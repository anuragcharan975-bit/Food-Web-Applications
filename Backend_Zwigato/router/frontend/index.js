const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/foods", require("./foodRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/restaurants", require("./restaurantRoutes"));
router.use("/banners", require("./bannerRoutes"));
router.use("/coupons", require("./couponRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/addresses", require("./addressRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/order-items", require("./orderItemRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/deliveries", require("./deliveryRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/contact-messages", require("./contactMessageRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use("/wishlists", require("./wishListRoutes"));

module.exports = router;