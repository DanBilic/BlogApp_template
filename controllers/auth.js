const User = require("../models/User");
const CustomErrorResponse = require("../utils/customErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     POST register a user
//@route    POST /api/v1/auth/register
//@acess    Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //get a signed jwt token for a user
  const token = user.getSignedToken();

  res.status(200).json({ success: true, token });
});
