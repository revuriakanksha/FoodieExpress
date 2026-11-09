
import { useEffect, useMemo, useState } from "react";
import FoodCard from "../components/FoodCard";
import { getFoods } from "../api/foodApi";

const categories = [
  "All",
  "Burgers",
  "Pizza",
  "Biryani",
  "Pasta",
  "Snacks",
  "Drinks",
  "Healthy",
];

export default function Search() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFoods() {
      try {
        const data = await getFoods();
        setFoods(data);
      } catch (err) {
        console.error("Failed to load foods:", err);
        setError("Unable to load food items. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch =
        `${food.name} ${food.restaurantName} ${food.category}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" || food.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [foods, search, category]);

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">FIND SOMETHING DELICIOUS</span>
        <h1>What are you craving?</h1>
        <p>Search dishes, browse categories, and add food to your cart.</p>
      </div>

      <input
        className="search-input"
        placeholder="Search for pizza, biryani, burgers..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="category-list">
        {categories.map((item) => (
          <button
            key={item}
            className={`category-chip ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="results-heading">
        <h2>Food menu</h2>
        {!loading && !error && <span>{filteredFoods.length} items</span>}
      </div>

      {loading ? (
        <p>Loading delicious food...</p>
      ) : error ? (
        <div className="empty-state">
          <h3>Could not load the menu</h3>
          <p>{error}</p>
          <button
            className="btn"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : filteredFoods.length ? (
        <div className="food-grid">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No dishes found</h3>
          <p>Try a different search or select another category.</p>
          <button
            className="btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
