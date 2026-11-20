import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import BooksPage from "./pages/dashboard/BooksPage";

import "./pages/auth-page.css";
import "./components/layout/dashboard-layout.css";
import "./pages/dashboard/books-page.css";

export default function App() {
  const location = useLocation();

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

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="app-shell">
      {!isDashboardRoute && (
        <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<AuthPage mode="login" />} />

        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route path="/verify-email" element={<VerifyEmailPage />} />

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
            <Route index element={<BooksPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
