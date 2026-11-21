
import { z } from "zod";

const bookIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid book identifier.");

export const addWishlistItemSchema = z
  .object({
    bookId: bookIdSchema,
  })
  .strict();
