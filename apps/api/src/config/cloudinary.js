
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

const requiredCredentials = [
  ["CLOUDINARY_CLOUD_NAME", env.CLOUDINARY_CLOUD_NAME],
  ["CLOUDINARY_API_KEY", env.CLOUDINARY_API_KEY],
  ["CLOUDINARY_API_SECRET", env.CLOUDINARY_API_SECRET],
];

const missingCredentials = requiredCredentials
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingCredentials.length > 0) {
  throw new Error(
    `Missing Cloudinary configuration: ${missingCredentials.join(", ")}`
  );
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
