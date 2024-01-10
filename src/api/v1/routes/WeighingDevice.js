// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateWeighingDevice,
  GetAllWeighingDevicesDetails,
  GetWeighingDevicesDataById,
  GetWeighingDeviceDetailsById,
  GetWeighingDevicesRecentDataById,
  UpdateWeighingDevice,
  DeleteWeighingDevice,
  GetAllDeviceDetails,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Add machine
router.post(
  "/add-device",
  // AuthenticateUser,
  // AuthorizeUser(["admin", "member"]),
  CreateWeighingDevice
);

// Update machine
router.put("/update-device/:deviceId", AuthenticateUser, UpdateWeighingDevice);

// Delete machine
router.delete(
  "/delete-device/:deviceId",
  AuthenticateUser,
  DeleteWeighingDevice
);

// Get user by id
router.get("/item_details/all", AuthenticateUser, GetAllWeighingDevicesDetails);
router.get("/item_details/one/:deviceId", GetWeighingDeviceDetailsById);
router.get("/all/", AuthenticateUser, GetAllDeviceDetails);
router.get("/all/:deviceId", GetWeighingDevicesDataById);
router.get("/one/:deviceId", GetWeighingDevicesRecentDataById);

module.exports = router;
