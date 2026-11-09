
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Food = require("../models/Food");
const User = require("../models/User");

const router = express.Router();

// Verify the user's login token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in to continue.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your login session is invalid or expired. Please log in again.",
    });
  }
}

// Place a new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    if (
      !address ||
      !/^[6-9]\d{9}$/.test(address.phone || "") ||
      !address.address?.trim() ||
      !address.city?.trim() ||
      !/^\d{6}$/.test(address.pincode || "")
    ) {
      return res.status(400).json({
        message: "Please provide valid delivery details.",
      });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is currently supported.",
      });
    }

    // Validate food IDs and quantities
    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.foodId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return res.status(400).json({
          message: "One or more cart items are invalid.",
        });
      }
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: "User account not found. Please log in again.",
      });
    }

    // Get actual food names and prices from MongoDB
    const foodIds = items.map((item) => item.foodId);

    if (new Set(foodIds).size !== foodIds.length) {
      return res.status(400).json({
        message: "Duplicate cart items are not allowed.",
      });
    }

    const foods = await Food.find({ _id: { $in: foodIds } });
    const foodMap = new Map(
      foods.map((food) => [food._id.toString(), food])
    );

    if (foods.length !== items.length) {
      return res.status(400).json({
        message: "Some food items could not be found. Please refresh your cart.",
      });
    }

    const orderItems = items.map((item) => {
      const food = foodMap.get(item.foodId);

      return {
        foodId: food._id.toString(),
        name: food.name,
        price: food.price,
        image: food.image || "",
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal === 0 || subtotal >= 499 ? 0 : 30;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: user._id,
      customerName: user.name,
      userEmail: user.email,
      items: orderItems,
      address: {
        phone: address.phone,
        address: address.address.trim(),
        city: address.city.trim(),
        pincode: address.pincode,
      },
      paymentMethod: "COD",
      subtotal,
      deliveryFee,
      total,
      status: "Order placed",
    });

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error.message);

    return res.status(500).json({
      message: "Could not place your order. Please try again.",
    });
  }
});

// Get orders belonging to the logged-in user
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    return res.json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error.message);

    return res.status(500).json({
      message: "Could not retrieve your orders.",
    });
  }
});

// Get one order belonging to the logged-in user
router.get("/:id", verifyToken, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json({ order });
  } catch (error) {
    console.error("Fetch order error:", error.message);

    return res.status(500).json({
      message: "Could not retrieve the order.",
    });
  }
});

module.exports = router;
