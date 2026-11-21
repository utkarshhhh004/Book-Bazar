
import { Router } from "express";

import {
  getCartController,
  addCartItemController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from "../controllers/cart.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { requireCapability } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../validators/cart.validator.js";

const router = Router();

router.use(authenticate);
router.use(requireCapability("buyer"));

// Retrieve cart.
router.get("/", getCartController);

// Add a listing.
router.post(
  "/items",
  validate(addCartItemSchema),
  addCartItemController
);

// Update listing quantity.
router.patch(
  "/items/:listingId",
  validate(updateCartItemSchema),
  updateCartItemController
);

// Remove a listing.
router.delete(
  "/items/:listingId",
  removeCartItemController
);

// Clear the entire cart.
router.delete("/", clearCartController);

export default router;
