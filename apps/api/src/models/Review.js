
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

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

    bookRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: "Book rating must be a whole number between 1 and 5.",
      },
    },

    sellerRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: "Seller rating must be a whole number between 1 and 5.",
      },
    },

    reviewText: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },

    imageReferences: {
      type: [String],
      default: [],
    },

    moderationStatus: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "reviews",
  }
);

reviewSchema.index({ bookId: 1 });
reviewSchema.index({ sellerId: 1 });
reviewSchema.index({ buyerId: 1 });

reviewSchema.index(
  { buyerId: 1, sellerOrderId: 1, bookId: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
