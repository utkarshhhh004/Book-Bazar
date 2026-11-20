
import { rateLimit } from "express-rate-limit";

const createRateLimiter = ({
  windowMs,
  limit,
  message,
}) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
};

// Maximum 10 login attempts per 15 minutes per IP.
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

// Maximum 5 registrations per hour per IP.
export const registrationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "Too many registration attempts. Please try again later.",
});

// Maximum 5 password recovery requests per hour per IP.
export const passwordRecoveryLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "Too many password recovery requests. Please try again later.",
});

// Maximum 5 email verification requests per hour per IP.
export const verificationLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "Too many email verification requests. Please try again later.",
});

// Maximum 30 refresh requests per 15 minutes per IP.
export const refreshLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: "Too many session refresh requests. Please try again later.",
});
