
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 300,
    },

    authors: {
      type: [
        {
          type: String,
          trim: true,
          minlength: 1,
          maxlength: 150,
        },
      ],
      required: true,
      validate: {
        validator(authors) {
          return authors.length > 0 && authors.every(Boolean);
        },
        message: "At least one valid author is required.",
      },
    },

    isbn: {
      type: String,
      trim: true,
      default: null,
      maxlength: 17,
      set(value) {
        if (!value) return null;
        return value.replace(/[-\s]/g, "").toUpperCase();
      },
    },

    publisher: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    edition: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    publicationYear: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear() + 1,
      default: null,
    },

    language: {
      type: String,
      trim: true,
      default: "English",
      maxlength: 60,
    },

    categoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 10000,
    },

    coverImage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },

    pageCount: {
      type: Number,
      min: 1,
      default: null,
    },

    catalogueStatus: {
      type: String,
      enum: [
        "pending_review",
        "approved",
        "rejected",
        "archived",
      ],
      default: "pending_review",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index(
  { isbn: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isbn: { $type: "string" },
    },
  }
);

bookSchema.index({
  title: "text",
  authors: "text",
  publisher: "text",
  description: "text",
});

bookSchema.index({ categoryIds: 1 });
bookSchema.index({ catalogueStatus: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
