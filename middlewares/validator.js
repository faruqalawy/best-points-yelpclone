const placeSchema = require("../schemas/placeSchema"); // schemas (Joi validate)
const ErrorHandler = require("../utils/ErrorHandler");
const reviewSchema = require("../schemas/reviewSchema");

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      return next(new ErrorHandler(msg, 400));
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      return next(new ErrorHandler(msg, 400));
    } else {
      next();
    }
  };