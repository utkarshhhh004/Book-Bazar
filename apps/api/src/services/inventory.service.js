
import mongoose from "mongoose";

import Listing from "../models/Listing.js";
import InventoryReservation from "../models/InventoryReservation.js";

const RESERVATION_DURATION_MS = 15 * 60 * 1000;

/**
 * Create a consistent service error understood by the existing
 * centralized Express error handler.
 */
const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Validate MongoDB document identifiers.
 */
const validateObjectId = (value, fieldName) => {
  if (!mongoose.isValidObjectId(value)) {
    throw createError(`Invalid ${fieldName}.`);
  }
};

/**
 * Validate positive whole-number quantities.
 */
const validateQuantity = (quantity) => {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw createError("Quantity must be a positive whole number.");
  }
};

/**
 * Every inventory operation must participate in the caller's
 * MongoDB transaction.
 */
const requireTransaction = (session) => {
  if (!session || !session.inTransaction()) {
    throw createError(
      "Inventory operations require an active MongoDB transaction.",
      500
    );
  }
};

/**
 * Reserve inventory for one listing.
 *
 * Available quantity:
 * listing.quantity - listing.reservedQuantity
 *
 * The conditional update prevents concurrent buyers from
 * reserving more stock than is available.
 */
export const reserveListingInventory = async ({
  buyerId,
  checkoutId,
  listingId,
  quantity,
  expiresAt,
  session,
}) => {
  requireTransaction(session);

  validateObjectId(buyerId, "buyer identifier");
  validateObjectId(checkoutId, "checkout identifier");
  validateObjectId(listingId, "listing identifier");
  validateQuantity(quantity);

  const expirationDate = new Date(expiresAt);

  if (
    Number.isNaN(expirationDate.getTime()) ||
    expirationDate <= new Date()
  ) {
    throw createError("Reservation expiration must be in the future.");
  }

  const listingUpdate = await Listing.updateOne(
    {
      _id: listingId,
      status: "active",
      $expr: {
        $gte: [
          {
            $subtract: ["$quantity", "$reservedQuantity"],
          },
          quantity,
        ],
      },
    },
    {
      $inc: {
        reservedQuantity: quantity,
      },
    },
    { session }
  );

  if (listingUpdate.modifiedCount !== 1) {
    throw createError(
      "Listing is unavailable or does not have sufficient stock.",
      409
    );
  }

  const [reservation] = await InventoryReservation.create(
    [
      {
        buyerId,
        checkoutId,
        listingId,
        quantity,
        status: "active",
        expiresAt: expirationDate,
      },
    ],
    { session }
  );

  return reservation;
};

/**
 * Transition one reservation and update its listing inventory.
 *
 * Both changes execute inside the same MongoDB transaction.
 */
const transitionReservation = async ({
  reservation,
  targetStatus,
  session,
  now,
}) => {
  const timestamp = now || new Date();

  const reservationUpdate = await InventoryReservation.updateOne(
    {
      _id: reservation._id,
      status: "active",
    },
    {
      $set: {
        status: targetStatus,
        ...(targetStatus === "consumed"
          ? { consumedAt: timestamp }
          : { releasedAt: timestamp }),
      },
    },
    { session }
  );

  // Another operation may already have transitioned it.
  if (reservationUpdate.modifiedCount !== 1) {
    return false;
  }

  const inventoryChanges = {
    reservedQuantity: -reservation.quantity,
  };

  if (targetStatus === "consumed") {
    inventoryChanges.quantity = -reservation.quantity;
  }

  const listingUpdate = await Listing.updateOne(
    {
      _id: reservation.listingId,
      reservedQuantity: { $gte: reservation.quantity },
      ...(targetStatus === "consumed"
        ? { quantity: { $gte: reservation.quantity } }
        : {}),
    },
    {
      $inc: inventoryChanges,
    },
    { session }
  );

  if (listingUpdate.modifiedCount !== 1) {
    throw createError(
      "Inventory consistency check failed. Transaction must be rolled back.",
      500
    );
  }

  return true;
};

/**
 * Transition all active reservations associated with a checkout.
 *
 * targetStatus:
 * - released: checkout cancelled
 * - expired: checkout expired
 * - consumed: payment successfully confirmed
 */
const transitionCheckoutReservations = async ({
  checkoutId,
  targetStatus,
  session,
  now = new Date(),
}) => {
  requireTransaction(session);
  validateObjectId(checkoutId, "checkout identifier");

  const query = {
    checkoutId,
    status: "active",
  };

  if (targetStatus === "expired") {
    query.expiresAt = { $lte: now };
  }

  if (targetStatus === "consumed") {
    query.expiresAt = { $gt: now };
  }

  const reservations = await InventoryReservation.find(query)
    .sort({ _id: 1 })
    .session(session);

  // A payment must never consume an expired reservation.
  if (targetStatus === "consumed") {
    const expiredReservation = await InventoryReservation.exists({
      checkoutId,
      status: "active",
      expiresAt: { $lte: now },
    }).session(session);

    if (expiredReservation) {
      throw createError(
        "Checkout inventory reservation has expired.",
        409
      );
    }
  }

  let transitionedCount = 0;

  for (const reservation of reservations) {
    const transitioned = await transitionReservation({
      reservation,
      targetStatus,
      session,
      now,
    });

    if (transitioned) {
      transitionedCount += 1;
    }
  }

  return {
    checkoutId: checkoutId.toString(),
    targetStatus,
    transitionedCount,
  };
};

/**
 * Release all active reservations when a checkout is cancelled.
 *
 * This does not consume physical stock.
 */
export const releaseCheckoutReservations = async ({
  checkoutId,
  session,
  now,
}) => {
  return transitionCheckoutReservations({
    checkoutId,
    targetStatus: "released",
    session,
    now,
  });
};

/**
 * Release expired reservations and restore available inventory.
 *
 * Expiration is explicitly processed; MongoDB TTL deletion
 * must never be responsible for restoring stock.
 */
export const expireCheckoutReservations = async ({
  checkoutId,
  session,
  now = new Date(),
}) => {
  return transitionCheckoutReservations({
    checkoutId,
    targetStatus: "expired",
    session,
    now,
  });
};

/**
 * Consume active reservations after successful payment confirmation.
 *
 * Physical quantity and reserved quantity both decrease.
 */
export const consumeCheckoutReservations = async ({
  checkoutId,
  session,
  now = new Date(),
}) => {
  return transitionCheckoutReservations({
    checkoutId,
    targetStatus: "consumed",
    session,
    now,
  });
};

/**
 * Expose the standard reservation duration to checkout services.
 */
export const getReservationExpiry = (from = new Date()) => {
  return new Date(from.getTime() + RESERVATION_DURATION_MS);
};
