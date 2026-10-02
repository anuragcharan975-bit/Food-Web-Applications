const Cart = require("../../model/cart");

// ================= GET USER CART =================

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.params.userId,
    })
      .populate("food")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cart.length,
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


// ================= ADD TO CART =================

const addToCart = async (req, res) => {
  try {
    const { food, quantity } = req.body;

    const Food = require("../../model/food");
    const foodItem = await Food.findById(food);
    
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    
    if (foodItem.available === false) {
      return res.status(400).json({ success: false, message: "Sorry, this product is currently not available." });
    }

    const cart = await Cart.create({
      user: req.params.userId,
      food,
      quantity,
    });

    const data = await Cart.findById(cart._id)
      .populate("food")
      .populate("user");

    res.status(201).json({
      success: true,
      message: "Food added to cart",
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add food to cart",
      error: error.message,
    });
  }
};


// ================= UPDATE CART =================

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.params.userId,
      },
      {
        quantity: req.body.quantity,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("food")
      .populate("user");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


// ================= DELETE CART =================

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.params.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
};