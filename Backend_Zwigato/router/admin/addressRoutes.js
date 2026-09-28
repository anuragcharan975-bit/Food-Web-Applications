const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/addressController");
// const validation = require("../../validation/frontend/addressValidation");

router.get("/viewall", controller.getAllAddresses);

router.get("/view:id", controller.getAddressById);

router.post("/add",  controller.createAddress);

router.put("/update:id", controller.updateAddress);
router.delete("/delete:id", controller.deleteAddress);

module.exports = router;