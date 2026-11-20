
import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    sellerOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerOrder",
      required: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    disputeType: {
      type: String,
      required: true,
      trim: true,
    },

    evidenceReferences: {
      type: [String],
      default: [],
    },

    sellerResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    status: {
      type: String,
      required: true,
      trim: true,
    },

    decision: {
      type: String,
      default: null,
      trim: true,
    },

    decisionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "disputes",
  }
);

disputeSchema.index({ orderId: 1 });
disputeSchema.index({ sellerOrderId: 1 });
disputeSchema.index({ buyerId: 1 });
disputeSchema.index({ sellerId: 1 });
disputeSchema.index({ status: 1 });

const Dispute = mongoose.model("Dispute", disputeSchema);

export default Dispute;
