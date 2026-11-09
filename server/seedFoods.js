const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./models/Food");

const foods = [
  {
    name: "Classic Burger",
    category: "Burgers",
    price: 149,
    restaurantId: "r3",
    restaurantName: "Burger House",
    rating: 4.5,
    description: "Juicy burger with fresh lettuce, tomato and cheese.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    restaurantId: "r2",
    restaurantName: "Pizza Palace",
    rating: 4.6,
    description: "Classic pizza topped with cheese and fresh basil.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chicken Biryani",
    category: "Biryani",
    price: 199,
    restaurantId: "r1",
    restaurantName: "Spice Garden",
    rating: 4.7,
    description: "Aromatic basmati rice with flavorful spices.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Creamy Pasta",
    category: "Pasta",
    price: 179,
    restaurantId: "r2",
    restaurantName: "Pizza Palace",
    rating: 4.3,
    description: "Creamy pasta tossed in a rich, savory sauce.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Crispy Sandwich",
    category: "Snacks",
    price: 99,
    restaurantId: "r3",
    restaurantName: "Burger House",
    rating: 4.2,
    description: "Toasted sandwich with fresh vegetables and cheese.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Chocolate Shake",
    category: "Drinks",
    price: 119,
    restaurantId: "r3",
    restaurantName: "Burger House",
    rating: 4.4,
    description: "A chilled and creamy chocolate milkshake.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "French Fries",
    category: "Snacks",
    price: 89,
    restaurantId: "r3",
    restaurantName: "Burger House",
    rating: 4.1,
    description: "Golden, crispy fries with a pinch of seasoning.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fresh Garden Salad",
    category: "Healthy",
    price: 139,
    restaurantId: "r1",
    restaurantName: "Spice Garden",
    rating: 4.2,
    description: "Fresh vegetables served with a light dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Insert only missing items; do not delete existing database data.
    for (const food of foods) {
      await Food.updateOne(
        { name: food.name, restaurantId: food.restaurantId },
        { $setOnInsert: food },
        { upsert: true }
      );
    }

    console.log("Food items seeded successfully!");
    console.log(`Processed ${foods.length} food items.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedFoods();
