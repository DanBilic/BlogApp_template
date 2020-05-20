const Blog = require("../models/Blog");
const CustomErrorResponse = require("../utils/customErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     GET all blogs
//@route    GET /api/v1/blogs
//@acess    Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  let query;
  console.log(req.query);

  //copy query
  const reqQuery = { ...req.query };

  //fields excluded from query
  const fieldsToExclude = ["select", "sort", "page", "limit"];

  //loop over fieldsToExclude and remove them from reqQuery
  fieldsToExclude.forEach((element) => delete reqQuery[element]);
  console.log(reqQuery);

  //query to JSON
  let queryString = JSON.stringify(reqQuery);

  //create operator (gt, gte, lt, lte...)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //posts is the virtual attribute og the blog
  query = Blog.find(JSON.parse(queryString)).populate("posts");

  //SELECT field
  //deswegen wurde das req.query objekt kopiert
  //die selct werte werden mit komma aneinandergehängt -> select=name, description
  if (req.query.select) {
    //split entfernt ',' aus einem strinf und gibt ein array zurück die die elemnte des strings enthalten die mit komma getrennt wurden
    const fields = req.query.select.split(",").join(" "); //->join fügt das array zu einem string zusammen getrennt durch das zeichen das als paramter übergeben wurde

    query = query.select(fields);
  }

  //SORT
  if (req.query.sort) {
    const sorting = req.query.sort.split(",").join(" ");
    query = query.sort(sorting);
  } else {
    // - singnalisiert abscteigen nach cretedAt sortieren und + bedeutet aufsteigen
    query = query.sort("-createdAt");
  }

  //PAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Blog.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //execute query
  const blogs = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination,
    data: blogs,
    meta_data: [],
  });
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
  //try catch bei fehlern der mongo validation -> required wurde nicht beachtet
  const blog = await Blog.create(req.body);

  //  201-> ressource created
  res.status(201).json({ success: true, data: blog, meta_data: [] });
});

//@desc     UPDATE a blog
//@route    PUT /api/v1/blogs/:id
//@acess    Private -> auth required
exports.updateBlog = async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    //das geupdatetet blog model (also das neue soll zurück gegebn werden)
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
//try catch drinnen gelassen zu demonstrationszwecken
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return new CustomErrorResponse(
        `Blog not found with id of ${req.params.id}`,
        404
      );
    }

    blog.remove();

    res.status(200).json({ success: true, data: {}, meta_data: [] });
  } catch (error) {
    next(error);
  }
};
