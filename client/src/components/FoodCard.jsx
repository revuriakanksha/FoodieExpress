
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function FoodCard({ food }) {
  const { addToCart } = useApp();
  const [imageError, setImageError] = useState(false);

  return (
    <article className="food-card">
      {imageError ? (
        <div className="food-image image-fallback">
          <span>🍽️</span>
          <p>Image unavailable</p>
        </div>
      ) : (
        <img
          className="food-image"
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}

      <div className="food-card-body">
        <div className="food-title-row">
          <h3>{food.name}</h3>
          <span className="rating">★ {food.rating}</span>
        </div>

        <p className="muted">{food.restaurantName}</p>
        <p className="food-description">{food.description}</p>

        <div className="food-bottom">
          <strong>₹{food.price}</strong>
          <button
            className="btn btn-small"
            onClick={() => addToCart(food)}
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  );
}
