const Restaurant = require("../../model/restaurant");


// ================= GET ALL =================

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get restaurants",
      error: error.message,
    });
  }
};


// ================= GET BY ID =================

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
      error: error.message,
    });
  }
};


module.exports = {
  getAllRestaurants,
  getRestaurantById,
};