import { z } from "zod";

const requiredText = (field, maxLength) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required.`)
    .max(maxLength, `${field} cannot exceed ${maxLength} characters.`);

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).optional().default("");

const phoneSchema = z
  .string()
  .trim()
  .transform((phone) => phone.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+?[1-9]\d{9,14}$/, "Enter a valid phone number."));

const commonAddressFields = {
  recipientName: requiredText("Recipient name", 150),

  phone: phoneSchema,

  addressLine1: requiredText("Address line 1", 250),
  addressLine2: optionalText(250),
  landmark: optionalText(150),

  city: requiredText("City", 100),
  state: requiredText("State", 100),

  postalCode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Indian PIN code."),

  country: z.string().trim().min(1).max(100).default("India"),
};

export const createAddressSchema = z
  .object({
    ...commonAddressFields,
    isDefault: z.boolean().optional().default(false),
  })
  .strict();

export const updateAddressSchema = z
  .object({
    ...commonAddressFields,
    isDefault: z.boolean().optional(),
  })
  .strict();
