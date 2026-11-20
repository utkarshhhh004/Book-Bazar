import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
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

    condition: {
      type: String,
      required: true,
      enum: ["new", "like_new", "very_good", "good", "acceptable"],
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
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator(value) {
          return Number.isSafeInteger(value);
        },
        message: "Reserved quantity must be a whole number.",
      },
    },

    sellerDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },

    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    disclosedDefects: {
      type: [String],
      default: [],
    },

    dispatchLocation: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    handlingTime: {
      type: Number,
      min: 0,
      default: null,
    },

    shippingTerms: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "draft",
        "pending_review",
        "active",
        "rejected",
        "paused",
        "sold_out",
        "archived",
        "suspended",
      ],
      default: "draft",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "listings",
  },
);

listingSchema.virtual("availableQuantity").get(function () {
  return Math.max(0, this.quantity - this.reservedQuantity);
});

listingSchema.index({ bookId: 1 });
listingSchema.index({ sellerId: 1 });

listingSchema.index({
  bookId: 1,
  status: 1,
  pricePaise: 1,
});

listingSchema.index({
  condition: 1,
  status: 1,
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
