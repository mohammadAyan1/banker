const Manapuram = require("../../model/Banks/manappuramModel");

// Create new record
const createForm = async (req, res) => {
  try {
    const form = await Manapuram.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all records
const getAllForms = async (req, res) => {
  try {
    const forms = await Manapuram.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single record by ID
const getFormById = async (req, res) => {
  try {
    const form = await Manapuram.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a record by ID
const updateForm = async (req, res) => {
  try {
    const updatedForm = await Manapuram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a record by ID
const deleteForm = async (req, res) => {
  try {
    const deletedForm = await Manapuram.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
};
