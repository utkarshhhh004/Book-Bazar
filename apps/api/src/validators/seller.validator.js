import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid identifier.");

const httpUrl = z
  .string()
  .url()
  .max(2048)
  .refine(
    (value) => ["http:", "https:"].includes(new URL(value).protocol),
    "Only HTTP or HTTPS URLs are allowed.",
  );

export const sellerVerificationSchema = z
  .object({
    sellerType: z.enum(["individual", "business"]),
    submittedDetails: z
      .object({
        displayName: z.string().trim().min(2).max(150),
        phone: z.string().trim().min(7).max(20),
        addressLine1: z.string().trim().min(3).max(150),
        addressLine2: z.string().trim().max(150).optional().default(""),
        city: z.string().trim().min(2).max(100),
        state: z.string().trim().min(2).max(100),
        postalCode: z.string().trim().min(3).max(20),
        country: z.string().trim().min(2).max(100),
        businessName: z.string().trim().max(200).optional().default(""),
        businessRegistrationNumber: z
          .string()
          .trim()
          .max(100)
          .optional()
          .default(""),
        representativeName: z.string().trim().max(150).optional().default(""),
      })
      .strict(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.sellerType === "business" &&
      (!data.submittedDetails.businessName ||
        !data.submittedDetails.representativeName)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["submittedDetails"],
        message:
          "Business name and authorized representative are required for business sellers.",
      });
    }
  });

export const createListingSchema = z
  .object({
    bookId: objectId,
    condition: z.enum(["new", "like_new", "very_good", "good", "acceptable"]),
    pricePaise: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    quantity: z.number().int().min(0).max(100000),
    sellerDescription: z.string().trim().max(3000).optional().default(""),
    images: z.array(httpUrl).max(10).optional().default([]),
    disclosedDefects: z
      .array(z.string().trim().min(1).max(500))
      .max(30)
      .optional()
      .default([]),
    dispatchLocation: z
      .object({
        city: z.string().trim().min(2).max(100),
        state: z.string().trim().min(2).max(100),
        postalCode: z.string().trim().min(3).max(20),
        country: z.string().trim().min(2).max(100),
      })
      .strict()
      .optional()
      .nullable()
      .default(null),
    handlingTime: z
      .number()
      .int()
      .min(0)
      .max(60)
      .optional()
      .nullable()
      .default(null),
    shippingTerms: z
      .object({
        shippingChargePaise: z
          .number()
          .int()
          .min(0)
          .max(Number.MAX_SAFE_INTEGER),
        freeShipping: z.boolean().default(false),
        handlingTimeDays: z.number().int().min(0).max(60).default(2),
      })
      .strict()
      .optional()
      .nullable()
      .default(null),
  })
  .strict();

export const updateListingSchema = createListingSchema
  .omit({ bookId: true })
  .partial()
  .strict();

export const listingStatusSchema = z
  .object({
    status: z.enum(["active", "paused"]),
  })
  .strict();

export const createCatalogueBookSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    authors: z.array(z.string().trim().min(1).max(150)).min(1).max(20),
    isbn: z.string().trim().max(17).optional().nullable(),
    publisher: z.string().trim().min(1).max(200),
    edition: z.string().trim().max(100).optional().default(""),
    publicationYear: z
      .number()
      .int()
      .min(1000)
      .max(new Date().getFullYear() + 1)
      .optional()
      .nullable(),
    language: z.string().trim().max(60).optional().default("English"),
    categoryIds: z.array(objectId).max(10).optional().default([]),
    description: z.string().trim().max(10000).optional().default(""),
    coverImage: httpUrl,
    pageCount: z.number().int().positive().optional().nullable(),
  })
  .strict();
