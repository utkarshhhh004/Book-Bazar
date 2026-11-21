import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Load the root-level .env file.
const rootEnvPath = path.resolve(currentDirectory, "../../../../.env");

const result = dotenv.config({
  path: rootEnvPath,
});

if (result.error && result.error.code !== "ENOENT") {
  throw result.error;
}

export const env = {
  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),

  // Frontend URLs
  WEB_URL: process.env.WEB_URL,
  CLIENT_URL: process.env.CLIENT_URL,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Authentication
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Razorpay Payment Gateway
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",

  // Marketplace Commission
  PLATFORM_COMMISSION_RATE: Number(process.env.PLATFORM_COMMISSION_RATE || 5),
};
