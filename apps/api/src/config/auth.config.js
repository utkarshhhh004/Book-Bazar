
import { env } from "./env.js";

const validateAuthConfiguration = () => {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters."
    );
  }

  if (!env.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is required.");
  }

  if (!env.JWT_REFRESH_EXPIRES_IN) {
    throw new Error("JWT_REFRESH_EXPIRES_IN is required.");
  }

  if (
    !["development", "test", "production"].includes(env.NODE_ENV)
  ) {
    throw new Error("Invalid NODE_ENV configuration.");
  }
};

validateAuthConfiguration();

export const authConfig = Object.freeze({
  accessTokenSecret: env.JWT_SECRET,
  accessTokenExpiresIn: env.JWT_EXPIRES_IN,
  refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,

  cookieName: "bb_refresh_token",

  cookieOptions: Object.freeze({
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth",
  }),
});
