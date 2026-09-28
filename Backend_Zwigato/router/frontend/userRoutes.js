const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/userController");
const upload = require("../../middleware/upload");

router.get("/viewall", controller.getAllUsers);
router.get("/view:id", controller.getUserById);

router.post("/register", upload.single("profileImage"), controller.createUser);
router.post("/login", controller.loginUser);
router.post("/add", upload.single("profileImage"), controller.createUser);

router.put("/:id", upload.single("profileImage"), controller.updateUser);
router.delete("/delete:id", controller.deleteUser);

module.exports = router;