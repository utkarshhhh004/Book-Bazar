
import mongoose from "mongoose";

import User from "../models/User.js";
import SellerVerification from "../models/SellerVerification.js";
import Listing from "../models/Listing.js";
import Book from "../models/Book.js";
import Category from "../models/Category.js";

const createError = (message, statusCode = 400, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
};

const requireValidId = (id, label = "identifier") => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(`Invalid ${label}.`);
  }
};

const requireSellerAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.accountStatus !== "active") {
    throw createError("Your account is unavailable.", 403);
  }

  if (!user.capabilities.includes("seller")) {
    throw createError("Activate your seller capability first.", 403, "SELLER_CAPABILITY_REQUIRED");
  }

  if (!user.emailVerified) {
    throw createError("Verify your email before using seller features.", 403, "EMAIL_VERIFICATION_REQUIRED");
  }

  return user;
};

const getLatestVerification = (sellerId) =>
  SellerVerification.findOne({ sellerId }).sort({ createdAt: -1, _id: -1 });

const isSellerApproved = async (sellerId) => {
  const verification = await getLatestVerification(sellerId);
  return verification?.status === "approved";
};

const toListingResponse = (listing) => {
  const item = listing.toObject ? listing.toObject() : listing;

  return {
    ...item,
    availableQuantity: Math.max(0, item.quantity - item.reservedQuantity),
  };
};

/**
 * Activate seller capability on the existing user account.
 * This does not approve seller verification.
 */
export const activateSeller = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.accountStatus !== "active") {
    throw createError("Your account is unavailable.", 403);
  }

  if (!user.emailVerified) {
    throw createError("Verify your email before activating seller capability.", 403, "EMAIL_VERIFICATION_REQUIRED");
  }

  if (!user.capabilities.includes("seller")) {
    user.capabilities.addToSet("seller");
    await user.save();
  }

  return {
    userId: user._id,
    capabilities: user.capabilities,
    sellerCapabilityActive: true,
  };
};

/**
 * Seller dashboard summary and latest verification.
 */
export const getSellerOverview = async (userId) => {
  await requireSellerAccount(userId);

  const [verification, totalListings, activeListings, draftListings] =
    await Promise.all([
      getLatestVerification(userId),
      Listing.countDocuments({ sellerId: userId }),
      Listing.countDocuments({ sellerId: userId, status: "active" }),
      Listing.countDocuments({ sellerId: userId, status: "draft" }),
    ]);

  return {
    verification: verification
      ? {
          id: verification._id,
          sellerType: verification.sellerType,
          submittedDetails: verification.submittedDetails,
          documentReferences: verification.documentReferences,
          status: verification.status,
          reviewReason: verification.reviewReason,
          createdAt: verification.createdAt,
          updatedAt: verification.updatedAt,
        }
      : null,
    listings: {
      total: totalListings,
      active: activeListings,
      draft: draftListings,
    },
    canPublishPublicly: verification?.status === "approved",
  };
};

/**
 * Create or update a seller verification draft.
 *
 * Document uploads are intentionally not accepted as arbitrary URLs.
 * Secure document storage must be integrated before submission for review.
 */
export const saveSellerVerificationDraft = async (userId, data) => {
  await requireSellerAccount(userId);

  const existing = await getLatestVerification(userId);

  if (
    existing &&
    ["pending_review", "under_review", "approved", "suspended"].includes(existing.status)
  ) {
    throw createError(
      "Your current verification application cannot be edited in its present status.",
      409,
    );
  }

  if (existing) {
    existing.sellerType = data.sellerType;
    existing.submittedDetails = data.submittedDetails;
    existing.status = "draft";
    existing.reviewReason = "";
    await existing.save();

    return existing;
  }

  return SellerVerification.create({
    sellerId: userId,
    sellerType: data.sellerType,
    submittedDetails: data.submittedDetails,
    documentReferences: [],
    status: "draft",
  });
};

/**
 * Create a seller listing.
 * Unverified sellers can only create drafts.
 * Approved sellers can create active listings for approved books.
 */
export const createSellerListing = async (userId, data) => {
  await requireSellerAccount(userId);
  requireValidId(data.bookId, "book identifier");

  const book = await Book.findById(data.bookId);

  if (!book || !["approved", "pending_review"].includes(book.catalogueStatus)) {
    throw createError("The selected catalogue book is unavailable.", 404);
  }

  const approvedSeller = await isSellerApproved(userId);

  const canActivate =
    approvedSeller &&
    book.catalogueStatus === "approved" &&
    data.quantity > 0;

  if (
    data.condition !== "new" &&
    data.images.length === 0
  ) {
    throw createError("Actual book photographs are required for used books.");
  }

  if (
    data.condition === "acceptable" &&
    data.disclosedDefects.length === 0
  ) {
    throw createError("Disclose the defects or missing pages for an acceptable-condition book.");
  }

  const listing = await Listing.create({
    ...data,
    sellerId: userId,
    status: canActivate ? "active" : "draft",
    reservedQuantity: 0,
  });

  return {
    listing: toListingResponse(listing),
    publicationMessage: canActivate
      ? "Your listing is now active in the marketplace."
      : "Your listing has been saved as a draft. Seller verification and catalogue approval are required before public visibility.",
  };
};

/**
 * Seller-owned listings only.
 */
export const getSellerListings = async (userId, filters = {}) => {
  await requireSellerAccount(userId);

  const allowedStatuses = [
    "draft",
    "pending_review",
    "active",
    "rejected",
    "paused",
    "sold_out",
    "archived",
    "suspended",
  ];

  const query = { sellerId: userId };

  if (filters.status && allowedStatuses.includes(filters.status)) {
    query.status = filters.status;
  }

  const page = Math.max(1, Number.parseInt(filters.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(filters.limit, 10) || 12));

  const [listings, total] = await Promise.all([
    Listing.find(query)
      .populate("bookId", "title authors isbn publisher edition publicationYear language coverImage catalogueStatus")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Listing.countDocuments(query),
  ]);

  return {
    listings: listings.map(toListingResponse),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update a listing without allowing sellerId, bookId,
 * reservedQuantity or status to be overwritten.
 */
export const updateSellerListing = async (userId, listingId, data) => {
  requireValidId(listingId, "listing identifier");
  await requireSellerAccount(userId);

  const listing = await Listing.findOne({
    _id: listingId,
    sellerId: userId,
  });

  if (!listing) {
    throw createError("Listing not found.", 404);
  }

  if (["archived", "suspended", "sold_out"].includes(listing.status)) {
    throw createError("This listing cannot be edited in its current status.", 409);
  }

  if (
    data.quantity !== undefined &&
    data.quantity < listing.reservedQuantity
  ) {
    throw createError(
      `Quantity cannot be lower than the ${listing.reservedQuantity} units already reserved.`,
    );
  }

  const nextCondition = data.condition ?? listing.condition;
  const nextImages = data.images ?? listing.images;

  if (nextCondition !== "new" && nextImages.length === 0) {
    throw createError("Actual book photographs are required for used books.");
  }

  if (
    nextCondition === "acceptable" &&
    (data.disclosedDefects ?? listing.disclosedDefects).length === 0
  ) {
    throw createError("Disclose the defects or missing pages for an acceptable-condition book.");
  }

  Object.assign(listing, data);
  await listing.save();

  return toListingResponse(listing);
};

/**
 * Seller can pause an active listing or reactivate it
 * only when seller verification, book approval and stock allow it.
 */
export const updateSellerListingStatus = async (userId, listingId, status) => {
  requireValidId(listingId, "listing identifier");
  await requireSellerAccount(userId);

  const listing = await Listing.findOne({
    _id: listingId,
    sellerId: userId,
  });

  if (!listing) {
    throw createError("Listing not found.", 404);
  }

  if (["archived", "suspended", "sold_out"].includes(listing.status)) {
    throw createError("This listing cannot change status.", 409);
  }

  if (status === "active") {
    const approvedSeller = await isSellerApproved(userId);
    const book = await Book.findById(listing.bookId).select("catalogueStatus");

    if (!approvedSeller || !book || book.catalogueStatus !== "approved") {
      throw createError(
        "Approved seller verification and an approved catalogue book are required before publishing.",
        403,
        "SELLER_OR_BOOK_APPROVAL_REQUIRED",
      );
    }

    if (listing.quantity <= listing.reservedQuantity) {
      throw createError("Add available stock before activating this listing.");
    }
  }

  listing.status = status;
  await listing.save();

  return toListingResponse(listing);
};

/**
 * Soft-delete a listing. Historical references remain intact.
 */
export const archiveSellerListing = async (userId, listingId) => {
  requireValidId(listingId, "listing identifier");
  await requireSellerAccount(userId);

  const listing = await Listing.findOne({
    _id: listingId,
    sellerId: userId,
  });

  if (!listing) {
    throw createError("Listing not found.", 404);
  }

  if (listing.reservedQuantity > 0) {
    throw createError(
      "This listing has reserved inventory and cannot be archived yet.",
      409,
    );
  }

  listing.status = "archived";
  await listing.save();

  return toListingResponse(listing);
};

/**
 * Submit a new shared catalogue book for moderation.
 * It is not immediately purchasable.
 */
export const submitCatalogueBook = async (userId, data) => {
  await requireSellerAccount(userId);

  if (data.categoryIds.length > 0) {
    const categoryCount = await Category.countDocuments({
      _id: { $in: data.categoryIds },
      status: "active",
    });

    if (categoryCount !== data.categoryIds.length) {
      throw createError("One or more selected categories are unavailable.");
    }
  }

  if (data.isbn) {
    const existing = await Book.findOne({ isbn: data.isbn });

    if (existing) {
      throw createError(
        "A catalogue record with this ISBN already exists. Select the existing book instead.",
        409,
        "BOOK_ALREADY_EXISTS",
      );
    }
  }

  try {
    return await Book.create({
      ...data,
      catalogueStatus: "pending_review",
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createError(
        "A catalogue record with this ISBN already exists.",
        409,
        "BOOK_ALREADY_EXISTS",
      );
    }

    throw error;
  }
};
