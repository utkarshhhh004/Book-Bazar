
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    userAgent: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Automatically remove expired session documents.
// Application logic must independently check expiration.
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Supports querying active sessions belonging to a user.
sessionSchema.index({
  userId: 1,
  revokedAt: 1,
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
