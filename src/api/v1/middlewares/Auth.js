// ----------Custom libraries & modules----------
const { VerifyTokens } = require("../helpers");

// ----------Function to authenticate the user----------
const AuthenticateUser = (req, res, next) => {
  // Token header
  const tokenHeader = req.headers.token;

  try {
    // Validate the token header
    if (tokenHeader) {
      const accessToken = tokenHeader.split("Bearer ")[1];
      if (accessToken) {
        // Verify access token
        const verifiedToken = VerifyTokens(accessToken, "access");
        if (!verifiedToken.status) {
          return res.status(401).json({
            status: false,
            error: {
              message: "Invalid access token!",
            },
          });
        }

        // Add user to the request
        req.user = verifiedToken.tokenDetails;
        return next();
      }

      return res.status(401).json({
        status: false,
        error: {
          message: "Access token must be properly provided!",
        },
      });
    }

    return res.status(401).json({
      status: false,
      error: {
        message: "Token header must be provided!",
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to authenticate the user!",
      },
    });
  }
};

// ----------Function to authorize the user----------
const AuthorizeUser = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.userType;
    try {
      if (roles.includes(userRole)) {
        return next();
      }
      return res.status(401).json({
        status: false,
        error: {
          message: "Permission denied to access this resource!",
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        error: {
          message: "Failed to authorize the user!",
        },
      });
    }
  };
};

module.exports = { AuthenticateUser, AuthorizeUser };
