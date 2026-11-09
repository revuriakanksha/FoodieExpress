
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restaurants } from "../data/foods";
import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";
import { getFoods } from "../api/foodApi";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFoods() {
      try {
        const data = await getFoods();
        setFoods(data);
      } catch (err) {
        console.error("Failed to load foods:", err);
        setError("Unable to load food items. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">YOUR FAVORITE FOOD, DELIVERED</span>
          <h1>Cravings? We've got you covered.</h1>
          <p>
            Discover delicious meals from local restaurants and get them
            delivered right to your doorstep.
          </p>

          <div className="hero-actions">
            <Link to="/restaurants" className="btn">
              Explore restaurants →
            </Link>
            <Link to="/search" className="btn btn-outline">
              Find your food
            </Link>
          </div>

          <div className="hero-stats">
            <div><strong>Fresh</strong><span>Every order</span></div>
            <div><strong>Fast</strong><span>Doorstep delivery</span></div>
            <div><strong>Easy</strong><span>Simple ordering</span></div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=85"
            alt="A table filled with delicious food"
            className="hero-image"
          />
          <div className="hero-note">
            <span>🍽️</span>
            <div>
              <strong>Made for food lovers</strong>
              <p>Every bite matters</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DISCOVER</span>
            <h2>Popular restaurants</h2>
            <p>Find your next favorite place to eat.</p>
          </div>
          <Link to="/restaurants" className="text-link">
            View all →
          </Link>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MADE FOR YOUR CRAVINGS</span>
            <h2>Customer favorites</h2>
            <p>Popular picks you might love.</p>
          </div>
          <Link to="/search" className="text-link">
            Explore menu →
          </Link>
        </div>

        {loading ? (
          <p>Loading delicious food...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : foods.length === 0 ? (
          <p>No food items available yet.</p>
        ) : (
          <div className="food-grid">
            {foods.slice(0, 4).map((food) => (
              <FoodCard key={food._id || food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      <section className="promo-banner">
        <div>
          <span className="eyebrow">YOUR NEXT MEAL IS WAITING</span>
          <h2>Good food. Great mood.</h2>
          <p>Browse our menu and find something delicious today.</p>
        </div>
        <Link to="/search" className="btn btn-light">
          Order your favorites →
        </Link>
      </section>
    </>
  );
}
