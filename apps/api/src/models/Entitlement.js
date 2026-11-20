
import mongoose from "mongoose";

const entitlementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    entitlementType: {
      type: String,
      required: true,
      trim: true,
      default: "first_successful_transaction",
    },

    status: {
      type: String,
      required: true,
      enum: ["available", "consumed"],
      default: "available",
    },

    consumedByType: {
      type: String,
      enum: ["purchase", "sale"],
      default: null,
    },

    consumedById: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "entitlements",
  }
);

entitlementSchema.index(
  { userId: 1, entitlementType: 1 },
  { unique: true }
);

const Entitlement = mongoose.model(
  "Entitlement",
  entitlementSchema
);

export default Entitlement;
