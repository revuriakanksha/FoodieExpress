
import { Link, useParams } from "react-router-dom";
import { foods, restaurants } from "../data/foods";
import FoodCard from "../components/FoodCard";

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurant = restaurants.find((item) => item.id === id);

  if (!restaurant) {
    return (
      <main className="page-container empty-state">
        <h2>Restaurant not found</h2>
        <Link to="/restaurants" className="btn">Browse restaurants</Link>
      </main>
    );
  }

  const restaurantFoods = foods.filter((food) => food.restaurantId === id);

  return (
    <main className="page-container">
      <Link to="/restaurants" className="text-link">← All restaurants</Link>

      <section className="restaurant-detail">
        <img src={restaurant.image} alt={restaurant.name} />
        <div>
          <span className="eyebrow">RESTAURANT</span>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisine}</p>
          <div className="restaurant-meta">
            <span className="rating">★ {restaurant.rating}</span>
            <span>{restaurant.time}</span>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Menu</h2>
          <p>Choose your favorite dishes.</p>
        </div>
      </div>

      {restaurantFoods.length ? (
        <div className="food-grid">
          {restaurantFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <p>No dishes are available for this restaurant yet.</p>
      )}
    </main>
  );
}
