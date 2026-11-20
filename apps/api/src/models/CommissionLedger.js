
import mongoose from "mongoose";

const commissionLedgerSchema = new mongoose.Schema(
  {
    sellerOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerOrder",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookSubtotalPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    sellerDiscountPaise: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 10,
    },

    commissionPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    waiverApplied: {
      type: Boolean,
      required: true,
      default: false,
    },

    calculationSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    entryType: {
      type: String,
      required: true,
      enum: ["charge", "adjustment", "reversal"],
      default: "charge",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
    collection: "commissionledgers",
  }
);

commissionLedgerSchema.index({ sellerId: 1 });
commissionLedgerSchema.index({ sellerOrderId: 1 });
commissionLedgerSchema.index({ createdAt: -1 });

const CommissionLedger = mongoose.model(
  "CommissionLedger",
  commissionLedgerSchema
);

export default CommissionLedger;
