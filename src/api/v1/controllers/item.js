// ----------Custom libraries and modules----------
const { itemModel } = require("../models");

// ----------Conroller function to added new item----------
const Createitem = async (req, res) => {
  // Request body
  const {
    title,
    imageUrl,
    weight,
    dateCreated,
    timeCreated,
    dateUpdated,
    timeUpdated,
  } = req.body;
  const { userId } = req.user;

  try {
    // Check if key already exist
    const item = await itemModel
      .findOne({
        $or: [{ title }],
      })
      .exec();
    if (item) {
      return res.status(400).json({
        status: false,
        error: {
          message: "item already exist!",
        },
      });
    }

    // New item
    const newitem = new itemModel({
      title,
      imageUrl,
      weight,
      dateCreated,
      timeCreated,
      dateUpdated,
      timeUpdated,
      userId,
    });

    // Save new item to the database
    const saveditem = await newitem.save();

    return res.status(201).json({
      status: true,
      item: saveditem,
      success: {
        message: "Successfully added a new item!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to add a new item!",
      },
    });
  }
};

// ----------Conroller function to get all items----------
const GetAllitems = async (req, res) => {
  try {
    const item = await itemModel.find().exec();
    return res.status(200).json({
      status: true,
      item,
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

// ----------Conroller function to get item by id----------
const GetitemsByUserId = async (req, res) => {
  // Request parameters
  const { userId } = req.user;

  try {
    const items = await itemModel
      .find({
        userId: userId,
      })
      .exec();
    return res.status(200).json({
      status: true,
      items,
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

// ----------Conroller function to update item by id----------
const Updateitem = async (req, res) => {
  // Request parameters
  const { itemId } = req.params;
  try {
    const item = await itemModel
      .findOne({
        _id: itemId,
      })
      .exec();
    if (!item) {
      return res.status(404).json({
        status: true,
        error: { message: "item not found" },
      });
    }
    const updateitem = await itemModel.findOneAndUpdate(
      { _id: itemId },
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );
    return res.status(200).json({
      status: true,
      updateitem,
      success: {
        message: "Successfully updated the item!",
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the item!",
      },
    });
  }
};

// ----------Conroller function to delete item by id----------
const Deleteitem = async (req, res) => {
  // Request parameters
  const { itemId } = req.params;
  try {
    const item = await itemModel
      .findOne({
        _id: itemId,
      })
      .exec();
    if (!item) {
      return res.status(404).json({
        status: true,
        error: { message: "item not found" },
      });
    }
    const deleteitem = await itemModel
      .findOneAndDelete({
        _id: itemId,
      })
      .exec();
    return res.status(200).json({
      status: true,
      success: {
        message: "item successfully deleted",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the item!",
      },
    });
  }
};

module.exports = {
  Createitem,
  GetAllitems,
  GetitemsByUserId,
  Updateitem,
  Deleteitem,
};
