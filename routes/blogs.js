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
const reviewsRouter = require("./reviews");

const router = express.Router();

const { protectRoute } = require("../middleware/protectRoute");
const { checkRoles } = require("../middleware/checkRoles");

//re-route into other resource routers
router.use("/:blogId/posts", postsRouter);
router.use("/:blogId/reviews", reviewsRouter);

// route '/' is mapped to /api/v1/blogs in server.js
router
  .route("/")
  .get(filteringResults(Blog, "posts"), getBlogs)
  .post(protectRoute, checkRoles("blogger"), createBlog);

// route '/:id' is mapped to /api/v1/blogs/:id in server.js
router
  .route("/:id")
  .get(getBlog)
  .put(protectRoute, checkRoles("blogger"), updateBlog)
  .delete(protectRoute, checkRoles("blogger"), deleteBlog);

router
  .route("/:id/photo")
  .put(protectRoute, checkRoles("blogger"), blogPhotoUpload);
module.exports = router;
