// grant access to to routes only with specific roles
const CustomErrorResponse = require("../utils/customErrorResponse");

exports.checkRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomErrorResponse(
          `User role ${req.user.role} is not authorized to access this endpoint`,
          401
        )
      );
    }
    next();
  };
};
