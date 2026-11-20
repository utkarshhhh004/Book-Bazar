
import mongoose from "mongoose";

const payoutDestinationSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destinationType: {
      type: String,
      required: true,
      enum: ["upi_vpa", "bank_account", "provider_supported"],
    },

    encryptedDetails: {
      type: String,
      required: true,
      select: false,
    },

    verificationStatus: {
      type: String,
      required: true,
      enum: ["pending", "verified", "rejected", "expired"],
      default: "pending",
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "payoutdestinations",
  }
);

payoutDestinationSchema.index({ sellerId: 1 });
payoutDestinationSchema.index({ verificationStatus: 1 });

const PayoutDestination = mongoose.model(
  "PayoutDestination",
  payoutDestinationSchema
);

export default PayoutDestination;
