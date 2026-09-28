const Order = require("../../model/order");
const User = require("../../model/user");
const Address = require("../../model/address");
const Restaurant = require("../../model/restaurant");
const Food = require("../../model/food");
const { sendEmail } = require("../../services/emailService");

// ================= GET USER ORDERS =================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    })
      .populate("user")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// ================= GET ORDER BY ID =================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.params.userId,
    })
      .populate("user")
      .populate("address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// ================= CREATE ORDER =================

const createOrder = async (req, res) => {
  try {
    const Address = require("../../model/address");
    const Food = require("../../model/food");
    
    // Create an address record from the simple string sent by frontend
    const addressStr = req.body.deliveryAddress || "Jaipur";
    const addressDoc = await Address.create({
      name: "Delivery Address",
      city: addressStr,
      state: "Rajasthan",
      pincode: "302001"
    });

    // Format items: frontend sends { foodId, quantity, price }
    const formattedItems = [];
    let restaurantId = null;

    for (let item of req.body.items) {
      formattedItems.push({
        food: item.foodId,
        quantity: item.quantity,
        price: item.price
      });
      // Try to grab restaurant ID from the first food item
      if (!restaurantId) {
        try {
          const foodDoc = await Food.findById(item.foodId);
          if (foodDoc) {
            restaurantId = foodDoc.restaurant;
          }
        } catch(e) {}
      }
    }

    // Fallback if we couldn't find a restaurant (e.g. sample data with fake IDs)
    if (!restaurantId) {
       const Restaurant = require("../../model/restaurant");
       const dummyRes = await Restaurant.findOne();
       restaurantId = dummyRes ? dummyRes._id : null;
    }

    const orderData = {
      user: req.params.userId,
      restaurant: restaurantId,
      items: formattedItems,
      address: addressDoc._id,
      totalAmount: req.body.totalAmount,
      paymentStatus: "Pending",
      orderStatus: "Placed"
    };

    const order = await Order.create(orderData);

    // Fetch user details for email
    const user = await User.findById(req.params.userId);
    
    if (user && user.email) {
      // Send Order Confirmation to User
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff4757; text-align: center;">Order Confirmed! 🎉</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your order has been successfully placed. We are preparing it right now!</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Delivery Address:</strong> ${addressDoc.city}</p>
          <br/>
          <p>Thank you for choosing Zwigato!<br/><strong>Zwigato Team</strong></p>
        </div>
      `;
      sendEmail(user.email, "Zwigato - Order Confirmed", userHtml);

      // Send Order Notification to Admin
      const admins = await User.find({ role: "admin" });
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff4757; text-align: center;">New Order Received! 🛒</h2>
          <p>A new order has been placed by <strong>${user.name}</strong> (${user.email}).</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Delivery Address:</strong> ${addressDoc.city}</p>
          <p>Please check the admin panel for more details.</p>
        </div>
      `;
      admins.forEach(admin => {
        if (admin.email) {
          sendEmail(admin.email, "Zwigato Admin - New Order Received", adminHtml);
        }
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
      orderId: order._id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// ================= UPDATE ORDER =================

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.params.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};


// ================= CANCEL / DELETE ORDER =================

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.params.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};


module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};