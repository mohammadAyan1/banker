const express = require("express");
const router = express.Router();
const {
  createIciciBank,
  getAllIciciBanks,
  getIciciBankById,
  updateIciciBank,
} = require("../../controllers/Banks/iciciBankController");

router.post("/", createIciciBank); // Create

router.get("/", getAllIciciBanks); // Get all

router.get("/:id", getIciciBankById); // Get by ID

router.put("/:id", updateIciciBank); // Update

module.exports = router;
