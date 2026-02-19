import React from "react";

const DocumentUpload = ({ onUpload }) => {

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onUpload(files);
    };

    return (
        <div className="border p-4 rounded bg-white shadow">
            <label className="block font-semibold mb-2">
                Upload Documents & Site Photos
            </label>

            <input
                type="file"
                multiple
                onChange={handleChange}
                className="border p-2 rounded w-full"
            />

            <p className="text-sm text-gray-500 mt-2">
                Upload PDFs, Excel, ATS, Registry & site photos
            </p>
        </div>
    );
};

export default DocumentUpload;
