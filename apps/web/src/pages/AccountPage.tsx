
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface Props {
  onClose: () => void;
}

export default function AccountPage({ onClose }: Props) {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function updateProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("bookbazar_token");
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      await api.updateProfile(token, fullName);
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Update failed"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="account-page">
      <button className="back-link" onClick={onClose}>
        ← Back to home
      </button>

      <p className="eyebrow">YOUR BOOK BAZAR ACCOUNT</p>
      <h1>My account.</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        <h2>{user.fullName}</h2>
        <p>{user.email}</p>
        <span className="status-pill">{user.status}</span>

        <form onSubmit={updateProfile} className="profile-form">
          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
            />
          </label>

          <label>
            Email address
            <input value={user.email || ""} disabled />
          </label>

          <button
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          {message && <p className="profile-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}
