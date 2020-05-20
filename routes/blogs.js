const express = require("express");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  blogPhotoUpload,
} = require("../controllers/blogs");

const Blog = require("../models/Blog");

//PAGINATION, SELECTION, SORTING for endpoints ... as middleware
const filteringResults = require("../middleware/filteringResults");

// Include ohter ressource routers
const postsRouter = require("./posts");

const router = express.Router();

//re-route into other resource routers
router.use("/:blogId/posts", postsRouter);

// route '/' is mapped to /api/v1/blogs in server.js
router
  .route("/")
  .get(filteringResults(Blog, "posts"), getBlogs)
  .post(createBlog);

// route '/:id' is mapped to /api/v1/blogs/:id in server.js
router.route("/:id").get(getBlog).put(updateBlog).delete(deleteBlog);

router.route("/:id/photo").put(blogPhotoUpload);
module.exports = router;
