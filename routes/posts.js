const express = require("express");
const { getPosts, getPost, addPost } = require("../controllers/posts");
const router = express.Router({ mergeParams: true });

router.route("/").get(getPosts).post(addPost);
router.route("/:id").get(getPost);

module.exports = router;
