import {
  BookOpen,
  ShoppingBag,
  Heart,
  Store,
  ArrowRight,
  UserRound,
  PenTool,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const dashboardCards = [
  {
    title: "My Orders",
    description: "Track your purchases and view order history.",
    icon: ShoppingBag,
    path: "/dashboard/orders",
  },
  {
    title: "My Wishlist",
    description: "Keep your favourite books in one place.",
    icon: Heart,
    path: "/dashboard/wishlist",
  },
  {
    title: "My Profile",
    description: "Manage your personal information.",
    icon: UserRound,
    path: "/dashboard/profile",
  },
  {
    title: "Become a Seller",
    description: "Start selling your books to readers.",
    icon: Store,
    path: "/dashboard/seller",
  },
  {
    title: "Become an Author",
    description: "Explore publishing opportunities.",
    icon: PenTool,
    path: "/dashboard/author",
  },
];

export default function DashboardOverview() {
  const { user } = useAuth();

  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "Reader";

  return (
    <div className="dashboard-overview">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <span className="dashboard-eyebrow">
            YOUR READING JOURNEY STARTS HERE
          </span>

          <h1>
            Welcome back, <span>{firstName}.</span>
          </h1>

          <p>
            Manage your account, explore your marketplace activities and
            discover everything Book Bazar has to offer.
          </p>

          <Link to="/" className="dashboard-explore-button">
            <BookOpen size={18} />
            Explore Books
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="dashboard-welcome-art" aria-hidden="true">
          <BookOpen size={104} strokeWidth={1.1} />
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">YOUR ACCOUNT</span>
            <h2>Quick Access</h2>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                to={card.path}
                className="dashboard-quick-card"
                key={card.path}
              >
                <div className="dashboard-quick-icon">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <div className="dashboard-quick-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>

                <ArrowRight className="dashboard-quick-arrow" size={18} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">YOUR ACTIVITY</span>
            <h2>Recent Activity</h2>
          </div>
        </div>

        <div className="dashboard-empty-activity">
          <div className="dashboard-empty-icon">
            <BookOpen size={29} />
          </div>

          <h3>Your journey is just beginning</h3>

          <p>
            Your recent orders and marketplace activities will appear here when
            you start using Book Bazar.
          </p>

          <Link to="/" className="dashboard-empty-link">
            Discover Books <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
