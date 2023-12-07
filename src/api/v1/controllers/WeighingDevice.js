// ----------Custom libraries and modules----------
const mongoose = require("mongoose");
const { WeighingDeviceModel } = require("../models");

// ----------Conroller function to added new WeighingDevice----------
const CreateWeighingDevice = async (req, res) => {
  // Request body
  const {
    key,
    title,
    imageUrl,
    assignedItem,
    dateCreated,
    timeCreated,
    dateUpdated,
    timeUpdated,
  } = req.body;
  const { userId } = req.user;

  try {
    // Check if email or phone number already exist
    const WeighingDevice = await WeighingDeviceModel.findOne({
      $or: [{ key }],
    }).exec();
    if (WeighingDevice) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Weighing device key already exist!",
        },
      });
    }

    // New WeighingDevice
    const newWeighingDevice = new WeighingDeviceModel({
      key,
      title,
      imageUrl,
      assignedItem,
      dateCreated,
      timeCreated,
      dateUpdated,
      timeUpdated,
      userId,
    });

    // Save new WeighingDevice to the database
    const savedWeighingDevice = await newWeighingDevice.save();

    return res.status(201).json({
      status: true,
      WeighingDevice: savedWeighingDevice,
      success: {
        message: "Successfully added a new weighing device!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to add a new weighing device!",
      },
    });
  }
};

// ----------Conroller function to get all WeighingDevices----------
const GetAllWeighingDevicesDetails = async (req, res) => {
  try {
    // const WeighingDevice = await WeighingDeviceModel.find().exec();

    const WeighingDevice = await WeighingDeviceModel.aggregate([
      {
        $lookup: {
          from: "items", // The name of the collection (Assuming it's named 'items')
          localField: "assignedItem",
          foreignField: "_id", // Assuming 'assignedItem' is the ID referencing an item
          as: "itemDetails",
        },
      },
      {
        $project: {
          _id: 1, // Exclude the default _id field

          title: 1, // Include the title field from WeighingDevice
          imageUrl: 1, // Include the imageUrl field from WeighingDevice
          userId: 1, // Include the userId field from WeighingDevice
          "itemDetails.title": 1, // Include the title field from Item
          "itemDetails.imageUrl": 1, // Include the imageUrl field from Item
          "itemDetails.weight": 1, // Include the weight field from Item
          // Add or remove fields as needed
        },
      },
    ]).exec();

    return res.status(200).json({
      status: true,
      WeighingDevice,
      success: {
        message: "Successfully fetched the weighing devices!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the weighing devices!",
      },
    });
  }
};

// ----------Conroller function to get weighing device by id----------
const GetWeighingDeviceDetailsById = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  // console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(deviceId));

  try {
    const weighingDeviceData = await WeighingDeviceModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(deviceId),
        },
      },
      {
        $lookup: {
          from: "items", // The name of the collection (Assuming it's named 'weighingdata')
          localField: "assignedItem",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $project: {
          _id: 1, // Exclude the default _id field
          title: 1, // Include the title field from WeighingDevice
          imageUrl: 1, // Include the imageUrl field from WeighingDevice
          userId: 1, // Include the userId field from WeighingDevice
          "itemDetails.title": 1, // Include the title field from Item
          "itemDetails.imageUrl": 1, // Include the imageUrl field from Item
          "itemDetails.weight": 1, // Include the weight field from Item
          // Add or remove fields as needed
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      weighingDeviceData,
      success: {
        message: "Successfully fetched the weighing devices!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the weighing devices!",
      },
    });
  }
};

// ----------Conroller function to get weighing device by id----------
const GetWeighingDevicesDataById = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  // console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(deviceId));

  try {
    const weighingDeviceData = await WeighingDeviceModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(deviceId),
        },
      },
      {
        $lookup: {
          from: "weighingdatas", // The name of the collection (Assuming it's named 'weighingdata')
          localField: "_id",
          foreignField: "weighingDeviceId",
          as: "deviceData",
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      weighingDeviceData,
      success: {
        message: "Successfully fetched the weighing devices!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the weighing devices!",
      },
    });
  }
};

// ----------Conroller function to get weighing device by id----------
const GetWeighingDevicesRecentDataById = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  // console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(deviceId));

  try {
    const weighingDeviceData = await WeighingDeviceModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(deviceId),
        },
      },
      {
        $lookup: {
          from: "weighingdatas", // The name of the collection (Assuming it's named 'weighingdata')
          localField: "_id",
          foreignField: "weighingDeviceId",
          as: "deviceData",
        },
      },
      {
        $unwind: "$deviceData", // Unwind to separate documents for each entry in deviceData array
      },
      {
        $sort: {
          "deviceData.createdAt": -1, // Sort by createdAt in descending order
        },
      },
      {
        $limit: 1, // Limit to the most recent document
      },
    ]);
    return res.status(200).json({
      status: true,
      weighingDeviceData,
      success: {
        message: "Successfully fetched the weighing devices!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the weighing devices!",
      },
    });
  }
};

// ----------Conroller function to update weighing device by id----------
const UpdateWeighingDevice = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;

  try {
    const WeighingDevice = await WeighingDeviceModel.findOne({
      _id: deviceId,
    }).exec();
    if (!WeighingDevice) {
      return res.status(404).json({
        status: true,
        error: { message: "Weighing device not found" },
      });
    }
    const updateWeighingDevice = await WeighingDeviceModel.findOneAndUpdate(
      { _id: WeighingDevice._id },
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );

    return res.status(200).json({
      status: true,
      updateWeighingDevice,
      success: {
        message: "Successfully updated the weighing device!",
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the weighing device!",
      },
    });
  }
};

// ----------Conroller function to delete weighing device by id----------
const DeleteWeighingDevice = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  try {
    const WeighingDevice = await WeighingDeviceModel.findOne({
      _id: deviceId,
    }).exec();
    if (!WeighingDevice) {
      return res.status(404).json({
        status: true,
        error: { message: "Weighing device not found" },
      });
    }
    const deleteWeighingDevice = await WeighingDeviceModel.findOneAndDelete({
      _id: deviceId,
    }).exec();
    return res.status(200).json({
      status: true,
      success: {
        message: "Weighing device successfully deleted",
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
  CreateWeighingDevice,
  GetAllWeighingDevicesDetails,
  GetWeighingDevicesDataById,
  UpdateWeighingDevice,
  DeleteWeighingDevice,
  GetWeighingDeviceDetailsById,
  GetWeighingDevicesRecentDataById,
};
