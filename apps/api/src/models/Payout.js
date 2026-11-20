import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayoutDestination",
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
        message: "Payout amount must be an integer in paise.",
      },
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    providerPayoutId: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "initiated",
        "processing",
        "successful",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    initiatedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "payouts",
  },
);

payoutSchema.index({ sellerId: 1 });
payoutSchema.index({ status: 1 });
payoutSchema.index({ providerPayoutId: 1 });

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
