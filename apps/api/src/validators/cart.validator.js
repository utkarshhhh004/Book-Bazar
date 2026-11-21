
import { z } from "zod";

const listingIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid listing identifier.");

const quantitySchema = z
  .number()
  .int("Quantity must be a whole number.")
  .min(1, "Quantity must be at least 1.")
  .max(100, "Quantity cannot exceed 100.");

export const addCartItemSchema = z
  .object({
    listingId: listingIdSchema,
    quantity: quantitySchema.default(1),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    quantity: quantitySchema,
  })
  .strict();
