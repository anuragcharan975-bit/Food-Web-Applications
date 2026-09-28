const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/wishListController");
const validation = require("../../validation/frontend/wishListValidation");

router.get(
  "/",
  controller.getAllWishLists
);

router.get(
  "/:id",
  controller.getWishListById
);

router.post(
  "/",
  validation.createWishList,
  controller.createWishList
);

router.put(
  "/:id",
  validation.updateWishList,
  controller.updateWishList
);

router.delete(
  "/:id",
  controller.deleteWishList
);

module.exports = router;