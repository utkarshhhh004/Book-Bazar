
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Resolve the root Book-Bazar/.env file.
const rootEnvPath = path.resolve(
  currentDirectory,
  "../../../../.env"
);

// Load root environment variables.
// Existing environment variables are not overwritten.
const result = dotenv.config({
  path: rootEnvPath,
});

if (result.error && result.error.code !== "ENOENT") {
  throw result.error;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),

  WEB_URL: process.env.WEB_URL,
  CLIENT_URL: process.env.CLIENT_URL,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
