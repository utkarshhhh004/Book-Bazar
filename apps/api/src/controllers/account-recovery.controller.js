
import {
  sendVerificationEmail,
  verifyEmailAddress,
} from "../services/email-verification.service.js";

import {
  requestPasswordReset,
  resetPassword,
} from "../services/password-reset.service.js";

/**
 * Verify email address.
 * POST /api/v1/auth/verify-email
 */
export const verifyEmailController = async (req, res, next) => {
  try {
    await verifyEmailAddress(req.body.token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: {
        emailVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend email verification link.
 * POST /api/v1/auth/resend-verification
 */
export const resendVerificationController = async (
  req,
  res,
  next
) => {
  try {
    await sendVerificationEmail(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset.
 * POST /api/v1/auth/forgot-password
 */
export const forgotPasswordController = async (
  req,
  res,
  next
) => {
  try {
    await requestPasswordReset(req.body.email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, password reset instructions will be sent.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password.
 * POST /api/v1/auth/reset-password
 */
export const resetPasswordController = async (
  req,
  res,
  next
) => {
  try {
    await resetPassword(
      req.body.token,
      req.body.password
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
