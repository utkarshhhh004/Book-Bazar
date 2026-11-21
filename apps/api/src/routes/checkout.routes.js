import { Router } from "express";

import {
  checkoutPreviewController,
  createCheckoutController,
} from "../controllers/checkout.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  checkoutPreviewSchema,
  createCheckoutSchema,
} from "../validators/checkout.validator.js";

const router = Router();

router.use(authenticate);

// Generate a read-only checkout preview.
router.post(
  "/preview",
  validate(checkoutPreviewSchema),
  checkoutPreviewController,
);

// Create a checkout session with an idempotency key.
router.post(
  "/session",
  validate(createCheckoutSchema),
  createCheckoutController,
);

export default router;
