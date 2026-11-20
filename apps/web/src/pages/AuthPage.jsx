
import { ArrowLeft, BookOpen, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <BookOpen size={28} />
          <span>
            Book<span>Bazar</span>
          </span>
        </Link>

        <div className="auth-icon">
          <LockKeyhole size={27} />
        </div>

        <h1>{isLogin ? "Welcome Back" : "Create Your Account"}</h1>

        <p className="auth-description">
          {isLogin
            ? "Sign in to continue your Book Bazar journey."
            : "Join Book Bazar and discover a world of books."}
        </p>

        <div className="auth-notice">
          Authentication functionality is coming soon. Your account
          registration and login will be connected to our backend.
        </div>

        <Link to="/" className="auth-home-link">
          <ArrowLeft size={17} />
          Return to Homepage
        </Link>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/register" : "/login"}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </main>
  );
}
