import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  RefreshCw,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Heart,
} from "lucide-react";

import api from "../../services/api";
import { addCartItem } from "../../services/cart.service";
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../../services/wishlist.service";

import "./books-cart-actions.css";

const formatPrice = (book) => {
  if (Number.isSafeInteger(book.pricePaise)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(book.pricePaise / 100);
  }

  if (book.price != null && Number.isFinite(Number(book.price))) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(book.price));
  }

  return null;
};

const getBookId = (book) => String(book?.bookId || book?._id || book?.id || "");

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.message ||
  error?.message ||
  fallback;

const getWishlistItems = (result) =>
  Array.isArray(result?.items) ? result.items : [];

export default function BooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [addingListingId, setAddingListingId] = useState("");
  const [cartFeedback, setCartFeedback] = useState(null);

  const [wishlistBookIds, setWishlistBookIds] = useState(() => new Set());
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");
  const [updatingWishlistBookId, setUpdatingWishlistBookId] = useState("");

  const loadWishlist = useCallback(async () => {
    setWishlistLoading(true);
    setWishlistError("");

    try {
      const result = await getWishlist();
      const items = getWishlistItems(result);

      setWishlistBookIds(
        new Set(items.map((item) => String(item.bookId)).filter(Boolean)),
      );
    } catch (requestError) {
      setWishlistError(
        getErrorMessage(
          requestError,
          "Unable to load your wishlist. Please try again.",
        ),
      );
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/books");
      const result = response.data?.data;
      const bookList = Array.isArray(result) ? result : result?.books;

      if (!Array.isArray(bookList)) {
        throw new Error("The catalogue response is invalid.");
      }

      setBooks(bookList);
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to load books. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
    loadWishlist();
  }, [loadBooks, loadWishlist]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) => {
      const title = book.title || "";
      const authors = Array.isArray(book.authors)
        ? book.authors.join(" ")
        : book.author || "";

      return `${title} ${authors}`.toLowerCase().includes(query);
    });
  }, [books, search]);

  const handleAddToCart = async (book) => {
    const listingId = book.listingId;

    if (!listingId || addingListingId) {
      setCartFeedback({
        type: "error",
        message: "This book does not have a valid seller listing.",
      });
      return;
    }

    try {
      setAddingListingId(String(listingId));
      setCartFeedback(null);

      await addCartItem({
        listingId,
        quantity: 1,
      });

      setCartFeedback({
        type: "success",
        message: `${book.title} has been added to your cart.`,
      });
    } catch (requestError) {
      setCartFeedback({
        type: "error",
        message: getErrorMessage(
          requestError,
          "Unable to add this book to your cart. Please try again.",
        ),
      });
    } finally {
      setAddingListingId("");
    }
  };

  const handleToggleWishlist = async (book) => {
    const bookId = getBookId(book);

    if (!bookId || updatingWishlistBookId || wishlistLoading) {
      return;
    }

    // Do not guess whether the book is saved if the initial wishlist
    // request failed. Ask the user to retry synchronization first.
    if (wishlistError) {
      return;
    }

    const isSaved = wishlistBookIds.has(bookId);

    try {
      setUpdatingWishlistBookId(bookId);
      setWishlistError("");

      const result = isSaved
        ? await removeWishlistItem(bookId)
        : await addWishlistItem(bookId);

      const items = getWishlistItems(result);

      // Use the backend's latest wishlist as the source of truth.
      setWishlistBookIds(
        new Set(items.map((item) => String(item.bookId)).filter(Boolean)),
      );
    } catch (requestError) {
      setWishlistError(
        getErrorMessage(
          requestError,
          "Unable to update your wishlist. Please try again.",
        ),
      );
    } finally {
      setUpdatingWishlistBookId("");
    }
  };

  return (
    <section className="books-page">
      <div className="books-page-toolbar">
        <div className="books-page-heading">
          <h1>Explore Books</h1>
          <p>Discover books available in the Book Bazar marketplace.</p>
        </div>

        <div className="books-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search by book title or author..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search books"
          />
        </div>
      </div>

      {cartFeedback && (
        <div
          className={`books-cart-feedback books-cart-feedback-${cartFeedback.type}`}
          role="status"
        >
          {cartFeedback.type === "success" ? (
            <CheckCircle size={17} />
          ) : (
            <AlertCircle size={17} />
          )}

          <span>{cartFeedback.message}</span>

          {cartFeedback.type === "success" && (
            <button type="button" onClick={() => navigate("/dashboard/cart")}>
              View Cart
            </button>
          )}
        </div>
      )}

      {wishlistError && (
        <div
          className="books-cart-feedback books-cart-feedback-error"
          role="alert"
        >
          <AlertCircle size={17} />
          <span>{wishlistError}</span>

          <button type="button" onClick={loadWishlist}>
            <RefreshCw size={15} />
            Retry Wishlist
          </button>
        </div>
      )}

      {loading ? (
        <div className="books-state">
          <span className="books-loader" />
          <strong>Loading books...</strong>
          <p>Please wait while we retrieve the marketplace catalogue.</p>
        </div>
      ) : error ? (
        <div className="books-state">
          <BookOpen size={34} />
          <strong>Unable to load the catalogue</strong>
          <p>{error}</p>

          <button
            type="button"
            className="books-retry-button"
            onClick={loadBooks}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="books-state">
          <BookOpen size={38} />

          <strong>
            {search.trim() ? "No matching books found" : "No books available"}
          </strong>

          <p>
            {search.trim()
              ? "Try another title or author."
              : "Books will appear here when sellers publish active listings."}
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const image =
              typeof book.coverImage === "string"
                ? book.coverImage
                : book.coverImage?.url;

            const authors = Array.isArray(book.authors)
              ? book.authors.join(", ")
              : book.author || "Author not specified";

            const listingId = book.listingId;
            const bookId = getBookId(book);

            const isAdding = addingListingId === String(listingId);
            const isSaved = wishlistBookIds.has(bookId);
            const isUpdatingWishlist = updatingWishlistBookId === bookId;

            const price = formatPrice(book);

            return (
              <article className="book-card" key={listingId || bookId}>
                <div className="book-card-cover">
                  {image ? (
                    <img
                      src={image}
                      alt={book.title || "Book cover"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="book-cover-placeholder">
                      <BookOpen size={38} />
                    </div>
                  )}

                  <button
                    type="button"
                    className={`book-wishlist-button ${
                      isSaved ? "is-saved" : ""
                    }`}
                    onClick={() => handleToggleWishlist(book)}
                    disabled={
                      !bookId ||
                      wishlistLoading ||
                      Boolean(wishlistError) ||
                      Boolean(updatingWishlistBookId)
                    }
                    aria-label={
                      isSaved
                        ? `Remove ${book.title} from wishlist`
                        : `Add ${book.title} to wishlist`
                    }
                    aria-pressed={isSaved}
                    title={
                      wishlistLoading
                        ? "Loading wishlist..."
                        : isSaved
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                    }
                  >
                    <Heart size={19} fill={isSaved ? "currentColor" : "none"} />
                  </button>

                  {isUpdatingWishlist && (
                    <span className="wishlist-action-status">Updating...</span>
                  )}
                </div>

                <div className="book-card-details">
                  <h2>{book.title}</h2>

                  <p className="book-card-author">{authors}</p>

                  {book.category && (
                    <span className="book-card-category">{book.category}</span>
                  )}

                  {price && (
                    <strong className="book-card-price">{price}</strong>
                  )}

                  <button
                    type="button"
                    className="books-add-cart-button"
                    disabled={!listingId || Boolean(addingListingId)}
                    onClick={() => handleAddToCart(book)}
                  >
                    <ShoppingCart size={16} />
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
