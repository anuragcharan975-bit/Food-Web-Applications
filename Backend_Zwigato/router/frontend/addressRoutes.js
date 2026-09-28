const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/addressController");


// GET ALL ADDRESSES
router.get("/viewall", controller.getAllAddresses);


// GET ADDRESS BY ID
router.get("/view:id", controller.getAddressById);


// CREATE ADDRESS
router.post("/add", controller.createAddress);


// UPDATE ADDRESS
router.put("/update:id", controller.updateAddress);


// DELETE ADDRESS
router.delete("/delete:id", controller.deleteAddress);


module.exports = router;