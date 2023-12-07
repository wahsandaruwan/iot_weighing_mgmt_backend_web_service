// ----------Third-party libraries & modules----------
const jwt = require("jsonwebtoken");

// ----------Custom libraries & modules----------
const Configs = require("../../../configs");

// ----------Function to generate access and refresh tokens----------
const GenerateTokens = (user) => {
  try {
    const payload = { userId: user._id, userType: user.userType };
    // Generate access token
    const accessToken = jwt.sign(payload, Configs.JWT_ACCESS_KEY, {
      expiresIn: "1d",
    });

    // Generate refresh token
    const refreshToken = jwt.sign(payload, Configs.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });

    return { status: true, accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    return { status: false, accessToken: null, refreshToken: null };
  }
};

// ----------Function to verify tokens----------
const VerifyTokens = (token, tokenType) => {
  try {
    let user;
    if (tokenType === "refresh") {
      // Verify the refresh token
      user = jwt.verify(token, Configs.JWT_REFRESH_KEY);
    } else {
      // Verify the access token
      user = jwt.verify(token, Configs.JWT_ACCESS_KEY);
    }

    return { status: true, tokenDetails: user };
  } catch (err) {
    console.log(err);
    return { status: false, tokenDetails: null };
  }
};

module.exports = { GenerateTokens, VerifyTokens };
