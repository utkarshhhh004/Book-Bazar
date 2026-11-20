
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  UserRound,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();

  const { login, register, resendVerificationEmail } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];

      setFormData((previous) => ({
        ...previous,
        address: {
          ...previous.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));
    }

    setError("");
    setSuccess("");
  };

  const handleResendVerification = async () => {
    if (resending) return;

    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await resendVerificationEmail();

      setSuccess(
        response?.message ||
          "Verification email sent successfully. Please check your inbox."
      );
    } catch (requestError) {
      const responseData = requestError.response?.data;

      setError(
        responseData?.message ||
          responseData?.error?.message ||
          requestError.message ||
          "Unable to resend verification email. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (loading) return;

    if (!isLogin) {
      if (formData.password.length < 12) {
        setError("Password must contain at least 12 characters.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (response.user.emailVerified === false) {
          setVerificationRequired(true);
          setSuccess(
            "Your credentials are valid, but your email address is not verified. Please request a verification email."
          );
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        const response = await register({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          address: {
            line1: formData.address.line1.trim(),
            line2: formData.address.line2.trim(),
            city: formData.address.city.trim(),
            state: formData.address.state.trim(),
            postalCode: formData.address.postalCode.trim(),
            country: formData.address.country.trim(),
          },
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        setSuccess(
          response?.verificationEmailSent === false
            ? "Your account has been created, but the verification email could not be sent. Please sign in and request verification again."
            : "Your account has been created successfully. Please check your email to verify your account before signing in."
        );

        setFormData((previous) => ({
          ...previous,
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (requestError) {
      const responseData = requestError.response?.data;

      setError(
        responseData?.error?.message ||
          responseData?.message ||
          requestError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`auth-page ${isLogin ? "auth-login" : "auth-register"}`}>
      <section className="auth-layout">
        <aside className="auth-brand-panel">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">
              <BookOpen size={25} />
            </span>
            <span className="auth-brand-name">
              Book<span>Bazar</span>
            </span>
          </Link>

          <div className="auth-brand-content">
            <span className="auth-eyebrow">
              <Sparkles size={14} />
              YOUR WORLD OF BOOKS
            </span>

            <h1>
              {isLogin ? (
                <>
                  Every book
                  <br />
                  has a <span>story.</span>
                  <br />
                  Yours continues here.
                </>
              ) : (
                <>
                  A new chapter
                  <br />
                  begins <span>with you.</span>
                </>
              )}
            </h1>

            <p>
              {isLogin
                ? "Rediscover your favourite reads, explore new authors and continue your reading journey with Book Bazar."
                : "Join a community of readers, discover extraordinary stories and make every page count."}
            </p>

            <div className="auth-book-art" aria-hidden="true">
              <div className="auth-book auth-book-one">
                <span>THE ART OF READING</span>
              </div>
              <div className="auth-book auth-book-two">
                <BookOpen size={35} />
              </div>
              <div className="auth-book auth-book-three">
                <span>NEW CHAPTERS</span>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <span>READ. DISCOVER. CONNECT.</span>
            <span>EST. BOOK BAZAR</span>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-topbar">
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <span className="auth-topbar-note">
              {isLogin ? "New to Book Bazar?" : "Already a member?"}{" "}
              <Link to={isLogin ? "/register" : "/login"}>
                {isLogin ? "Join us" : "Sign in"}
              </Link>
            </span>
          </div>

          <div className="auth-form-container">
            <div className="auth-form-heading">
              <span className="auth-form-kicker">
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </span>

              <h2>
                {isLogin ? "Sign in to your account" : "Create your account"}
              </h2>

              <p>
                {isLogin
                  ? "Enter your credentials to access your personal reading space."
                  : "Fill in your details and become part of our reading community."}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="auth-section-label">
                    <span>01</span>
                    PERSONAL INFORMATION
                  </div>

                  <div className="auth-field">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="auth-input-wrapper">
                      <UserRound size={18} />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-section-label">
                    <span>02</span>
                    ADDRESS DETAILS
                  </div>

                  <div className="auth-field">
                    <label htmlFor="address.line1">Street Address</label>
                    <div className="auth-input-wrapper">
                      <MapPin size={18} />
                      <input
                        id="address.line1"
                        name="address.line1"
                        type="text"
                        placeholder="House number and street"
                        value={formData.address.line1}
                        onChange={handleChange}
                        autoComplete="address-line1"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="address.line2">
                      Address Line 2 <span>(Optional)</span>
                    </label>
                    <input
                      id="address.line2"
                      name="address.line2"
                      type="text"
                      placeholder="Apartment, landmark"
                      value={formData.address.line2}
                      onChange={handleChange}
                      autoComplete="address-line2"
                    />
                  </div>

                  <div className="auth-form-grid">
                    <div className="auth-field">
                      <label htmlFor="address.city">City</label>
                      <input
                        id="address.city"
                        name="address.city"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="address.state">State</label>
                      <input
                        id="address.state"
                        name="address.state"
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleChange}
                        autoComplete="address-level1"
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="address.postalCode">Postal Code</label>
                      <input
                        id="address.postalCode"
                        name="address.postalCode"
                        placeholder="Postal code"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        autoComplete="postal-code"
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="address.country">Country</label>
                      <input
                        id="address.country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        autoComplete="country-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-section-label">
                    <span>03</span>
                    ACCOUNT CREDENTIALS
                  </div>
                </>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <LockKeyhole size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    minLength={isLogin ? undefined : 12}
                    maxLength={128}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {!isLogin && (
                  <span className="auth-field-hint">
                    Minimum 12 characters.
                  </span>
                )}
              </div>

              {!isLogin && (
                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <LockKeyhole size={18} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      maxLength={128}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="auth-forgot">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              )}

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="auth-success" role="status">
                  {success}
                </div>
              )}

              {verificationRequired && (
                <button
                  type="button"
                  className="auth-submit"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending
                    ? "Sending verification email..."
                    : "Resend Verification Email"}
                  {!resending && <Mail size={18} />}
                </button>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In to Book Bazar"
                    : "Create My Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-form-bottom">
              <LockKeyhole size={14} />
              Your information is protected and securely handled.
            </div>
          </div>

          <footer className="auth-mobile-footer">
            © Book Bazar. All rights reserved.
          </footer>
        </section>
      </section>
    </main>
  );
}
