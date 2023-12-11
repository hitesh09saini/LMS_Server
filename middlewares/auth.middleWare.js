require('dotenv').config({
    path: '../.env'
});
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const AppError = require("../utils/error.utils");

const authorizedRoles = (...roles) => asyncHandler(async (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have permission to view this route", 403)
    );
  }

  next();
});

module.exports = authorizedRoles;