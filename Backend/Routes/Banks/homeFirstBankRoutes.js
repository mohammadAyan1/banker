const express = require("express");
const router = express.Router();
const homeFirstBank = require("../../controllers/Banks/homeFirstBankCtrl");
const { protect } = require("../../middleware/authMiddleware");

// Create a new valuation report
router.post("/", homeFirstBank.createValuationReport);

// Get all valuation reports
router.get("/", homeFirstBank.getAllValuationReports);

router.put("/unassign/:id", homeFirstBank.unassignFieldOfficer);

router.put("/remove-image/:id", homeFirstBank.deleteImageFromValuationReport);

// Get a single valuation report by ID
router.get("/:id", homeFirstBank.getValuationReportById);

router.put("/:id", protect, homeFirstBank.updateValuationReportById);

module.exports = router;




// api/first-bank
