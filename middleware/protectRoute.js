const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const CustomErrorResponse = require("../utils/customErrorResponse");
const User = require("../models/User");

// Protect routes
exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    // check if Bearer token is tin the authorization header
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    // token is set in the cookies -> so no need for authorization header with Bearer token
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    // 401-> not authorized
    return next(
      new CustomErrorResponse("Not authorized to access this route!", 401)
    );
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded token: ", decoded);

    // decoded contains an id which is the user id
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new CustomErrorResponse("Not authorized to access this route!", 401)
    );
  }
});
