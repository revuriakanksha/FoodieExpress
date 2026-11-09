
const express = require("express");
const Food = require("../models/Food");

const router = express.Router();

// GET all food items
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food items",
    });
  }
});

// GET one food item by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.json(food);
  } catch (error) {
    res.status(400).json({
      message: "Invalid food ID",
    });
  }
});

module.exports = router;
