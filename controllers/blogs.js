const Blog = require("../models/Blog");
const CustomErrorResponse = require("../utils/customErrorResponse");

//@desc     GET all blogs
//@route    GET /api/v1/blogs
//@acess    Public
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res
      .status(200)
      .json({ success: true, count: blogs.length, data: blogs, meta_data: [] });
  } catch (error) {
    res.status(400).json({ success: false, data: [], meta_data: [] });
  }
};

//@desc     GET single blog
//@route    GET /api/v1/blogs/:id
//@acess    Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    //blog with given id does not exist but id is correctly formatted
    if (!blog) {
      return new CustomErrorResponse(
        `Blog not found with id of ${req.params.id}`,
        404
      );
    }
    res.status(200).json({ success: true, data: blog, meta_data: [] });
  } catch (error) {
    //error occurs by a not correctly formated id
    //  res.status(400).json({ success: false, data: {}, meta_data: [] });
    next(error);
  }
};

//@desc     CREATE a blog
//@route    POST /api/v1/blogs/:id
//@acess    Private -> auth required
exports.createBlog = async (req, res, next) => {
  //try catch bei fehlern der mongo validation -> required wurde nicht beachtet
  try {
    const blog = await Blog.create(req.body);

    //  201-> ressource created
    res.status(201).json({ success: true, data: blog, meta_data: [] });
  } catch (error) {
    //400 bad request
    res.status(400).json({ success: false, data: {}, meta_data: [] });
  }
};

//@desc     UPDATE a blog
//@route    PUT /api/v1/blogs/:id
//@acess    Private -> auth required
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      //das geupdatetet blog model (also das neue soll zurück gegebn werden)
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(400).json({ success: false, data: {}, meta_data: [] });
    }
    res.status(200).json({ success: true, data: blog, meta_data: [] });
  } catch (error) {
    res.status(400).json({ success: false, data: {}, meta_data: [] });
  }
};

//@desc     DELETE a blog
//@route    DELETE /api/v1/blogs/:id
//@acess    Private -> auth required
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(400).json({ success: false, data: {}, meta_data: [] });
    }
    res.status(200).json({ success: true, data: {}, meta_data: [] });
  } catch (error) {
    res.status(400).json({ success: false, data: {}, meta_data: [] });
  }
};
