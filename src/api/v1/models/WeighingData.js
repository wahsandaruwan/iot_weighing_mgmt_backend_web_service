// ----------Third-party libraries & modules----------
const mongoose = require("mongoose");

// ----------User schema----------
const WeighingDataSchema = new mongoose.Schema(
  {
    batteryPercentage: {
      type: String,
      required: true,
    },
    batteryVoltage: {
      type: String,
      required: true,
    },
    totalWeight: {
      type: String,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    weighingDeviceId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeighingData", WeighingDataSchema);

