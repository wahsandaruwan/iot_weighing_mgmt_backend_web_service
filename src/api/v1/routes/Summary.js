// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  getCounts,
  getCustomerDeviceCount,
  getCountByDate,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Get user by id
router.get("/count", AuthenticateUser, getCounts);
router.get("/get-device-count", AuthenticateUser, getCustomerDeviceCount);
router.get("/get-customer-device-count", AuthenticateUser, getCountByDate);

module.exports = router;
