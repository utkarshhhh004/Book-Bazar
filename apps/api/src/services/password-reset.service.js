
import mongoose from "mongoose";

import User from "../models/User.js";
import Session from "../models/Session.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

import {
  generateTokenPair,
  hashToken,
  hashPassword,
} from "../utils/auth.utils.js";

import { sendEmail } from "./email.service.js";

const RESET_TOKEN_EXPIRY = 15 * 60 * 1000;

/**
 * Request a password-reset email.
 */
export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  // Do not reveal whether an account exists.
  if (!user) {
    return {
      message: "If an account exists, reset instructions will be sent.",
    };
  }

  if (user.accountStatus !== "active") {
    return {
      message: "If an account exists, reset instructions will be sent.",
    };
  }

  const frontendUrl = process.env.WEB_URL;

  if (!frontendUrl) {
    throw new Error("WEB_URL is not configured.");
  }

  const { token, tokenHash } = generateTokenPair();

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY
  );

  // Invalidate previous unused reset tokens.
  await PasswordResetToken.deleteMany({
    userId: user._id,
    usedAt: null,
  });

  const tokenRecord = await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const resetUrl = new URL(
    "/reset-password",
    frontendUrl
  );

  resetUrl.searchParams.set("token", token);

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your Book Bazar password",
      text: `
Hello ${user.fullName},

We received a request to reset your Book Bazar password.

Use the following link to reset your password:

${resetUrl.toString()}

This link expires in 15 minutes.

If you did not request this change, please ignore this email.
      `.trim(),
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.fullName},</p>
        <p>Use the link below to reset your password.</p>
        <p>
          <a href="${resetUrl.toString()}">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this change, ignore this email.</p>
      `,
    });
  } catch (error) {
    await PasswordResetToken.deleteOne({
      _id: tokenRecord._id,
    });

    throw error;
  }

  return {
    message: "If an account exists, reset instructions will be sent.",
  };
};

/**
 * Reset the user's password using a valid reset token.
 */
export const resetPassword = async (token, newPassword) => {
  if (!token || typeof token !== "string") {
    throw new Error("Password reset token is required.");
  }

  const tokenHash = hashToken(token);
  const passwordHash = await hashPassword(newPassword);

  const dbSession = await mongoose.startSession();

  try {
    await dbSession.withTransaction(async () => {
      const tokenRecord = await PasswordResetToken.findOne({
        tokenHash,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      }).session(dbSession);

      if (!tokenRecord) {
        throw new Error("Invalid or expired password reset link.");
      }

      const user = await User.findById(
        tokenRecord.userId
      ).session(dbSession);

      if (!user || user.accountStatus !== "active") {
        throw new Error("Password reset cannot be completed.");
      }

      tokenRecord.usedAt = new Date();

      await tokenRecord.save({
        session: dbSession,
      });

      user.passwordHash = passwordHash;
      user.passwordChangedAt = new Date();

      await user.save({
        session: dbSession,
      });

      // Revoke every existing session.
      await Session.updateMany(
        {
          userId: user._id,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
        {
          session: dbSession,
        }
      );
    });
  } finally {
    await dbSession.endSession();
  }

  return {
    message: "Password reset successfully. Please log in again.",
  };
};
