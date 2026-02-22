const express = require("express");
const router = express.Router();
// const upload = require("../middleware/upload");
const uploadDocuments = require("../middleware/uploderDocument.js");
const imagekit = require("../config/imagekit");
const modelMap = require("../controllers/modelMap.js");
const Case = require("../model/Banks/homeFirstModel.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const uploadedFiles = [];

    console.log(req?.files)

    for (const file of req.files) {
      const result = await imagekit.upload({
        file: file.buffer,        // buffer
        fileName: file.originalname,
        folder: "/uploads",
      });

      uploadedFiles.push({
        url: result.url,
        fileId: result.fileId,   // ⭐ important
        name: result.name,
      });
    }

    res.json({ success: true, urls: uploadedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// router.post("/", upload.array("files"), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No files uploaded" });
//   }

//   const fileUrls = req.files.map((file) => {
//     return `${process.env.UPLOAD_DOMAIN_URL}/uploads/${file.filename}`;
//   });
//   // console.log(fileUrls);

//   res.json({ urls: fileUrls });
// });

function toPascalCase(str) {
  return str
    .replace(/\s+/g, "-")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

router.post("/upload-document", async (req, res) => {
  const { caseId, fileUrl, bankName } = req.body;

  console.log(caseId, fileUrl, bankName);

  if (!caseId || !fileUrl || !bankName) {
    return res.status(400).json({
      error: "caseId, fileUrl, and bankName are required.",
    });
  }

  // const modelKey = toPascalCase(bankName);
  const Model = modelMap[bankName];

  if (!Model) {
    return res.status(400).json({
      error: `Invalid bank name: ${bankName}`,
    });
  }

  // console.log(Model);

  try {
    const updatedCase = await Model.findByIdAndUpdate(
      { _id: caseId },
      { $push: { AttachDocuments: fileUrl } }, // 👈 Push URL directly
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: "File URL successfully added to documents.",
      updatedCase,
    });
  } catch (err) {
    console.error("Error updating documents:", err.message);
    return res.status(500).json({ error: "Server error while updating case." });
  }
});

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ error: "File deletion failed" });
    }
    res.json({ message: "File deleted successfully" });
  });
});

module.exports = router;
