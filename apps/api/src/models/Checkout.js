
import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "active",
        "awaiting_payment",
        "completed",
        "expired",
        "cancelled",
      ],
      default: "active",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: undefined,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "checkouts",
  }
);

checkoutSchema.index({ buyerId: 1 });

checkoutSchema.index({
  status: 1,
  expiresAt: 1,
});

checkoutSchema.index(
  { orderId: 1 },
  {
    unique: true,
    sparse: true,
  }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
