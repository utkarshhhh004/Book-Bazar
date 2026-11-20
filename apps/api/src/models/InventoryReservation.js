
import mongoose from "mongoose";

const inventoryReservationSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    checkoutId: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Reserved quantity must be a whole number.",
      },
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "consumed", "released", "expired"],
      default: "active",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    releasedAt: {
      type: Date,
      default: null,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
    collection: "inventoryreservations",
  }
);

inventoryReservationSchema.index({ listingId: 1 });
inventoryReservationSchema.index({ checkoutId: 1 });

inventoryReservationSchema.index({
  status: 1,
  expiresAt: 1,
});

inventoryReservationSchema.index({ buyerId: 1 });

const InventoryReservation = mongoose.model(
  "InventoryReservation",
  inventoryReservationSchema
);

export default InventoryReservation;
