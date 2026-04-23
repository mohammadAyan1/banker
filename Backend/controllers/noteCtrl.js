const Note = require("../model/noteModel");

exports.addNote = async (req, res) => {
  try {
    const { caseId, message } = req.body;
    const note = await Note.create({
      caseId,
      message,
      addedBy: req.user._id,
      role: req.user.role,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to add note" });
  }
};

exports.getNotesByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const notes = await Note.find({ caseId }).populate("addedBy", "name");
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

exports.allCaseByUserId = async (req, res, next) => {
  // console.log(req.user, "A");
  try {
    const notes = await Note.find({ addedBy: req.user._id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.allNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
