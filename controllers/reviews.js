const Review = require("../models/Review");
const Blog = require("../models/Blog");
const CustomErrorResponse = require("../utils/customErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     GET reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1/blogs/:blogId/reviews
//@acess    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.blogId) {
    const reviews = await Review.find({ blog: req.params.blogId });

    //seperate response for posts for a blog with id -> no populate needed
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      meta_data: [
        {
          action: "get a review",
          method: "GET",
          href: "/api/v1/reviews/:reviewId",
        },
        {
          action: "update a review",
          method: "PUT",
          href: "/api/v1/reviews/:reviewId",
        },
        {
          action: "create a review",
          method: "POST",
          href: "/api/v1/reviews/:reviewId",
        },
        {
          action: "delete a review",
          method: "DELETE",
          href: "/api/v1/reviews/:reviewId",
        },
        {
          action: "get all blogs",
          method: "GET",
          href: "/api/v1/blogs",
        },
      ],
    });
  } else {
    res.status(200).json({
      ...res.filteredResults,
      meta_data: [
        {
          action: "get reviews",
          method: "GET",
          href: "/api/v1/reviews",
        },
        {
          action: "get all blogs",
          method: "GET",
          href: "/api/v1/blogs",
        },
      ],
    });
  }
});

//@desc     GET single review
//@route    GET /api/v1/reviews/:id
//@acess    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "blog",
    select: "name description",
  });

  //mongoose id is formatted correctly but does not exist in db
  if (!review) {
    return next(
      new CustomErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
    meta_data: [
      {
        action: "get reviews",
        method: "GET",
        href: "/api/v1/reviews",
      },
      {
        action: "get all blogs",
        method: "GET",
        href: "/api/v1/blogs",
      },
    ],
  });
});

//@desc     POST create review
//@route    POST POST /api/v1/blogs/:blogId/reviews
//@acess    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.blog = req.params.blogId;

  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return next(
      new CustomErrorResponse(
        `No blog with the id of ${req.params.blogId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  // 201 -> creating ressource
  res.status(201).json({
    success: true,
    data: review,
    meta_data: [
      {
        action: "get reviews",
        method: "GET",
        href: "/api/v1/reviews",
      },
      {
        action: "get all blogs",
        method: "GET",
        href: "/api/v1/blogs",
      },
    ],
  });
});

//@desc     PUT update review
//@route    PUT /api/v1/reviews/:id
//@acess    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new CustomErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // check: is current_user the owner of the review
  // review.user is a mongo _id
  if (review.user.toString() !== req.user.id) {
    return next(
      new CustomErrorResponse(
        `User with id: ${req.user.id} is not authorized to update this review`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
    meta_data: [
      {
        action: "get reviews",
        method: "GET",
        href: "/api/v1/reviews",
      },
      {
        action: "get all blogs",
        method: "GET",
        href: "/api/v1/blogs",
      },
    ],
  });
});

//@desc     DELETE update review
//@route    DELETE /api/v1/reviews/:id
//@acess    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new CustomErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // check: is current_user the owner of the review
  // review.user is a mongo _id
  if (review.user.toString() !== req.user.id) {
    return next(
      new CustomErrorResponse(
        `User with id: ${req.user.id} is not authorized to delete this review`,
        401
      )
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
    meta_data: [
      {
        action: "get reviews",
        method: "GET",
        href: "/api/v1/reviews",
      },
      {
        action: "get all blogs",
        method: "GET",
        href: "/api/v1/blogs",
      },
    ],
  });
});
