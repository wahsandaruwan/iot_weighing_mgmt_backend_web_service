// ----------Custom libraries and modules----------
const { UserTokenModel } = require("../models");
const { GenerateTokens, VerifyTokens } = require("../helpers");

// ----------Conroller function to generate new access token----------
const GenerateAccessToken = async (req, res) => {
  // Request body
  const { refreshToken } = req.body;

  try {
    // Check if refresh token doesn't exists
    const userToken = await UserTokenModel.findOne({
      token: refreshToken,
    }).exec();
    if (!userToken) {
      return res.status(400).json({
        status: false,
        refreshToken: null,
        error: {
          message: "Refresh token doesn't exists!",
        },
      });
    }

    // Verify refresh token
    const verfiedToken = VerifyTokens(refreshToken, "refresh");
    if (!verfiedToken.status) {
      return res.status(400).json({
        status: false,
        refreshToken: null,
        error: {
          message: "Invalid refresh token!",
        },
      });
    }

    // Generate a new access token
    const generatedTokens = GenerateTokens({
      _id: verfiedToken.tokenDetails.id,
      userType: verfiedToken.tokenDetails.userType,
    });
    if (generatedTokens.status) {
      return res.status(201).json({
        status: true,
        accessToken: generatedTokens.accessToken,
        success: {
          message: "Successfully created a new access token!",
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to generate a new access token!",
      },
    });
  }
};

// ----------Conroller function to delete the refresh token----------
const DeleteRefreshToken = async (req, res) => {
  // Request body
  const { refreshToken } = req.body;

  try {
    // Check if refresh token doesn't exists
    const userToken = await UserTokenModel.findOne({
      token: refreshToken,
    }).exec();
    if (!userToken) {
      return res.status(400).json({
        status: false,
        refreshToken: null,
        error: {
          message: "Refresh token doesn't exists!",
        },
      });
    }

    // Delete the token record
    await userToken.deleteOne({ token: refreshToken });

    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully logged out the user!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the refresh token!",
      },
    });
  }
};

// ----------Conroller function to get loggged in user information by the access token----------
const GetUserInfoByToken = (req, res) => {
  // Request
  const { user } = req;

  if (!user) {
    return res.status(401).json({
      status: false,
      error: {
        message: "Invalid access token!",
      },
    });
  }

  return res.status(200).json({
    status: true,
    user: { id: user.id, userType: user.userType },
    success: {
      message: "Successfully fetched the logged in user information!",
    },
  });
};

module.exports = {
  GenerateAccessToken,
  DeleteRefreshToken,
  GetUserInfoByToken,
};
