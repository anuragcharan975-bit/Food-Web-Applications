const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/userController");
const validation = require("../../validation/admin/userValidation");

router.get("/viewall", controller.getAllUsers);
router.get("/view:id", controller.getUserById);

router.post("/add", validation.createUser, controller.createUser);
router.put("/update:id", validation.updateUser, controller.updateUser);
router.delete("/delete:id", controller.deleteUser);

module.exports = router;