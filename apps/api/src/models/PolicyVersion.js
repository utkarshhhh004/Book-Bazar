
import mongoose from "mongoose";

const policyVersionSchema = new mongoose.Schema(
  {
    policyType: {
      type: String,
      required: true,
      trim: true,
    },

    version: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator(value) {
          return Number.isInteger(value);
        },
        message: "Policy version must be a positive integer.",
      },
    },

    configuration: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    effectiveFrom: {
      type: Date,
      required: true,
    },

    effectiveTo: {
      type: Date,
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    changeReason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    versionKey: false,
    collection: "policyversions",
  }
);

policyVersionSchema.index(
  { policyType: 1, version: 1 },
  { unique: true }
);

policyVersionSchema.index({ effectiveFrom: 1 });
policyVersionSchema.index({ updatedBy: 1 });

const PolicyVersion = mongoose.model(
  "PolicyVersion",
  policyVersionSchema
);

export default PolicyVersion;
