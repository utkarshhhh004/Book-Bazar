
import { useState } from "react";

import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import AccountPage from "./pages/AccountPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function BookBazarApp() {
  const { user, loading } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  if (loading) {
    return <div className="loading-screen">BOOK BAZAR</div>;
  }

  return (
    <div className="app">
      <Navbar
        onExplore={() => {
          setAuthOpen(false);
          setAccountOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAccount={() => {
          if (user) {
            setAccountOpen(true);
          } else {
            setAuthOpen(true);
          }
        }}
        onSell={() => {
          if (user) {
            setAccountOpen(true);
          } else {
            setAuthOpen(true);
          }
        }}
      />

      {accountOpen && user ? (
        <AccountPage onClose={() => setAccountOpen(false)} />
      ) : (
        <>
          <main className="hero">
            <div className="hero-content">
              <p className="eyebrow">
                A MARKETPLACE FOR EVERY READER
              </p>

              <h1>
                Good books
                <br />
                deserve <span>another</span>
                <br />
                <span>story.</span>
              </h1>

              <p className="hero-description">
                Discover books, give your old favourites a new
                home, and find your next great read with BOOK BAZAR.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() => {
                    document.getElementById("services")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore books →
                </button>

                <button
                  className="secondary-button"
                  onClick={() => {
                    if (user) setAccountOpen(true);
                    else setAuthOpen(true);
                  }}
                >
                  Start selling
                </button>
              </div>
            </div>

            <div className="hero-art">
              <div className="book-art">
                <div className="book-cover cover-one">
                  <span>▤</span>
                  <strong>READ</strong>
                </div>

                <div className="book-cover cover-two">
                  <span>▤</span>
                  <strong>SHARE</strong>
                </div>

                <div className="book-cover cover-three">
                  <span>▤</span>
                  <strong>REPEAT</strong>
                </div>
              </div>
            </div>
          </main>

          <section className="services" id="services">
            <div className="service-item">
              <span>▢</span>
              <h3>Buy books</h3>
              <p>Find books from readers and sellers.</p>
            </div>

            <div className="service-item">
              <span>▤</span>
              <h3>Sell books</h3>
              <p>Give your books a new home.</p>
            </div>

            <div className="service-item">
              <span>▣</span>
              <h3>Publish books</h3>
              <p>A dedicated space for authors is coming.</p>
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <span>BOOK BAZAR</span>
        <span>Every book deserves another story.</span>
        {user && <span>Welcome, {user.fullName}</span>}
      </footer>

      {authOpen && (
        <AuthForm
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false);
            setAccountOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookBazarApp />
    </AuthProvider>
  );
}
