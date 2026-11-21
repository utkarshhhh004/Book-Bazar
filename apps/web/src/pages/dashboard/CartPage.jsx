
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  BookOpen,
  RefreshCw,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../services/cart.service";

import "./cart-page.css";

const formatPrice = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((paise || 0) / 100);

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCart = useCallback(async () => {
    try {
      setError("");
      const result = await getCart();
      setCart(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const runCartAction = async (actionKey, action) => {
    try {
      setActionLoading(actionKey);
      setError("");
      setSuccessMessage("");

      const updatedCart = await action();
      setCart(updatedCart);
    } catch (err) {
      setError(getErrorMessage(err));
      await loadCart();
    } finally {
      setActionLoading("");
    }
  };

  const handleQuantityChange = (item, nextQuantity) => {
    if (nextQuantity < 1 || nextQuantity > item.availableQuantity) {
      return;
    }

    runCartAction(item.listingId, () =>
      updateCartItem({
        listingId: item.listingId,
        quantity: nextQuantity,
      })
    );
  };

  const handleRemoveItem = (listingId) => {
    runCartAction(listingId, async () => {
      const updatedCart = await removeCartItem(listingId);
      setSuccessMessage("Book removed from your cart.");
      return updatedCart;
    });
  };

  const handleClearCart = () => {
    runCartAction("clear", async () => {
      const updatedCart = await clearCart();
      setSuccessMessage("Your cart has been cleared.");
      return updatedCart;
    });
  };

  const items = cart?.items || [];
  const subtotalPaise = items.reduce((total, item) => {
    if (item.unavailable || !Number.isSafeInteger(item.pricePaise)) {
      return total;
    }

    return total + item.pricePaise * item.quantity;
  }, 0);

  const unavailableCount = items.filter(
    (item) => item.unavailable
  ).length;

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-state">
          <RefreshCw className="cart-spinner" size={28} />
          <p>Loading your shopping cart...</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="cart-page">
        <div className="cart-state cart-error-state">
          <AlertCircle size={36} />
          <h2>Unable to load your cart</h2>
          <p>{error}</p>
          <button className="cart-primary-button" onClick={loadCart}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
            <h1>My Cart</h1>
            <p>Review your selected books before checkout.</p>
          </div>
          <ShoppingCart size={30} />
        </div>

        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={42} />
          </div>
          <h2>Your cart is empty</h2>
          <p>
            Looks like you haven't added any books yet.
            Explore our catalogue and find your next read.
          </p>
          <button
            className="cart-primary-button"
            onClick={() => navigate("/dashboard")}
          >
            <BookOpen size={18} />
            Explore Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
          <h1>My Cart</h1>
          <p>
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="cart-heading-icon">
          <ShoppingCart size={28} />
        </div>
      </div>

      {error && (
        <div className="cart-message cart-message-error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="cart-message cart-message-success">
          {successMessage}
        </div>
      )}

      {unavailableCount > 0 && (
        <div className="cart-message cart-message-warning">
          <AlertCircle size={17} />
          {unavailableCount} item(s) are currently unavailable or have
          insufficient stock. Remove them or review their availability
          before checkout.
        </div>
      )}

      <div className="cart-content">
        <section className="cart-items-section">
          <div className="cart-section-header">
            <h2>Cart Items</h2>
            <button
              className="cart-clear-button"
              onClick={handleClearCart}
              disabled={Boolean(actionLoading)}
            >
              <Trash2 size={15} />
              Clear Cart
            </button>
          </div>

          <div className="cart-items-list">
            {items.map((item) => {
              const itemLoading = actionLoading === item.listingId;
              const unavailable = item.unavailable;

              return (
                <article
                  className={`cart-item ${unavailable ? "cart-item-unavailable" : ""}`}
                  key={item.listingId}
                >
                  <div className="cart-item-image">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title || "Book cover"}
                      />
                    ) : (
                      <div className="cart-image-placeholder">
                        <BookOpen size={30} />
                      </div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.title || "Unavailable book"}</h3>

                    <p className="cart-item-author">
                      {item.authors?.length
                        ? item.authors.join(", ")
                        : "Author information unavailable"}
                    </p>

                    <div className="cart-item-meta">
                      <span>
                        Condition: {item.condition || "Not specified"}
                      </span>
                      {item.seller?.name && (
                        <span>Seller: {item.seller.name}</span>
                      )}
                    </div>

                    {unavailable && (
                      <span className="cart-unavailable-label">
                        Currently unavailable
                      </span>
                    )}

                    <div className="cart-item-bottom">
                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={
                            itemLoading ||
                            Boolean(actionLoading) ||
                            item.quantity <= 1 ||
                            unavailable
                          }
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                        >
                          <Minus size={15} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={
                            itemLoading ||
                            Boolean(actionLoading) ||
                            item.quantity >= item.availableQuantity ||
                            unavailable
                          }
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        disabled={Boolean(actionLoading)}
                        onClick={() => handleRemoveItem(item.listingId)}
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <strong>
                      {formatPrice(item.pricePaise * item.quantity)}
                    </strong>
                    <span>{formatPrice(item.pricePaise)} each</span>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            className="cart-continue-button"
            onClick={() => navigate("/dashboard")}
          >
            <BookOpen size={17} />
            Continue Shopping
          </button>
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary-row">
            <span>Items</span>
            <span>{cart?.itemCount ?? items.length}</span>
          </div>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotalPaise)}</strong>
          </div>

          <div className="cart-summary-row cart-summary-muted">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="cart-summary-row cart-summary-muted">
            <span>Taxes and fees</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="cart-summary-total">
            <span>Estimated Total</span>
            <strong>{formatPrice(subtotalPaise)}</strong>
          </div>

          <p className="cart-summary-note">
            This is your book subtotal only. Final shipping, taxes and
            applicable fees will be shown before order confirmation.
          </p>

          <button
            className="cart-checkout-button"
            disabled={
              Boolean(actionLoading) ||
              unavailableCount > 0 ||
              items.length === 0
            }
            onClick={() => navigate("/dashboard/checkout")}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>

          <p className="cart-secure-note">
            Your inventory is reserved only when checkout begins.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
