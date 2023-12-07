// ----------Third-party libraries & modules----------
const mongoose = require("mongoose");

// ----------User schema----------
const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    weight: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: String,
      required: true,
    },
    timeCreated: {
      type: String,
      required: true,
    },
    dateUpdated: {
      type: String,
      required: true,
    },
    timeUpdated: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to handle item removal
ItemSchema.post("remove", async function (doc) {
  // Find and update WeighingDevice documents where assignedItem is the deleted item
  await mongoose
    .model("WeighingDevice")
    .updateMany({ assignedItem: doc._id }, { $set: { assignedItem: 0 } });
});

module.exports = mongoose.model("Item", ItemSchema);
