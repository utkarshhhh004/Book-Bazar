
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Listing from "../models/Listing.js";

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

const validateQuantity = (quantity) => {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw createError("Quantity must be a positive whole number.");
  }
};

const getEligibleListing = async (listingId) => {
  const listing = await Listing.findOne({
    _id: listingId,
    status: "active",
  })
    .populate("bookId", "title authors coverImage catalogueStatus")
    .populate("sellerId", "fullName accountStatus capabilities");

  if (!listing) {
    throw createError("This book listing is unavailable.", 404);
  }

  if (
    !listing.bookId ||
    listing.bookId.catalogueStatus !== "approved"
  ) {
    throw createError("This book is not available in the approved catalogue.");
  }

  if (
    !listing.sellerId ||
    listing.sellerId.accountStatus !== "active" ||
    !listing.sellerId.capabilities?.includes("seller")
  ) {
    throw createError("This seller is currently unavailable.");
  }

  return listing;
};

const getAvailableQuantity = (listing) =>
  Math.max(0, listing.quantity - listing.reservedQuantity);

const getOrCreateCart = async (buyerId) => {
  let cart = await Cart.findOne({ buyerId });

  if (cart) return cart;

  try {
    cart = await Cart.create({
      buyerId,
      items: [],
    });

    return cart;
  } catch (error) {
    // Another concurrent request may have created the buyer's cart.
    if (error.code === 11000) {
      cart = await Cart.findOne({ buyerId });
      if (cart) return cart;
    }

    throw error;
  }
};

const formatCart = (cart) => {
  const items = (cart?.items || []).map((item) => {
    const listing = item.listingId;

    if (!listing || !listing.bookId || !listing.sellerId) {
      return {
        listingId: item.listingId?._id || item.listingId || null,
        quantity: item.quantity,
        unavailable: true,
      };
    }

    const availableQuantity = getAvailableQuantity(listing);

    return {
      listingId: listing._id,
      quantity: item.quantity,
      title: listing.bookId.title,
      authors: listing.bookId.authors,
      coverImage: listing.bookId.coverImage,
      condition: listing.condition,
      pricePaise: listing.pricePaise,
      price: listing.pricePaise / 100,
      availableQuantity,
      unavailable: listing.status !== "active" || availableQuantity < item.quantity,
      seller: {
        id: listing.sellerId._id,
        name: listing.sellerId.fullName,
      },
      images: listing.images || [],
    };
  });

  const subtotalPaise = items.reduce((total, item) => {
    if (item.unavailable || !Number.isSafeInteger(item.pricePaise)) {
      return total;
    }

    return total + item.pricePaise * item.quantity;
  }, 0);

  return {
    buyerId: cart?.buyerId || null,
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotalPaise,
    subtotal: subtotalPaise / 100,
    updatedAt: cart?.updatedAt || null,
  };
};

export const getCart = async (buyerId) => {
  validateObjectId(buyerId, "buyer identifier");

  const cart = await Cart.findOne({ buyerId }).populate({
    path: "items.listingId",
    select: "bookId sellerId condition pricePaise quantity reservedQuantity status images",
    populate: [
      {
        path: "bookId",
        select: "title authors coverImage catalogueStatus",
      },
      {
        path: "sellerId",
        select: "fullName accountStatus capabilities",
      },
    ],
  });

  return formatCart(cart);
};

export const addCartItem = async ({
  buyerId,
  listingId,
  quantity = 1,
}) => {
  validateObjectId(buyerId, "buyer identifier");
  validateObjectId(listingId, "listing identifier");
  validateQuantity(quantity);

  const listing = await getEligibleListing(listingId);
  const availableQuantity = getAvailableQuantity(listing);

  const cart = await getOrCreateCart(buyerId);

  const existingItem = cart.items.find(
    (item) => item.listingId.toString() === listingId.toString()
  );

  const requestedQuantity =
    (existingItem?.quantity || 0) + quantity;

  if (requestedQuantity > availableQuantity) {
    throw createError(
      `Only ${availableQuantity} unit(s) are currently available.`
    );
  }

  if (existingItem) {
    existingItem.quantity = requestedQuantity;
  } else {
    cart.items.push({
      listingId,
      quantity,
    });
  }

  await cart.save();

  return getCart(buyerId);
};

export const updateCartItemQuantity = async ({
  buyerId,
  listingId,
  quantity,
}) => {
  validateObjectId(buyerId, "buyer identifier");
  validateObjectId(listingId, "listing identifier");
  validateQuantity(quantity);

  const listing = await getEligibleListing(listingId);
  const availableQuantity = getAvailableQuantity(listing);

  if (quantity > availableQuantity) {
    throw createError(
      `Only ${availableQuantity} unit(s) are currently available.`
    );
  }

  const cart = await Cart.findOne({ buyerId });

  if (!cart) {
    throw createError("Shopping cart not found.", 404);
  }

  const existingItem = cart.items.find(
    (item) => item.listingId.toString() === listingId.toString()
  );

  if (!existingItem) {
    throw createError("This listing is not in your cart.", 404);
  }

  existingItem.quantity = quantity;

  await cart.save();

  return getCart(buyerId);
};

export const removeCartItem = async ({
  buyerId,
  listingId,
}) => {
  validateObjectId(buyerId, "buyer identifier");
  validateObjectId(listingId, "listing identifier");

  const cart = await Cart.findOne({ buyerId });

  if (!cart) {
    throw createError("Shopping cart not found.", 404);
  }

  const initialLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.listingId.toString() !== listingId.toString()
  );

  if (cart.items.length === initialLength) {
    throw createError("This listing is not in your cart.", 404);
  }

  await cart.save();

  return getCart(buyerId);
};

export const clearCart = async (buyerId) => {
  validateObjectId(buyerId, "buyer identifier");

  const cart = await Cart.findOne({ buyerId });

  if (!cart) {
    return {
      buyerId,
      items: [],
      itemCount: 0,
      subtotalPaise: 0,
      subtotal: 0,
      updatedAt: null,
    };
  }

  cart.items = [];
  await cart.save();

  return formatCart(cart);
};
