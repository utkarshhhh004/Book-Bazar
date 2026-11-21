import mongoose from "mongoose";

import Book from "../models/Book.js";
import Listing from "../models/Listing.js";
import SellerVerification from "../models/SellerVerification.js";
import User from "../models/User.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allowedConditions = [
  "new",
  "like_new",
  "very_good",
  "good",
  "acceptable",
];

const allowedSorts = ["newest", "price_low", "price_high"];

export const getBookCatalogue = async ({
  search = "",
  categoryId,
  condition,
  page = 1,
  limit = 12,
  sort = "newest",
} = {}) => {
  const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = Math.min(48, Math.max(1, Number.parseInt(limit, 10) || 12));

  if (typeof search !== "string") {
    throw createError("Invalid search query.");
  }

  if (!allowedSorts.includes(sort)) {
    throw createError("Invalid catalogue sorting option.");
  }

  if (condition && !allowedConditions.includes(condition)) {
    throw createError("Invalid book condition.");
  }

  const bookQuery = {
    catalogueStatus: "approved",
  };

  if (search.trim()) {
    const expression = new RegExp(escapeRegex(search.trim()), "i");

    bookQuery.$or = [
      { title: expression },
      { authors: expression },
      { publisher: expression },
    ];
  }

  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw createError("Invalid category identifier.");
    }

    bookQuery.categoryIds = categoryId;
  }

  const books = await Book.find(bookQuery)
    .select(
      "title authors isbn publisher edition publicationYear language categoryIds description coverImage pageCount",
    )
    .populate("categoryIds", "name slug")
    .lean();

  if (books.length === 0) {
    return {
      books: [],
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: 0,
        pages: 0,
      },
    };
  }

  const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

  // Only sellers with an approved verification record are eligible.
  const approvedSellerIds = await SellerVerification.distinct("sellerId", {
    status: "approved",
  });

  if (approvedSellerIds.length === 0) {
    return {
      books: [],
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: 0,
        pages: 0,
      },
    };
  }

  // Enforce active accounts, verified email and seller capability.
  const eligibleSellers = await User.find({
    _id: { $in: approvedSellerIds },
    accountStatus: "active",
    emailVerified: true,
    capabilities: "seller",
  })
    .select("_id fullName")
    .lean();

  const eligibleSellerIds = eligibleSellers.map((seller) => seller._id);

  if (eligibleSellerIds.length === 0) {
    return {
      books: [],
      pagination: {
        page: currentPage,
        limit: pageSize,
        total: 0,
        pages: 0,
      },
    };
  }

  const sellerMap = new Map(
    eligibleSellers.map((seller) => [seller._id.toString(), seller]),
  );

  // Only active listings with positive available inventory qualify.
  const listingQuery = {
    bookId: { $in: books.map((book) => book._id) },
    sellerId: { $in: eligibleSellerIds },
    status: "active",
    $expr: {
      $gt: ["$quantity", "$reservedQuantity"],
    },
  };

  if (condition) {
    listingQuery.condition = condition;
  }

  let listingSort = { createdAt: -1 };

  if (sort === "price_low") {
    listingSort = { pricePaise: 1, createdAt: -1 };
  } else if (sort === "price_high") {
    listingSort = { pricePaise: -1, createdAt: -1 };
  }

  const total = await Listing.countDocuments(listingQuery);

  const listings = await Listing.find(listingQuery)
    .sort(listingSort)
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const result = listings
    .map((listing) => {
      const book = bookMap.get(listing.bookId.toString());
      const seller = sellerMap.get(listing.sellerId.toString());

      if (!book || !seller) {
        return null;
      }

      return {
        listingId: listing._id,
        bookId: book._id,
        title: book.title,
        authors: book.authors,
        isbn: book.isbn,
        publisher: book.publisher,
        edition: book.edition,
        publicationYear: book.publicationYear,
        language: book.language,
        categories: book.categoryIds,
        category: book.categoryIds?.[0]?.name || "Uncategorized",
        description: book.description,
        coverImage: book.coverImage,
        pageCount: book.pageCount,
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
        images: listing.images || [],
      };
    })
    .filter(Boolean);

  return {
    books: result,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  };
};
