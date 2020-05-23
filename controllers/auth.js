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
  //const token = user.getSignedToken();

  //res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

//@desc     POST login a user
//@route    POST /api/v1/auth/login
//@acess    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email && !password) {
    return next(
      new CustomErrorResponse(`Please enter email and passowrd`, 400)
    );
  }

  //check if user with the given email exists
  //+passwort -> password appears in result set and can be validated
  const user = await User.findOne({ email }).select("+password");

  console.log("user: ", user);

  //if user does not exists -> 401 unauthorized
  if (!user) {
    console.log("inside if");
    return next(new CustomErrorResponse(`wrong email and password`, 401));
  }

  //check if transmitted password is the same password from the db
  //RESPONSE: true/false
  const passwordMatch = await user.matchPassword(password);

  if (!passwordMatch) {
    return next(new CustomErrorResponse(`wrong email and password`, 401));
  }

  //get a signed jwt token for a user
  //const token = user.getSignedToken();

  //res.status(200).json({ success: true, token });

  sendTokenResponse(user, 200, res);
});

//get token from mode, create cookie ans send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

//@desc     GET current logged in user
//@route    GET /api/v1/auth/current_user
//@acess    Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     PUT update user
//@route    PUT /api/v1/auth/update_user
//@acess    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updateFields = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     PUT update user
//@route    PUT /api/v1/auth/update_password
//@acess    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const matchpw = await user.matchPassword(req.body.currentPassword);

  // check current password
  if (!matchpw) {
    return next(new CustomErrorResponse(`Password is incorrect`, 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
