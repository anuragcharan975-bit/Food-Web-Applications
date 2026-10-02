const fs = require('fs');

const orderControllerCode = `
const Order = require("../../model/order");
const User = require("../../model/user");
const Address = require("../../model/address");
const Restaurant = require("../../model/restaurant");
const Food = require("../../model/food");
const { sendEmail } = require("../../services/emailService");
const crypto = require("crypto");
const Razorpay = require("razorpay");

// Initialize Razorpay
// Note: Provide these keys in .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// ================= GET USER ORDERS =================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    })
      .populate("user")
      .populate("address")
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.params.userId,
    })
      .populate("user")
      .populate("address")
      .populate("items.food");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get order", error: error.message });
  }
};

// ================= CREATE ORDER =================

const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod = "COD" } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const formattedItems = [];
    let calculatedSubtotal = 0;
    let restaurantId = null;

    // 1. Validations & Backend Calculation
    for (let item of items) {
      const foodDoc = await Food.findById(item.foodId);
      
      if (!foodDoc) {
        return res.status(400).json({ success: false, message: "Some items in your cart no longer exist. Please review your cart." });
      }
      
      // VERY IMPORTANT: Check Availability
      if (foodDoc.available === false) {
        return res.status(400).json({ success: false, message: \`\${foodDoc.name} is currently unavailable. Please review your cart.\` });
      }

      if (!restaurantId) {
        restaurantId = foodDoc.restaurant;
      }

      const finalPrice = foodDoc.discountPrice && foodDoc.discountPrice > 0 ? foodDoc.discountPrice : foodDoc.price;
      calculatedSubtotal += finalPrice * item.quantity;

      formattedItems.push({
        food: foodDoc._id,
        quantity: item.quantity,
        price: finalPrice
      });
    }

    // Calculations
    const deliveryCharge = 50; // Flat delivery charge for this implementation
    const discount = 0; // Add coupon logic here if needed
    const finalTotalAmount = calculatedSubtotal + deliveryCharge - discount;

    // 2. Handle Address
    let addressDoc;
    if (mongoose.Types.ObjectId.isValid(deliveryAddress)) {
      addressDoc = await Address.findById(deliveryAddress);
    }
    if (!addressDoc) {
      const addressStr = deliveryAddress || "Jaipur";
      addressDoc = await Address.create({
        name: "Delivery Address",
        city: addressStr,
        state: "Rajasthan",
        pincode: "302001"
      });
    }

    // 3. Create Order
    const orderData = {
      user: req.params.userId,
      restaurant: restaurantId || null,
      items: formattedItems,
      address: addressDoc._id,
      subtotal: calculatedSubtotal,
      deliveryCharge,
      discount,
      totalAmount: finalTotalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Placed"
    };

    const order = await Order.create(orderData);

    // 4. Handle Payment Gateway or COD
    if (paymentMethod === "Online") {
      // Create Razorpay Order
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'dummy_key') {
        const rpOrder = await razorpay.orders.create({
          amount: Math.round(finalTotalAmount * 100), // amount in paise
          currency: "INR",
          receipt: order._id.toString(),
        });
        
        return res.status(201).json({
          success: true,
          message: "Order created, proceed to payment",
          orderId: order._id,
          razorpayOrderId: rpOrder.id,
          amount: finalTotalAmount,
          currency: "INR"
        });
      } else {
        // Fallback for demo mode if no Razorpay credentials
        return res.status(201).json({
          success: true,
          message: "Order created (Online Payment Demo Mode)",
          orderId: order._id,
          demoOnlinePayment: true
        });
      }
    }

    // For COD
    await sendOrderEmails(order, addressDoc, req.params.userId);

    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      data: order,
      orderId: order._id
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

// ================= VERIFY PAYMENT =================

const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is valid
      const order = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        transactionId: razorpay_payment_id
      }, { new: true }).populate('address');

      await sendOrderEmails(order, order.address, order.user);

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      // Payment Invalid
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
  }
};

// Helper function for emails
const sendOrderEmails = async (order, addressDoc, userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      const userHtml = \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff4757; text-align: center;">Order Confirmed! 🍔</h2>
          <p>Hello <strong>\${user.name}</strong>,</p>
          <p>Your order has been successfully placed.</p>
          <p><strong>Order ID:</strong> \${order._id}</p>
          <p><strong>Payment Method:</strong> \${order.paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹\${order.totalAmount}</p>
          <br/>
          <p>Thank you for choosing Zwigato!</p>
        </div>
      \`;
      sendEmail(user.email, "Zwigato - Order Confirmed", userHtml);
    }
  } catch (e) {
    console.log("Email error:", e);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order updated successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.params.userId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};

const mongoose = require("mongoose"); // for mongoose.Types.ObjectId checking

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  verifyPayment,
  updateOrder,
  deleteOrder,
};
`;

fs.writeFileSync('Backend_Zwigato/controller/frontend/orderController.js', orderControllerCode);
console.log('orderController.js rewritten with complete checkout + payment flow!');
