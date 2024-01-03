// ----------Custom libraries and modules----------
const { itemModel, UserModel, WeighingDeviceModel } = require("../models");

// ----------Conroller function to get summary----------
const getCounts = async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments({ userType: "customer" });
    const deviceCount = await WeighingDeviceModel.countDocuments();
    const itemCount = await itemModel.countDocuments();

    return res.status(200).json({
      status: true,
      data: { userCount, deviceCount, itemCount },
      success: {
        message: "Successfully fetched the items!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the items!",
      },
    });
  }
};

const getCustomerDeviceCount = async (req, res) => {
  try {
    const result = await UserModel.aggregate([
      {
        $match: { userType: "customer" },
      },
      {
        $lookup: {
          from: "weighingdevices", // Replace with the actual collection name for devices
          localField: "_id", // Field from the users collection
          foreignField: "userId", // Field from the devices collection
          as: "devices",
        },
      },
      {
        $addFields: {
          deviceCount: { $size: "$devices" },
        },
      },
      {
        $project: {
          _id: 1, // Include the customer id
          fullName: "$fullName", // Assuming 'fullName' is the field representing customer name, adjust accordingly
          deviceCount: 1, // Include the device count
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      data: result,
      success: {
        message: "Successfully fetched the data!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the data!",
      },
    });
  }
};

const getCountByDate = async (req, res) => {
  try {
    const currentDate = new Date(); // Current date
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 30); // Date 30 days ago

    // Get customer count day by day for the last 30 days
    const customerCounts = await UserModel.aggregate([
      {
        $match: {
          userType: "customer",
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y/%m/%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);

    // Get new device count day by day for the last 30 days
    const deviceCounts = await WeighingDeviceModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y/%m/%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          count: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      data: { customerCounts, deviceCounts },
      success: {
        message: "Successfully fetched the data!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch the data!",
      },
    });
  }
};

module.exports = {
  getCounts,
  getCustomerDeviceCount,
  getCountByDate,
};
