const path = require("path");
const Blog = require("../models/Blog");
const CustomErrorResponse = require("../utils/customErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     GET all blogs
//@route    GET /api/v1/blogs
//@acess    Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.filteredResults);
});

//@desc     GET single blog
//@route    GET /api/v1/blogs/:id
//@acess    Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  //blog with given id does not exist but id is correctly formatted
  if (!blog) {
    return new CustomErrorResponse(
      `Blog not found with id of ${req.params.id}`,
      404
    );
  }
  res.status(200).json({ success: true, data: blog, meta_data: [] });
});

//@desc     CREATE a blog
//@route    POST /api/v1/blogs/:id
//@acess    Private -> auth required
exports.createBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.create(req.body);

  //  201-> ressource created
  res.status(201).json({ success: true, data: blog, meta_data: [] });
});

//@desc     UPDATE a blog
//@route    PUT /api/v1/blogs/:id
//@acess    Private -> auth required
exports.updateBlog = async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    //return new updated model instance
    new: true,
    runValidators: true,
  });
  if (!blog) {
    return new CustomErrorResponse(
      `Blog not found with id of ${req.params.id}`,
      404
    );
  }
  res.status(200).json({ success: true, data: blog, meta_data: [] });
};

//@desc     DELETE a blog
//@route    DELETE /api/v1/blogs/:id
//@acess    Private -> auth required
//try catch -> to show asyncHandler refactor
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(
        new CustomErrorResponse(
          `Blog not found with id of ${req.params.id}`,
          404
        )
      );
    }

    blog.remove();

    res.status(200).json({ success: true, data: {}, meta_data: [] });
  } catch (error) {
    next(error);
  }
};

//@desc     upload photo for a blog
//@route    PUT /api/v1/blogs/:id/photo
//@acess    Private -> auth required
exports.blogPhotoUpload = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return new CustomErrorResponse(
      `Blog not found with id of ${req.params.id}`,
      404
    );
  }

  if (!req.files) {
    return next(new CustomErrorResponse(`Please upload a photo`, 400));
  }

  // console.log(req.files);
  const file = req.files.file;

  //Make sure file is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new CustomErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new CustomErrorResponse(
        `Please upload an image with a size less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create custom filename so users dont overrite it
  // ${path.parse(file.name).ext} -> extract file extension from uploaded file
  file.name = `photo_${blog._id}${path.parse(file.name).ext}`;
  // console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new CustomErrorResponse(`Problme with photo upload`, 500));
    }

    await Blog.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
