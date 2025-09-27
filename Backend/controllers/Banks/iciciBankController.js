const IciciBank = require("../../model/Banks/IciciBankModel");

// CREATE new ICICI bank entry
exports.createIciciBank = async (req, res) => {
  try {
    const newReport = await IciciBank.create(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create report", error: error.message });
  }
};

// GET all ICICI bank entries
exports.getAllIciciBanks = async (req, res) => {
  try {
    const reports = await IciciBank.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// GET single ICICI bank entry by ID
exports.getIciciBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await IciciBank.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch report", error: error.message });
  }
};

exports.updateIciciBank = async (req, res) => {
  console.log(req.body, "ICICI UPDATE controller 47 no.");
  try {
    const updatedJob = await IciciBank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Updated successfully", updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating Job Assignment", error });
  }
};
