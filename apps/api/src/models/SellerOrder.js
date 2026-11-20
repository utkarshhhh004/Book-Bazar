import mongoose from "mongoose";

const sellerOrderSchema = new mongoose.Schema(
  {
    parentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemsSnapshot: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      default: [],
    },

    bookSubtotalPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingPaise: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sellerFulfillmentStatus: {
      type: String,
      required: true,
      default: "pending",
    },

    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "sellerorders",
  },
);

sellerOrderSchema.index({ parentOrderId: 1 });

sellerOrderSchema.index({
  sellerId: 1,
  createdAt: -1,
});

sellerOrderSchema.index({
  sellerFulfillmentStatus: 1,
});

const SellerOrder = mongoose.model("SellerOrder", sellerOrderSchema);

export default SellerOrder;
