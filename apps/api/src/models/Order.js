
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerOrderIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SellerOrder",
        },
      ],
      default: [],
    },

    itemsSnapshot: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      default: [],
    },

    deliveryAddressSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    bookSubtotalPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingTotalPaise: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    gatewayFeePaise: {
      type: Number,
      min: 0,
      default: 0,
    },

    taxTotalPaise: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      required: true,
      default: "pending",
    },

    orderStatus: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "orders",
  }
);

orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
