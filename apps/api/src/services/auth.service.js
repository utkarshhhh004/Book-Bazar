import mongoose from "mongoose";

import User from "../models/User.js";
import Session from "../models/Session.js";
import Address from "../models/Address.js";

import {
  hashPassword,
  comparePassword,
  hashToken,
} from "../utils/auth.utils.js";

import { generateAccessToken } from "../utils/jwt.utils.js";
import { generateRefreshToken } from "../utils/refresh.utils.js";

import { sendVerificationEmail } from "./email-verification.service.js";

/**
 * Return safe user information.
 */
const sanitizeUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  address: user.address,
  emailVerified: user.emailVerified,
  capabilities: user.capabilities,
  accountStatus: user.accountStatus,
});

/**
 * Register a new user.
 *
 * Creates the User and primary Address documents atomically.
 * Sends the verification email only after the transaction commits.
 */
export const registerUser = async (userData) => {
  const normalizedEmail = userData.email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(userData.password);

  let user;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const [createdUser] = await User.create(
        [
          {
            fullName: userData.fullName,
            email: normalizedEmail,
            passwordHash,

            // Preserve the existing embedded User.address structure.
            address: {
              line1: userData.address.line1,
              line2: userData.address.line2 || "",
              city: userData.address.city,
              state: userData.address.state,
              postalCode: userData.address.postalCode,
              country: userData.address.country,
            },

            capabilities: ["buyer"],
            isAdmin: false,
            emailVerified: false,
            accountStatus: "active",
          },
        ],
        { session },
      );

      user = createdUser;

      // Create the corresponding primary address document.
      await Address.create(
        [
          {
            userId: createdUser._id,
            recipientName: userData.fullName,
            phone: userData.address.phone,
            addressLine1: userData.address.line1,
            addressLine2: userData.address.line2 || "",
            landmark: "",
            city: userData.address.city,
            state: userData.address.state,
            postalCode: userData.address.postalCode,
            country: userData.address.country || "India",
            isDefault: true,
          },
        ],
        { session },
      );
    });
  } catch (error) {
    // Handle simultaneous registration attempts for the same email.
    if (error.code === 11000) {
      const conflict = new Error("An account with this email already exists.");
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  } finally {
    await session.endSession();
  }

  let verificationEmailSent = false;

  try {
    // This executes only after the database transaction commits.
    await sendVerificationEmail(user._id);
    verificationEmailSent = true;
  } catch (error) {
    // Keep the account. Verification can be requested again later.
    console.error("Verification email delivery failed:", error.message);
  }

  return {
    user: sanitizeUser(user),
    verificationEmailSent,
  };
};

/**
 * Authenticate a user and create a new session.
 */
export const loginUser = async ({ email, password, userAgent = "" }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  if (user.accountStatus !== "active") {
    const error = new Error("This account is currently unavailable.");
    error.statusCode = 403;
    throw error;
  }

  const refresh = generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
    lastUsedAt: new Date(),
    userAgent: userAgent.slice(0, 500),
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.expiresAt,
    sessionId: session._id.toString(),
    user: sanitizeUser(user),
  };
};

/**
 * Rotate a refresh token and generate a new access token.
 */
export const refreshUserSession = async (refreshToken) => {
  if (!refreshToken || typeof refreshToken !== "string") {
    const error = new Error("Authentication session is required.");
    error.statusCode = 401;
    throw error;
  }

  const oldTokenHash = hashToken(refreshToken);
  const now = new Date();

  const session = await Session.findOne({
    refreshTokenHash: oldTokenHash,
    revokedAt: null,
    expiresAt: { $gt: now },
  }).select("+refreshTokenHash");

  if (!session) {
    const error = new Error("Invalid or expired session.");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(session.userId);

  if (!user || user.accountStatus !== "active") {
    const error = new Error("Account is unavailable.");
    error.statusCode = 401;
    throw error;
  }

  const refresh = generateRefreshToken();

  // Conditional update prevents two concurrent refresh requests
  // from successfully rotating the same refresh token.
  const updateResult = await Session.updateOne(
    {
      _id: session._id,
      refreshTokenHash: oldTokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: {
        refreshTokenHash: refresh.tokenHash,
        expiresAt: refresh.expiresAt,
        lastUsedAt: now,
      },
    },
  );

  if (updateResult.modifiedCount !== 1) {
    const error = new Error("Session has already been refreshed.");
    error.statusCode = 401;
    throw error;
  }

  return {
    accessToken: generateAccessToken(user),
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.expiresAt,
  };
};

/**
 * Retrieve the authenticated user's profile.
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.accountStatus !== "active") {
    const error = new Error("User account not found or unavailable.");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
};

/**
 * Revoke the current login session.
 */
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await Session.updateOne(
    {
      refreshTokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};

/**
 * Revoke all active sessions belonging to a user.
 */
export const logoutAllUserSessions = async (userId) => {
  const result = await Session.updateMany(
    {
      userId,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );

  return {
    revokedSessions: result.modifiedCount,
  };
};
