
import { Router } from "express";

import {
  createListingController,
  getMyListingsController,
  updateListingController,
  updateListingStatusController,
  archiveListingController,
  submitCatalogueBookController,
} from "../controllers/listing.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { requireCapability, requireVerifiedEmail } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createListingSchema,
  updateListingSchema,
  listingStatusSchema,
  createCatalogueBookSchema,
} from "../validators/seller.validator.js";

const router = Router();

router.use(authenticate);
router.use(requireCapability("seller"));
router.use(requireVerifiedEmail);

// Keep specific routes before the listingId parameter routes.
router.get("/seller/me", getMyListingsController);

router.post(
  "/catalogue-requests",
  validate(createCatalogueBookSchema),
  submitCatalogueBookController,
);

router.post(
  "/",
  validate(createListingSchema),
  createListingController,
);

router.patch(
  "/:listingId/status",
  validate(listingStatusSchema),
  updateListingStatusController,
);

router.patch(
  "/:listingId",
  validate(updateListingSchema),
  updateListingController,
);

router.delete(
  "/:listingId",
  archiveListingController,
);

export default router;
