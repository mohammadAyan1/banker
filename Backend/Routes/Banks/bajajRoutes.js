const express = require("express");
const router = express.Router();
const valuationReportController = require("../../controllers/Banks/bajajCtrl");

// Create a new valuation report
router.post("/", valuationReportController.createValuationReport);

// Get all valuation reports
router.get("/", valuationReportController.getAllValuationReports);

// Get a single valuation report by ID
router.get("/:id", valuationReportController.getValuationReportById);

// Update a valuation report by ID
router.put("/:id", valuationReportController.updateValuationReport);

// Delete a valuation report by ID
router.delete("/:id", valuationReportController.deleteValuationReport);

module.exports = router;
