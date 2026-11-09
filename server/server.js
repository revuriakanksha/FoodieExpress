const foodRoutes = require("./routes/foodRoutes");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/foods", foodRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the FoodieExpress API!");
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FoodieExpress backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    // Start Express only after the database connects
    app.listen(PORT, () => {
      console.log(
        `FoodieExpress server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
