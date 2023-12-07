// ----------Third-party libraries & modules----------
const mongoose = require("mongoose");

// ----------User token schema----------
const UserTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400000,
  },
});

module.exports = mongoose.model("UserToken", UserTokenSchema);
