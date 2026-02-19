const fs = require("fs");
const path = require("path");

exports.deleteUploadedFile = async (req, res) => {
    try {
        let { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ message: "filePath is required" });
        }

        // ✅ remove everything before uploads/
        filePath = filePath.replace(/^.*uploads\//, "");

        const fullPath = path.join(__dirname, "../uploads", filePath);

        // 🔒 Security check (prevent deleting outside uploads)
        if (!fullPath.startsWith(path.join(__dirname, "../uploads"))) {
            return res.status(400).json({ message: "Invalid file path" });
        }

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return res.json({ message: "File deleted successfully", success: true });
        } else {
            return res.status(404).json({ message: "File not found", success: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
