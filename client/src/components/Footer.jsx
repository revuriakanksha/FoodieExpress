
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="brand footer-brand">
            Foodie<span>Express</span>
          </Link>
          <p>Good food, delivered to your doorstep.</p>
        </div>

        <div className="footer-links">
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/search">Explore Food</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>
      </div>

      <p className="copyright">
        © {new Date().getFullYear()} FoodieExpress. College project demo.
      </p>
    </footer>
  );
}
