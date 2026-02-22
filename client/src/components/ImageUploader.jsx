
// import React, { useState, useEffect } from "react";
// import { Upload, Button, Spin, Modal } from "antd";

// import {
//   UploadOutlined,
//   CloudUploadOutlined,
//   DownloadOutlined,
// } from "@ant-design/icons";
// import toast from "react-hot-toast";
// import axiosInstance from "../config/axios";

// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { useParams } from "react-router-dom";

// import { getCurrentLocation } from "../utils/getLocation";

// const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

// const ImageUploader = ({
//   images,
//   setImages,
//   setUploadedUrls,
//   caseId,
//   bankName,
//   deleteId,
//   fetchData,
//   uploadedImages,
//   url
// }) => {




//   const handleCapture = async (file) => {
//     try {
//       const location = await getCurrentLocation();

//       const imageData = {
//         uid: file.uid,
//         name: file.name,
//         file: file,
//         latitude: location.latitude,
//         longitude: location.longitude,
//         accuracy: location.accuracy,
//         capturedAt: new Date().toISOString(),
//       };

//       setImages(prev => [...prev, imageData]);

//     } catch (err) {
//       toast.error("Location not available");
//       console.log(err);

//     }
//   };




//   const [uploading, setUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewVisible, setPreviewVisible] = useState(false);


//   const { id } = useParams();


//   useEffect(() => {
//     console.log(id)
//   }, [id])


//   // function getFileName(path) {
//   //   return path.replace(/^.*uploads\//, "");
//   // }


//   const handleRemoveImage = async (fileUrl, ActualUrl) => {
//     try {
//       const res = await fetch(`${CPANEL}/api/remove/delete-file`, {
//         method: "DELETE",   // ✅ must match backend
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           filePath: fileUrl,  // ✅ send inside JSON
//         }),
//         credentials: "include",   // ✅ correct for cookies/session
//       });

//       const data = await res.json();

//       console.log(data);

//       if (!data.success) {
//         return
//       }

//       removeImage(id, ActualUrl)

//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };


//   const removeImage = async (id, imageUrl) => {
//     try {
//       const res = await fetch(`${CPANEL}/api/${url ? url : "first-bank"}/remove-image/${id}`, {
//         method: "PUT", // ✅ must match router.put
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",   // ✅ correct for cookies/session
//         body: JSON.stringify({
//           imageUrl: imageUrl,
//         }),
//       });

//       const data = await res.json();

//       console.log(data);
//       if (data.success) {
//         await fetchData()
//       }

//     } catch (error) {
//       console.error("Error deleting image:", error);
//     }
//   };



//   // const navigate = useNavigate();

//   const handleUploadToServer = async () => {
//     const formData = new FormData();

//     images.forEach((file) => {
//       if (file.originFileObj) {
//         formData.append("files", file.originFileObj);
//       }
//     });

//     if (!formData.has("files")) {
//       toast.error("Please select at least one file to upload");
//       return;
//     }

//     console.log(formData)

//     setUploading(true);

//     try {
//       const res = await fetch(`${CPANEL}/api/uploads`, {
//         method: "POST",
//         body: formData,   // ✅ send files directly
//       });

//       const result = await res.json();

//       console.log(result)

//       if (result?.urls?.length) {
//         setUploadedUrls((prev) => [...prev, ...result.urls]);
//         // ✅ clear small preview after upload
//         setImages(prev => prev.filter(img => !img.originFileObj));
//         toast.success("Files uploaded successfully");
//       } else {
//         toast.error("Upload failed");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Server error during upload");
//     } finally {
//       setUploading(false);
//     }
//   };




//   useEffect(() => {


//     console.log(uploadedImages);

//   }, [uploadedImages])


//   const handleAutoUpload = async (file) => {
//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("files", file);

//       const res = await fetch(`${CPANEL}/api/uploads`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",   // ✅ correct for cookies/session
//       });

//       const result = await res.json();

//       if (result?.urls?.length) {
//         const url = result.urls[0];

//         await axiosInstance.post(`/uploads/upload-document`, {
//           caseId,
//           bankName,
//           fileUrl: url,
//         });

//         const uploadedFile = {
//           uid: `uploaded-${Date.now()}`,
//           name: url.split("/").pop(),
//           status: "done",
//           url,
//         };

//         setImages((prev) => [
//           ...prev.filter((img) => img.uid !== file.uid),
//           uploadedFile,
//         ]);

//         setUploadedUrls((prev) =>
//           Array.from(new Set([...prev, ...result.urls]))
//         );

//         await fetchData();
//         toast.success(`${file.name} uploaded and case updated successfully`);
//       } else {
//         toast.error("Upload failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to upload or update ${file.name}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handlePreview = async (file) => {
//     setPreviewImage(file.url || file.thumbUrl);
//     setPreviewVisible(true);
//   };

//   const handleDownloadAll = async () => {
//     try {
//       const zip = new JSZip();

//       // 1. Add server-uploaded images (with URLs)
//       const serverImageUrls = (uploadedImages || images).filter((img) => img.url);

//       for (const img of serverImageUrls) {
//         const res = await fetch(img.url);
//         if (!res.ok) {
//           zip.file(`${img.name}-ERROR.txt`, `Failed to fetch: ${img.url}`);
//           continue;
//         }
//         const blob = await res.blob();
//         zip.file(img.name || `image-${Date.now()}.jpg`, blob);
//       }

//       // 2. Add local (not yet uploaded) images
//       const localImages = (uploadedImages || images).filter((img) => img.originFileObj);
//       for (const img of localImages) {
//         zip.file(
//           img.originFileObj.name || `local-image-${Date.now()}.jpg`,
//           img.originFileObj
//         );
//       }

//       // 3. Generate zip and trigger download
//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, "all-images.zip");
//     } catch (error) {
//       console.error("Download all failed:", error);
//       toast.error("Failed to download all images");
//     }
//   };

//   if (uploading) {
//     return <Spin />;
//   }

//   return (
//     <>
//       {caseId ? (
//         <Upload
//           beforeUpload={(file) => {
//             setImages((prev) => [
//               ...prev,
//               {
//                 uid: file.uid,
//                 name: file.name,
//                 originFileObj: file,
//               },
//             ]);
//             handleAutoUpload(file);
//             handleCapture(file)
//             return false;
//           }}
//           // fileList={images}
//           fileList={images.filter(img => img.originFileObj)}
//           onRemove={(file) => {
//             setImages((prev) => prev.filter((img) => img.uid !== file.uid));
//           }}
//           listType='picture-card'
//           multiple
//           showUploadList={false}
//           className='flex custom-upload'
//         >
//           <Button icon={<UploadOutlined />} />
//         </Upload>
//       ) : (
//         <div className='w-full'>
//           <div>
//             <label className='block font-medium text-sm text-gray-700 mb-2'>
//               Upload Files
//             </label>

//             <div className='flex items-start gap-4 flex-wrap'>
//               <Upload
//                 accept="image/*"
//                 capture="environment"
//                 multiple   // opens back camera
//                 beforeUpload={(file) => {
//                   setImages((prev) => [
//                     ...prev,
//                     {
//                       uid: file.uid,
//                       name: file.name,
//                       originFileObj: file,
//                     },
//                   ]);

//                   handleCapture(file)

//                   return false;
//                 }}
//                 // fileList={images}
//                 fileList={images.filter(img => img.originFileObj)}
//                 onRemove={async (file) => {
//                   const urlToDelete = file.url;
//                   if (urlToDelete) {
//                     try {
//                       await axiosInstance.put(
//                         `/case/remove-image/${deleteId}`,
//                         {
//                           imageUrl: urlToDelete,
//                           route: window.location.pathname, // 👈 or pass it explicitly if known
//                         }
//                       );
//                       setUploadedUrls((prev) =>
//                         prev.filter((url) => url !== urlToDelete)
//                       );
//                       toast.success("Image deleted successfully");
//                     } catch (error) {
//                       toast.error("Failed to delete image");
//                       console.error("Delete image error:", error);
//                     }
//                   }
//                   setImages((prev) =>
//                     prev.filter((img) => img.uid !== file.uid)
//                   );
//                 }}
//                 onPreview={handlePreview}
//                 listType='picture-card'
//                 showUploadList={{
//                   showPreviewIcon: true,
//                   showDownloadIcon: false,
//                 }}
//                 className='flex-1'
//               >
//                 <Button icon={<UploadOutlined />} />
//               </Upload>

//               <Modal
//                 open={previewVisible}
//                 footer={null}
//                 onCancel={() => setPreviewVisible(false)}
//                 closable
//                 className='custom-preview-modal'
//               >
//                 <img
//                   alt='Preview'
//                   style={{ width: "100%" }}
//                   src={previewImage}
//                 />
//               </Modal>

//               <div className='self-start'>
//                 <Button
//                   icon={<DownloadOutlined />}
//                   onClick={handleDownloadAll}
//                   type='dashed'
//                   className='mt-4'
//                 >
//                   Download All Photos
//                 </Button>

//                 <Button
//                   icon={<CloudUploadOutlined />}
//                   onClick={handleUploadToServer}
//                   loading={uploading}
//                   type='primary'
//                   className='mt-4 ml-4'
//                 >
//                   Upload to Server
//                 </Button>
//               </div>



//             </div>
//           </div>
//         </div>
//       )}

//       {uploadedImages?.length > 0 && (
//         <div className="grid grid-cols-3 gap-1">
//           {uploadedImages.map((item, index) => {

//             console.log(item);


//             return (
//               <>
//                 <div>

//                   <button type="button" onClick={() => handleRemoveImage(item?.fileId, item)} className="flex z-50 border relative top-[50%] left-[50%] hover:bg-red-500 hover:text-white px-2  hover:border  ">X</button>
//                   <img
//                     key={index}
//                     src={`${item?.url}`}
//                     alt={`uploaded-${index}`}
//                     className="max mb-2"
//                   />
//                 </div>

//               </>
//             );
//           })}
//         </div>
//       )}

//     </>
//   );
// };

// export default ImageUploader;




import React, { useState, useEffect } from "react";
import { Upload, Button, Spin, Modal } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import { getCurrentLocation } from "../utils/getLocation";

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
  url,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  }, [id]);

  // Location capture logic
  const handleCapture = async (file) => {
    try {
      const location = await getCurrentLocation();
      const imageData = {
        uid: file.uid,
        name: file.name,
        file: file,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        capturedAt: new Date().toISOString(),
      };
      setImages((prev) => [...prev, imageData]);
    } catch (err) {
      toast.error("Location not available");
      console.log(err);
    }
  };

  // Delete image from server and database
  const handleRemoveImage = async (fileUrl, ActualUrl) => {
    try {
      const res = await fetch(`${CPANEL}/api/remove/delete-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: fileUrl }),
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) return;
      removeImage(id, ActualUrl);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const removeImage = async (id, imageUrl) => {
    try {
      const res = await fetch(
        `${CPANEL}/api/${url ? url : "first-bank"}/remove-image/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageUrl }),
        }
      );
      const data = await res.json();
      if (data.success) await fetchData();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Upload all pending images to server
  const handleUploadToServer = async () => {
    const formData = new FormData();
    images.forEach((file) => {
      if (file.originFileObj) formData.append("files", file.originFileObj);
    });
    if (!formData.has("files")) {
      toast.error("Please select at least one file to upload");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result?.urls?.length) {
        setUploadedUrls((prev) => [...prev, ...result.urls]);
        setImages((prev) => prev.filter((img) => !img.originFileObj));
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

  // Auto-upload single file (for case-specific upload)
  const handleAutoUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("files", file);
      const res = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",
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
        setUploadedUrls((prev) => Array.from(new Set([...prev, ...result.urls])));
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
      const serverImageUrls = (uploadedImages || images).filter((img) => img.url);
      for (const img of serverImageUrls) {
        const res = await fetch(img.url);
        if (!res.ok) {
          zip.file(`${img.name}-ERROR.txt`, `Failed to fetch: ${img.url}`);
          continue;
        }
        const blob = await res.blob();
        zip.file(img.name || `image-${Date.now()}.jpg`, blob);
      }
      const localImages = (uploadedImages || images).filter((img) => img.originFileObj);
      for (const img of localImages) {
        zip.file(
          img.originFileObj.name || `local-image-${Date.now()}.jpg`,
          img.originFileObj
        );
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "all-images.zip");
    } catch (error) {
      console.error("Download all failed:", error);
      toast.error("Failed to download all images");
    }
  };

  // Loading overlay
  if (uploading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <Spin size="large" tip="Uploading..." />
      </div>
    );
  }

  return (
    <div className="image-uploader-container p-4">
      {/* Case-specific upload (single button) */}
      {caseId ? (
        <div className="mb-4">
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
              handleCapture(file);
              return false;
            }}
            fileList={images.filter((img) => img.originFileObj)}
            onRemove={(file) => {
              setImages((prev) => prev.filter((img) => img.uid !== file.uid));
            }}
            listType="picture-card"
            multiple
            showUploadList={false}
            className="inline-block"
          >
            <Button icon={<UploadOutlined />} size="large">
              Upload Images
            </Button>
          </Upload>
        </div>
      ) : (
        // Full uploader with previews and actions
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-2">
            Upload Files
          </label>

          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Upload area */}
            <Upload
              accept="image/*"
              capture="environment"
              multiple
              beforeUpload={(file) => {
                setImages((prev) => [
                  ...prev,
                  {
                    uid: file.uid,
                    name: file.name,
                    originFileObj: file,
                  },
                ]);
                handleCapture(file);
                return false;
              }}
              fileList={images.filter((img) => img.originFileObj)}
              onRemove={async (file) => {
                const urlToDelete = file.url;
                if (urlToDelete) {
                  try {
                    await axiosInstance.put(`/case/remove-image/${deleteId}`, {
                      imageUrl: urlToDelete,
                      route: window.location.pathname,
                    });
                    setUploadedUrls((prev) =>
                      prev.filter((url) => url !== urlToDelete)
                    );
                    toast.success("Image deleted successfully");
                  } catch (error) {
                    toast.error("Failed to delete image");
                    console.error("Delete image error:", error);
                  }
                }
                setImages((prev) => prev.filter((img) => img.uid !== file.uid));
              }}
              onPreview={handlePreview}
              listType="picture-card"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              className="flex-1"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <UploadOutlined className="text-2xl" />
                <span className="mt-2 text-sm">Click or tap to select</span>
              </div>
            </Upload>

            {/* Action buttons */}
            <div className="flex flex-row md:flex-col gap-2 self-start mt-2 md:mt-0">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadAll}
                type="dashed"
                block
              >
                Download All
              </Button>
              <Button
                icon={<CloudUploadOutlined />}
                onClick={handleUploadToServer}
                type="primary"
                block
              >
                Upload to Server
              </Button>
            </div>
          </div>

          {/* Preview modal */}
          <Modal
            open={previewVisible}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            closable
            centered
            width="auto"
            className="custom-preview-modal"
          >
            <img
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
              src={previewImage}
            />
          </Modal>
        </div>
      )}

      {/* Display uploaded images (from server) */}
      {uploadedImages?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Uploaded Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((item, index) => (
              <div
                key={item.url || index}
                className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item?.url}
                  alt={`uploaded-${index}`}
                  className="w-full h-32 object-cover"
                />
                {/* Overlay buttons on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => handlePreview({ url: item.url })}
                  />
                  <Button
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemoveImage(item?.fileId, item)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;