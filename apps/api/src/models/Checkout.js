import mongoose from "mongoose";

const isNonNegativeSafeInteger = (value) =>
  Number.isSafeInteger(value) && value >= 0;

const isPositiveSafeInteger = (value) =>
  Number.isSafeInteger(value) && value > 0;

const addressSnapshotSchema = new mongoose.Schema(
  {
    recipientName: String,
    phone: String,
    addressLine1: String,
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false },
);

const checkoutItemSnapshotSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    authors: {
      type: [String],
      default: [],
    },
    coverImage: mongoose.Schema.Types.Mixed,
    condition: String,
    unitPricePaise: {
      type: Number,
      validate: {
        validator: isPositiveSafeInteger,
        message: "Unit price must be a positive integer in paise.",
      },
    },
    quantity: {
      type: Number,
      validate: {
        validator: isPositiveSafeInteger,
        message: "Quantity must be a positive integer.",
      },
    },
    lineTotalPaise: {
      type: Number,
      validate: {
        validator: isPositiveSafeInteger,
        message: "Line total must be a positive integer in paise.",
      },
    },
  },
  { _id: false },
);

const checkoutSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional at schema level for compatibility with legacy documents.
    // New checkout creation must always provide these fields.
    idempotencyKey: {
      type: String,
      trim: true,
      minlength: 16,
      maxlength: 128,
    },

    requestFingerprint: {
      type: String,
    },

    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    addressSnapshot: {
      type: addressSnapshotSchema,
    },

    itemsSnapshot: {
      type: [checkoutItemSnapshotSchema],
    },

    bookSubtotalPaise: {
      type: Number,
      validate: {
        validator: isNonNegativeSafeInteger,
        message: "Book subtotal must be a non-negative integer in paise.",
      },
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "awaiting_payment", "completed", "expired", "cancelled"],
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
  },
);

checkoutSchema.index({ buyerId: 1 });

checkoutSchema.index({
  status: 1,
  expiresAt: 1,
});

// Unique only for documents containing a string idempotency key.
// Legacy documents without this field remain compatible.
checkoutSchema.index(
  { buyerId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: "string" },
    },
  },
);

checkoutSchema.index(
  { orderId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
