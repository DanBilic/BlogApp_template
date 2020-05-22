const express = require("express");
const { registerUser, login, getCurrentUser } = require("../controllers/auth");

const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/current_user", protectRoute, getCurrentUser);

module.exports = router;
