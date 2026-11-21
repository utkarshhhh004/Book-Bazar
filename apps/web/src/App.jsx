import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Layout Components
import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// Dashboard Pages
import BooksPage from "./pages/dashboard/BooksPage";
import CartPage from "./pages/dashboard/CartPage";
import WishlistPage from "./pages/dashboard/WishlistPage";
import AddressesPage from "./pages/dashboard/AddressesPage";
import CheckoutPage from "./pages/dashboard/CheckoutPage";
import MyListingsPage from "./pages/dashboard/MyListingsPage";
import SellBookPage from "./pages/dashboard/SellBookPage";
import "./pages/dashboard/sell-book-page.css";

// Global Styles
import "./pages/auth-page.css";
import "./components/layout/dashboard-layout.css";

// Dashboard Styles
import "./pages/dashboard/books-page.css";
import "./pages/dashboard/cart-page.css";
import "./pages/dashboard/wishlist-page.css";
import "./pages/dashboard/addresses-page.css";
import "./pages/dashboard/checkout-page.css";
import "./pages/dashboard/seller-listings-page.css";

export default function App() {
  const location = useLocation();

  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("book-bazar-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("book-bazar-theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  // Determine whether the current route belongs to Dashboard
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="app-shell">
      {/* Public Navbar */}
      {!isDashboardRoute && (
        <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<AuthPage mode="login" />} />

        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                theme={theme}
                onToggleTheme={handleToggleTheme}
              />
            }
          >
            {/* Marketplace */}
            <Route index element={<BooksPage />} />

            <Route path="cart" element={<CartPage />} />

            <Route path="wishlist" element={<WishlistPage />} />

            {/* Account */}
            <Route path="addresses" element={<AddressesPage />} />

            <Route path="checkout" element={<CheckoutPage />} />

            {/* Seller */}
            <Route path="sell" element={<SellBookPage />} />
            <Route path="listings" element={<MyListingsPage />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
