// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  Createitem,
  GetAllitems,
  GetitemsByUserId,
  Updateitem,
  Deleteitem,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middlewares");

// Initialize the router
const router = express.Router();

// Add machine
router.post(
  "/add-item",
  AuthenticateUser,
  // AuthorizeUser(["admin", "member"]),
  Createitem
);

// Update machine
router.put("/update-item/:itemId", AuthenticateUser, Updateitem);

// Delete machine
router.delete("/delete-item/:itemId", AuthenticateUser, Deleteitem);

// Get user by id
router.get("/get-all-items", AuthenticateUser, GetAllitems);
router.get("/get-items-user-id", AuthenticateUser, GetitemsByUserId);

module.exports = router;
