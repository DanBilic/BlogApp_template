//@desc     GET all blogs
//@route    GET /api/v1/blogs
//@acess    Public
exports.getBlogs = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all Blogs" });
};

//@desc     GET single blog
//@route    GET /api/v1/blogs/:id
//@acess    Public
exports.getBlog = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `get a Blog with id: ${req.params.id}` });
};

//@desc     CREATE a blog
//@route    POST /api/v1/blogs/:id
//@acess    Private -> auth required
exports.createBlog = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new Blog" });
};

//@desc     UPDATE a blog
//@route    PUT /api/v1/blogs/:id
//@acess    Private -> auth required
exports.updateBlog = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update a Blog with id: ${req.params.id}` });
};

//@desc     DELETE a blog
//@route    DELETE /api/v1/blogs/:id
//@acess    Private -> auth required
exports.deleteBlog = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete a Blog with id: ${req.params.id}` });
};
