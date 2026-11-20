
import mongoose from "mongoose";

import User from "../models/User.js";
import EmailVerificationToken from "../models/EmailVerificationToken.js";

import { generateTokenPair } from "../utils/auth.utils.js";
import { sendEmail } from "./email.service.js";

const VERIFICATION_TOKEN_EXPIRY = 15 * 60 * 1000;

/**
 * Generate and send an email-verification link.
 */
export const sendVerificationEmail = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User account not found.");
  }

  if (user.emailVerified) {
    throw new Error("Email address is already verified.");
  }

  const frontendUrl = process.env.WEB_URL;

  if (!frontendUrl) {
    throw new Error("WEB_URL is not configured.");
  }

  const { token, tokenHash } = generateTokenPair();

  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRY
  );

  // Invalidate previously issued unused verification tokens.
  await EmailVerificationToken.deleteMany({
    userId: user._id,
    usedAt: null,
  });

  const tokenRecord = await EmailVerificationToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const verificationUrl = new URL(
    "/verify-email",
    frontendUrl
  );

  verificationUrl.searchParams.set("token", token);

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your Book Bazar account",
      text: `
Hello ${user.fullName},

Please verify your Book Bazar email address using the link below:

${verificationUrl.toString()}

This link expires in 15 minutes.

If you did not create this account, you can ignore this email.
      `.trim(),
      html: `
        <h2>Welcome to Book Bazar!</h2>
        <p>Hello ${user.fullName},</p>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl.toString()}">
            Verify Email Address
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
      `,
    });
  } catch (error) {
    await EmailVerificationToken.deleteOne({
      _id: tokenRecord._id,
    });

    throw error;
  }

  return {
    message: "Verification email sent successfully.",
  };
};

/**
 * Verify an email address using its verification token.
 */
export const verifyEmailAddress = async (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Verification token is required.");
  }

  const { hashToken } = await import("../utils/auth.utils.js");

  const tokenHash = hashToken(token);

  const dbSession = await mongoose.startSession();

  let verifiedUserId;

  try {
    await dbSession.withTransaction(async () => {
      const tokenRecord = await EmailVerificationToken.findOne({
        tokenHash,
        usedAt: null,
        expiresAt: { $gt: new Date() },
      }).session(dbSession);

      if (!tokenRecord) {
        throw new Error("Invalid or expired verification link.");
      }

      const user = await User.findById(
        tokenRecord.userId
      ).session(dbSession);

      if (!user) {
        throw new Error("User account not found.");
      }

      if (user.emailVerified) {
        throw new Error("Email address is already verified.");
      }

      tokenRecord.usedAt = new Date();
      await tokenRecord.save({ session: dbSession });

      user.emailVerified = true;
      await user.save({ session: dbSession });

      verifiedUserId = user._id.toString();
    });
  } finally {
    await dbSession.endSession();
  }

  return {
    userId: verifiedUserId,
    emailVerified: true,
  };
};
