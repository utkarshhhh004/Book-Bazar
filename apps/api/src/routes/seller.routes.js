import { Router } from "express";

import {
  activateSellerController,
  getSellerOverviewController,
  saveSellerVerificationDraftController,
} from "../controllers/seller.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  requireCapability,
  requireVerifiedEmail,
} from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { sellerVerificationSchema } from "../validators/seller.validator.js";

const router = Router();

router.use(authenticate);

router.post("/activate", requireVerifiedEmail, activateSellerController);

router.get(
  "/me",
  requireCapability("seller"),
  requireVerifiedEmail,
  getSellerOverviewController,
);

router.put(
  "/verification",
  requireCapability("seller"),
  requireVerifiedEmail,
  validate(sellerVerificationSchema),
  saveSellerVerificationDraftController,
);

export default router;
