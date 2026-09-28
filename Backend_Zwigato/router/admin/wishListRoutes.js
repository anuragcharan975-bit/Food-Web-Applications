const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/wishListController");
const validation = require("../../validation/admin/wishListValidation");

router.get("/viewall", controller.getAllWishLists);
router.get("/view:id", controller.getWishListById);

router.post("/add", validation.createWishList, controller.createWishList);

router.put("/update:id", validation.updateWishList, controller.updateWishList);

router.delete("delete/:id", controller.deleteWishList);

module.exports = router;