import { Router } from "express";

import {
  getAddressesController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "../controllers/address.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { requireCapability } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator.js";

const router = Router();

// All address operations require authentication and buyer capability.
router.use(authenticate);
router.use(requireCapability("buyer"));

// Retrieve all addresses belonging to the authenticated user.
router.get("/", getAddressesController);

// Create a new delivery address.
router.post("/", validate(createAddressSchema), createAddressController);

// Replace an existing delivery address.
router.put(
  "/:addressId",
  validate(updateAddressSchema),
  updateAddressController,
);

// Delete an address.
router.delete("/:addressId", deleteAddressController);

// Set an address as the default delivery address.
router.patch("/:addressId/default", setDefaultAddressController);

export default router;
