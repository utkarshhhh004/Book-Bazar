
import { useAuth } from "../context/AuthContext";

interface Props {
  onExplore: () => void;
  onAccount: () => void;
  onSell: () => void;
}

export default function Navbar({
  onExplore,
  onAccount,
  onSell,
}: Props) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <button className="brand" onClick={onExplore}>
        <span className="brand-icon">▤</span>
        BOOK BAZAR
      </button>

      <div className="nav-links">
        <button onClick={onExplore}>Explore books</button>
        <button onClick={onSell}>Sell books</button>
        <button onClick={onSell}>Publish</button>
      </div>

      <div className="nav-account">
        {user ? (
          <>
            <button className="account-link" onClick={onAccount}>
              {user.fullName?.split(" ")[0] || "My account"}
            </button>

            <button
              className="outline-button"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </>
        ) : (
          <button className="outline-button" onClick={onAccount}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
