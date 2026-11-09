
import { useState } from "react";
import { restaurants } from "../data/foods";
import RestaurantCard from "../components/RestaurantCard";

export default function Restaurants() {
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter((restaurant) =>
    `${restaurant.name} ${restaurant.cuisine}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">DISCOVER LOCAL FLAVORS</span>
        <h1>Explore restaurants</h1>
        <p>Find a restaurant for whatever you're craving.</p>
      </div>

      <input
        className="search-input"
        placeholder="Search restaurants or cuisines..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredRestaurants.length ? (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No restaurants found</h3>
          <p>Try another restaurant name or cuisine.</p>
        </div>
      )}
    </main>
  );
}
