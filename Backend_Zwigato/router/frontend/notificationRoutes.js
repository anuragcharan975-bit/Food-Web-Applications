const express = require("express");
const router = express.Router();

const controller = require("../../controller/frontend/notificationController");
const validation = require("../../validation/frontend/notificationValidation");

router.get(
  "/",
  controller.getAllNotifications
);

router.get(
  "/:id",
  controller.getNotificationById
);

router.post(
  "/",
  validation.createNotification,
  controller.createNotification
);

router.put(
  "/:id",
  validation.updateNotification,
  controller.updateNotification
);

router.delete(
  "/:id",
  controller.deleteNotification
);

module.exports = router;