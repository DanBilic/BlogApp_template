const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

const Review = require("../models/Review");
const filteringResults = require("../middleware/filteringResults");
const { protectRoute } = require("../middleware/protectRoute");
// const { checkRoles } = require("../middleware/checkRoles");

router
  .route("/")
  .get(
    filteringResults(Review, {
      path: "blog",
      select: "name description",
    }),
    getReviews
  )
  .post(protectRoute, addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protectRoute, updateReview)
  .delete(protectRoute, deleteReview);

module.exports = router;
