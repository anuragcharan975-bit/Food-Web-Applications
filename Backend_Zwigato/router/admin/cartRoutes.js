const express = require("express");

const router = express.Router();

const controller = require("../../controller/admin/cartController");


// ================= CREATE CART =================
router.post("/add", controller.createCart);


// ================= GET ALL CARTS =================
router.get("/viewall", controller.getAllCarts);


// ================= GET CART BY ID =================
router.get("/view/:id", controller.getCartById);


// ================= UPDATE CART =================
router.put("/update/:id", controller.updateCart);


// ================= DELETE CART =================
router.delete("/delete/:id", controller.deleteCart);


module.exports = router;