// ----------Custom libraries and modules----------
const mongoose = require("mongoose");

const { WeighingDeviceModel, UserModel } = require("../models");
const { SendEmail } = require("../helpers");

// ----------Conroller function to added new weighing data----------
const SendNotification = async (req, res) => {
  // Request body
  const { battery_percentage, battery_voltage, total_weight, item_count, id } =
    req.query;

  // Ensure values are not less than 0
  const sanitizedBatteryPercentage = Math.max(
    0,
    parseFloat(battery_percentage) || 0
  );
  const sanitizedBatteryVoltage = Math.max(0, parseFloat(battery_voltage) || 0);
  const sanitizedTotalWeight = Math.max(0, parseFloat(total_weight) || 0);
  const sanitizedItemCount = Math.max(0, parseInt(item_count) || 0);

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

    const userData = await WeighingDeviceModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          "userDetails.fullName": 1,
          "userDetails.emailAddress": 1,
          "userDetails.phoneNumber": 1,
        },
      },
    ]);

    const adminUsers = await UserModel.find({ userType: "admin" });

    const recipients = [
      ...userData.map((item) => {
        const userDetails = item.userDetails[0];
        return {
          name: userDetails.fullName || "",
          email: userDetails.emailAddress || "",
        };
      }),
      ...adminUsers.map((adminUser) => ({
        name: adminUser.fullName || "",
        email: adminUser.emailAddress || "",
      })),
    ];

    const data = `Device Battery Percentage is ${sanitizedBatteryPercentage} <br/> Device Battery Voltage is ${sanitizedBatteryVoltage} <br/> Device Total Weight is ${sanitizedTotalWeight} <br/> Device Item Count is ${sanitizedItemCount} <br/>`;

    const result = await SendEmail({
      recipients,
      subject: `Details about the ${id}`,
      htmlContent: data,
    });

    if (result.status != "success") {
      return res.status(500).json({
        status: false,
        error: {
          message: "Internal Server Error. Please try again later",
        },
      });
    }
    return res.status(200).send({
      status: true,
      success: {
        message: "Successfully sent emails!",
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

module.exports = {
  SendNotification,
};
