const CustomErrorResponse = require("../utils/customErrorResponse");

const errorHandler = (err, req, res, next) => {
  //    copy of err object
  let error = { ...err };
  error.message = err.message;

  //  Log to console for developers
  console.log(err.stack.red);

  //  name of the error
  //    console.log(err.name);

  //    mongoose bad Object id
  if (err.name === "CastError") {
    const message = `Bootcamp not found with given id ${err.value}`;
    error = new CustomErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
