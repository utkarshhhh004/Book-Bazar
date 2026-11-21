import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";

import cloudinary from "../config/cloudinary.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  requireCapability,
  requireVerifiedEmail,
} from "../middlewares/authorize.middleware.js";

const router = Router();

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 2,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG and WEBP images are allowed."));
    }

    callback(null, true);
  },
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "book-bazar/books",
        resource_type: "image",
        public_id: randomUUID(),
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          filename: result.public_id,
          publicId: result.public_id,
          mimetype: file.mimetype,
          size: result.bytes,
        });
      },
    );

    stream.end(file.buffer);
  });

router.post(
  "/book-images",
  authenticate,
  requireCapability("seller"),
  requireVerifiedEmail,
  upload.array("images", 2),

  async (req, res, next) => {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Upload at least one book photograph.",
      });
    }

    let uploadedImages = [];

    try {
      const results = await Promise.allSettled(
        req.files.map(uploadToCloudinary),
      );

      uploadedImages = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const failed = results.some((result) => result.status === "rejected");

      if (failed) {
        await Promise.allSettled(
          uploadedImages.map((image) =>
            cloudinary.uploader.destroy(image.publicId),
          ),
        );

        throw (
          results.find((result) => result.status === "rejected")?.reason ||
          new Error("Cloudinary upload failed.")
        );
      }

      return res.status(201).json({
        success: true,
        message: "Book photographs uploaded successfully.",
        data: {
          images: uploadedImages,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
