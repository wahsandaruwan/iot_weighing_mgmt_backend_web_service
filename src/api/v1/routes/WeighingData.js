// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateWeighingData,
  UpdateWeighingData,
  DeleteWeighingData,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Add weighing data
router.get(
  "/add-data",
  // AuthenticateUser,
  // AuthorizeUser(["admin", "member"]),
  CreateWeighingData
);

// Update weighing data
router.put(
  "/update-data/:weighingDataId",
  AuthenticateUser,
  UpdateWeighingData
);

// Delete weighing data
router.delete(
  "/delete-device/:weighingDataId",
  AuthenticateUser,
  DeleteWeighingData
);

module.exports = router;
