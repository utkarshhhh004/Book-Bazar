
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "../services/auth.service";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const requestStarted = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we verify your email address."
  );

  useEffect(() => {
    if (requestStarted.current) return;

    requestStarted.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          "The verification link is invalid because its token is missing."
        );
        return;
      }

      try {
        const response = await verifyEmail(token);

        setStatus("success");
        setMessage(
          response?.message ||
            "Your email address has been verified successfully. You can now sign in."
        );
      } catch (error) {
        const responseData = error.response?.data;

        setStatus("error");
        setMessage(
          responseData?.message ||
            responseData?.error?.message ||
            error.message ||
            "Email verification failed. Your link may have expired or already been used."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <main className="auth-page auth-login">
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
            <span className="auth-eyebrow">ACCOUNT VERIFICATION</span>
            <h1>
              One step
              <br />
              closer to your
              <br />
              <span>next chapter.</span>
            </h1>
            <p>
              Verify your email address to activate your Book Bazar account and
              begin your reading journey.
            </p>
          </div>

          <div className="auth-brand-footer">
            <span>READ. DISCOVER. CONNECT.</span>
            <span>EST. BOOK BAZAR</span>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-topbar">
            <Link to="/" className="auth-back-link">
              Back to Home
            </Link>
          </div>

          <div className="auth-form-container">
            <div className="auth-form-heading">
              <span className="auth-form-kicker">EMAIL VERIFICATION</span>
              <h2>
                {status === "verifying"
                  ? "Verifying your email"
                  : status === "success"
                    ? "Email verified!"
                    : "Verification unsuccessful"}
              </h2>
              <p>{message}</p>
            </div>

            <div className="auth-verification-status">
              {status === "verifying" && (
                <div className="auth-verification-loader" />
              )}

              {status === "success" && (
                <CheckCircle2 size={48} />
              )}

              {status === "error" && (
                <XCircle size={48} />
              )}
            </div>

            {status !== "verifying" && (
              <Link to="/login" className="auth-submit">
                {status === "success"
                  ? "Continue to Sign In"
                  : "Return to Sign In"}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
