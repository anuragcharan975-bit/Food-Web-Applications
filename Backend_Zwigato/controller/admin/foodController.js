const Food = require("../../model/food");

// ================= CREATE FOOD =================

const createFood = async (req, res) => {
  try {
    const foodData = {
      name: req.body.name,
      name: req.body.name,
      description: req.body.description || "",
      price: req.body.price,
      discountPrice: req.body.discountPrice || 0,
      type: req.body.type || "Veg",
      available: req.body.available !== undefined ? req.body.available : true,
      image: req.file ? req.file.filename : (req.body.image || ""),
    };

    // Fix Invalid Object IDs from simple admin form
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(req.body.category)) {
      foodData.category = req.body.category;
    } else {
      const Category = require("../../model/category");
      let cat = await Category.findOne();
      if (!cat) {
        cat = await Category.create({ name: "Default Category", status: true });
      }
      foodData.category = cat._id;
    }

    if (mongoose.Types.ObjectId.isValid(req.body.restaurant)) {
      foodData.restaurant = req.body.restaurant;
    } else {
      const Restaurant = require("../../model/restaurant");
      let res = await Restaurant.findOne();
      if (!res) {
        res = await Restaurant.create({ name: "Default Restaurant", address: "Local", status: true });
      }
      foodData.restaurant = res._id;
    }

    const food = await Food.create(foodData);

    const result = await Food.findById(food._id)
      .populate("category")
      .populate("restaurant");

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: result,
    });
  } catch (error) {
    console.log("Create Food Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create food",
      error: error.message,
    });
  }
};

// ================= GET ALL FOODS =================

const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("category")
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.log("Get Foods Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get foods",
      error: error.message,
    });
  }
};

// ================= GET FOOD BY ID =================

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category")
      .populate("restaurant");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.log("Get Food Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get food",
      error: error.message,
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.restaurant) updateData.restaurant = req.body.restaurant;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) {
      updateData.price = req.body.price === "" ? 0 : Number(req.body.price);
    }
    if (req.body.discountPrice !== undefined) {
      updateData.discountPrice = req.body.discountPrice === "" ? 0 : Number(req.body.discountPrice);
    }
    if (req.body.type) updateData.type = req.body.type;
    
    if (req.body.available !== undefined) {
      // Convert to boolean since formData sends strings
      updateData.available = req.body.available === 'true' || req.body.available === true;
    }

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const food =
      await Food.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("category")
        .populate("restaurant");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });
  } catch (error) {
    console.log("Update Food Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update food",
      error: error.message,
    });
  }
};

// ================= TOGGLE AVAILABLE =================

const toggleFoodStatus = async (req, res) => {
  try {
    const food = await Food.findById(
      req.params.id
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    food.available = !food.available;

    await food.save();

    res.status(200).json({
      success: true,
      message: food.available
        ? "Food activated successfully"
        : "Food deactivated successfully",
      data: food,
    });
  } catch (error) {
    console.log(
      "Toggle Food Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update food status",
      error: error.message,
    });
  }
};

// ================= DELETE FOOD =================

const deleteFood = async (req, res) => {
  try {
    const food =
      await Food.findByIdAndDelete(
        req.params.id
      );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.log("Delete Food Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete food",
      error: error.message,
    });
  }
};

module.exports = {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  toggleFoodStatus,
  deleteFood,
};