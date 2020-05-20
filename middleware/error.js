const CustomErrorResponse = require("../utils/customErrorResponse");

const errorHandler = (err, req, res, next) => {
  //    copy of err object
  let error = { ...err };
  error.message = err.message;

  //  Log to console for developers
  //    console.log(err.stack.red);
  console.log(err);

  //  name of the error
  //    console.log(err.name);

  //    mongoose bad Object id
  if (err.name === "CastError") {
    const message = `Blog not found with given id ${err.value}`;
    error = new CustomErrorResponse(message, 404);
  }
  //  mongoose duplictae key error -> code is 11000
  if (err.code === 11000) {
    const message = "Blog already exists please create a new one";
    // 400 -> bad request
    error = new CustomErrorResponse(message, 400);
  }

  //    mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new CustomErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
