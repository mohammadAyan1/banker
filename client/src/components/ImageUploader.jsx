
import React, { useState, useEffect } from "react";
import { Upload, Button, Spin, Modal } from "antd";

import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios";
// import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";


const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const ImageUploader = ({
  images,
  setImages,
  setUploadedUrls,
  caseId,
  bankName,
  deleteId,
  fetchData,
  uploadedImages,
  url
}) => {


  // const [data, setData] = useState();




  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);


  const { id } = useParams();


  useEffect(() => {
    console.log(id)
  }, [id])


  function getFileName(path) {
    return path.replace(/^.*uploads\//, "");
  }


  const handleRemoveImage = async (fileUrl, ActualUrl) => {
    try {
      const res = await fetch(`${CPANEL}/api/remove/delete-file`, {
        method: "DELETE",   // ✅ must match backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: fileUrl,  // ✅ send inside JSON
        }),
        credentials: "include",   // ✅ correct for cookies/session
      });

      const data = await res.json();

      console.log(data);

      if (!data.success) {
        return
      }

      removeImage(id, ActualUrl)

    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  const removeImage = async (id, imageUrl) => {
    try {
      const res = await fetch(`${CPANEL}/api/${url ? url : "first-bank"}/remove-image/${id}`, {
        method: "PUT", // ✅ must match router.put
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",   // ✅ correct for cookies/session
        body: JSON.stringify({
          imageUrl: imageUrl,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        window.location.reload()
      }

    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };



  // const navigate = useNavigate();

  const handleUploadToServer = async () => {
    const formData = new FormData();

    images.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    if (!formData.has("files")) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setUploading(true);


    try {
      // const res = await fetch(`${CPANEL}/api/image_kit`, {
      const res = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",   // ✅ correct for cookies/session
      });

      const result = await res.json();

      if (result?.urls?.length) {
        const uploaded = result.urls.map((url, i) => ({
          uid: `uploaded-${Date.now()}-${i}`,
          name: url.split("/").pop(),
          status: "done",
          url,
        }));

        const updatedImages = [
          ...images.filter((img) => !img.originFileObj),
          ...uploaded,
        ];

        setImages(updatedImages);
        setUploadedUrls((prev) => [...prev, ...result.urls]);
        toast.success("Files uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Server error during upload");
    } finally {
      setUploading(false);
    }
  };


  // const fetchImageOfTheside = async () => {
  //   const res = await axios.get(`${CPANEL}/api/`)
  // }


  useEffect(() => {


    console.log(uploadedImages);

  }, [uploadedImages])


  const handleAutoUpload = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",   // ✅ correct for cookies/session
      });

      const result = await res.json();

      if (result?.urls?.length) {
        const url = result.urls[0];

        await axiosInstance.post(`/uploads/upload-document`, {
          caseId,
          bankName,
          fileUrl: url,
        });

        const uploadedFile = {
          uid: `uploaded-${Date.now()}`,
          name: url.split("/").pop(),
          status: "done",
          url,
        };

        setImages((prev) => [
          ...prev.filter((img) => img.uid !== file.uid),
          uploadedFile,
        ]);

        setUploadedUrls((prev) =>
          Array.from(new Set([...prev, ...result.urls]))
        );

        await fetchData();
        toast.success(`${file.name} uploaded and case updated successfully`);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload or update ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleDownloadAll = async () => {
    try {
      const zip = new JSZip();

      // 1. Add server-uploaded images (with URLs)
      const serverImageUrls = images.filter((img) => img.url);

      for (const img of serverImageUrls) {
        const res = await fetch(img.url);
        if (!res.ok) {
          zip.file(`${img.name}-ERROR.txt`, `Failed to fetch: ${img.url}`);
          continue;
        }
        const blob = await res.blob();
        zip.file(img.name || `image-${Date.now()}.jpg`, blob);
      }

      // 2. Add local (not yet uploaded) images
      const localImages = images.filter((img) => img.originFileObj);
      for (const img of localImages) {
        zip.file(
          img.originFileObj.name || `local-image-${Date.now()}.jpg`,
          img.originFileObj
        );
      }

      // 3. Generate zip and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "all-images.zip");
    } catch (error) {
      console.error("Download all failed:", error);
      toast.error("Failed to download all images");
    }
  };

  if (uploading) {
    return <Spin />;
  }

  return (
    <>
      {caseId ? (
        <Upload
          beforeUpload={(file) => {
            setImages((prev) => [
              ...prev,
              {
                uid: file.uid,
                name: file.name,
                originFileObj: file,
              },
            ]);
            handleAutoUpload(file);
            return false;
          }}
          fileList={images}
          onRemove={(file) => {
            setImages((prev) => prev.filter((img) => img.uid !== file.uid));
          }}
          listType='picture-card'
          multiple
          showUploadList={false}
          className='flex custom-upload'
        >
          <Button icon={<UploadOutlined />} />
        </Upload>
      ) : (
        <div className='w-full'>
          <div>
            <label className='block font-medium text-sm text-gray-700 mb-2'>
              Upload Files
            </label>

            <div className='flex items-start gap-4 flex-wrap'>
              <Upload
                beforeUpload={(file) => {
                  setImages((prev) => [
                    ...prev,
                    {
                      uid: file.uid,
                      name: file.name,
                      originFileObj: file,
                    },
                  ]);
                  return false;
                }}
                fileList={images}
                onRemove={async (file) => {
                  const urlToDelete = file.url;
                  if (urlToDelete) {
                    try {
                      await axiosInstance.put(
                        `/case/remove-image/${deleteId}`,
                        {
                          imageUrl: urlToDelete,
                          route: window.location.pathname, // 👈 or pass it explicitly if known
                        }
                      );
                      setUploadedUrls((prev) =>
                        prev.filter((url) => url !== urlToDelete)
                      );
                      toast.success("Image deleted successfully");
                    } catch (error) {
                      toast.error("Failed to delete image");
                      console.error("Delete image error:", error);
                    }
                  }
                  setImages((prev) =>
                    prev.filter((img) => img.uid !== file.uid)
                  );
                }}
                onPreview={handlePreview}
                listType='picture-card'
                multiple
                showUploadList={{
                  showPreviewIcon: true,
                  showDownloadIcon: false,
                }}
                className='flex-1'
              >
                <Button icon={<UploadOutlined />} />
              </Upload>

              <Modal
                open={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                closable
                className='custom-preview-modal'
              >
                <img
                  alt='Preview'
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>

              <div className='self-start'>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadAll}
                  type='dashed'
                  className='mt-4'
                >
                  Download All Photos
                </Button>

                <Button
                  icon={<CloudUploadOutlined />}
                  onClick={handleUploadToServer}
                  loading={uploading}
                  type='primary'
                  className='mt-4 ml-4'
                >
                  Upload to Server
                </Button>
              </div>



            </div>
          </div>
        </div>
      )}

      {uploadedImages?.length > 0 && (
        <div>
          {uploadedImages.map((item, index) => {
            console.log('====================================');
            console.log(item);
            console.log('====================================');

            const imageUrl = item?.replace(/^undefined\/?/, "");

            console.log('====================================');
            console.log(imageUrl);
            console.log('====================================');

            const fileName = getFileName(item);


            return (
              <>
                <button type="button" onClick={() => handleRemoveImage(fileName, item)} className="flex z-50 relative top-6 left-1 hover:bg-red-500 hover:text-white px-2  hover:border ">X</button>
                <img
                  key={index}
                  src={`${CPANEL}/${imageUrl}`}
                  alt={`uploaded-${index}`}
                  className="max mb-2"
                />
              </>
            );
          })}
        </div>
      )}

    </>
  );
};

export default ImageUploader;


