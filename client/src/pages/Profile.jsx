
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useApp();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) {
    return (
      <main className="page-container empty-state">
        <h1>Please log in</h1>
        <p>Log in to view your FoodieExpress profile.</p>
        <Link to="/login" className="btn">
          Log in
        </Link>
      </main>
    );
  }

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>My Profile</h1>
        <p>Manage your FoodieExpress account.</p>
      </div>

      <section className="profile-card bill-card">
        <div className="profile-header">
          <div className="profile-avatar">{initial}</div>
          <div>
            <h2>{user.name}</h2>
            <p className="muted">{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail-row">
            <span>Full name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-detail-row">
            <span>Email address</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-detail-row">
            <span>Account status</span>
            <strong>Logged in</strong>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/my-orders" className="btn">
            View My Orders
          </Link>

          <Link to="/search" className="btn btn-outline">
            Explore Food
          </Link>

          <button
            type="button"
            className="btn btn-outline"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}
