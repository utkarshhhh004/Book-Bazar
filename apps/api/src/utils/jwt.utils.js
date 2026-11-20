
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";

const validateJwtConfiguration = () => {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters."
    );
  }
};

export const generateAccessToken = (user) => {
  validateJwtConfiguration();

  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "access",
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256",
    }
  );
};

export const verifyAccessToken = (token) => {
  validateJwtConfiguration();

  const decoded = jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
  });

  if (decoded.type !== "access" || typeof decoded.sub !== "string") {
    throw new Error("Invalid access token.");
  }

  return decoded;
};
