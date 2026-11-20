
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Cart quantity must be a whole number.",
      },
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
    versionKey: false,
    collection: "carts",
  },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
