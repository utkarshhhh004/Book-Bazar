
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const BCRYPT_ROUNDS = 12;

/**
 * Hash a user's password before storing it in MongoDB.
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Compare a supplied password with its stored bcrypt hash.
 */
export const comparePassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

/**
 * Generate a cryptographically secure random token.
 * The raw token is returned only to the caller.
 */
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash tokens using SHA-256 before storing them in MongoDB.
 */
export const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

/**
 * Generate a token and its corresponding hash.
 */
export const generateTokenPair = () => {
  const token = generateSecureToken();

  return {
    token,
    tokenHash: hashToken(token),
  };
};
