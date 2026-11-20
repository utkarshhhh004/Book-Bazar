
import { ArrowRight, Search } from "lucide-react";
import "./styles/hero-section.css";

export default function HeroSection({ search, setSearch }) {
  const handleSearch = (event) => {
    event.preventDefault();

    document.getElementById("featured")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="hero" id="home">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h1>
            Every Book Has a Story.
            <span> Find Yours.</span>
          </h1>

          <p className="hero-description">
            Discover your next favourite read, explore affordable books,
            and give pre-loved books a new home with Book Bazar.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={20} />

            <input
              type="search"
              placeholder="Search books, authors or categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search books, authors or categories"
            />

            <button type="submit" aria-label="Search books">
              <span>Explore</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="hero-highlights">
            <span>Affordable Books</span>
            <span>Pre-loved Reads</span>
            <span>Discover More</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000"
            alt="A peaceful library filled with books"
            className="hero-image"
          />

          <div className="hero-floating-card">
            <span className="hero-floating-icon">✦</span>
            <div>
              <strong>Find Your Next Read</strong>
              <p>Explore a world of stories.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
