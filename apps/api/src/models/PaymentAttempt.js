
import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    providerOrderId: {
      type: String,
      default: null,
      trim: true,
    },

    amountPaise: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Payment amount must be an integer in paise.",
      },
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      default: "initiated",
      enum: [
        "initiated",
        "pending",
        "successful",
        "failed",
        "expired",
      ],
    },

    failureCode: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "paymentattempts",
  }
);

paymentAttemptSchema.index(
  { idempotencyKey: 1 },
  { unique: true }
);

paymentAttemptSchema.index({ orderId: 1 });
paymentAttemptSchema.index({ providerOrderId: 1 });
paymentAttemptSchema.index({ status: 1 });

const PaymentAttempt = mongoose.model(
  "PaymentAttempt",
  paymentAttemptSchema
);

export default PaymentAttempt;
