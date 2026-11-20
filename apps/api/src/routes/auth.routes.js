
import { Router } from "express";

import {
  registerController,
  loginController,
  refreshController,
  currentUserController,
  logoutController,
  logoutAllController,
} from "../controllers/auth.controller.js";

import {
  verifyEmailController,
  resendVerificationController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/account-recovery.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  loginLimiter,
  registrationLimiter,
  passwordRecoveryLimiter,
  verificationLimiter,
  refreshLimiter,
} from "../middlewares/rateLimit.middleware.js";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  emailSchemaValidator,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Registration
router.post(
  "/register",
  registrationLimiter,
  validate(registerSchema),
  registerController
);

// Login
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  loginController
);

// Session management
router.post(
  "/refresh",
  refreshLimiter,
  refreshController
);

router.get(
  "/me",
  authenticate,
  currentUserController
);

router.post(
  "/logout",
  logoutController
);

router.post(
  "/logout-all",
  authenticate,
  logoutAllController
);

// Email verification
router.post(
  "/verify-email",
  verificationLimiter,
  validate(verifyEmailSchema),
  verifyEmailController
);

router.post(
  "/resend-verification",
  authenticate,
  verificationLimiter,
  resendVerificationController
);

// Password recovery
router.post(
  "/forgot-password",
  passwordRecoveryLimiter,
  validate(emailSchemaValidator),
  forgotPasswordController
);

router.post(
  "/reset-password",
  passwordRecoveryLimiter,
  validate(resetPasswordSchema),
  resetPasswordController
);

export default router;
