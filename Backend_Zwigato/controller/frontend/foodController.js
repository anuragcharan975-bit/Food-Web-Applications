const Food = require("../../model/food");

const getAllFoods = async (req, res) => {
  try {
    let query = { available: { $ne: false } };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      
      // First, find restaurants that match the search query
      const Restaurant = require("../../model/restaurant");
      const matchingRestaurants = await Restaurant.find({ name: searchRegex }).select('_id');
      const restaurantIds = matchingRestaurants.map(r => r._id);

      // Then search foods by name, description OR if they belong to a matching restaurant
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { restaurant: { $in: restaurantIds } }
      ];
    }

    const foods = await Food.find(query)
      .populate("category")
      .populate("restaurant")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get foods",
      error: error.message,
    });
  }
};

const getFoodById = async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      available: { $ne: false },
    })
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
    res.status(500).json({
      success: false,
      message: "Failed to get food",
      error: error.message,
    });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
};