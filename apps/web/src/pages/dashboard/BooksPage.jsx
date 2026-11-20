import { useEffect, useState } from "react";
import { Search, BookOpen, RefreshCw } from "lucide-react";

import api from "../../services/api";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/books");

        const result = response.data?.data;
        const bookList = Array.isArray(result) ? result : result?.books;

        if (!Array.isArray(bookList)) {
          throw new Error("The catalogue response is invalid.");
        }

        if (active) {
          setBooks(bookList);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              requestError.response?.data?.error?.message ||
              "Unable to load books. Please try again.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      active = false;
    };
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    const title = book.title || "";
    const authors = Array.isArray(book.authors)
      ? book.authors.join(" ")
      : book.author || "";

    return `${title} ${authors}`.toLowerCase().includes(query);
  });

  return (
    <section className="books-page">
      <div className="books-page-toolbar">
        <div className="books-page-heading">
          <h1>Explore Books</h1>
          <p>Discover books available in the Book Bazar marketplace.</p>
        </div>

        <div className="books-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search by book title or author..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search books"
          />
        </div>
      </div>

      {loading ? (
        <div className="books-state">
          <span className="books-loader" />
          <strong>Loading books...</strong>
          <p>Please wait while we retrieve the marketplace catalogue.</p>
        </div>
      ) : error ? (
        <div className="books-state">
          <BookOpen size={34} />
          <strong>Unable to load the catalogue</strong>
          <p>{error}</p>
          <button
            type="button"
            className="books-retry-button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="books-state">
          <BookOpen size={38} />
          <strong>
            {search.trim() ? "No matching books found" : "No books available"}
          </strong>
          <p>
            {search.trim()
              ? "Try another title or author."
              : "Books will appear here when sellers publish active listings."}
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const image =
              typeof book.coverImage === "string"
                ? book.coverImage
                : book.coverImage?.url;

            const authors = Array.isArray(book.authors)
              ? book.authors.join(", ")
              : book.author || "Author not specified";

            return (
              <article className="book-card" key={book._id || book.id}>
                <div className="book-card-cover">
                  {image ? (
                    <img src={image} alt={book.title} loading="lazy" />
                  ) : (
                    <div className="book-cover-placeholder">
                      <BookOpen size={38} />
                    </div>
                  )}
                </div>

                <div className="book-card-details">
                  <h2>{book.title}</h2>
                  <p className="book-card-author">{authors}</p>

                  {book.category && (
                    <span className="book-card-category">{book.category}</span>
                  )}

                  {book.price != null && (
                    <strong className="book-card-price">
                      ₹{Number(book.price).toLocaleString("en-IN")}
                    </strong>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
