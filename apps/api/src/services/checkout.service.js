import mongoose from "mongoose";
import { createHash } from "node:crypto";

import User from "../models/User.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";
import Listing from "../models/Listing.js";
import Checkout from "../models/Checkout.js";

import {
  getReservationExpiry,
  reserveListingInventory,
  expireCheckoutReservations,
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

const validateIdempotencyKey = (key) => {
  if (
    typeof key !== "string" ||
    key.trim().length < 16 ||
    key.trim().length > 128
  ) {
    throw createError("A valid checkout idempotency key is required.");
  }

  return key.trim();
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
      403,
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
      404,
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

// Fingerprint only the request identity, not mutable listing prices.
// The same key must represent the same address and cart quantities.
const createRequestFingerprint = ({ addressId, cart }) => {
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw createError("Your cart is empty.", 400);
  }

  const items = cart.items
    .map((item) => ({
      listingId: item.listingId.toString(),
      quantity: item.quantity,
    }))
    .sort((a, b) => a.listingId.localeCompare(b.listingId));

  const canonicalRequest = JSON.stringify({
    addressId: addressId.toString(),
    items,
  });

  return createHash("sha256").update(canonicalRequest).digest("hex");
};

const loadCheckoutItems = async ({ cart, buyerId, session }) => {
  if (!cart || cart.items.length === 0) {
    throw createError("Your cart is empty.", 400);
  }

  const listingIds = cart.items.map((item) => item.listingId.toString());
  const uniqueListingIds = new Set(listingIds);

  if (uniqueListingIds.size !== listingIds.length) {
    throw createError(
      "Your cart contains duplicate listings. Please update your cart.",
      409,
    );
  }

  const listings = await Listing.find({
    _id: { $in: cart.items.map((item) => item.listingId) },
  }).session(session);

  const listingMap = new Map(
    listings.map((listing) => [listing._id.toString(), listing]),
  );

  const bookIds = listings.map((listing) => listing.bookId);

  const books = await Book.find({
    _id: { $in: bookIds },
    catalogueStatus: "approved",
  }).session(session);

  const bookMap = new Map(books.map((book) => [book._id.toString(), book]));

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
    sellers.map((seller) => [seller._id.toString(), seller]),
  );

  const items = [];
  let bookSubtotalPaise = 0;

  for (const cartItem of cart.items) {
    const listingId = cartItem.listingId.toString();
    const listing = listingMap.get(listingId);

    if (!listing || listing.status !== "active") {
      throw createError(
        "One or more books in your cart are no longer available.",
        409,
      );
    }

    if (listing.sellerId.toString() === buyerId.toString()) {
      throw createError("You cannot purchase your own book listing.", 400);
    }

    const seller = sellerMap.get(listing.sellerId.toString());

    if (!seller) {
      throw createError(
        "A seller associated with your cart is unavailable.",
        409,
      );
    }

    const book = bookMap.get(listing.bookId.toString());

    if (!book) {
      throw createError(
        "The catalogue record for a selected book is unavailable.",
        409,
      );
    }

    const quantity = cartItem.quantity;

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      throw createError("Your cart contains an invalid quantity.");
    }

    const availableQuantity = listing.quantity - listing.reservedQuantity;

    if (availableQuantity < quantity) {
      throw createError(
        `Insufficient stock for "${book.title}". Please update the quantity.`,
        409,
      );
    }

    if (!Number.isSafeInteger(listing.pricePaise) || listing.pricePaise < 1) {
      throw createError(`The price for "${book.title}" is invalid.`, 500);
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
      authors: book.authors || [],
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
  shippingTotalPaise: 0,
  gatewayFeePaise: 0,
  taxTotalPaise: 0,
  totalPaise: bookSubtotalPaise,
  deliveryAddress: addressSnapshot,
});

const buildStoredCheckoutResponse = (checkout) => {
  if (
    !Array.isArray(checkout.itemsSnapshot) ||
    checkout.itemsSnapshot.length === 0 ||
    !checkout.addressSnapshot ||
    !Number.isSafeInteger(checkout.bookSubtotalPaise)
  ) {
    throw createError(
      "The stored checkout snapshot is incomplete. Please start a new checkout.",
      409,
    );
  }

  return buildCheckoutResponse({
    checkout,
    items: checkout.itemsSnapshot,
    bookSubtotalPaise: checkout.bookSubtotalPaise,
    addressSnapshot: checkout.addressSnapshot,
  });
};

const getExistingCheckout = async ({
  buyerId,
  idempotencyKey,
  requestFingerprint,
  session = null,
}) => {
  const query = Checkout.findOne({
    buyerId,
    idempotencyKey,
  });

  const checkout = await query.session(session);

  if (!checkout) {
    return null;
  }

  if (checkout.requestFingerprint !== requestFingerprint) {
    throw createError(
      "This idempotency key has already been used for a different checkout request. Start a new checkout attempt.",
      409,
    );
  }

  return checkout;
};

const getExistingCheckoutResult = (checkout, now = new Date()) => {
  if (
    ["active", "awaiting_payment"].includes(checkout.status) &&
    checkout.expiresAt > now
  ) {
    return {
      response: buildStoredCheckoutResponse(checkout),
    };
  }

  return {
    error: createError(
      "This checkout session is no longer active. Please start a new checkout attempt with a new idempotency key.",
      409,
    ),
  };
};

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

export const createCheckout = async ({
  buyerId,
  addressId,
  idempotencyKey,
}) => {
  validateObjectId(buyerId, "buyer identifier");

  const normalizedKey = validateIdempotencyKey(idempotencyKey);
  const session = await mongoose.startSession();

  let checkoutResult;
  let checkoutError;

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

      const requestFingerprint = createRequestFingerprint({
        addressId,
        cart,
      });

      // Check for an existing request before validating stock.
      // This prevents a retry from failing because its own reservation
      // has already reduced available inventory.
      const existingCheckout = await getExistingCheckout({
        buyerId,
        idempotencyKey: normalizedKey,
        requestFingerprint,
        session,
      });

      if (existingCheckout) {
        const now = new Date();

        if (
          existingCheckout.status === "active" &&
          existingCheckout.expiresAt <= now
        ) {
          await expireCheckoutReservations({
            checkoutId: existingCheckout._id,
            session,
            now,
          });

          existingCheckout.status = "expired";
          await existingCheckout.save({ session });

          checkoutError = createError(
            "This checkout session has expired. Please start a new checkout attempt with a new idempotency key.",
            409,
          );

          return;
        }

        const existingResult = getExistingCheckoutResult(existingCheckout, now);

        checkoutResult = existingResult.response;
        checkoutError = existingResult.error;
        return;
      }

      const { items, bookSubtotalPaise } = await loadCheckoutItems({
        cart,
        buyerId,
        session,
      });

      const addressSnapshot = createAddressSnapshot(address);
      const now = new Date();
      const expiresAt = getReservationExpiry(now);

      const [checkout] = await Checkout.create(
        [
          {
            buyerId,
            idempotencyKey: normalizedKey,
            requestFingerprint,
            addressId: address._id,
            addressSnapshot,
            itemsSnapshot: items,
            bookSubtotalPaise,
            status: "active",
            expiresAt,
          },
        ],
        { session },
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
        addressSnapshot,
      });
    });

    if (checkoutError) {
      throw checkoutError;
    }

    return checkoutResult;
  } catch (error) {
    // A concurrent request may win the unique-index race.
    // Retrieve and return its committed checkout when possible.
    if (error.code === 11000) {
      const [cart, existingCheckout] = await Promise.all([
        Cart.findOne({ buyerId }),
        Checkout.findOne({
          buyerId,
          idempotencyKey: normalizedKey,
        }),
      ]);

      if (existingCheckout) {
        const requestFingerprint = createRequestFingerprint({
          addressId,
          cart,
        });

        if (existingCheckout.requestFingerprint !== requestFingerprint) {
          throw createError(
            "This idempotency key has already been used for a different checkout request.",
            409,
          );
        }

        const existingResult = getExistingCheckoutResult(existingCheckout);

        if (existingResult.error) {
          throw existingResult.error;
        }

        return existingResult.response;
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
};
