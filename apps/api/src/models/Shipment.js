
import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    sellerOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerOrder",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courierName: {
      type: String,
      trim: true,
      default: null,
    },

    trackingNumber: {
      type: String,
      trim: true,
      default: null,
    },

    trackingUrl: {
      type: String,
      trim: true,
      default: null,
    },

    dispatchEvidence: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    shipmentStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "ready_to_dispatch",
        "dispatched",
        "in_transit",
        "delivered",
        "delivery_failed",
        "returned",
      ],
      default: "pending",
    },

    dispatchedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "shipments",
  }
);

shipmentSchema.index({ sellerOrderId: 1 });
shipmentSchema.index({ sellerId: 1 });
shipmentSchema.index({ shipmentStatus: 1 });
shipmentSchema.index({ trackingNumber: 1 });

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
