
import { useCallback, useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
  Search,
  Eye,
  Pause,
  Play,
  Archive,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";

import {
  getMyListings,
  updateListingStatus,
  archiveListing,
} from "../../services/seller.service";

const FILTERS = [
  { label: "All Listings", value: "" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Pending Review", value: "pending_review" },
  { label: "Paused", value: "paused" },
  { label: "Rejected", value: "rejected" },
  { label: "Sold Out", value: "sold_out" },
  { label: "Archived", value: "archived" },
];

const formatPrice = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((paise || 0) / 100);

const formatStatus = (status) =>
  (status || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");
  const [feedback, setFeedback] = useState(null);

  const loadListings = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const result = await getMyListings({
        status: filter || undefined,
        page,
        limit: 12,
      });

      setListings(result.listings || []);
      setPagination(
        result.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        }
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadListings(1);
  }, [loadListings]);

  const handleStatusChange = async (listing, status) => {
    if (actionId) return;

    try {
      setActionId(String(listing._id));
      setFeedback(null);

      await updateListingStatus(listing._id, status);

      setFeedback({
        type: "success",
        message: `Listing ${status === "active" ? "activated" : "paused"} successfully.`,
      });

      await loadListings(pagination.page);
    } catch (requestError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(requestError),
      });
    } finally {
      setActionId("");
    }
  };

  const handleArchive = async (listing) => {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${listing.bookId?.title || "this listing"}"?`
    );

    if (!confirmed || actionId) return;

    try {
      setActionId(String(listing._id));
      setFeedback(null);

      await archiveListing(listing._id);

      setFeedback({
        type: "success",
        message: "Listing archived successfully.",
      });

      await loadListings(pagination.page);
    } catch (requestError) {
      setFeedback({
        type: "error",
        message: getErrorMessage(requestError),
      });
    } finally {
      setActionId("");
    }
  };

  const filteredListings = listings.filter((listing) => {
    const book = listing.bookId || {};

    return `${book.title || ""} ${(book.authors || []).join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  });

  const counts = {
    total: pagination.total,
    active: listings.filter((item) => item.status === "active").length,
    drafts: listings.filter((item) => item.status === "draft").length,
  };

  return (
    <section className="seller-listings-page">
      <div className="seller-page-header">
        <div>
          <h1>My Listings</h1>
          <p>Manage your books, inventory and marketplace listings.</p>
        </div>

        <button
          type="button"
          className="seller-secondary-button"
          onClick={() => loadListings(pagination.page)}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "seller-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="seller-listing-stats">
        <article>
          <span>Total Listings</span>
          <strong>{counts.total}</strong>
        </article>

        <article>
          <span>Active on Marketplace</span>
          <strong>{counts.active}</strong>
        </article>

        <article>
          <span>Drafts on This Page</span>
          <strong>{counts.drafts}</strong>
        </article>
      </div>

      {feedback && (
        <div className={`seller-feedback seller-feedback-${feedback.type}`}>
          {feedback.type === "success"
            ? <CheckCircle size={17} />
            : <AlertCircle size={17} />}
          {feedback.message}
        </div>
      )}

      <div className="seller-listing-toolbar">
        <div className="seller-listing-filters">
          {FILTERS.map((item) => (
            <button
              type="button"
              key={item.value}
              className={filter === item.value ? "selected" : ""}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="seller-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search your listings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <div className="seller-empty-state">
          <RefreshCw className="seller-spin" size={28} />
          <strong>Loading your listings...</strong>
          <p>Retrieving your latest seller inventory.</p>
        </div>
      ) : error ? (
        <div className="seller-empty-state">
          <AlertCircle size={32} />
          <strong>Unable to load listings</strong>
          <p>{error}</p>
          <button
            type="button"
            className="seller-primary-button"
            onClick={() => loadListings(1)}
          >
            Try Again
          </button>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="seller-empty-state">
          <Package size={38} />
          <strong>
            {search ? "No matching listings" : "No listings found"}
          </strong>
          <p>
            {search
              ? "Try searching with another book title or author."
              : "Your submitted books and seller listings will appear here."}
          </p>
        </div>
      ) : (
        <div className="seller-listings-grid">
          {filteredListings.map((listing) => {
            const book = listing.bookId || {};
            const busy = actionId === String(listing._id);

            const image =
              typeof book.coverImage === "string"
                ? book.coverImage
                : book.coverImage?.url;

            return (
              <article className="seller-listing-card" key={listing._id}>
                <div className="seller-listing-image">
                  {image ? (
                    <img src={image} alt={book.title || "Book cover"} />
                  ) : (
                    <BookOpen size={35} />
                  )}
                </div>

                <div className="seller-listing-details">
                  <div className={`seller-status status-${listing.status}`}>
                    {formatStatus(listing.status)}
                  </div>

                  <h2>{book.title || "Catalogue book unavailable"}</h2>

                  <p className="seller-listing-author">
                    {(book.authors || []).join(", ") || "Author not available"}
                  </p>

                  <strong className="seller-listing-price">
                    {formatPrice(listing.pricePaise)}
                  </strong>

                  <div className="seller-inventory">
                    <span>Stock: <b>{listing.quantity}</b></span>
                    <span>Reserved: <b>{listing.reservedQuantity}</b></span>
                    <span>Available: <b>{listing.availableQuantity ?? Math.max(0, listing.quantity - listing.reservedQuantity)}</b></span>
                  </div>

                  <p className="seller-listing-condition">
                    Condition: {formatStatus(listing.condition)}
                  </p>

                  <div className="seller-listing-actions">
                    {listing.status === "active" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleStatusChange(listing, "paused")}
                      >
                        <Pause size={15} />
                        Pause
                      </button>
                    )}

                    {listing.status === "paused" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleStatusChange(listing, "active")}
                      >
                        <Play size={15} />
                        Activate
                      </button>
                    )}

                    {!["archived", "suspended", "sold_out"].includes(listing.status) && (
                      <button
                        type="button"
                        className="seller-archive-action"
                        disabled={busy}
                        onClick={() => handleArchive(listing)}
                      >
                        <Archive size={15} />
                        Archive
                      </button>
                    )}

                    {busy && <span>Updating...</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && pagination.pages > 1 && (
        <div className="seller-pagination">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => loadListings(pagination.page - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            type="button"
            disabled={pagination.page >= pagination.pages}
            onClick={() => loadListings(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
