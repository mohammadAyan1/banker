// import React, { useState } from "react";
// import { Upload, Button, Spin, Modal } from "antd";
// import {
//   UploadOutlined,
//   CloudUploadOutlined,
//   DownloadOutlined,
// } from "@ant-design/icons";
// import toast from "react-hot-toast";
// import axiosInstance from "../config/axios";
// import { useNavigate } from "react-router-dom";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// // dnd-kit imports
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

// const SortableImage = ({ file, handleRemove, handlePreview }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: file.uid });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     width: 120,
//     height: 120,
//     margin: 8,
//     position: "relative",
//     borderRadius: 4,
//     overflow: "hidden",
//     cursor: "grab",
//     border: "1px solid #ddd",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <img
//         src={file.url || URL.createObjectURL(file.originFileObj)}
//         alt={file.name}
//         className='w-full h-full object-cover'
//         onClick={() => handlePreview(file)}
//       />
//       <button
//         onClick={() => handleRemove(file.uid)}
//         style={{
//           position: "absolute",
//           top: 4,
//           right: 4,
//           background: "red",
//           color: "white",
//           border: "none",
//           borderRadius: "50%",
//           width: 20,
//           height: 20,
//           lineHeight: "20px",
//           fontSize: 12,
//           textAlign: "center",
//           cursor: "pointer",
//         }}
//       >
//         X
//       </button>
//     </div>
//   );
// };

// const ImageUploader = ({
//   images,
//   setImages,
//   setUploadedUrls,
//   caseId,
//   bankName,
//   deleteId,
//   fetchData,
// }) => {
//   const [uploading, setUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewVisible, setPreviewVisible] = useState(false);

//   const navigate = useNavigate();

//   const handleRemove = async (uid) => {
//     const file = images.find((img) => img.uid === uid);

//     if (file?.url) {
//       try {
//         await axiosInstance.put(`/case/remove-image/${deleteId}`, {
//           imageUrl: file.url,
//           route: window.location.pathname,
//         });
//         setUploadedUrls((prev) => prev.filter((url) => url !== file.url));
//         toast.success("Image deleted successfully");
//       } catch (error) {
//         toast.error("Failed to delete image");
//         console.error("Delete image error:", error);
//       }
//     }

//     setImages((prev) => prev.filter((img) => img.uid !== uid));
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 5,
//       },
//     })
//   );

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     if (active.id !== over.id) {
//       const oldIndex = images.findIndex((img) => img.uid === active.id);
//       const newIndex = images.findIndex((img) => img.uid === over.id);
//       const reordered = arrayMove(images, oldIndex, newIndex);
//       setImages(reordered);

//       try {
//         await axiosInstance.put(`/case/reorder-images/${caseId}`, {
//           images: reordered.map((img) => img.url),
//         });
//         toast.success("Image order updated");
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to update order");
//       }
//     }
//   };

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

//     setUploading(true);

//     try {
//       const res = await fetch(`${CPANEL}/api/image_kit`, {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();

//       if (result?.urls?.length) {
//         const uploaded = result.urls.map((url, i) => ({
//           uid: `uploaded-${Date.now()}-${i}`,
//           name: url.split("/").pop(),
//           status: "done",
//           url,
//         }));

//         const updatedImages = [
//           ...images.filter((img) => !img.originFileObj),
//           ...uploaded,
//         ];

//         setImages(updatedImages);
//         setUploadedUrls((prev) => [...prev, ...result.urls]);
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

//   const handleAutoUpload = async (file) => {
//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("files", file);

//       const res = await fetch(`${CPANEL}/api/uploads`, {
//         method: "POST",
//         body: formData,
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

//   const handlePreview = (file) => {
//     setPreviewImage(file.url || file.thumbUrl);
//     setPreviewVisible(true);
//   };

//   const handleDownloadAll = async () => {
//     try {
//       const zip = new JSZip();

//       const serverImageUrls = images.filter((img) => img.url);

//       for (const img of serverImageUrls) {
//         const res = await fetch(img.url);
//         if (!res.ok) {
//           zip.file(`${img.name}-ERROR.txt`, `Failed to fetch: ${img.url}`);
//           continue;
//         }
//         const blob = await res.blob();
//         zip.file(img.name || `image-${Date.now()}.jpg`, blob);
//       }

//       const localImages = images.filter((img) => img.originFileObj);
//       for (const img of localImages) {
//         zip.file(
//           img.originFileObj.name || `local-image-${Date.now()}.jpg`,
//           img.originFileObj
//         );
//       }

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
//             return false;
//           }}
//           showUploadList={false}
//           multiple
//         >
//           <Button icon={<UploadOutlined />} />
//         </Upload>
//       ) : (
//         <div className='w-full'>
//           <div>
//             <label className='block font-medium text-sm text-gray-700 mb-2'>
//               Upload Files
//             </label>

//             <div className='flex flex-wrap gap-4'>
//               <Upload
//                 beforeUpload={(file) => {
//                   setImages((prev) => [
//                     ...prev,
//                     {
//                       uid: file.uid,
//                       name: file.name,
//                       originFileObj: file,
//                     },
//                   ]);
//                   return false;
//                 }}
//                 showUploadList={false}
//                 multiple
//               >
//                 <Button icon={<UploadOutlined />} />
//               </Upload>

//               <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleDragEnd}
//               >
//                 <SortableContext
//                   items={images.map((img) => img.uid)}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   <div className='flex flex-wrap'>
//                     {images.map((file) => (
//                       <SortableImage
//                         key={file.uid}
//                         file={file}
//                         handleRemove={handleRemove}
//                         handlePreview={handlePreview}
//                       />
//                     ))}
//                   </div>
//                 </SortableContext>
//               </DndContext>

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
//     </>
//   );
// };

// export default ImageUploader;

//! ----------------------------------------------

import React, { useState } from "react";
import { Upload, Button, Spin, Modal } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const ImageUploader = ({
  images,
  setImages,
  setUploadedUrls,
  caseId,
  bankName,
  deleteId,
  fetchData,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  // console.log(bankName, "sourabh");

  const navigate = useNavigate();

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

  const handleAutoUpload = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch(`${CPANEL}/api/uploads`, {
        method: "POST",
        body: formData,
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
    </>
  );
};

export default ImageUploader;
