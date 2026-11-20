
import { z } from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "A valid address ID is required.");

export const checkoutPreviewSchema = z
  .object({
    addressId: objectIdSchema,
  })
  .strict();

export const createCheckoutSchema = z
  .object({
    addressId: objectIdSchema,

    idempotencyKey: z
      .string()
      .trim()
      .min(16, "Idempotency key must contain at least 16 characters.")
      .max(128, "Idempotency key cannot exceed 128 characters."),
  })
  .strict();
