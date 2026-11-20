
import { useMemo } from "react";
import { books } from "../../data/books";
import BookCard from "../../components/books/BookCard";
import "./styles/featured-books-section.css";

export default function FeaturedBooksSection({
  search,
  selectedCategory,
  setSelectedCategory,
}) {
  const filteredBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !normalizedSearch ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch) ||
        book.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <section className="featured-section" id="featured">
      <div className="container">
        <div className="featured-heading">
          <div className="section-heading">
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>

            <h2>
              Featured <span>Books</span>
            </h2>

            <p>
              Discover popular reads and find your next favourite book.
            </p>
          </div>

          {selectedCategory !== "All" && (
            <button
              type="button"
              className="clear-category-button"
              onClick={() => setSelectedCategory("All")}
            >
              Clear Category
            </button>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="featured-books-grid">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="featured-empty-state">
            <h3>No books found</h3>
            <p>
              Try another search term or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
              }}
            >
              View All Categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
