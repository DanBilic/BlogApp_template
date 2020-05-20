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

router
  .route("/")
  .get(
    filteringResults(Post, {
      path: "blog",
      select: "name description",
    }),
    getPosts
  )
  .post(addPost);
router.route("/:id").get(getPost).put(updatePost).delete(deletePost);

module.exports = router;
