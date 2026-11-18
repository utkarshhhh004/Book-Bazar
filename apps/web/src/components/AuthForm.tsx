
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AuthForm({ onSuccess, onClose }: Props) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        await register(fullName, email, password);
      } else {
        await login(email, password);
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="auth-brand">BOOK BAZAR</div>

        <p className="eyebrow">A MARKETPLACE FOR EVERY READER</p>

        <h2>
          {mode === "login"
            ? "Welcome back."
            : "Join our reading community."}
        </h2>

        <p className="auth-description">
          {mode === "login"
            ? "Sign in to discover your next favourite book."
            : "Create your account and give books another story."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                maxLength={100}
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === "register" ? 8 : 1}
              maxLength={72}
            />
          </label>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login"
            ? "New to Book Bazar?"
            : "Already have an account?"}

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
