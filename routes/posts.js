const express = require("express");
const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");
const router = express.Router({ mergeParams: true });

const Post = require("../models/Post");
const filteringResults = require("../middleware/filteringResults");
const { protectRoute } = require("../middleware/protectRoute");
const { checkRoles } = require("../middleware/checkRoles");

router
  .route("/")
  .get(
    filteringResults(Post, {
      path: "blog",
      select: "name description",
    }),
    getPosts
  )
  .post(protectRoute, checkRoles("blogger"), addPost);
router
  .route("/:id")
  .get(getPost)
  .put(protectRoute, checkRoles("blogger"), updatePost)
  .delete(protectRoute, checkRoles("blogger"), deletePost);

module.exports = router;
