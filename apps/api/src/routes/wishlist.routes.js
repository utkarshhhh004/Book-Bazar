
import { Router } from "express";

import {
  getWishlistController,
  addWishlistItemController,
  removeWishlistItemController,
} from "../controllers/wishlist.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { requireCapability } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  addWishlistItemSchema,
} from "../validators/wishlist.validator.js";

const router = Router();

router.use(authenticate);
router.use(requireCapability("buyer"));

router.get("/", getWishlistController);

router.post(
  "/items",
  validate(addWishlistItemSchema),
  addWishlistItemController,
);

router.delete(
  "/items/:bookId",
  removeWishlistItemController,
);

export default router;
