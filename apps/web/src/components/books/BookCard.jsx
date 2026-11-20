
import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import "./book-card.css";

export default function BookCard({ book }) {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <article className="book-card">
      <div className="book-card-image-wrapper">
        <img
          src={book.image}
          alt={book.title}
          className="book-card-image"
          loading="lazy"
        />

        <span className="book-condition">
          {book.condition}
        </span>

        <button
          type="button"
          className={`book-wishlist-button ${
            isFavourite ? "is-favourite" : ""
          }`}
          onClick={() => setIsFavourite((current) => !current)}
          aria-label={
            isFavourite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isFavourite}
        >
          <Heart
            size={18}
            fill={isFavourite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="book-card-content">
        <span className="book-card-category">
          {book.category}
        </span>

        <h3 className="book-card-title">
          {book.title}
        </h3>

        <p className="book-card-author">
          by {book.author}
        </p>

        <div className="book-card-rating">
          <Star size={15} fill="currentColor" />
          <span>{book.rating}</span>
        </div>

        <div className="book-card-footer">
          <div className="book-card-pricing">
            <strong>₹{book.price}</strong>
            <del>₹{book.originalPrice}</del>
          </div>

          <button
            type="button"
            className="book-cart-button"
            aria-label={`Add ${book.title} to cart`}
            title="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
