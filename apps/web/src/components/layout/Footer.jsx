
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="bb-footer">
      <div className="bb-footer-inner">
        <Link to="/" className="bb-footer-brand">
          <BookOpen size={23} />
          <span>
            Book<span className="bb-footer-accent">Bazar</span>
          </span>
        </Link>

        <p className="bb-footer-tagline">
          Discover, buy and sell books in one marketplace.
        </p>

        <div className="bb-footer-bottom">
          <p>
            © {new Date().getFullYear()} Book Bazar. All rights reserved.
          </p>

          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </footer>
  );
}
