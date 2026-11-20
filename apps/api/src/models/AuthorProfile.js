
import mongoose from "mongoose";

const authorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    biography: {
      type: String,
      trim: true,
      default: "",
      maxlength: 3000,
    },

    profileImage: {
      type: String,
      default: null,
      trim: true,
    },

    genres: {
      type: [String],
      default: [],
    },

    profileStatus: {
      type: String,
      required: true,
      enum: ["pending", "active", "inactive", "suspended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "authorprofiles",
  }
);

authorProfileSchema.index({ profileStatus: 1 });

const AuthorProfile = mongoose.model(
  "AuthorProfile",
  authorProfileSchema
);

export default AuthorProfile;
