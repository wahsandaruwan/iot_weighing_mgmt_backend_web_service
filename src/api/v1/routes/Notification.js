// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const { SendNotification } = require("../controllers");

// Initialize the router
const router = express.Router();

// Add weighing data
router.get(
  "/send-notification",
  SendNotification
);

module.exports = router;
