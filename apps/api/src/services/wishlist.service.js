
import mongoose from "mongoose";

import Wishlist from "../models/Wishlist.js";
import Book from "../models/Book.js";
import Listing from "../models/Listing.js";
import SellerVerification from "../models/SellerVerification.js";
import User from "../models/User.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id, fieldName) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(`Invalid ${fieldName}.`);
  }
};

export const getWishlist = async (userId) => {
  validateObjectId(userId, "user identifier");

  const savedItems = await Wishlist.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "bookId",
      select:
        "title authors isbn publisher edition publicationYear language description coverImage pageCount catalogueStatus",
    })
    .lean();

  const validItems = savedItems.filter(
    (item) => item.bookId && item.bookId.catalogueStatus === "approved",
  );

  const bookIds = validItems.map((item) => item.bookId._id);

  if (bookIds.length === 0) {
    return {
      items: [],
      itemCount: 0,
    };
  }

  const approvedSellerIds = await SellerVerification.distinct(
    "sellerId",
    { status: "approved" },
  );

  const eligibleSellers = approvedSellerIds.length
    ? await User.find({
        _id: { $in: approvedSellerIds },
        accountStatus: "active",
        emailVerified: true,
        capabilities: "seller",
      })
        .select("_id fullName")
        .lean()
    : [];

  const sellerMap = new Map(
    eligibleSellers.map((seller) => [
      seller._id.toString(),
      seller,
    ]),
  );

  const eligibleSellerIds = eligibleSellers.map(
    (seller) => seller._id,
  );

  const listings = eligibleSellerIds.length
    ? await Listing.find({
        bookId: { $in: bookIds },
        sellerId: { $in: eligibleSellerIds },
        status: "active",
        $expr: {
          $gt: ["$quantity", "$reservedQuantity"],
        },
      })
        .sort({ pricePaise: 1, createdAt: -1 })
        .lean()
    : [];

  const listingsByBook = new Map();

  for (const listing of listings) {
    const bookKey = listing.bookId.toString();
    const seller = sellerMap.get(listing.sellerId.toString());

    if (!seller) continue;

    const offers = listingsByBook.get(bookKey) || [];

    offers.push({
      listingId: listing._id,
      condition: listing.condition,
      pricePaise: listing.pricePaise,
      price: listing.pricePaise / 100,
      availableQuantity: Math.max(
        0,
        listing.quantity - listing.reservedQuantity,
      ),
      seller: {
        id: seller._id,
        name: seller.fullName,
      },
    });

    listingsByBook.set(bookKey, offers);
  }

  const items = validItems.map((item) => {
    const book = item.bookId;

    return {
      wishlistId: item._id,
      bookId: book._id,
      savedAt: item.createdAt,
      book: {
        id: book._id,
        title: book.title,
        authors: book.authors,
        isbn: book.isbn,
        publisher: book.publisher,
        edition: book.edition,
        publicationYear: book.publicationYear,
        language: book.language,
        description: book.description,
        coverImage: book.coverImage,
        pageCount: book.pageCount,
      },
      listings: listingsByBook.get(book._id.toString()) || [],
    };
  });

  return {
    items,
    itemCount: items.length,
  };
};

export const addWishlistItem = async ({ userId, bookId }) => {
  validateObjectId(userId, "user identifier");
  validateObjectId(bookId, "book identifier");

  const book = await Book.findOne({
    _id: bookId,
    catalogueStatus: "approved",
  })
    .select("_id")
    .lean();

  if (!book) {
    throw createError(
      "This book is not available in the approved catalogue.",
      404,
    );
  }

  try {
    await Wishlist.findOneAndUpdate(
      { userId, bookId },
      {
        $setOnInsert: {
          userId,
          bookId,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  } catch (error) {
    // A concurrent request may have inserted the same unique pair.
    if (error.code !== 11000) {
      throw error;
    }
  }

  return getWishlist(userId);
};

export const removeWishlistItem = async ({ userId, bookId }) => {
  validateObjectId(userId, "user identifier");
  validateObjectId(bookId, "book identifier");

  const removedItem = await Wishlist.findOneAndDelete({
    userId,
    bookId,
  });

  if (!removedItem) {
    throw createError("This book is not in your wishlist.", 404);
  }

  return getWishlist(userId);
};
