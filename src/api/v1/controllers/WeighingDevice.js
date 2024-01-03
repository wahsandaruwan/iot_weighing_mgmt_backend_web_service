// ----------Custom libraries and modules----------
const mongoose = require("mongoose");
const { WeighingDeviceModel } = require("../models");

// ----------Conroller function to added new WeighingDevice----------
const CreateWeighingDevice = async (req, res) => {
  // Request body
  const {
    title,
    imageUrl,
    assignedItem,
    userId,
    dateCreated,
    timeCreated,
    dateUpdated,
    timeUpdated,
  } = req.body;

  try {
    // New WeighingDevice
    const newWeighingDevice = new WeighingDeviceModel({
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
  const { userId } = req.user;

  try {
    // const WeighingDevice = await WeighingDeviceModel.find().exec();

    const WeighingDevice = await WeighingDeviceModel.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
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

const GetAllDeviceDetails = async (req, res) => {
  try {
    // Fetch all devices from the WeighingDevices model
    const devices = await WeighingDeviceModel.find();

    return res.status(200).json({
      status: true,
      devices,
      success: {
        message: "Successfully fetched all device details!",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch device details!",
      },
    });
  }
};

// ----------Conroller function to get weighing device by id----------
const GetWeighingDeviceDetailsById = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  // console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(deviceId));

  // Check if the WeighingDevice with the specified ID exists
  const weighingDeviceExists = await WeighingDeviceModel.exists({
    _id: deviceId,
  });

  if (!weighingDeviceExists) {
    return res.status(404).json({
      status: false,
      error: {
        message: "WeighingDevice not found with the specified ID.",
      },
    });
  }

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
          dateCreated: 1,
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
// const GetWeighingDevicesDataById = async (req, res) => {
//   // Request parameters
//   const { deviceId } = req.params;
//   // console.log(mongoose.mongo.BSONPure.ObjectID.fromHexString(deviceId));

//   try {
//     // Check if the WeighingDevice with the specified ID exists
//     const weighingDeviceExists = await WeighingDeviceModel.exists({
//       _id: deviceId,
//     });

//     if (!weighingDeviceExists) {
//       return res.status(404).json({
//         status: false,
//         error: {
//           message: "WeighingDevice not found with the specified ID.",
//         },
//       });
//     }

//     const weighingDeviceData = await WeighingDeviceModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(deviceId),
//         },
//       },
//       {
//         $lookup: {
//           from: "weighingdatas", // The name of the collection (Assuming it's named 'weighingdata')
//           localField: "_id",
//           foreignField: "weighingDeviceId",
//           as: "deviceData",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           deviceData: { $reverseArray: "$deviceData" },
//           // Add other fields if needed
//         },
//       },
//     ]);
//     return res.status(200).json({
//       status: true,
//       weighingDeviceData,
//       success: {
//         message: "Successfully fetched the weighing devices!",
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: false,
//       error: {
//         message: "Failed to fetch the weighing devices!",
//       },
//     });
//   }
// };

// work for the daily datas
// const GetWeighingDevicesDataById = async (req, res) => {
//   // Request parameters
//   const { deviceId } = req.params;
//   const { period } = req.query;

//   try {
//     // Check if the WeighingDevice with the specified ID exists
//     const weighingDeviceExists = await WeighingDeviceModel.exists({
//       _id: deviceId,
//     });

//     if (!weighingDeviceExists) {
//       return res.status(404).json({
//         status: false,
//         error: {
//           message: "WeighingDevice not found with the specified ID.",
//         },
//       });
//     }

//     let aggregationPipeline = [
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(deviceId),
//         },
//       },
//       {
//         $lookup: {
//           from: "weighingdatas",
//           localField: "_id",
//           foreignField: "weighingDeviceId",
//           as: "deviceData",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1, // Include the title field from WeighingDevice
//           imageUrl: 1, // Include the imageUrl field from WeighingDevice
//           userId: 1, // Include the userId field from WeighingDevice
//           deviceData: 1,
//           // Add other fields if needed
//         },
//       },
//     ];

//     if (period === "daily") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: today,
//               $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     }

//     const weighingDeviceData = await WeighingDeviceModel.aggregate(
//       aggregationPipeline
//     );

//     return res.status(200).json({
//       status: true,
//       weighingDeviceData,
//       success: {
//         message: "Successfully fetched the weighing devices!",
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: false,
//       error: {
//         message: "Failed to fetch the weighing devices!",
//       },
//     });
//   }
// };

//give the this week all data
// const GetWeighingDevicesDataById = async (req, res) => {
//   // Request parameters
//   const { deviceId } = req.params;
//   const { period } = req.query;

//   try {
//     // Check if the WeighingDevice with the specified ID exists
//     const weighingDeviceExists = await WeighingDeviceModel.exists({
//       _id: deviceId,
//     });

//     if (!weighingDeviceExists) {
//       return res.status(404).json({
//         status: false,
//         error: {
//           message: "WeighingDevice not found with the specified ID.",
//         },
//       });
//     }

//     let aggregationPipeline = [
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(deviceId),
//         },
//       },
//       {
//         $lookup: {
//           from: "weighingdatas",
//           localField: "_id",
//           foreignField: "weighingDeviceId",
//           as: "deviceData",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           imageUrl: 1,
//           userId: 1,
//           deviceData: 1,
//           // Add other fields if needed
//         },
//       },
//     ];

//     if (period === "daily") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: today,
//               $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     } else if (period === "weekly") {
//       const startOfWeek = new Date();
//       startOfWeek.setHours(0, 0, 0, 0);
//       startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: startOfWeek,
//               $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000), // End of the current week
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     }

//     const weighingDeviceData = await WeighingDeviceModel.aggregate(
//       aggregationPipeline
//     );

//     return res.status(200).json({
//       status: true,
//       weighingDeviceData,
//       success: {
//         message: "Successfully fetched the weighing devices!",
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: false,
//       error: {
//         message: "Failed to fetch the weighing devices!",
//       },
//     });
//   }
// };

// const GetWeighingDevicesDataById = async (req, res) => {
//   // Request parameters
//   const { deviceId } = req.params;
//   const { period } = req.query;

//   try {
//     // Check if the WeighingDevice with the specified ID exists
//     const weighingDeviceExists = await WeighingDeviceModel.exists({
//       _id: deviceId,
//     });

//     if (!weighingDeviceExists) {
//       return res.status(404).json({
//         status: false,
//         error: {
//           message: "WeighingDevice not found with the specified ID.",
//         },
//       });
//     }

//     let aggregationPipeline = [
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(deviceId),
//         },
//       },
//       {
//         $lookup: {
//           from: "weighingdatas",
//           localField: "_id",
//           foreignField: "weighingDeviceId",
//           as: "deviceData",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           imageUrl: 1,
//           userId: 1,
//           deviceData: 1,
//           // Add other fields if needed
//         },
//       },
//     ];

//     if (period === "daily") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: today,
//               $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     } else if (period === "weekly") {
//       const startOfWeek = new Date();
//       startOfWeek.setHours(0, 0, 0, 0);
//       startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: startOfWeek,
//               $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000), // End of the current week
//             },
//           },
//         },
//         {
//           $sort: {
//             "deviceData.createdAt": -1,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               _id: "$_id",
//               date: {
//                 $dateToString: {
//                   format: "%Y-%m-%d",
//                   date: "$deviceData.createdAt",
//                 },
//               },
//             },
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $first: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     }

//     const weighingDeviceData = await WeighingDeviceModel.aggregate(
//       aggregationPipeline
//     );

//     return res.status(200).json({
//       status: true,
//       weighingDeviceData,
//       success: {
//         message: "Successfully fetched the weighing devices!",
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: false,
//       error: {
//         message: "Failed to fetch the weighing devices!",
//       },
//     });
//   }
// };

// work for the week
// const GetWeighingDevicesDataById = async (req, res) => {
//   // Request parameters
//   const { deviceId } = req.params;
//   const { period } = req.query;

//   try {
//     // Check if the WeighingDevice with the specified ID exists
//     const weighingDeviceExists = await WeighingDeviceModel.exists({
//       _id: deviceId,
//     });

//     if (!weighingDeviceExists) {
//       return res.status(404).json({
//         status: false,
//         error: {
//           message: "WeighingDevice not found with the specified ID.",
//         },
//       });
//     }

//     let aggregationPipeline = [
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(deviceId),
//         },
//       },
//       {
//         $lookup: {
//           from: "weighingdatas",
//           localField: "_id",
//           foreignField: "weighingDeviceId",
//           as: "deviceData",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           imageUrl: 1,
//           userId: 1,
//           deviceData: 1,
//         },
//       },
//     ];

//     if (period === "daily") {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: today,
//               $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//             // Add other fields if needed
//           },
//         }
//       );
//     } else if (period === "weekly") {
//       const startOfWeek = new Date();
//       startOfWeek.setHours(0, 0, 0, 0);
//       startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week

//       aggregationPipeline.push(
//         {
//           $unwind: "$deviceData",
//         },
//         {
//           $match: {
//             "deviceData.createdAt": {
//               $gte: startOfWeek,
//               $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000), // End of the current week
//             },
//           },
//         },
//         {
//           $sort: {
//             "deviceData.createdAt": 1,
//           },
//         },
//         {
//           $group: {
//             _id: {
//               _id: "$_id",
//               date: {
//                 $dateToString: {
//                   format: "%Y-%m-%d",
//                   date: "$deviceData.createdAt",
//                 },
//               },
//             },
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $last: "$deviceData" },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id._id",
//             title: { $first: "$title" },
//             imageUrl: { $first: "$imageUrl" },
//             userId: { $first: "$userId" },
//             deviceData: { $push: "$deviceData" },
//           },
//         }
//       );
//     }

//     const weighingDeviceData = await WeighingDeviceModel.aggregate(
//       aggregationPipeline
//     );

//     return res.status(200).json({
//       status: true,
//       weighingDeviceData,
//       success: {
//         message: "Successfully fetched the weighing devices!",
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: false,
//       error: {
//         message: "Failed to fetch the weighing devices!",
//       },
//     });
//   }
// };

const GetWeighingDevicesDataById = async (req, res) => {
  // Request parameters
  const { deviceId } = req.params;
  const { period } = req.query;

  try {
    // Check if the WeighingDevice with the specified ID exists
    const weighingDeviceExists = await WeighingDeviceModel.exists({
      _id: deviceId,
    });

    if (!weighingDeviceExists) {
      return res.status(404).json({
        status: false,
        error: {
          message: "WeighingDevice not found with the specified ID.",
        },
      });
    }

    let aggregationPipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(deviceId),
        },
      },
      {
        $lookup: {
          from: "weighingdatas",
          localField: "_id",
          foreignField: "weighingDeviceId",
          as: "deviceData",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1,
          userId: 1,
          deviceData: 1,
        },
      },
    ];

    if (period === "daily") {
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);

      // aggregationPipeline.push(
      //   {
      //     $unwind: "$deviceData",
      //   },
      //   {
      //     $match: {
      //       "deviceData.createdAt": {
      //         $gte: today,
      //         $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      //       },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       title: { $first: "$title" },
      //       imageUrl: { $first: "$imageUrl" },
      //       userId: { $first: "$userId" },
      //       deviceData: { $push: "$deviceData" },
      //     },
      //   }
      // );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      aggregationPipeline.push(
        {
          $unwind: "$deviceData",
        },
        {
          $match: {
            "deviceData.createdAt": {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $sort: {
            "deviceData.createdAt": 1,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              hour: {
                $hour: "$deviceData.createdAt",
              },
            },
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $last: "$deviceData" },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $push: "$deviceData" },
          },
        }
      );
    } else if (period === "weekly") {
      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week

      aggregationPipeline.push(
        {
          $unwind: "$deviceData",
        },
        {
          $match: {
            "deviceData.createdAt": {
              $gte: startOfWeek,
              $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000), // End of the current week
            },
          },
        },
        {
          $sort: {
            "deviceData.createdAt": 1,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$deviceData.createdAt",
                },
              },
            },
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $last: "$deviceData" },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $push: "$deviceData" },
          },
        }
      );
    } else if (period === "monthly") {
      const startOfMonth = new Date();
      startOfMonth.setHours(0, 0, 0, 0);
      startOfMonth.setDate(1); // Start of the current month

      aggregationPipeline.push(
        {
          $unwind: "$deviceData",
        },
        {
          $match: {
            "deviceData.createdAt": {
              $gte: startOfMonth,
              $lt: new Date(
                startOfMonth.getFullYear(),
                startOfMonth.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
              ), // End of the current month
            },
          },
        },
        {
          $sort: {
            "deviceData.createdAt": 1,
          },
        },
        {
          $group: {
            _id: {
              _id: "$_id",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$deviceData.createdAt",
                },
              },
            },
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $last: "$deviceData" },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            title: { $first: "$title" },
            imageUrl: { $first: "$imageUrl" },
            userId: { $first: "$userId" },
            deviceData: { $push: "$deviceData" },
          },
        }
      );
    }

    // Add a $sort stage to sort by createdAt in ascending order
    aggregationPipeline.push(
      {
        $unwind: "$deviceData",
      },
      {
        $sort: {
          "deviceData.createdAt": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          imageUrl: { $first: "$imageUrl" },
          userId: { $first: "$userId" },
          deviceData: { $push: "$deviceData" },
        },
      }
    );

    const weighingDeviceData = await WeighingDeviceModel.aggregate(
      aggregationPipeline
    );

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
    // Check if the WeighingDevice with the specified ID exists
    const weighingDeviceExists = await WeighingDeviceModel.exists({
      _id: deviceId,
    });

    if (!weighingDeviceExists) {
      return res.status(404).json({
        status: false,
        error: {
          message: "WeighingDevice not found with the specified ID.",
        },
      });
    }

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
  GetAllDeviceDetails,
  GetAllWeighingDevicesDetails,
  GetWeighingDevicesDataById,
  UpdateWeighingDevice,
  DeleteWeighingDevice,
  GetWeighingDeviceDetailsById,
  GetWeighingDevicesRecentDataById,
};
