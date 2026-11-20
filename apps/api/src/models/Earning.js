
import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerOrder",
      required: true,
    },

    grossBookAmountPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionPaise: {
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

    netEarningPaise: {
      type: Number,
      required: true,
      min: 0,
    },

    eligibilityAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "eligible", "held", "settled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "earnings",
  }
);

earningSchema.index({ sellerId: 1 });
earningSchema.index({ sellerOrderId: 1 });
earningSchema.index({ sellerId: 1, status: 1 });

const Earning = mongoose.model("Earning", earningSchema);

export default Earning;
