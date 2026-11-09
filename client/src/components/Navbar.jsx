
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { cartCount, user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">F</span>
          Foodie<span>Express</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/search">Explore Food</NavLink>
          <NavLink to="/my-orders">My Orders</NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            🛒 Cart <span className="cart-count">{cartCount}</span>
          </Link>

          {user ? (
  <>
    <Link to="/profile" className="profile-link">
      👤 {user.name}
    </Link>
    <button
      type="button"
      className="btn btn-small"
      onClick={handleLogout}
    >
      Logout
    </button>
  </>
) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-small">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
