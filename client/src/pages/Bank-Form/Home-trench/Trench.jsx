// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   Checkbox,
//   InputNumber,
// } from "antd";
// import dayjs from "dayjs";

// import {
//   ShowLoading,
//   HideLoading,
// } from "../../../redux/features/alerts/alertSlice";
// import {
//   createHomeTrenchReport,
//   getHomeTrenchReportById,
//   updateHomeTrenchReport,
// } from "../../../redux/features/Banks/homeTrench/homeTrenchReportThunks";
// import ImageUploader from "../../../components/ImageUploader";
// import ConfirmModal from "../../../components/ConfirmModal";
// import LocationPicker from "../../../components/GeoLocationInput";
// import AutoFillForm from "../../AutoFillForm";
// import { finalUpdate } from "../../../redux/features/case/caseThunks";

// const { TextArea } = Input;
// const { Option } = Select;

// const Trench = () => {
//   const [form] = Form.useForm();
//   const [formData, setFormData] = useState({
//     // 1. VENDOR VISIT DETAILS
//     dateOfVisit: "",
//     dateOfReport: "",
//     propertyAddress: "",
//     visitedPersonName: "",
//     contactNumber: "",

//     // 2. CONSTRUCTION
//     constructionStage: "",
//     constructionPercentage: "",
//     constructionAsPer: "",

//     // 3. AREA
//     total: "",
//     areaRemarks: "",
//     latitude: "",
//     longitude: "",
//     overallStatus: "",
//     negativeReason: "",

//     // 4. CERTIFICATE
//     certificateText:
//       "THIS IS TO CERTIFY THAT, I HAVE VISITED CONSTRUCTION SITE AS PER ABOVE ADDRESS AND FOUND IT COMPLIANT TO THE BYELAWS / PLANS PROVIDED.",

//     // 5. BILLING
//     charges: "",
//     gstPercentage: "",
//     totalAmount: "",

//     // 6. DECLARATION
//     declaration1: true,
//     declaration2: true,
//     declaration3: "",

//     // 7. SITE PICS
//     sitePics: [],
//   });

//   const [uploadedImages, setUploadedImagess] = useState([]);


//   const { user } = useSelector((state) => state.auth);
//   const [uploadedUrls, setUploadedUrls] = useState([]);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [images, setImages] = useState([]);
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const geoRef = useRef();
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ! last update

//   // Fetch data if in edit mode
//   useEffect(() => {
//     if (id) {
//       const fetchReportData = async () => {
//         setLoading(true);
//         try {
//           const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
//           setIsEdit(true);

//           // Convert date strings to dayjs objects for AntD DatePicker
//           const formattedData = {
//             ...response,
//             dateOfVisit: response.dateOfVisit
//               ? dayjs(response.dateOfVisit)
//               : null,
//             dateOfReport: response.dateOfReport
//               ? dayjs(response.dateOfReport)
//               : null,
//           };

//           setFormData(formattedData);
//           form.setFieldsValue(formattedData);

//           console.log('====================================');
//           console.log(formattedData);
//           console.log('====================================');
//           setUploadedImagess(formattedData?.imageUrls)
//           if (Array.isArray(response.imageUrls)) {
//             const fileListFromServer = response.imageUrls.map((url, index) => ({
//               uid: `server-${index}`,
//               name: url.split("/").pop(),
//               status: "done",
//               url,
//             }));
//             setImages(fileListFromServer);
//             setUploadedUrls(response.imageUrls);
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//           toast.error("Failed to load report data");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchReportData();
//     }
//   }, [id, dispatch, form]);

//   // Auto-fetch location for field officers
//   useEffect(() => {
//     if (user.role === "FieldOfficer") {
//       const timeout = setTimeout(() => {
//         geoRef.current?.getLocation();
//       }, 100);
//       return () => clearTimeout(timeout);
//     }
//   }, [user.role]);

//   const handleFormChange = (changedValues) => {
//     setFormData((prev) => ({ ...prev, ...changedValues }));
//   };

//   const handleLocationChange = (lat, lng) => {
//     form.setFieldsValue({
//       latitude: lat,
//       longitude: lng,
//     });
//     setFormData((prev) => ({
//       ...prev,
//       latitude: lat,
//       longitude: lng,
//     }));
//   };

//   const validateForm = async () => {
//     try {
//       await form.validateFields();
//       if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
//         toast.error("Please upload at least one image");
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error("Validation failed:", error);
//       return false;
//     }
//   };

//   const handleSubmit = async () => {
//     const isValid = await validateForm();
//     if (!isValid) return;

//     dispatch(ShowLoading());
//     try {
//       const values = await form.validateFields();
//       const fullData = {
//         ...values,
//         dateOfVisit: values.dateOfVisit
//           ? values.dateOfVisit.format("YYYY-MM-DD")
//           : "",
//         dateOfReport: values.dateOfReport
//           ? values.dateOfReport.format("YYYY-MM-DD")
//           : "",
//         imageUrls: uploadedUrls,
//       };

//       if (isEdit) {
//         await dispatch(updateHomeTrenchReport({ id, fullData })).unwrap();
//         toast.success("Report updated successfully");
//       } else {
//         await dispatch(createHomeTrenchReport(fullData)).unwrap();
//         toast.success("Report submitted successfully");
//       }

//       if (user.role === "Admin") {
//         navigate("/");
//       } else {
//         navigate("/field/dashboard");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred while submitting");
//     } finally {
//       dispatch(HideLoading());
//     }
//   };

//   const handleLastUpdate = async () => {
//     try {
//       const values = await form.validateFields();
//       const finalData = {
//         ...values,
//         dateOfVisit: values.dateOfVisit
//           ? values.dateOfVisit.format("YYYY-MM-DD")
//           : "",
//         dateOfReport: values.dateOfReport
//           ? values.dateOfReport.format("YYYY-MM-DD")
//           : "",
//         imageUrls: uploadedUrls,
//       };

//       await dispatch(
//         finalUpdate({ id, bankName: "HomeFirstTrench", updateData: finalData })
//       ).unwrap();

//       toast.success("Case submitted finally!");
//       if (user.role === "Admin") {
//         navigate("/");
//       } else {
//         navigate("/field/dashboard");
//       }
//     } catch (err) {
//       console.error("Final submission failed", err);
//       toast.error("Final submission failed");
//     }
//   };

//   const handleSubmitClick = async () => {
//     if (user.role === "FieldOfficer") {
//       const isValid = await validateForm();
//       if (isValid) {
//         setShowConfirm(true);
//       }
//     } else {
//       handleSubmit();
//     }
//   };

//   const calculateTotalAmount = () => {
//     const charges = parseFloat(formData.charges) || 0;
//     const gstPercentage = parseFloat(formData.gstPercentage) || 0;
//     const gstAmount = charges * (gstPercentage / 100);
//     const total = charges + gstAmount;
//     form.setFieldsValue({ totalAmount: total.toFixed(2) });
//     setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
//   };

//   useEffect(() => {
//     calculateTotalAmount();
//   }, [formData.charges, formData.gstPercentage]);

//   return (
//     <div className='w-full border p-6 bg-white rounded-lg shadow-md'>
//       <ConfirmModal
//         visible={showConfirm}
//         onCancel={() => setShowConfirm(false)}
//         onConfirm={handleSubmit}
//         title='Confirm Submission'
//         message='Are you sure you want to submit this report? This action cannot be undone.'
//       />

//       <h1 className='text-2xl font-bold mb-6 text-center'>
//         {isEdit ? "Edit Trench Report" : "Create New Trench Report"}
//       </h1>

//       <Form
//         form={form}
//         layout='vertical'
//         onValuesChange={handleFormChange}
//         initialValues={formData}
//         className='space-y-6'
//       >
//         {/* 1. VENDOR VISIT DETAILS */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             1. VENDOR VISIT DETAILS
//           </h2>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='DATE OF VISIT'
//               name='dateOfVisit'
//             // rules={[{ required: true, message: "Please select visit date" }]}
//             >
//               <DatePicker className='w-full' format='YYYY-MM-DD' />
//             </Form.Item>

//             <Form.Item
//               label='DATE OF REPORT'
//               name='dateOfReport'
//             // rules={[{ required: true, message: "Please select report date" }]}
//             >
//               <DatePicker className='w-full' format='YYYY-MM-DD' />
//             </Form.Item>
//           </div>

//           <Form.Item
//             label='Address of Property (As per site)'
//             name='propertyAddress'
//           // rules={[
//           //   { required: true, message: "Please enter property address" },
//           // ]}
//           >
//             <TextArea rows={3} />
//           </Form.Item>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='NAME OF THE PERSON WHO VISITED THE SITE'
//               name='visitedPersonName'
//             // rules={[{ required: true, message: "Please enter visitor name" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label='CONTACT NUMBER'
//               name='contactNumber'
//             // rules={[
//             //   { required: true, message: "Please enter contact number" },
//             //   {
//             //     pattern: /^[0-9]{10,15}$/,
//             //     message: "Please enter valid phone number",
//             //   },
//             // ]}
//             >
//               <Input type='tel' />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 2. CONSTRUCTION */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             2. CONSTRUCTION
//           </h2>

//           <Form.Item
//             label='CONSTRUCTION STAGE (AS PER SITE)'
//             name='constructionStage'
//             // rules={[
//             //   { required: true, message: "Please enter construction stage" },
//             // ]}
//             tooltip='FOUNDATION / PLINTH / RCC / BRICK WORK / PLASTER / TILING / INTERNAL FINISHING / COMPLETED'
//           >
//             <Input />
//           </Form.Item>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='CONSTRUCTION (%)'
//               name='constructionPercentage'
//             // rules={[
//             //   { required: true, message: "Please enter percentage" },
//             //   {
//             //     type: "number",
//             //     min: 0,
//             //     max: 100,
//             //     message: "Must be between 0-100",
//             //   },
//             // ]}
//             >
//               <InputNumber className='w-full' />
//             </Form.Item>

//             <Form.Item
//               label='CONSTRUCTION IS AS PER'
//               name='constructionAsPer'
//             // rules={[{ required: true, message: "Please select an option" }]}
//             >
//               <Select>
//                 <Option value='PROVIDED PLANS'>PROVIDED PLANS</Option>
//                 <Option value='BYELAWS'>BYELAWS</Option>
//                 <Option value='BOTH'>BOTH</Option>
//               </Select>
//             </Form.Item>
//           </div>
//         </div>

//         {/* 3. AREA */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>3. AREA</h2>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='TOTAL CONSIDERED ON SITE (IN SQ.FT)'
//               name='total'
//             // rules={[{ required: true, message: "Please enter total" }]}
//             >
//               <InputNumber className='w-full' min={0} />
//             </Form.Item>

//             <Form.Item label='REMARKS' name='areaRemarks'>
//               <Input />
//             </Form.Item>
//           </div>

//           <LocationPicker
//             ref={geoRef}
//             onLocationChange={handleLocationChange}
//             initialLat={formData.latitude}
//             initialLng={formData.longitude}
//           />

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='OVERALL STATUS'
//               name='overallStatus'
//             // rules={[{ required: true, message: "Please select status" }]}
//             >
//               <Select>
//                 <Option value='POSITIVE'>POSITIVE</Option>
//                 <Option value='NEGATIVE'>NEGATIVE</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item
//               label='IF NEGATIVE, PLEASE SPECIFY THE REASON'
//               name='negativeReason'
//             // rules={[
//             //   {
//             //     required: formData.overallStatus === "NEGATIVE",
//             //     message: "Please specify reason for negative status",
//             //   },
//             // ]}
//             >
//               <Input disabled={formData.overallStatus !== "NEGATIVE"} />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 4. CERTIFICATE */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             4. CERTIFICATE
//           </h2>

//           <Form.Item name='certificateText'>
//             <TextArea rows={4} />
//           </Form.Item>
//         </div>

//         {/* 5. BILLING */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             5. BILLING
//           </h2>

//           <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//             <Form.Item label='CHARGES' name='charges'>
//               <InputNumber
//                 className='w-full'
//                 min={0}
//                 onChange={calculateTotalAmount}
//               />
//             </Form.Item>

//             <Form.Item label='GST % (IF APPLICABLE)' name='gstPercentage'>
//               <InputNumber
//                 className='w-full'
//                 min={0}
//                 max={100}
//                 onChange={calculateTotalAmount}
//               />
//             </Form.Item>

//             <Form.Item label='TOTAL' name='totalAmount'>
//               <InputNumber className='w-full' readOnly />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 6. DECLARATION */}
//         <div className='border-b pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             6. DECLARATION
//           </h2>

//           <Form.Item name='declaration1' valuePropName='checked'>
//             <Checkbox>
//               We have no direct or indirect interest in the property valued.
//             </Checkbox>
//           </Form.Item>

//           <Form.Item name='declaration2' valuePropName='checked'>
//             <Checkbox>
//               The property was inspected by our authorized representative and
//               info is true.
//             </Checkbox>
//           </Form.Item>

//           <Form.Item
//             label='Additional Declaration'
//             name='declaration3'
//           // rules={[{ required: true, message: "Please enter declaration" }]}
//           >
//             <Input />
//           </Form.Item>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
//           <Form.Item
//             label='LATITUDE'
//             name='latitude'
//           // rules={[{ required: true, message: "Latitude is required" }]}
//           >
//             <Input readOnly />
//           </Form.Item>

//           <Form.Item
//             label='LONGITUDE'
//             name='longitude'
//           // rules={[{ required: true, message: "Longitude is required" }]}
//           >
//             <Input readOnly />
//           </Form.Item>
//         </div>

//         {/* 7. SITE PICS */}
//         <div className='pb-6'>
//           <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
//             7. SITE PHOTOS
//           </h2>
//           <ImageUploader
//             deleteId={id}
//             images={images}
//             setImages={setImages}
//             setUploadedUrls={setUploadedUrls}
//             maxCount={10}
//             uploadedImages={uploadedImages}
//             url={"home-trench-reports"}
//             uploadedUrls={uploadedUrls}
//           />
//         </div>

//         {/* Submit Button */}

//         <div className='mt-6 text-right'>
//           <Button
//             type='primary'
//             size='large'
//             onClick={handleSubmitClick}
//             loading={loading}
//             className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg mr-5'
//           >
//             {isEdit ? "Update Report" : "Submit Report"}
//           </Button>

//           <Button
//             type='primary'
//             size='large'
//             loading={loading}
//             className='bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg '
//             onClick={handleLastUpdate}
//           >
//             Final Submit
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default Trench;



import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
  Collapse,
  Tag,
} from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  ShowLoading,
  HideLoading,
} from "../../../redux/features/alerts/alertSlice";
import {
  createHomeTrenchReport,
  getHomeTrenchReportById,
  updateHomeTrenchReport,
} from "../../../redux/features/Banks/homeTrench/homeTrenchReportThunks";
import ImageUploader from "../../../components/ImageUploader";
import ConfirmModal from "../../../components/ConfirmModal";
import LocationPicker from "../../../components/GeoLocationInput";
import AutoFillForm from "../../AutoFillForm";           // ← unchanged component
import { finalUpdate } from "../../../redux/features/case/caseThunks";

// ── NEW: Adapter utilities (AutoFillForm ko touch nahi kiya) ─────────────────
import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
import { TRENCH_MAPPING } from "../../../config/Bankfieldmappings";
// ─────────────────────────────────────────────────────────────────────────────

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

// ─────────────────────────────────────────────────────────────────────────────
// AutoFill status badge — shows which fields were filled and which weren't
// ─────────────────────────────────────────────────────────────────────────────
const AutoFillStatus = ({ filledFields, totalMappedFields }) => {
  if (filledFields.length === 0) return null;

  // Human-readable labels for Trench field names
  const FIELD_LABELS = {
    propertyAddress: "Property Address",
    dateOfReport: "Date of Report",
    visitedPersonName: "Visitor Name",
  };

  const allFields = Object.keys(TRENCH_MAPPING);
  const filledSet = new Set(filledFields);

  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 14px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: 10,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginRight: 4 }}>
        Auto-fill status:
      </span>
      {allFields.map((field) => (
        <Tag
          key={field}
          icon={
            filledSet.has(field) ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={filledSet.has(field) ? "success" : "default"}
          style={{ fontSize: 11 }}
        >
          {FIELD_LABELS[field] || field}
        </Tag>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const Trench = () => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    // 1. VENDOR VISIT DETAILS
    dateOfVisit: "",
    dateOfReport: "",
    propertyAddress: "",
    visitedPersonName: "",
    contactNumber: "",

    // 2. CONSTRUCTION
    constructionStage: "",
    constructionPercentage: "",
    constructionAsPer: "",

    // 3. AREA
    total: "",
    areaRemarks: "",
    latitude: "",
    longitude: "",
    overallStatus: "",
    negativeReason: "",

    // 4. CERTIFICATE
    certificateText:
      "THIS IS TO CERTIFY THAT, I HAVE VISITED CONSTRUCTION SITE AS PER ABOVE ADDRESS AND FOUND IT COMPLIANT TO THE BYELAWS / PLANS PROVIDED.",

    // 5. BILLING
    charges: "",
    gstPercentage: "",
    totalAmount: "",

    // 6. DECLARATION
    declaration1: true,
    declaration2: true,
    declaration3: "",

    // 7. SITE PICS
    sitePics: [],
  });

  // ── AutoFill state ───────────────────────────────────────────────────────
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  // ────────────────────────────────────────────────────────────────────────

  const [uploadedImages, setUploadedImagess] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [images, setImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const geoRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── AutoFill handler — adapter pattern ──────────────────────────────────
  //
  // createAutoFillAdapter:
  //   1. Receives raw extracted data from AutoFillForm (unchanged)
  //   2. Translates keys using TRENCH_MAPPING
  //   3. Calls our callback with only the mapped + non-null fields
  //
  // TRENCH_MAPPING sirf Trench ke liye hai — AutoFillForm ko kuch pata nahi.
  // ─────────────────────────────────────────────────────────────────────────
  const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mappedData) => {
    // Track which fields were filled for the status badge
    setAutoFilledFields(Object.keys(mappedData));

    // dateOfReport string → dayjs for AntD DatePicker
    const processedData = { ...mappedData };
    if (processedData.dateOfReport) {
      // Try to parse DD/MM/YYYY (format from AI) or ISO
      const parsed = dayjs(processedData.dateOfReport, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
      processedData.dateOfReport = parsed.isValid() ? parsed : dayjs();
    }

    // Update React state
    setFormData((prev) => ({ ...prev, ...processedData }));

    // Sync AntD Form instance so fields visually update
    form.setFieldsValue(processedData);
  });
  // ─────────────────────────────────────────────────────────────────────────

  // Fetch data if in edit mode
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setLoading(true);
        try {
          const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
          setIsEdit(true);

          const formattedData = {
            ...response,
            dateOfVisit: response.dateOfVisit ? dayjs(response.dateOfVisit) : null,
            dateOfReport: response.dateOfReport ? dayjs(response.dateOfReport) : null,
          };

          setFormData(formattedData);
          form.setFieldsValue(formattedData);

          setUploadedImagess(formattedData?.imageUrls);
          if (Array.isArray(response.imageUrls)) {
            const fileListFromServer = response.imageUrls.map((url, index) => ({
              uid: `server-${index}`,
              name: url.split("/").pop(),
              status: "done",
              url,
            }));
            setImages(fileListFromServer);
            setUploadedUrls(response.imageUrls);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load report data");
        } finally {
          setLoading(false);
        }
      };
      fetchReportData();
    }
  }, [id, dispatch, form]);

  // Auto-fetch location for field officers
  useEffect(() => {
    if (user.role === "FieldOfficer") {
      const timeout = setTimeout(() => {
        geoRef.current?.getLocation();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user.role]);

  const handleFormChange = (changedValues) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  const handleLocationChange = (lat, lng) => {
    form.setFieldsValue({ latitude: lat, longitude: lng });
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const validateForm = async () => {
    try {
      await form.validateFields();
      if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
        toast.error("Please upload at least one image");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    dispatch(ShowLoading());
    try {
      const values = await form.validateFields();
      const fullData = {
        ...values,
        dateOfVisit: values.dateOfVisit ? values.dateOfVisit.format("YYYY-MM-DD") : "",
        dateOfReport: values.dateOfReport ? values.dateOfReport.format("YYYY-MM-DD") : "",
        imageUrls: uploadedUrls,
      };

      if (isEdit) {
        await dispatch(updateHomeTrenchReport({ id, fullData })).unwrap();
        toast.success("Report updated successfully");
      } else {
        await dispatch(createHomeTrenchReport(fullData)).unwrap();
        toast.success("Report submitted successfully");
      }

      if (user.role === "Admin") navigate("/");
      else navigate("/field/dashboard");
    } catch (error) {
      toast.error(error.message || "An error occurred while submitting");
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleLastUpdate = async () => {
    try {
      const values = await form.validateFields();
      const finalData = {
        ...values,
        dateOfVisit: values.dateOfVisit ? values.dateOfVisit.format("YYYY-MM-DD") : "",
        dateOfReport: values.dateOfReport ? values.dateOfReport.format("YYYY-MM-DD") : "",
        imageUrls: uploadedUrls,
      };

      await dispatch(
        finalUpdate({ id, bankName: "HomeFirstTrench", updateData: finalData })
      ).unwrap();

      toast.success("Case submitted finally!");
      if (user.role === "Admin") navigate("/");
      else navigate("/field/dashboard");
    } catch (err) {
      console.error("Final submission failed", err);
      toast.error("Final submission failed");
    }
  };

  const handleSubmitClick = async () => {
    if (user.role === "FieldOfficer") {
      const isValid = await validateForm();
      if (isValid) setShowConfirm(true);
    } else {
      handleSubmit();
    }
  };

  const calculateTotalAmount = () => {
    const charges = parseFloat(formData.charges) || 0;
    const gstPercentage = parseFloat(formData.gstPercentage) || 0;
    const gstAmount = charges * (gstPercentage / 100);
    const total = charges + gstAmount;
    form.setFieldsValue({ totalAmount: total.toFixed(2) });
    setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formData.charges, formData.gstPercentage]);

  return (
    <div className="w-full border p-6 bg-white rounded-lg shadow-md">
      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Confirm Submission"
        message="Are you sure you want to submit this report? This action cannot be undone."
      />

      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Trench Report" : "Create New Trench Report"}
      </h1>

      {/* ── AUTO-FILL SECTION ──────────────────────────────────────────────── */}
      <Collapse
        defaultActiveKey={[]}
        style={{
          marginBottom: 28,
          border: "1.5px solid #6366f1",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 12px 0 rgba(99,102,241,0.08)",
        }}
        expandIconPosition="end"
      >
        <Panel
          key="autofill"
          header={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ThunderboltOutlined
                style={{
                  fontSize: 18,
                  color: "#6366f1",
                  filter: "drop-shadow(0 0 4px #a5b4fc)",
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#3730a3" }}>
                Smart Auto-Fill
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  fontWeight: 400,
                  marginLeft: 4,
                }}
              >
                — Document upload karo, form automatic bhar jayega
              </span>
              {autoFilledFields.length > 0 && (
                <Tag
                  color="success"
                  style={{ marginLeft: "auto", fontSize: 11 }}
                >
                  ✅ {autoFilledFields.length} field{autoFilledFields.length > 1 ? "s" : ""} filled
                </Tag>
              )}
            </div>
          }
          style={{ background: "#fafafe" }}
        >
          {/*
           * AutoFillForm ko setFormData ki jagah handleAutoFill pass karo.
           * AutoFillForm ka internal logic bilkul change nahi hua.
           * Sirf ye adapter us extracted data ko Trench ke field names me map karta hai.
           */}
          <AutoFillForm setFormData={handleAutoFill} />

          <AutoFillStatus
            filledFields={autoFilledFields}
            totalMappedFields={Object.keys(TRENCH_MAPPING).length}
          />
        </Panel>
      </Collapse>
      {/* ───────────────────────────────────────────────────────────────────── */}

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        initialValues={formData}
        className="space-y-6"
      >
        {/* 1. VENDOR VISIT DETAILS */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            1. VENDOR VISIT DETAILS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="DATE OF VISIT" name="dateOfVisit">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item label="DATE OF REPORT" name="dateOfReport">
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item
            label="Address of Property (As per site)"
            name="propertyAddress"
          >
            <TextArea rows={3} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="NAME OF THE PERSON WHO VISITED THE SITE"
              name="visitedPersonName"
            >
              <Input />
            </Form.Item>

            <Form.Item label="CONTACT NUMBER" name="contactNumber">
              <Input type="tel" />
            </Form.Item>
          </div>
        </div>

        {/* 2. CONSTRUCTION */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            2. CONSTRUCTION
          </h2>

          <Form.Item
            label="CONSTRUCTION STAGE (AS PER SITE)"
            name="constructionStage"
            tooltip="FOUNDATION / PLINTH / RCC / BRICK WORK / PLASTER / TILING / INTERNAL FINISHING / COMPLETED"
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="CONSTRUCTION (%)" name="constructionPercentage">
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item label="CONSTRUCTION IS AS PER" name="constructionAsPer">
              <Select>
                <Option value="PROVIDED PLANS">PROVIDED PLANS</Option>
                <Option value="BYELAWS">BYELAWS</Option>
                <Option value="BOTH">BOTH</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* 3. AREA */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            3. AREA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="TOTAL CONSIDERED ON SITE (IN SQ.FT)"
              name="total"
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item label="REMARKS" name="areaRemarks">
              <Input />
            </Form.Item>
          </div>

          <LocationPicker
            ref={geoRef}
            onLocationChange={handleLocationChange}
            initialLat={formData.latitude}
            initialLng={formData.longitude}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="OVERALL STATUS" name="overallStatus">
              <Select>
                <Option value="POSITIVE">POSITIVE</Option>
                <Option value="NEGATIVE">NEGATIVE</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="IF NEGATIVE, PLEASE SPECIFY THE REASON"
              name="negativeReason"
            >
              <Input disabled={formData.overallStatus !== "NEGATIVE"} />
            </Form.Item>
          </div>
        </div>

        {/* 4. CERTIFICATE */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            4. CERTIFICATE
          </h2>

          <Form.Item name="certificateText">
            <TextArea rows={4} />
          </Form.Item>
        </div>

        {/* 5. BILLING */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            5. BILLING
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="CHARGES" name="charges">
              <InputNumber
                className="w-full"
                min={0}
                onChange={calculateTotalAmount}
              />
            </Form.Item>

            <Form.Item label="GST % (IF APPLICABLE)" name="gstPercentage">
              <InputNumber
                className="w-full"
                min={0}
                max={100}
                onChange={calculateTotalAmount}
              />
            </Form.Item>

            <Form.Item label="TOTAL" name="totalAmount">
              <InputNumber className="w-full" readOnly />
            </Form.Item>
          </div>
        </div>

        {/* 6. DECLARATION */}
        <div className="border-b pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            6. DECLARATION
          </h2>

          <Form.Item name="declaration1" valuePropName="checked">
            <Checkbox>
              We have no direct or indirect interest in the property valued.
            </Checkbox>
          </Form.Item>

          <Form.Item name="declaration2" valuePropName="checked">
            <Checkbox>
              The property was inspected by our authorized representative and
              info is true.
            </Checkbox>
          </Form.Item>

          <Form.Item label="Additional Declaration" name="declaration3">
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Form.Item label="LATITUDE" name="latitude">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="LONGITUDE" name="longitude">
            <Input readOnly />
          </Form.Item>
        </div>

        {/* 7. SITE PICS */}
        <div className="pb-6">
          <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
            7. SITE PHOTOS
          </h2>
          <ImageUploader
            deleteId={id}
            images={images}
            setImages={setImages}
            setUploadedUrls={setUploadedUrls}
            maxCount={10}
            uploadedImages={uploadedImages}
            url={"home-trench-reports"}
            uploadedUrls={uploadedUrls}
          />
        </div>

        {/* Submit Buttons */}
        <div className="mt-6 text-right">
          <Button
            type="primary"
            size="large"
            onClick={handleSubmitClick}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg mr-5"
          >
            {isEdit ? "Update Report" : "Submit Report"}
          </Button>

          <Button
            type="primary"
            size="large"
            loading={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
            onClick={handleLastUpdate}
          >
            Final Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Trench;
