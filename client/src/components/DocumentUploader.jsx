import React, { useEffect, useState } from "react";
import { Upload, Button, Spin, List, Typography, message } from "antd";
import {
    UploadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    FileOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const { Text } = Typography;
const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const DocumentUploader = ({ caseId, bankName, docUrls, setDocUrls, fetchData }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Handle file selection
    const handleBeforeUpload = (file) => {
        setFileList((prev) => [...prev, file]);
        return false; // Prevent auto upload
    };

    const handleRemoveLocalFile = (file) => {
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    };


    // Upload to ImageKit and add URLs to state
    const handleUploadToServer = async () => {
        if (fileList?.length === 0) {
            toast.error("Please select files to upload");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const res = await fetch(`${CPANEL}/api/uploads`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!data.success || !data.urls?.length) {
                throw new Error("Upload failed");
            }

            const newUrls = data.urls.map((item) => item.url);
            // setDocUrls((prev) => [...prev, ...newUrls]);
            setDocUrls((prev) => [
                ...(Array.isArray(prev) ? prev : []),
                ...(Array.isArray(newUrls) ? newUrls : [newUrls])
            ]);
            setFileList([]);
            toast.success("Documents uploaded successfully");

            // ✅ Only refresh data if we are in edit mode (caseId exists)
            if (fetchData && caseId) fetchData();
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload documents");
        } finally {
            setUploading(false);
        }
    };

    // Delete document from ImageKit and from case (if caseId exists)
    const handleDeleteDocument = async (docUrl) => {
        try {
            // 1. Delete from ImageKit
            await fetch(`${CPANEL}/api/remove/delete-file`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath: docUrl }),
            });

            // 2. If case exists, remove from database
            if (caseId) {
                const res = await fetch(`${CPANEL}/api/${bankName}/remove-document/${caseId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ documentUrl: docUrl }),
                });
                const data = await res.json();
                if (!data.success) {
                    toast.error("Failed to remove from case");
                    return;
                }
            }

            // 3. Remove from local state
            setDocUrls((prev) => prev.filter((url) => url !== docUrl));
            toast.success("Document removed");

            // ✅ Only refresh data if we are in edit mode (caseId exists)
            if (fetchData && caseId) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting document");
        }
    };
    // Download all documents as a zip
    const handleDownloadAll = async () => {
        if (!docUrls?.length) return;
        try {
            const zip = new JSZip();
            for (const docUrl of docUrls) {
                const res = await fetch(docUrl);
                if (res.ok) {
                    const blob = await res.blob();
                    const filename = docUrl.split("/").pop() || "document";
                    zip.file(filename, blob);
                }
            }
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "documents.zip");
        } catch (error) {
            console.error("Download all failed:", error);
            toast.error("Failed to download documents");
        }
    };



    return (
        <div className="document-uploader p-4 border rounded bg-white">
            <h3 className="text-lg font-medium mb-3">Attach Documents</h3>

            {/* File selection */}
            <Upload
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png" // you can restrict further
                multiple
                beforeUpload={handleBeforeUpload}
                fileList={fileList}
                onRemove={handleRemoveLocalFile}
                showUploadList={{ showRemoveIcon: true }}
            >
                <Button icon={<UploadOutlined />}>Select Documents</Button>
            </Upload>

            {/* Upload button */}
            {fileList.length > 0 && (
                <div className="mt-3">
                    <Button
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        onClick={handleUploadToServer}
                        loading={uploading}
                    >
                        Upload to Server
                    </Button>
                </div>
            )}

            {/* List of existing documents */}
            {docUrls?.length > 0 && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Uploaded Documents</span>
                        <Button size="small" onClick={handleDownloadAll}>
                            Download All
                        </Button>
                    </div>
                    <List
                        size="small"
                        bordered
                        dataSource={docUrls}
                        renderItem={(docUrl) => {
                            const fileName = docUrl.split("/").pop();
                            return (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="link"
                                            href={docUrl}
                                            target="_blank"
                                            icon={<FileOutlined />}
                                        >
                                            View
                                        </Button>,
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            onClick={() => handleDeleteDocument(docUrl)}
                                        />,
                                    ]}
                                >
                                    <Text ellipsis style={{ maxWidth: 300 }}>
                                        {fileName}
                                    </Text>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            )}

            {uploading && <Spin tip="Uploading..." className="mt-4" />}
        </div>
    );
};

export default DocumentUploader;