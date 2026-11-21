
import { useState } from "react";
import {
  BookOpen,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./Navbar.css";

export default function Navbar({ theme, onToggleTheme }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeMenu = () => setMobileMenu(false);

  return (
    <header className="bb-navbar">
      <div className="bb-navbar-inner">

        <Link to="/" className="bb-brand" onClick={closeMenu}>
          <span className="bb-brand-icon">
            <BookOpen size={23} />
          </span>

          <span>
            Book<span className="bb-brand-accent">Bazar</span>
          </span>
        </Link>

        <nav className={`bb-nav-links ${mobileMenu ? "bb-nav-open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="/#categories" onClick={closeMenu}>Categories</a>
          <a href="/#featured" onClick={closeMenu}>Explore Books</a>
          <a href="/#sell" onClick={closeMenu}>Sell Books</a>
        </nav>

        <div className="bb-nav-actions">

          <button
            className="bb-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <Link
            to="/login"
            className="bb-login-button"
            onClick={closeMenu}
          >
            <UserRound size={16} />
            <span>Login</span>
          </Link>

          <Link
            to="/register"
            className="bb-register-button"
            onClick={closeMenu}
          >
            <UserRound size={16} />
            <span>Register</span>
          </Link>

          <button
            className="bb-mobile-menu"
            type="button"
            onClick={() => setMobileMenu((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>
    </header>
  );
}
