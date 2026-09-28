const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/notificationController");
const validation = require("../../validation/admin/notificationValidation");

router.get("/viewall", controller.getAllNotifications);
router.get("/view:id", controller.getNotificationById);

router.post(  "/add",  validation.createNotification,  controller.createNotification);

router.put(  "/update:id",  validation.updateNotification,  controller.updateNotification);

router.delete("/delete:id", controller.deleteNotification);

module.exports = router;