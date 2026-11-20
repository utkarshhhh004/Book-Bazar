
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "categories",
  }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentCategoryId: 1 });
categorySchema.index({ status: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
