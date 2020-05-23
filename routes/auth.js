const express = require("express");
const {
  registerUser,
  login,
  getCurrentUser,
  updateUser,
  updatePassword,
} = require("../controllers/auth");

const router = express.Router();
const { protectRoute } = require("../middleware/protectRoute");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/current_user", protectRoute, getCurrentUser);
router.put("/update_user", protectRoute, updateUser);
router.put("/update_password", protectRoute, updatePassword);

module.exports = router;
