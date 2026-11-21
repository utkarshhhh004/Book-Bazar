
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Truck,
  CreditCard,
} from "lucide-react";

import {
  getAddresses,
} from "../../services/address.service";

import {
  previewCheckout,
  createCheckout,
} from "../../services/checkout.service";

import "./checkout-page.css";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const formatPrice = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);

const createIdempotencyKey = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const formatRemainingTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [preview, setPreview] = useState(null);
  const [checkout, setCheckout] = useState(null);

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const idempotencyKeyRef = useRef(null);
  const requestInProgressRef = useRef(false);

  const selectedAddress = addresses.find(
    (address) => address._id === selectedAddressId
  );

  const loadAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    setError("");

    try {
      const result = await getAddresses();
      const savedAddresses = Array.isArray(result) ? result : [];

      setAddresses(savedAddresses);

      setSelectedAddressId((current) => {
        if (
          current &&
          savedAddresses.some((address) => address._id === current)
        ) {
          return current;
        }

        return (
          savedAddresses.find((address) => address.isDefault)?._id ||
          savedAddresses[0]?._id ||
          ""
        );
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const loadPreview = useCallback(async (addressId) => {
    if (!addressId) {
      setPreview(null);
      return;
    }

    setLoadingPreview(true);
    setError("");
    setSuccess("");

    try {
      const result = await previewCheckout(addressId);

      setPreview(result);
    } catch (err) {
      setPreview(null);
      setError(getErrorMessage(err));
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedAddressId) {
      setPreview(null);
      return;
    }

    setCheckout(null);
    setRemainingSeconds(null);
    idempotencyKeyRef.current = null;

    loadPreview(selectedAddressId);
  }, [selectedAddressId, loadPreview]);

  useEffect(() => {
    if (!checkout?.expiresAt) {
      setRemainingSeconds(null);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.floor(
          (new Date(checkout.expiresAt).getTime() - Date.now()) / 1000
        )
      );

      setRemainingSeconds(remaining);
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [checkout?.expiresAt]);

  const handleAddressChange = (addressId) => {
    if (creatingCheckout) return;

    setSelectedAddressId(addressId);
    setCheckout(null);
    setError("");
    setSuccess("");
  };

  const handleCreateCheckout = async () => {
    if (requestInProgressRef.current || creatingCheckout) return;

    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }

    if (!preview || !preview.items?.length) {
      setError("Checkout preview is unavailable. Please refresh it.");
      return;
    }

    if (checkout) {
      setError("A checkout session has already been created.");
      return;
    }

    requestInProgressRef.current = true;
    setCreatingCheckout(true);
    setError("");
    setSuccess("");

    // Reuse this key if the request fails and the user retries.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = createIdempotencyKey();
    }

    try {
      const result = await createCheckout(
        selectedAddressId,
        idempotencyKeyRef.current
      );

      setCheckout(result);

      setSuccess(
        "Checkout session created successfully. Your inventory is reserved."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      requestInProgressRef.current = false;
      setCreatingCheckout(false);
    }
  };

  const handleRefreshPreview = () => {
    if (creatingCheckout || loadingPreview || !selectedAddressId) return;

    setCheckout(null);
    idempotencyKeyRef.current = null;

    loadPreview(selectedAddressId);
  };

  const handleStartNewCheckout = () => {
    setCheckout(null);
    setRemainingSeconds(null);
    idempotencyKeyRef.current = null;
    setError("");
    setSuccess("");

    loadPreview(selectedAddressId);
  };

  const displayedItems = checkout?.items || preview?.items || [];
  const displayedSubtotal =
    checkout?.bookSubtotalPaise ?? preview?.bookSubtotalPaise ?? 0;

  const isSessionExpired =
    checkout && remainingSeconds !== null && remainingSeconds <= 0;

  const canCreateCheckout =
    Boolean(selectedAddressId) &&
    Boolean(preview?.items?.length) &&
    !loadingPreview &&
    !creatingCheckout &&
    !checkout;

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <div>
          <p className="checkout-eyebrow">BOOK BAZAR MARKETPLACE</p>
          <h1>Checkout</h1>
          <p className="checkout-description">
            Review your books and select where you want them delivered.
          </p>
        </div>

        <Link to="/dashboard/cart" className="checkout-back-link">
          <ArrowLeft size={17} />
          Back to Cart
        </Link>
      </div>

      {error && (
        <div className="checkout-alert checkout-alert-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="checkout-alert checkout-alert-success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle size={19} />
          <span>{success}</span>
        </div>
      )}

      {loadingAddresses ? (
        <div className="checkout-loading">
          <LoaderCircle className="checkout-spinner" size={30} />
          <p>Loading your delivery addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            <MapPin size={30} />
          </div>

          <h2>No Saved Delivery Address</h2>

          <p>
            Add a delivery address before proceeding with checkout. If you
            still have your original registration address, complete its
            migration on the Addresses page first.
          </p>

          <Link
            to="/dashboard/addresses"
            className="checkout-primary-button"
          >
            Manage Delivery Addresses
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <div className="checkout-layout">
            <div className="checkout-main-column">
              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <div className="checkout-step-number">01</div>

                  <div>
                    <h2>Delivery Address</h2>
                    <p>Select your preferred delivery destination.</p>
                  </div>
                </div>

                <div className="checkout-address-list">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`checkout-address-card ${
                        selectedAddressId === address._id
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={() =>
                          handleAddressChange(address._id)
                        }
                        disabled={creatingCheckout}
                      />

                      <div className="checkout-address-content">
                        <div className="checkout-address-heading">
                          <div className="checkout-address-name">
                            <MapPin size={17} />
                            <strong>{address.recipientName}</strong>
                          </div>

                          {address.isDefault && (
                            <span className="checkout-default-badge">
                              Default
                            </span>
                          )}
                        </div>

                        <p>{address.phone}</p>

                        <p>{address.addressLine1}</p>

                        {address.addressLine2 && (
                          <p>{address.addressLine2}</p>
                        )}

                        {address.landmark && (
                          <p>Near {address.landmark}</p>
                        )}

                        <p>
                          {address.city}, {address.state} -{" "}
                          {address.postalCode}
                        </p>

                        <p>{address.country}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <Link
                  to="/dashboard/addresses"
                  className="checkout-manage-address-link"
                >
                  Manage saved addresses
                  <ArrowRight size={15} />
                </Link>
              </section>

              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <div className="checkout-step-number">02</div>

                  <div>
                    <h2>Order Summary</h2>
                    <p>Review the books and quantities in your cart.</p>
                  </div>

                  <button
                    type="button"
                    className="checkout-refresh-button"
                    onClick={handleRefreshPreview}
                    disabled={
                      loadingPreview ||
                      creatingCheckout ||
                      Boolean(checkout)
                    }
                    title="Refresh checkout preview"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        loadingPreview ? "checkout-spinner" : ""
                      }
                    />
                    Refresh
                  </button>
                </div>

                {loadingPreview ? (
                  <div className="checkout-loading checkout-inline-loading">
                    <LoaderCircle
                      className="checkout-spinner"
                      size={26}
                    />
                    <p>Preparing your checkout preview...</p>
                  </div>
                ) : displayedItems.length === 0 ? (
                  <div className="checkout-inline-empty">
                    <Package size={25} />
                    <p>No checkout items available.</p>
                    <Link to="/dashboard/cart">Return to your cart</Link>
                  </div>
                ) : (
                  <div className="checkout-items-list">
                    {displayedItems.map((item) => (
                      <article
                        className="checkout-item"
                        key={item.listingId}
                      >
                        <div className="checkout-item-icon">
                          <Package size={23} />
                        </div>

                        <div className="checkout-item-information">
                          <h3>{item.title}</h3>

                          {item.authors?.length > 0 && (
                            <p>
                              By {item.authors.join(", ")}
                            </p>
                          )}

                          <div className="checkout-item-meta">
                            <span>
                              Condition: {item.condition}
                            </span>

                            <span>
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <div className="checkout-item-price">
                          <strong>
                            {formatPrice(item.lineTotalPaise)}
                          </strong>

                          <span>
                            {formatPrice(item.unitPricePaise)} each
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="checkout-policy-note">
                <ShieldCheck size={21} />

                <div>
                  <h3>Secure Inventory Reservation</h3>
                  <p>
                    Inventory is reserved only after a checkout session is
                    successfully created. Cart items alone do not reserve
                    stock.
                  </p>
                </div>
              </section>
            </div>

            <aside className="checkout-summary-column">
              <section className="checkout-summary-card">
                <h2>Price Details</h2>

                <div className="checkout-price-row">
                  <span>Book Subtotal</span>
                  <strong>{formatPrice(displayedSubtotal)}</strong>
                </div>

                <div className="checkout-price-row">
                  <span>Shipping</span>
                  <span className="checkout-pending-label">
                    To be determined
                  </span>
                </div>

                <div className="checkout-price-row">
                  <span>Gateway Fees</span>
                  <span className="checkout-pending-label">
                    To be determined
                  </span>
                </div>

                <div className="checkout-price-row">
                  <span>Taxes</span>
                  <span className="checkout-pending-label">
                    To be determined
                  </span>
                </div>

                <div className="checkout-total-row">
                  <span>Final Total</span>
                  <strong>Not available yet</strong>
                </div>

                <p className="checkout-pricing-disclaimer">
                  Final payable amount will be calculated after applicable
                  shipping, gateway and tax policies are resolved. No
                  estimated charges are being added.
                </p>

                {!checkout ? (
                  <button
                    type="button"
                    className="checkout-primary-button checkout-create-button"
                    onClick={handleCreateCheckout}
                    disabled={!canCreateCheckout}
                  >
                    {creatingCheckout ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="checkout-spinner"
                        />
                        Creating Session...
                      </>
                    ) : (
                      <>
                        Reserve Inventory
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="checkout-session-status">
                    <CheckCircle size={20} />

                    <div>
                      <strong>Checkout Session Created</strong>
                      <p>Inventory reservation is active.</p>
                    </div>
                  </div>
                )}

                <div className="checkout-summary-footer">
                  <ShieldCheck size={15} />
                  <span>Authenticated checkout session</span>
                </div>
              </section>

              {checkout && (
                <section className="checkout-reservation-card">
                  <div className="checkout-reservation-heading">
                    <Clock size={20} />
                    <h3>Inventory Reservation</h3>
                  </div>

                  {isSessionExpired ? (
                    <>
                      <p className="checkout-expired-message">
                        Your reservation has expired. Start a new checkout
                        session to reserve available inventory again.
                      </p>

                      <button
                        type="button"
                        className="checkout-secondary-button"
                        onClick={handleStartNewCheckout}
                        disabled={creatingCheckout}
                      >
                        Start New Checkout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="checkout-countdown">
                        {formatRemainingTime(remainingSeconds || 0)}
                      </div>

                      <p>
                        Time remaining before inventory reservation expires.
                      </p>
                    </>
                  )}
                </section>
              )}

              <section className="checkout-help-card">
                <Truck size={20} />
                <div>
                  <h3>Delivery Information</h3>
                  <p>
                    Sellers manage dispatch and provide shipment tracking
                    after confirmed payment.
                  </p>
                </div>
              </section>

              <section className="checkout-help-card">
                <CreditCard size={20} />
                <div>
                  <h3>Payment</h3>
                  <p>
                    Payment will be enabled after final checkout pricing
                    and payment-provider integration are completed.
                  </p>
                </div>
              </section>

              {selectedAddress && (
                <div className="checkout-selected-address">
                  <span>Delivering to</span>
                  <strong>{selectedAddress.recipientName}</strong>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </section>
  );
}

export default CheckoutPage;
