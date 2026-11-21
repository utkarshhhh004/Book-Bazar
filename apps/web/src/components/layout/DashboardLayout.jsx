import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  ShoppingBag,
  ShoppingCart,
  CirclePlus,
  Package,
  PenLine,
  BookMarked,
  Settings,
  MapPin,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navigationGroups = [
  {
    label: "Marketplace",
    items: [
      { label: "Books", path: "/dashboard", icon: BookOpen, end: true },
      { label: "Cart", path: "/dashboard/cart", icon: ShoppingCart },
      { label: "Wishlist", path: "/dashboard/wishlist", icon: Heart },
      { label: "My Orders", path: "/dashboard/orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Selling",
    items: [
      { label: "Sell Book", path: "/dashboard/sell", icon: CirclePlus },
      { label: "My Listings", path: "/dashboard/listings", icon: Package },
    ],
  },
  {
    label: "Publishing",
    items: [
      { label: "Publish Book", path: "/dashboard/publish", icon: PenLine },
      {
        label: "My Publications",
        path: "/dashboard/publications",
        icon: BookMarked,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Addresses",
        path: "/dashboard/addresses",
        icon: MapPin,
      },
      {
        label: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export default function DashboardLayout({ theme, onToggleTheme }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.fullName || "User";

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <div className={`dashboard-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      {mobileOpen && (
        <button
          type="button"
          className="dashboard-mobile-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
        />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="dashboard-sidebar-brand">
          <NavLink
            to="/dashboard"
            className="dashboard-brand-link"
            aria-label="Book Bazar"
            onClick={closeMobileSidebar}
          >
            <span className="dashboard-brand-icon">
              <BookOpen size={21} />
            </span>

            <span className="dashboard-brand-name">BookBazar</span>
          </NavLink>

          <button
            type="button"
            className="dashboard-sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>

          <button
            type="button"
            className="dashboard-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="dashboard-navigation" aria-label="Dashboard navigation">
          {navigationGroups.map((group) => (
            <div className="dashboard-nav-group" key={group.label}>
              <p className="dashboard-nav-heading">{group.label}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={closeMobileSidebar}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `dashboard-nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="dashboard-nav-icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>

                    <span className="dashboard-nav-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <span className="dashboard-sidebar-tagline">
            READ. DISCOVER. CONNECT.
          </span>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="dashboard-mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-header-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              className="dashboard-header-button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="dashboard-profile-wrapper">
              <button
                type="button"
                className="dashboard-profile-button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
              >
                <span className="dashboard-avatar">{initials}</span>
                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="dashboard-profile-menu">
                  <div className="dashboard-profile-info">
                    <strong>{fullName}</strong>
                    <span>{user?.email || ""}</span>
                  </div>

                  <NavLink
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </NavLink>

                  <button type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          © {new Date().getFullYear()} Book Bazar. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
