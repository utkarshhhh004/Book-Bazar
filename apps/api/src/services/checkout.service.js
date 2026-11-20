
import mongoose from "mongoose";

import User from "../models/User.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";
import Listing from "../models/Listing.js";
import Checkout from "../models/Checkout.js";

import {
  getReservationExpiry,
  reserveListingInventory,
} from "./inventory.service.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (value, fieldName) => {
  if (!mongoose.isValidObjectId(value)) {
    throw createError(`Invalid ${fieldName}.`);
  }
};

const validateBuyer = (buyer) => {
  if (!buyer) {
    throw createError("User account was not found.", 404);
  }

  if (buyer.accountStatus !== "active") {
    throw createError("Your account is not active.", 403);
  }

  if (!buyer.emailVerified) {
    throw createError(
      "Please verify your email before proceeding to checkout.",
      403
    );
  }

  if (!buyer.capabilities?.includes("buyer")) {
    throw createError("Buyer access is not enabled for this account.", 403);
  }
};

const getOwnedAddress = async ({ addressId, buyerId, session }) => {
  validateObjectId(addressId, "delivery address");

  const address = await Address.findOne({
    _id: addressId,
    userId: buyerId,
  }).session(session);

  if (!address) {
    throw createError(
      "The selected delivery address was not found in your account.",
      404
    );
  }

  return address;
};

const createAddressSnapshot = (address) => ({
  recipientName: address.recipientName,
  phone: address.phone,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2 || "",
  landmark: address.landmark || "",
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
});

const loadCheckoutItems = async ({ cart, buyerId, session }) => {
  if (!cart || cart.items.length === 0) {
    throw createError("Your cart is empty.", 400);
  }

  const listingIds = cart.items.map((item) => item.listingId.toString());
  const uniqueListingIds = new Set(listingIds);

  if (uniqueListingIds.size !== listingIds.length) {
    throw createError(
      "Your cart contains duplicate listings. Please update your cart.",
      409
    );
  }

  const listings = await Listing.find({
    _id: { $in: cart.items.map((item) => item.listingId) },
  }).session(session);

  const listingMap = new Map(
    listings.map((listing) => [listing._id.toString(), listing])
  );

  const bookIds = listings.map((listing) => listing.bookId);

  const books = await Book.find({
    _id: { $in: bookIds },
    catalogueStatus: "approved",
  }).session(session);

  const bookMap = new Map(
    books.map((book) => [book._id.toString(), book])
  );

  const sellerIds = [
    ...new Set(listings.map((listing) => listing.sellerId.toString())),
  ];

  const sellers = await User.find({
    _id: { $in: sellerIds },
    accountStatus: "active",
    capabilities: "seller",
  })
    .select("_id fullName accountStatus capabilities")
    .session(session);

  const sellerMap = new Map(
    sellers.map((seller) => [seller._id.toString(), seller])
  );

  const items = [];
  let bookSubtotalPaise = 0;

  for (const cartItem of cart.items) {
    const listingId = cartItem.listingId.toString();
    const listing = listingMap.get(listingId);

    if (!listing || listing.status !== "active") {
      throw createError(
        "One or more books in your cart are no longer available.",
        409
      );
    }

    if (listing.sellerId.toString() === buyerId.toString()) {
      throw createError(
        "You cannot purchase your own book listing.",
        400
      );
    }

    const seller = sellerMap.get(listing.sellerId.toString());

    if (!seller) {
      throw createError(
        "A seller associated with your cart is unavailable.",
        409
      );
    }

    const book = bookMap.get(listing.bookId.toString());

    if (!book) {
      throw createError(
        "The catalogue record for a selected book is unavailable.",
        409
      );
    }

    const quantity = cartItem.quantity;

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      throw createError("Your cart contains an invalid quantity.");
    }

    const availableQuantity =
      listing.quantity - listing.reservedQuantity;

    if (availableQuantity < quantity) {
      throw createError(
        `Insufficient stock for "${book.title}". Please update the quantity.`,
        409
      );
    }

    if (
      !Number.isSafeInteger(listing.pricePaise) ||
      listing.pricePaise < 1
    ) {
      throw createError(
        `The price for "${book.title}" is invalid.`,
        500
      );
    }

    const lineTotalPaise = listing.pricePaise * quantity;

    if (!Number.isSafeInteger(lineTotalPaise)) {
      throw createError("The cart total exceeds the supported amount.", 400);
    }

    bookSubtotalPaise += lineTotalPaise;

    if (!Number.isSafeInteger(bookSubtotalPaise)) {
      throw createError("The cart subtotal exceeds the supported amount.", 400);
    }

    items.push({
      listingId: listing._id,
      bookId: book._id,
      sellerId: seller._id,
      title: book.title,
      authors: book.authors,
      coverImage: book.coverImage,
      condition: listing.condition,
      unitPricePaise: listing.pricePaise,
      quantity,
      lineTotalPaise,
    });
  }

  return {
    items,
    bookSubtotalPaise,
  };
};

const buildCheckoutResponse = ({
  checkout,
  items,
  bookSubtotalPaise,
  addressSnapshot,
}) => ({
  checkoutId: checkout._id,
  status: checkout.status,
  expiresAt: checkout.expiresAt,
  items,
  itemCount: items.reduce((total, item) => total + item.quantity, 0),
  bookSubtotalPaise,

  // Shipping, gateway fees and taxes are deliberately not estimated here.
  // They must be resolved by the applicable checkout pricing policies.
  shippingTotalPaise: null,
  gatewayFeePaise: null,
  taxTotalPaise: null,
  totalPaise: null,

  deliveryAddress: addressSnapshot,
});

export const previewCheckout = async ({ buyerId, addressId }) => {
  validateObjectId(buyerId, "buyer identifier");

  const buyer = await User.findById(buyerId);
  validateBuyer(buyer);

  const address = await getOwnedAddress({
    addressId,
    buyerId,
    session: null,
  });

  const cart = await Cart.findOne({ buyerId });

  const { items, bookSubtotalPaise } = await loadCheckoutItems({
    cart,
    buyerId,
    session: null,
  });

  return {
    checkout: null,
    items,
    bookSubtotalPaise,
    addressSnapshot: createAddressSnapshot(address),
  };
};

export const createCheckout = async ({ buyerId, addressId }) => {
  validateObjectId(buyerId, "buyer identifier");

  const session = await mongoose.startSession();

  let checkoutResult;

  try {
    await session.withTransaction(async () => {
      const buyer = await User.findById(buyerId).session(session);
      validateBuyer(buyer);

      const address = await getOwnedAddress({
        addressId,
        buyerId,
        session,
      });

      const cart = await Cart.findOne({ buyerId }).session(session);

      const { items, bookSubtotalPaise } = await loadCheckoutItems({
        cart,
        buyerId,
        session,
      });

      const now = new Date();
      const expiresAt = getReservationExpiry(now);

      const [checkout] = await Checkout.create(
        [
          {
            buyerId,
            status: "active",
            expiresAt,
          },
        ],
        { session }
      );

      for (const item of items) {
        await reserveListingInventory({
          buyerId,
          checkoutId: checkout._id,
          listingId: item.listingId,
          quantity: item.quantity,
          expiresAt,
          session,
        });
      }

      checkoutResult = buildCheckoutResponse({
        checkout,
        items,
        bookSubtotalPaise,
        addressSnapshot: createAddressSnapshot(address),
      });
    });

    return checkoutResult;
  } finally {
    await session.endSession();
  }
};
