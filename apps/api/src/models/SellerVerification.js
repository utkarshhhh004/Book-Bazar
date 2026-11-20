
import mongoose from "mongoose";

const sellerVerificationSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerType: {
      type: String,
      required: true,
      enum: ["individual", "business"],
    },

    submittedDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    documentReferences: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      required: true,
      enum: [
        "draft",
        "pending_review",
        "under_review",
        "additional_information_required",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "draft",
    },

    reviewReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "sellerverifications",
  }
);

sellerVerificationSchema.index({ sellerId: 1 });
sellerVerificationSchema.index({ status: 1 });

const SellerVerification = mongoose.model(
  "SellerVerification",
  sellerVerificationSchema
);

export default SellerVerification;
