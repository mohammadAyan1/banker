const ValuationReport = require("../../model/Banks/BajajModel");

// Create a new valuation report
exports.createValuationReport = async (req, res) => {
  try {
    const report = new ValuationReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all valuation reports
exports.getAllValuationReports = async (req, res) => {
  try {
    const reports = await ValuationReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single valuation report by ID
exports.getValuationReportById = async (req, res) => {
  try {
    const report = await ValuationReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a valuation report by ID
// exports.updateValuationReport = async (req, res) => {
//   try {
//     const report = await ValuationReport.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!report) {
//       return res.status(404).json({ error: "Valuation report not found" });
//     }
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Delete a valuation report by ID
exports.updateValuationReport = async (req, res) => {
  try {
    const user = req.user; // Assuming you have user from middleware
    const updateData = { ...req.body };

    console.log(updateData);

    const report = await ValuationReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error updating valuation report:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteValuationReport = async (req, res) => {
  try {
    const report = await ValuationReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }
    res.status(204).json({ message: "Valuation report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
