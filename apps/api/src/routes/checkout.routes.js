
import { Router } from "express";

import {
  checkoutPreviewController,
  createCheckoutController,
} from "../controllers/checkout.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  checkoutPreviewSchema,
} from "../validators/checkout.validator.js";

const router = Router();

router.use(authenticate);

router.post(
  "/preview",
  validate(checkoutPreviewSchema),
  checkoutPreviewController
);

router.post(
  "/session",
  validate(checkoutPreviewSchema),
  createCheckoutController
);

export default router;
