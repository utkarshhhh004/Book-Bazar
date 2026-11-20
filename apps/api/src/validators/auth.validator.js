
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .max(254)
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(12, "Password must contain at least 12 characters.")
  .max(128, "Password cannot exceed 128 characters.");

const addressSchema = z
  .object({
    line1: z
      .string()
      .trim()
      .min(1, "Address line 1 is required.")
      .max(150),

    line2: z
      .string()
      .trim()
      .max(150)
      .optional()
      .default(""),

    city: z
      .string()
      .trim()
      .min(1, "City is required.")
      .max(100),

    state: z
      .string()
      .trim()
      .min(1, "State is required.")
      .max(100),

    postalCode: z
      .string()
      .trim()
      .min(1, "Postal code is required.")
      .max(20),

    country: z
      .string()
      .trim()
      .min(1, "Country is required.")
      .max(100),
  })
  .strict();

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must contain at least 2 characters.")
      .max(100),

    email: emailSchema,
    address: addressSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required."),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must contain at least 2 characters.")
      .max(100),

    address: addressSchema,
  })
  .strict();

export const emailSchemaValidator = z
  .object({
    email: emailSchema,
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1, "Verification token is required."),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must differ from the current password.",
      path: ["newPassword"],
    }
  );

export const emptyBodySchema = z.object({}).strict();
