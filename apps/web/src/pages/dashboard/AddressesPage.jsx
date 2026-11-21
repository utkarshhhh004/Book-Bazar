import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/address.service";

import "./addresses-page.css";

const initialForm = {
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const hasValidLegacyAddress = (address) =>
  Boolean(
    address &&
    address.line1 &&
    address.city &&
    address.state &&
    address.postalCode,
  );

function AddressesPage() {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ ...initialForm });
  const [editingId, setEditingId] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMigratingLegacy, setIsMigratingLegacy] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Legacy address stored inside the User document.
  const legacyAddress =
    addresses.length === 0 && hasValidLegacyAddress(user?.address)
      ? user.address
      : null;

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAddresses();

      setAddresses(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const openAddForm = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setIsMigratingLegacy(false);
    setIsFormOpen(true);
    setError("");
    setSuccess("");
  };

  // Prefill the old registration address for migration.
  const openLegacyMigrationForm = () => {
    if (!legacyAddress) return;

    setForm({
      recipientName: user?.fullName || "",
      phone: "",
      addressLine1: legacyAddress.line1 || "",
      addressLine2: legacyAddress.line2 || "",
      landmark: "",
      city: legacyAddress.city || "",
      state: legacyAddress.state || "",
      postalCode: legacyAddress.postalCode || "",
      country: legacyAddress.country || "India",
      isDefault: true,
    });

    setEditingId(null);
    setIsMigratingLegacy(true);
    setIsFormOpen(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (address) => {
    setForm({
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    });

    setEditingId(address._id);
    setIsMigratingLegacy(false);
    setIsFormOpen(true);
    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    if (saving) return;

    setIsFormOpen(false);
    setEditingId(null);
    setIsMigratingLegacy(false);
    setForm({ ...initialForm });
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = { ...form };

    try {
      if (editingId) {
        await updateAddress(editingId, payload);

        setSuccess("Delivery address updated successfully.");
      } else {
        // Used for both new addresses and legacy address migration.
        await createAddress({
          ...payload,
          isDefault: isMigratingLegacy ? true : payload.isDefault,
        });

        setSuccess(
          isMigratingLegacy
            ? "Your existing registration address has been migrated successfully."
            : "Delivery address added successfully.",
        );
      }

      setIsFormOpen(false);
      setEditingId(null);
      setIsMigratingLegacy(false);
      setForm({ ...initialForm });

      await loadAddresses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this delivery address?",
    );

    if (!confirmed) return;

    setActionId(addressId);
    setError("");
    setSuccess("");

    try {
      await deleteAddress(addressId);

      setSuccess("Delivery address deleted successfully.");
      await loadAddresses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setActionId(addressId);
    setError("");
    setSuccess("");

    try {
      await setDefaultAddress(addressId);

      setSuccess("Default delivery address updated.");
      await loadAddresses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className="addresses-page">
      <div className="addresses-header">
        <div>
          <p className="addresses-eyebrow">YOUR ACCOUNT</p>

          <h1>Delivery Addresses</h1>

          <p className="addresses-description">
            Save and manage your delivery addresses for a faster checkout
            experience.
          </p>
        </div>

        <button
          type="button"
          className="address-primary-button"
          onClick={openAddForm}
          disabled={loading}
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {error && (
        <div
          className="address-alert address-alert-error"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="address-alert address-alert-success"
          role="status"
          aria-live="polite"
        >
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {isFormOpen && (
        <div className="address-form-card">
          <div className="address-form-header">
            <div>
              <h2>
                {isMigratingLegacy
                  ? "Complete Your Existing Address"
                  : editingId
                    ? "Edit Address"
                    : "Add New Address"}
              </h2>

              <p>
                {isMigratingLegacy
                  ? "Your original registration address has been prefilled. Add your phone number to save it as your default delivery address."
                  : editingId
                    ? "Update your saved delivery information."
                    : "Enter the details of the address where you want your books delivered."}
              </p>
            </div>

            <button
              type="button"
              className="address-icon-button"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close address form"
              title="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="address-form-grid">
              <label>
                Recipient Name *
                <input
                  type="text"
                  name="recipientName"
                  value={form.recipientName}
                  onChange={handleChange}
                  placeholder="Enter recipient's full name"
                  autoComplete="name"
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Phone Number *
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  required
                />
              </label>

              <label className="address-field-full">
                Address Line 1 *
                <input
                  type="text"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="House / Flat No., Building, Street"
                  autoComplete="address-line1"
                  maxLength={250}
                  required
                />
              </label>

              <label className="address-field-full">
                Address Line 2
                <input
                  type="text"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Area, locality or apartment (optional)"
                  autoComplete="address-line2"
                  maxLength={250}
                />
              </label>

              <label className="address-field-full">
                Landmark
                <input
                  type="text"
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark (optional)"
                  maxLength={150}
                />
              </label>

              <label>
                City *
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  autoComplete="address-level2"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                State *
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  autoComplete="address-level1"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                PIN Code *
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[1-9][0-9]{5}"
                  title="Enter a valid 6-digit Indian PIN code."
                  required
                />
              </label>

              <label>
                Country *
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  autoComplete="country-name"
                  maxLength={100}
                  required
                />
              </label>
            </div>

            {!editingId && (
              <label className="address-default-checkbox">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  disabled={isMigratingLegacy}
                />

                <span>
                  {isMigratingLegacy
                    ? "Save as my default delivery address"
                    : "Set as my default delivery address"}
                </span>
              </label>
            )}

            <div className="address-form-actions">
              <button
                type="button"
                className="address-secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="address-primary-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle className="address-spinner" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    {isMigratingLegacy
                      ? "Save Existing Address"
                      : editingId
                        ? "Save Changes"
                        : "Save Address"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="addresses-loading">
          <LoaderCircle className="address-spinner" size={28} />
          <p>Loading your delivery addresses...</p>
        </div>
      ) : error ? (
        <div className="addresses-empty">
          <div className="addresses-empty-icon">
            <AlertCircle size={30} />
          </div>

          <h2>Unable to load addresses</h2>

          <p>
            We couldn't retrieve your saved delivery addresses. Please try
            again.
          </p>

          <button
            type="button"
            className="address-primary-button"
            onClick={loadAddresses}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : addresses.length === 0 && legacyAddress ? (
        <div className="addresses-grid">
          <article className="address-card">
            <div className="address-card-top">
              <div className="address-recipient">
                <MapPin size={19} />
                <h2>{user?.fullName || "Your Registered Address"}</h2>
              </div>

              <span className="address-default-badge">
                <Star size={13} />
                Registration Address
              </span>
            </div>

            <div className="address-details">
              <p>{legacyAddress.line1}</p>

              {legacyAddress.line2 && <p>{legacyAddress.line2}</p>}

              <p>
                {legacyAddress.city}, {legacyAddress.state} -{" "}
                {legacyAddress.postalCode}
              </p>

              <p>{legacyAddress.country || "India"}</p>
            </div>

            <div className="address-alert address-alert-error">
              <Phone size={17} />
              <span>
                Add your phone number to convert this registration address into
                a saved delivery address.
              </span>
            </div>

            <div className="address-card-actions">
              <button
                type="button"
                onClick={openLegacyMigrationForm}
                className="address-primary-button"
              >
                <ArrowRight size={16} />
                Complete & Save Address
              </button>
            </div>
          </article>
        </div>
      ) : addresses.length === 0 ? (
        <div className="addresses-empty">
          <div className="addresses-empty-icon">
            <MapPin size={30} />
          </div>

          <h2>No delivery addresses yet</h2>

          <p>
            Add your first delivery address to make future purchases quicker and
            easier.
          </p>

          <button
            type="button"
            className="address-primary-button"
            onClick={openAddForm}
          >
            <Plus size={18} />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <article className="address-card" key={address._id}>
              <div className="address-card-top">
                <div className="address-recipient">
                  <MapPin size={19} />
                  <h2>{address.recipientName}</h2>
                </div>

                {address.isDefault && (
                  <span className="address-default-badge">
                    <Star size={13} />
                    Default
                  </span>
                )}
              </div>

              <p className="address-phone">{address.phone}</p>

              <div className="address-details">
                <p>{address.addressLine1}</p>

                {address.addressLine2 && <p>{address.addressLine2}</p>}

                {address.landmark && <p>Near {address.landmark}</p>}

                <p>
                  {address.city}, {address.state} - {address.postalCode}
                </p>

                <p>{address.country}</p>
              </div>

              <div className="address-card-actions">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address._id)}
                    disabled={actionId === address._id}
                  >
                    <Star size={15} />
                    Set Default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  disabled={actionId === address._id}
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  className="address-delete-button"
                  onClick={() => handleDelete(address._id)}
                  disabled={actionId === address._id}
                >
                  {actionId === address._id ? (
                    <LoaderCircle className="address-spinner" size={15} />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AddressesPage;
