
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    paymentAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentAttempt",
      required: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    providerTransactionId: {
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

    paymentMethod: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "initiated",
        "pending",
        "successful",
        "failed",
        "expired",
        "refund_initiated",
        "refunded",
      ],
      default: "initiated",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "payments",
  }
);

paymentSchema.index(
  { providerTransactionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      providerTransactionId: { $type: "string" },
    },
  }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ buyerId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
