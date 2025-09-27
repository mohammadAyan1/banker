const express = require("express");
const router = express.Router();
const {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
} = require("../../controllers/Banks/manappuramCtrl");

// POST - Create
router.post("/create", createForm);

// GET - All
router.get("/display", getAllForms);

// GET - By ID
router.get("/display/:id", getFormById);

// PUT - Update by ID
router.put("/update/:id", updateForm);

// DELETE - By ID
router.delete("/delete/:id", deleteForm);

module.exports = router;
