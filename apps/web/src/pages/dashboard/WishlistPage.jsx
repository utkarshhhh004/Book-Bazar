import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  BookOpen,
  ArrowRight,
  ShoppingCart,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";

import {
  getWishlist,
  removeWishlistItem,
} from "../../services/wishlist.service";
import { addCartItem } from "../../services/cart.service";

import "./wishlist-page.css";

const formatPrice = (pricePaise) => {
  if (!Number.isSafeInteger(pricePaise)) return null;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(pricePaise / 100);
};

function WishlistPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [removingBookId, setRemovingBookId] = useState("");
  const [addingListingId, setAddingListingId] = useState("");

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getWishlist();

      setItems(Array.isArray(result?.items) ? result.items : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error?.message ||
          "Unable to load your wishlist. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = async (bookId, title) => {
    try {
      setRemovingBookId(String(bookId));
      setFeedback(null);

      const result = await removeWishlistItem(bookId);

      setItems(Array.isArray(result?.items) ? result.items : []);

      setFeedback({
        type: "success",
        message: `${title} has been removed from your wishlist.`,
      });
    } catch (requestError) {
      setFeedback({
        type: "error",
        message:
          requestError.response?.data?.message ||
          "Unable to remove this book. Please try again.",
      });
    } finally {
      setRemovingBookId("");
    }
  };

  const handleAddToCart = async (item) => {
    const availableListing = item.listings?.[0];

    if (!availableListing?.listingId) {
      setFeedback({
        type: "error",
        message: "This book currently has no available seller listing.",
      });
      return;
    }

    try {
      setAddingListingId(String(availableListing.listingId));
      setFeedback(null);

      await addCartItem({
        listingId: availableListing.listingId,
        quantity: 1,
      });

      setFeedback({
        type: "success",
        message: `${item.book.title} has been added to your cart.`,
      });
    } catch (requestError) {
      setFeedback({
        type: "error",
        message:
          requestError.response?.data?.message ||
          requestError.response?.data?.error?.message ||
          "Unable to add this book to your cart.",
      });
    } finally {
      setAddingListingId("");
    }
  };

  return (
    <main className="wishlist-page">
      <header className="wishlist-heading">
        <div>
          <span className="wishlist-eyebrow">YOUR PERSONAL COLLECTION</span>

          <h1>My Wishlist</h1>

          <p>
            Keep the books you love close. Your next favourite read might be
            here.
          </p>
        </div>

        <div className="wishlist-heading-icon">
          <Heart size={22} />
        </div>
      </header>

      {feedback && (
        <div
          className={`wishlist-feedback wishlist-feedback-${feedback.type}`}
          role="status"
        >
          {feedback.type === "success" ? (
            <CheckCircle size={17} />
          ) : (
            <AlertCircle size={17} />
          )}

          <span>{feedback.message}</span>

          {feedback.type === "success" &&
            feedback.message.includes("added to your cart") && (
              <button type="button" onClick={() => navigate("/dashboard/cart")}>
                View Cart
              </button>
            )}
        </div>
      )}

      {loading ? (
        <section className="wishlist-state">
          <RefreshCw className="wishlist-spinner" size={28} />
          <h2>Loading your wishlist...</h2>
          <p>Retrieving your saved books.</p>
        </section>
      ) : error ? (
        <section className="wishlist-state">
          <AlertCircle size={34} />
          <h2>Unable to load your wishlist</h2>
          <p>{error}</p>

          <button
            type="button"
            className="wishlist-primary-button"
            onClick={loadWishlist}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </section>
      ) : items.length === 0 ? (
        <section className="wishlist-empty">
          <div className="wishlist-decoration wishlist-decoration-one" />
          <div className="wishlist-decoration wishlist-decoration-two" />

          <div className="wishlist-empty-icon">
            <Heart size={38} />
          </div>

          <span className="wishlist-empty-eyebrow">
            YOUR COLLECTION STARTS HERE
          </span>

          <h2>Your wishlist is waiting for stories.</h2>

          <p>
            You haven't saved any books yet. Explore the marketplace, discover
            books you love and save them here for later.
          </p>

          <button
            type="button"
            className="wishlist-primary-button"
            onClick={() => navigate("/dashboard")}
          >
            <BookOpen size={17} />
            Explore Books
            <ArrowRight size={16} />
          </button>

          <span className="wishlist-footer-note">
            YOUR NEXT CHAPTER STARTS WITH A BOOK.
          </span>
        </section>
      ) : (
        <>
          <div className="wishlist-list-toolbar">
            <div>
              <h2>Saved Books</h2>
              <p>
                {items.length} {items.length === 1 ? "book" : "books"} saved in
                your collection
              </p>
            </div>

            <button
              type="button"
              className="wishlist-refresh-button"
              onClick={loadWishlist}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <section className="wishlist-grid">
            {items.map((item) => {
              const book = item.book;
              const bookId = String(item.bookId);
              const image =
                typeof book.coverImage === "string"
                  ? book.coverImage
                  : book.coverImage?.url;

              const listings = item.listings || [];
              const bestOffer = listings[0];
              const price = bestOffer
                ? formatPrice(bestOffer.pricePaise)
                : null;

              const isRemoving = removingBookId === bookId;
              const isAdding =
                bestOffer && addingListingId === String(bestOffer.listingId);

              return (
                <article
                  className="wishlist-book-card"
                  key={item.wishlistId || bookId}
                >
                  <div className="wishlist-book-cover">
                    {image ? (
                      <img src={image} alt={book.title} loading="lazy" />
                    ) : (
                      <div className="wishlist-cover-placeholder">
                        <BookOpen size={38} />
                      </div>
                    )}
                  </div>

                  <div className="wishlist-book-details">
                    <h3>{book.title}</h3>

                    <p className="wishlist-book-author">
                      {Array.isArray(book.authors)
                        ? book.authors.join(", ")
                        : "Author not specified"}
                    </p>

                    {book.publisher && (
                      <p className="wishlist-book-publisher">
                        {book.publisher}
                      </p>
                    )}

                    {bestOffer ? (
                      <>
                        <div className="wishlist-offer-details">
                          <span className="wishlist-availability">
                            <Package size={13} />
                            Available
                          </span>

                          <span>
                            {bestOffer.condition?.replaceAll("_", " ")}
                          </span>
                        </div>

                        {price && (
                          <strong className="wishlist-book-price">
                            {price}
                          </strong>
                        )}

                        <p className="wishlist-seller">
                          Sold by {bestOffer.seller?.name || "Verified seller"}
                        </p>
                      </>
                    ) : (
                      <p className="wishlist-unavailable">
                        Currently unavailable
                      </p>
                    )}

                    <div className="wishlist-book-actions">
                      <button
                        type="button"
                        className="wishlist-cart-button"
                        disabled={!bestOffer || Boolean(addingListingId)}
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart size={15} />
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>

                      <button
                        type="button"
                        className="wishlist-remove-button"
                        disabled={Boolean(removingBookId)}
                        onClick={() => handleRemove(bookId, book.title)}
                        aria-label={`Remove ${book.title} from wishlist`}
                      >
                        {isRemoving ? (
                          <RefreshCw size={16} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default WishlistPage;
