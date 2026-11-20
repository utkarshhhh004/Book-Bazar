import mongoose from "mongoose";

const sellerListingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    pricePaise: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Price must be a valid integer amount in paise.",
      },
    },

    condition: {
      type: String,
      required: true,
      enum: ["new", "like_new", "good", "acceptable"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Quantity must be a whole number.",
      },
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Reserved quantity must be a whole number.",
      },
    },

    listingStatus: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "active",
        "rejected",
        "paused",
        "sold_out",
        "archived",
      ],
      default: "draft",
      required: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

sellerListingSchema.virtual("availableQuantity").get(function () {
  return Math.max(0, this.quantity - this.reservedQuantity);
});

sellerListingSchema.index({
  bookId: 1,
  listingStatus: 1,
});

sellerListingSchema.index({
  sellerId: 1,
  listingStatus: 1,
});

sellerListingSchema.index({
  listingStatus: 1,
  createdAt: -1,
});

const SellerListing = mongoose.model("SellerListing", sellerListingSchema);

export default SellerListing;
