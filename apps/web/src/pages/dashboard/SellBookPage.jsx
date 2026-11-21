import { useEffect, useState } from "react";
import {
  BookOpen,
  Camera,
  Upload,
  X,
  IndianRupee,
  Package,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import {
  activateSeller,
  uploadBookImages,
  submitCatalogueBook,
  createListing,
} from "../../services/seller.service";

const INITIAL_FORM = {
  title: "",
  authors: "",
  isbn: "",
  publisher: "",
  edition: "",
  publicationYear: "",
  language: "English",
  description: "",

  condition: "good",
  price: "",
  quantity: "1",
  sellerDescription: "",
  disclosedDefects: "",

  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const MAX_IMAGES = 2;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export default function SellBookPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Release preview URLs when the component unmounts.
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Handle form inputs.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (feedback) {
      setFeedback(null);
    }
  };

  // Upload one or two book photographs.
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    const combinedFiles = [...images, ...selectedFiles];

    if (combinedFiles.length > MAX_IMAGES) {
      setFeedback({
        type: "error",
        message: "You can upload a maximum of two photographs.",
      });

      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
    );

    if (invalidFile) {
      setFeedback({
        type: "error",
        message: "Only JPG, PNG and WEBP images up to 5 MB each are allowed.",
      });

      event.target.value = "";
      return;
    }

    setImages(combinedFiles);

    setPreviews(combinedFiles.map((file) => URL.createObjectURL(file)));

    setFeedback(null);

    event.target.value = "";
  };

  // Remove selected photograph.
  const removeImage = (index) => {
    setImages((current) => current.filter((_, i) => i !== index));

    setPreviews((current) => {
      const updated = [...current];

      URL.revokeObjectURL(updated[index]);

      updated.splice(index, 1);

      return updated;
    });
  };

  // Validate all seller inputs.
  const validateForm = () => {
    const requiredFields = [
      ["title", "Book title"],
      ["authors", "Author"],
      ["publisher", "Publisher"],
      ["price", "Selling price"],
      ["quantity", "Available quantity"],
      ["city", "City"],
      ["state", "State"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(form[field]).trim()) {
        return `${label} is required.`;
      }
    }

    if (images.length < 1 || images.length > MAX_IMAGES) {
      return "Please upload one or two photographs of your book.";
    }

    const price = Number(form.price);

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isSafeInteger(Math.round(price * 100))
    ) {
      return "Enter a valid selling price.";
    }

    const quantity = Number(form.quantity);

    if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 100000) {
      return "Enter a valid whole-number quantity.";
    }

    if (
      form.publicationYear &&
      (!Number.isInteger(Number(form.publicationYear)) ||
        Number(form.publicationYear) < 1000 ||
        Number(form.publicationYear) > new Date().getFullYear() + 1)
    ) {
      return "Enter a valid publication year.";
    }

    const authors = form.authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    if (!authors.length) {
      return "At least one author is required.";
    }

    if (authors.length > 20) {
      return "A maximum of 20 authors is allowed.";
    }

    if (form.condition === "acceptable" && !form.disclosedDefects.trim()) {
      return "Please disclose the defects or missing pages.";
    }

    return null;
  };

  // Submit book and seller listing.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFeedback(null);

    const validationError = validateForm();

    if (validationError) {
      setFeedback({
        type: "error",
        message: validationError,
      });

      return;
    }

    setLoading(true);

    try {
      // STEP 1: Activate seller capability.
      await activateSeller();

      // STEP 2: Upload actual photographs to Cloudinary.
      const uploadedImages = await uploadBookImages(images);

      if (!uploadedImages || uploadedImages.length !== images.length) {
        throw new Error(
          "All book photographs could not be uploaded. Please try again.",
        );
      }

      const imageUrls = uploadedImages.map((image) => image.url);

      if (imageUrls.some((url) => !url)) {
        throw new Error("The image server did not return valid image URLs.");
      }

      // STEP 3: Prepare catalogue information.
      const cataloguePayload = {
        title: form.title.trim(),

        authors: form.authors
          .split(",")
          .map((author) => author.trim())
          .filter(Boolean),

        isbn: form.isbn.trim() || null,

        publisher: form.publisher.trim(),

        edition: form.edition.trim(),

        publicationYear: form.publicationYear
          ? Number(form.publicationYear)
          : null,

        language: form.language.trim() || "English",

        categoryIds: [],

        description: form.description.trim(),

        coverImage: imageUrls[0],
      };

      // STEP 4: Submit book to shared catalogue.
      const book = await submitCatalogueBook(cataloguePayload);

      const bookId = book?._id || book?.id;

      if (!bookId) {
        throw new Error("The catalogue did not return a valid book ID.");
      }

      // STEP 5: Prepare seller listing.
      const listingPayload = {
        bookId,

        condition: form.condition,

        pricePaise: Math.round(Number(form.price) * 100),

        quantity: Number(form.quantity),

        sellerDescription: form.sellerDescription.trim(),

        images: imageUrls,

        disclosedDefects: form.disclosedDefects
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        dispatchLocation: {
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
      };

      // STEP 6: Create seller listing in MongoDB.
      const listing = await createListing(listingPayload);

      const listingId = listing?._id || listing?.id;

      // STEP 7: Display actual backend response.
      setFeedback({
        type: "success",
        message:
          listing?.status === "active"
            ? "Your book is now listed on the marketplace!"
            : "Your book has been submitted successfully and saved as a draft. Seller verification and catalogue approval are required before public visibility.",
      });

      if (listingId) {
        sessionStorage.setItem(
          "book-bazar-last-created-listing",
          String(listingId),
        );
      }

      // Reset form after successful listing creation.
      setForm(INITIAL_FORM);

      setImages([]);

      setPreviews((current) => {
        current.forEach((url) => URL.revokeObjectURL(url));

        return [];
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sell-book-page">
      {/* PAGE HEADER */}
      <div className="sell-book-heading">
        <div>
          <h1>Sell Your Book</h1>

          <p>
            Give your books a new home. Share accurate details and photographs
            with potential buyers.
          </p>
        </div>

        <div className="sell-book-heading-icon">
          <BookOpen size={27} />
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div
          className={`sell-book-feedback sell-book-feedback-${feedback.type}`}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={19} />
          ) : (
            <AlertCircle size={19} />
          )}

          <span>{feedback.message}</span>
        </div>
      )}

      <form className="sell-book-form" onSubmit={handleSubmit}>
        {/* SECTION 1: BOOK INFORMATION */}
        <div className="sell-book-section">
          <div className="sell-book-section-heading">
            <span>01</span>

            <div>
              <h2>Book Information</h2>
              <p>Provide accurate information about your book.</p>
            </div>
          </div>

          <div className="sell-book-fields">
            <label className="sell-book-field full">
              Book Title *
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={300}
                required
              />
            </label>

            <label className="sell-book-field">
              Author(s) *
              <input
                type="text"
                name="authors"
                value={form.authors}
                onChange={handleChange}
                required
              />
            </label>

            <label className="sell-book-field">
              ISBN
              <input
                type="text"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                maxLength={17}
              />
            </label>

            <label className="sell-book-field">
              Publisher *
              <input
                type="text"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </label>

            <label className="sell-book-field">
              Edition
              <input
                type="text"
                name="edition"
                value={form.edition}
                onChange={handleChange}
                maxLength={100}
              />
            </label>

            <label className="sell-book-field">
              Publication Year
              <input
                type="number"
                name="publicationYear"
                value={form.publicationYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear() + 1}
              />
            </label>

            <label className="sell-book-field">
              Language
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="sell-book-field full">
              Book Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={10000}
              />
            </label>
          </div>
        </div>

        {/* SECTION 2: BOOK PHOTOGRAPHS */}
        <div className="sell-book-section">
          <div className="sell-book-section-heading">
            <span>02</span>

            <div>
              <h2>Book Photographs</h2>

              <p>
                Upload one or two actual photographs of the book you are
                selling.
              </p>
            </div>
          </div>

          <label className="sell-book-upload">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={loading || images.length >= MAX_IMAGES}
            />

            <Upload size={27} />

            <strong>Upload Book Photographs</strong>

            <span>JPG, PNG or WEBP · Maximum 5 MB per image</span>

            <small>{images.length}/2 photographs selected</small>
          </label>

          {previews.length > 0 && (
            <div className="sell-book-image-previews">
              {previews.map((preview, index) => (
                <div className="sell-book-image-preview" key={preview}>
                  <img src={preview} alt={`Book photograph ${index + 1}`} />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={loading}
                    aria-label={`Remove photograph ${index + 1}`}
                  >
                    <X size={17} />
                  </button>

                  <span>Photograph {index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: CONDITION AND PRICING */}
        <div className="sell-book-section">
          <div className="sell-book-section-heading">
            <span>03</span>

            <div>
              <h2>Condition and Pricing</h2>

              <p>Set a fair price and accurately describe the condition.</p>
            </div>
          </div>

          <div className="sell-book-fields">
            <label className="sell-book-field">
              Book Condition *
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="acceptable">Acceptable</option>
              </select>
            </label>

            <label className="sell-book-field">
              Selling Price (INR) *
              <div className="sell-book-price-input">
                <IndianRupee size={17} />

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </label>

            <label className="sell-book-field">
              Available Quantity *
              <div className="sell-book-price-input">
                <Package size={17} />

                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="0"
                  max="100000"
                  step="1"
                  required
                />
              </div>
            </label>

            <label className="sell-book-field full">
              Seller's Description
              <textarea
                name="sellerDescription"
                value={form.sellerDescription}
                onChange={handleChange}
                rows={4}
                maxLength={3000}
              />
            </label>

            {form.condition === "acceptable" && (
              <label className="sell-book-field full">
                Defects / Missing Pages *
                <textarea
                  name="disclosedDefects"
                  value={form.disclosedDefects}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* SECTION 4: DISPATCH LOCATION */}
        <div className="sell-book-section">
          <div className="sell-book-section-heading">
            <span>04</span>

            <div>
              <h2>Dispatch Location</h2>

              <p>Where will you dispatch the book from?</p>
            </div>
          </div>

          <div className="sell-book-fields">
            <label className="sell-book-field">
              City *
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>

            <label className="sell-book-field">
              State *
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </label>

            <label className="sell-book-field">
              Postal Code *
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>

            <label className="sell-book-field">
              Country *
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="sell-book-submit-area">
          <p>
            Your book will undergo the applicable catalogue and seller
            verification checks before becoming publicly available.
          </p>

          <button type="submit" className="sell-book-submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle className="sell-book-spinner" size={18} />
                Submitting Listing...
              </>
            ) : (
              <>
                <Camera size={18} />
                Submit Book Listing
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
