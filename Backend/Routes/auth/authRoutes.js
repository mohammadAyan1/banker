const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/authMiddleware");

const {
  register,
  login,
  currentUser,
  FetchFO,
  updateUser,
  deleteUser,
  currentUserById,
  logout,
  getAllUsers,
} = require("../../controllers/auth/authController");

router.post("/login", login);

router.post("/add-user", register);

router.get("/logout", protect, logout);

router.get("/field-officers", FetchFO); ///protect rkhna hai

router.get("/currentUser", protect, currentUser);

router.get("/users", protect, getAllUsers);

router.delete("/:id", protect, deleteUser);

router.put("/:id", protect, updateUser);

router.get("/currentUser/:id", protect, currentUserById);

module.exports = router;
