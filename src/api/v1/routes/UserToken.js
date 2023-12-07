// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  GenerateAccessToken,
  DeleteRefreshToken,
  GetUserInfoByToken,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Generate access token
router.post("/access/generate", GenerateAccessToken);

// Delete refresh token
router.delete("/refresh/delete", DeleteRefreshToken);

// Get logged in user information by the token
router.get(
  "/",
  AuthenticateUser,
  AuthorizeUser(["member", "manager"]),
  GetUserInfoByToken
);

module.exports = router;
