
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="restaurant-card"
    >
      {imageError ? (
        <div className="restaurant-image-fallback">
          <span>🍽️</span>
          <p>Image unavailable</p>
        </div>
      ) : (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}

      <div className="restaurant-card-body">
        <h3>{restaurant.name}</h3>
        <p className="muted">{restaurant.cuisine}</p>

        <div className="restaurant-meta">
          <span className="rating">★ {restaurant.rating}</span>
          <span>{restaurant.time}</span>
        </div>
      </div>
    </Link>
  );
}
