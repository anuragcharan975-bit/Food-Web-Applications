const Restaurant = require("../../model/restaurant");

// ================= CREATE =================

const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      description,
      latitude,
      longitude,
    } = req.body;

    // Check email
    const existingEmail = await Restaurant.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Check phone
    const existingPhone = await Restaurant.findOne({
      phone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      email,
      phone,
      address,
      description,
      latitude: latitude || null,
      longitude: longitude || null,
      image: req.file
        ? req.file.filename
        : "",
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });

  } catch (error) {
    console.log(
      "Create Restaurant Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone number is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
      error: error.message,
    });
  }
};

// ================= GET ALL =================

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get restaurants",
      error: error.message,
    });
  }
};

// ================= GET BY ID =================

const getRestaurantById = async (req, res) => {
  try {
    const restaurant =
      await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get restaurant",
      error: error.message,
    });
  }
};

// ================= UPDATE =================

const updateRestaurant = async (req, res) => {
  try {
    const restaurant =
      await Restaurant.findById(
        req.params.id
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      description,
      latitude,
      longitude,
    } = req.body;

    // Check email of another restaurant
    const existingEmail =
      await Restaurant.findOne({
        email,
        _id: {
          $ne: req.params.id,
        },
      });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Check phone of another restaurant
    const existingPhone =
      await Restaurant.findOne({
        phone,
        _id: {
          $ne: req.params.id,
        },
      });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "This phone number is already registered",
      });
    }

    restaurant.name = name;
    restaurant.email = email;
    restaurant.phone = phone;
    restaurant.address = address;
    restaurant.description = description;
    
    if (latitude !== undefined) restaurant.latitude = latitude;
    if (longitude !== undefined) restaurant.longitude = longitude;

    if (req.file) {
      restaurant.image = req.file.filename;
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });

  } catch (error) {
    console.log(
      "Update Restaurant Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone number is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
      error: error.message,
    });
  }
};

// ================= DELETE =================

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant =
      await Restaurant.findByIdAndDelete(
        req.params.id
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
      error: error.message,
    });
  }
};

// ================= STATUS =================

const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant =
      await Restaurant.findById(
        req.params.id
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isOpen =
      !restaurant.isOpen;

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant status updated",
      data: restaurant,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
};