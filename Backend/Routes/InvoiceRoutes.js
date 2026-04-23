const express = require("express");
const router = express.Router();
const { saveInvoice, getAllInvoices, deleteInvoice } = require("../controllers/InvoiceCtrl");
const { protect } = require("../middleware/authMiddleware");

router.post("/save", protect, saveInvoice);
router.get("/", protect, getAllInvoices);
router.delete("/:id", protect, deleteInvoice);

module.exports = router;
