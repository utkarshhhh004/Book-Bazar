
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    line2: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    address: {
      type: addressSchema,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    capabilities: {
      type: [
        {
          type: String,
          enum: ["buyer", "seller", "author"],
        },
      ],
      default: ["buyer"],
    },

    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "disabled"],
      default: "active",
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Additional query indexes.
userSchema.index({ accountStatus: 1 });
userSchema.index({ emailVerified: 1 });

// Prevent duplicate capability entries.
userSchema.path("capabilities").validate({
  validator(capabilities) {
    return new Set(capabilities).size === capabilities.length;
  },
  message: "Duplicate account capabilities are not allowed.",
});

const User = mongoose.model("User", userSchema);

export default User;
