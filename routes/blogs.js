const express = require("express");
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs");
const router = express.Router();

// route '/' is mapped to /api/v1/blogs in server.js
router.route("/").get(getBlogs).post(createBlog);

// route '/:id' is mapped to /api/v1/blogs/:id in server.js
router.route("/:id").get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
