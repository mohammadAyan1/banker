const HomeTrenchReport = require("../../model/Banks/homeTrenchModel");

// Create a new Home Trench Report
exports.createHomeTrenchReport = async (req, res) => {
  try {
    
    const report = new HomeTrenchReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



/// delete image
exports.deleteImageFromValuationReport = async (req, res) => {
  try {
    const { id } = req.params; // document ID
    const { imageUrl } = req.body; // URL to remove

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    console.log(imageUrl, "POIUYTREWQ")
    console.log(id, "ASDFGHJK")

    const updatedJob = await HomeTrenchReport.findByIdAndUpdate(
      id,
      { $pull: { imageUrls: imageUrl } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Image URL deleted successfully",
      updatedJob,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting image",
      error,
    });
  }
};



// Get all Home Trench Reports
exports.getAllHomeTrenchReports = async (req, res) => {
  try {
    const reports = await HomeTrenchReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Home Trench Report by ID
exports.getHomeTrenchReportById = async (req, res) => {
  try {
    const report = await HomeTrenchReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Home Trench Report by ID
exports.updateHomeTrenchReport = async (req, res) => {
  try {
    const report = await HomeTrenchReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Home Trench Report by ID
exports.deleteHomeTrenchReport = async (req, res) => {
  try {
    const report = await HomeTrenchReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res
      .status(204)
      .json({ message: "Home Trench Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
