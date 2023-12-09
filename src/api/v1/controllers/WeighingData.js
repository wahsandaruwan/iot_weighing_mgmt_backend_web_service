// ----------Custom libraries and modules----------
const { WeighingDataModel, WeighingDeviceModel } = require("../models");
const { convertDateFormat } = require("../helpers");

// ----------Conroller function to added new weighing data----------
const CreateWeighingData = async (req, res) => {
  // Request body
  const {
    battery_percentage,
    battery_voltage,
    total_weight,
    item_count,
    id,
    date_created,
    time_created,
  } = req.query;

  const dateCreated = convertDateFormat(date_created);

  try {
    // Check if the WeighingDevice with the specified ID exists
    const weighingDeviceExists = await WeighingDeviceModel.exists({
      _id: id,
    });

    if (!weighingDeviceExists) {
      return res.status(404).json({
        status: false,
        error: {
          message: "WeighingDevice not found with the specified ID.",
        },
      });
    }

    // New WeighingData
    const newWeighingData = new WeighingDataModel({
      batteryPercentage: battery_percentage,
      batteryVoltage: battery_voltage,
      totalWeight: total_weight,
      itemCount: item_count,
      weighingDeviceId: id,
      dateCreated,
      timeCreated: time_created,
    });

    // Save new WeighingData to the database
    const savedWeighingData = await newWeighingData.save();

    return res.status(201).json({
      status: true,
      weighingData: savedWeighingData,
      success: {
        message: "Successfully added a new weighing data!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to add a new weighing data!",
      },
    });
  }
};

// ----------Conroller function to update weighing device by id----------
const UpdateWeighingData = async (req, res) => {
  // Request parameters
  const { weighingDataId } = req.params;

  try {
    const weighingData = await WeighingDataModel.findOne({
      _id: weighingDataId,
    }).exec();
    if (!weighingData) {
      return res.status(404).json({
        status: true,
        error: { message: "Weighing data not found" },
      });
    }
    const updateWeighingData = await WeighingDataModel.findOneAndUpdate(
      { _id: weighingData._id },
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );

    return res.status(200).json({
      status: true,
      updateWeighingData,
      success: {
        message: "Successfully updated the weighing data!",
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the weighing data!",
      },
    });
  }
};

// ----------Conroller function to delete weighing device by id----------
const DeleteWeighingData = async (req, res) => {
  // Request parameters
  const { weighingDataId } = req.params;
  try {
    const weighingData = await WeighingDataModel.findOne({
      _id: weighingDataId,
    }).exec();
    if (!weighingData) {
      return res.status(404).json({
        status: true,
        error: { message: "Weighing data not found" },
      });
    }
    const deleteWeighingData = await WeighingDataModel.findOneAndDelete({
      _id: weighingDataId,
    }).exec();
    return res.status(200).json({
      status: true,
      success: {
        message: "Weighing data successfully deleted",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the weighing device!",
      },
    });
  }
};

module.exports = {
  CreateWeighingData,
  UpdateWeighingData,
  DeleteWeighingData,
};
