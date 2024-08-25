const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require('../middlewares/isAuth');
const { isAuthorReview } = require("../middlewares/isAuthor");
const ReviewController = require("../controllers/reviews");
const { validateReview } = require("../middlewares/validator");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(ReviewController.store)
);

router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(ReviewController.destroy)
);

module.exports = router;
