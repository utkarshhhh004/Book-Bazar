
import {
  generateTokenPair,
} from "./auth.utils.js";

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const COOKIE_NAME = "bb_refresh_token";

/**
 * Convert duration strings into milliseconds.
 * Supported units: s, m, h, d.
 */
const parseDuration = (duration) => {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration);

  if (!match) {
    throw new Error(
      "Invalid JWT_REFRESH_EXPIRES_IN configuration."
    );
  }

  const value = Number(match[1]);

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[match[2]];
};

/**
 * Generate a refresh token and its expiration date.
 */
export const generateRefreshToken = () => {
  const { token, tokenHash } = generateTokenPair();

  const expiresAt = new Date(
    Date.now() + parseDuration(REFRESH_TOKEN_EXPIRES_IN)
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
};

/**
 * Refresh-token cookie configuration.
 */
export const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: parseDuration(REFRESH_TOKEN_EXPIRES_IN),
    ...(process.env.COOKIE_DOMAIN
      ? { domain: process.env.COOKIE_DOMAIN }
      : {}),
  };
};

/**
 * Cookie name used by authentication controllers.
 */
export const REFRESH_COOKIE_NAME = COOKIE_NAME;
