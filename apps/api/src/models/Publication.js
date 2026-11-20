
import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    authorshipDeclaration: {
      type: Boolean,
      required: true,
      default: false,
    },

    ownershipDeclaration: {
      type: Boolean,
      required: true,
      default: false,
    },

    evidenceReferences: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    reviewStatus: {
      type: String,
      required: true,
      enum: [
        "pending_review",
        "under_review",
        "additional_documents_required",
        "approved",
        "rejected",
        "suspended",
        "removed",
      ],
      default: "pending_review",
    },

    reviewReason: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "publications",
  }
);

publicationSchema.index({ authorId: 1 });
publicationSchema.index({ reviewStatus: 1 });
publicationSchema.index({ createdAt: -1 });

const Publication = mongoose.model(
  "Publication",
  publicationSchema
);

export default Publication;
