
import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amountPaise: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Refund amount must be an integer in paise.",
      },
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "requested",
        "pending",
        "initiated",
        "processing",
        "successful",
        "failed",
      ],
      default: "requested",
    },

    providerRefundId: {
      type: String,
      default: null,
      trim: true,
    },

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "refunds",
  }
);

refundSchema.index({ paymentId: 1 });
refundSchema.index({ orderId: 1 });
refundSchema.index({ status: 1 });

refundSchema.index(
  { providerRefundId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      providerRefundId: { $type: "string" },
    },
  }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
