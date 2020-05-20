const Post = require("../models/Post");
const Blog = require("../models/Blog");
const CustomErrorResponse = require("../utils/customErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     GET posts
//@route    GET /api/v1/posts
//@route    GET /api/v1/blogs/:blogId/posts
//@acess    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.blogId) {
    query = Post.find({ blog: req.params.blogId });
  } else {
    query = Post.find().populate({
      path: "blog",
      select: "name description",
    });
  }

  const posts = await query;

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

//@desc     GET single post
//@route    GET /api/v1/posts/:id
//@acess    Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: "blog",
    select: "name description",
  });

  if (!post) {
    return next(
      new CustomErrorResponse(`No post with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

//@desc     Add course
//@route    POST /api/v1/blogs/:blogId/posts
//@acess    Private
exports.addPost = asyncHandler(async (req, res, next) => {
  req.body.blog = req.params.blogId;

  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return next(
      new CustomErrorResponse(`No blog with the id of ${req.params.blogId}`),
      404
    );
  }

  const post = await Post.create(req.body);

  res.status(200).json({
    success: true,
    data: post,
  });
});
