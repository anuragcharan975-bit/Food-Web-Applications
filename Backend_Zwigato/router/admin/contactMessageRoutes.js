const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/contactMessageController");
const validation = require("../../validation/admin/contactValidation");

// GET ALL CONTACT MESSAGES
router.get(  "/view",  controller.getAllContactMessages);
// GET CONTACT MESSAGE BY ID
router.get(  "/viewall:id",  controller.getContactMessageById);

// UPDATE CONTACT MESSAGE
router.put(  "/update:id",  validation.updateContact,  controller.updateContactMessage);

// DELETE CONTACT MESSAGE
router.delete(  "/delete:id",  controller.deleteContactMessage);

module.exports = router;