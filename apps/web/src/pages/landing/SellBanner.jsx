
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import "./styles/sell-banner.css";

export default function SellBanner() {
  return (
    <section className="sell-banner" id="sell">
      <div className="container">
        <div className="sell-banner-content">
          <div className="sell-banner-text">
            <span className="sell-banner-eyebrow">
              GIVE YOUR BOOKS A NEW HOME
            </span>

            <h2>
              Have Books You're
              <span> Ready to Share?</span>
            </h2>

            <p>
              Turn your pre-loved books into opportunities.
              List your books, reach readers and make every story count.
            </p>

            <Link to="/login" className="sell-banner-button">
              Start Selling
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="sell-banner-visual">
            <div className="sell-banner-icon">
              <BookOpen size={58} />
            </div>

            <div className="sell-banner-floating-card">
              <TrendingUp size={20} />
              <span>Every Book Deserves Another Chapter</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
