

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
//   Collapse,
//   Tag,
// } from "antd";
// import {
//   ThunderboltOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";
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
// import AutoFillForm from "../../AutoFillForm";           // ← unchanged component
// import { finalUpdate } from "../../../redux/features/case/caseThunks";

// // ── NEW: Adapter utilities (AutoFillForm ko touch nahi kiya) ─────────────────
// import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
// import { TRENCH_MAPPING } from "../../../config/Bankfieldmappings";
// // ─────────────────────────────────────────────────────────────────────────────

// const { TextArea } = Input;
// const { Option } = Select;
// const { Panel } = Collapse;

// // ─────────────────────────────────────────────────────────────────────────────
// // AutoFill status badge — shows which fields were filled and which weren't
// // ─────────────────────────────────────────────────────────────────────────────
// const AutoFillStatus = ({ filledFields, totalMappedFields }) => {
//   if (filledFields.length === 0) return null;

//   // Human-readable labels for Trench field names
//   const FIELD_LABELS = {
//     propertyAddress: "Property Address",
//     dateOfReport: "Date of Report",
//     visitedPersonName: "Visitor Name",
//   };

//   const allFields = Object.keys(TRENCH_MAPPING);
//   const filledSet = new Set(filledFields);

//   return (
//     <div
//       style={{
//         marginTop: 12,
//         padding: "10px 14px",
//         background: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
//         border: "1px solid #bbf7d0",
//         borderRadius: 10,
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 8,
//         alignItems: "center",
//       }}
//     >
//       <span style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginRight: 4 }}>
//         Auto-fill status:
//       </span>
//       {allFields.map((field) => (
//         <Tag
//           key={field}
//           icon={
//             filledSet.has(field) ? (
//               <CheckCircleOutlined />
//             ) : (
//               <CloseCircleOutlined />
//             )
//           }
//           color={filledSet.has(field) ? "success" : "default"}
//           style={{ fontSize: 11 }}
//         >
//           {FIELD_LABELS[field] || field}
//         </Tag>
//       ))}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────────────────────────────────────
// const Trench = () => {
//   const [form] = Form.useForm();

//   const [formData, setFormData] = useState({
//     // 1. VENDOR VISIT DETAILS
//     dateOfVisit: "",
//     dateOfReport: "",
//     propertyAddress: "",
//     visitedPersonName: "",
//     contactNumber: "",
//     laiNo: "",
//     propertyCode: "",


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
//     declaration3: "information furnished in the report is true & correct to the best of our knowledge & as per the documents provided by financial Institution or Property Owner.",

//     // 7. SITE PICS
//     sitePics: [],
//   });

//   // ── AutoFill state ───────────────────────────────────────────────────────
//   const [autoFilledFields, setAutoFilledFields] = useState([]);
//   // ────────────────────────────────────────────────────────────────────────

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

//   // ── AutoFill handler — adapter pattern ──────────────────────────────────
//   //
//   // createAutoFillAdapter:
//   //   1. Receives raw extracted data from AutoFillForm (unchanged)
//   //   2. Translates keys using TRENCH_MAPPING
//   //   3. Calls our callback with only the mapped + non-null fields
//   //
//   // TRENCH_MAPPING sirf Trench ke liye hai — AutoFillForm ko kuch pata nahi.
//   // ─────────────────────────────────────────────────────────────────────────
//   const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mappedData) => {
//     setAutoFilledFields(Object.keys(mappedData));

//     const processedData = { ...mappedData };

//     // Parse dates
//     if (processedData.dateOfReport) {
//       const parsed = dayjs(processedData.dateOfReport, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
//       processedData.dateOfReport = parsed.isValid() ? parsed : null;
//     }
//     if (processedData.dateOfVisit) {
//       const parsed = dayjs(processedData.dateOfVisit, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
//       processedData.dateOfVisit = parsed.isValid() ? parsed : null;
//     }

//     // Map LandArea to total field
//     if (processedData.LandArea) {
//       processedData.total = processedData.LandArea;
//     }

//     // Single state update + sync form
//     setFormData((prev) => ({ ...prev, ...processedData }));
//     form.setFieldsValue(processedData);
//   });
//   // ─────────────────────────────────────────────────────────────────────────

//   // Fetch data if in edit mode
//   useEffect(() => {
//     if (id) {
//       const fetchReportData = async () => {
//         setLoading(true);
//         try {
//           const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
//           setIsEdit(true);

//           const formattedData = {
//             ...response,
//             total: response?.totalAmount,
//             dateOfVisit: response.dateOfVisit ? dayjs(response.dateOfVisit) : null,
//             dateOfReport: response.dateOfReport ? dayjs(response.dateOfReport) : null,
//           };

//           setFormData(formattedData);
//           form.setFieldsValue(formattedData);

//           setUploadedImagess(formattedData?.imageUrls);
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
//     form.setFieldsValue({ latitude: lat, longitude: lng });
//     setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
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
//         dateOfVisit: values.dateOfVisit ? values.dateOfVisit.format("YYYY-MM-DD") : "",
//         dateOfReport: values.dateOfReport ? values.dateOfReport.format("YYYY-MM-DD") : "",
//         imageUrls: uploadedUrls,
//       };


//       console.log('====================================');
//       console.log(fullData);
//       console.log('====================================');

//       if (isEdit) {
//         await dispatch(updateHomeTrenchReport({ id, fullData })).unwrap();
//         toast.success("Report updated successfully");
//       } else {
//         await dispatch(createHomeTrenchReport(fullData)).unwrap();
//         toast.success("Report submitted successfully");
//       }

//       if (user.role === "Admin") navigate("/");
//       else navigate("/field/dashboard");
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
//         dateOfVisit: values.dateOfVisit ? values.dateOfVisit.format("YYYY-MM-DD") : "",
//         dateOfReport: values.dateOfReport ? values.dateOfReport.format("YYYY-MM-DD") : "",
//         imageUrls: uploadedUrls,
//       };

//       await dispatch(
//         finalUpdate({ id, bankName: "HomeFirstTrench", updateData: finalData })
//       ).unwrap();

//       toast.success("Case submitted finally!");
//       if (user.role === "Admin") navigate("/");
//       else navigate("/field/dashboard");
//     } catch (err) {
//       console.error("Final submission failed", err);
//       toast.error("Final submission failed");
//     }
//   };

//   const handleSubmitClick = async () => {
//     if (user.role === "FieldOfficer") {
//       const isValid = await validateForm();
//       if (isValid) setShowConfirm(true);
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
//     <div className="w-full border p-6 bg-white rounded-lg shadow-md">
//       <ConfirmModal
//         visible={showConfirm}
//         onCancel={() => setShowConfirm(false)}
//         onConfirm={handleSubmit}
//         title="Confirm Submission"
//         message="Are you sure you want to submit this report? This action cannot be undone."
//       />

//       <h1 className="text-2xl font-bold mb-6 text-center">
//         {isEdit ? "Edit Trench Report" : "Create New Trench Report"}
//       </h1>

//       {/* ── AUTO-FILL SECTION ──────────────────────────────────────────────── */}
//       <Collapse
//         defaultActiveKey={[]}
//         style={{
//           marginBottom: 28,
//           border: "1.5px solid #6366f1",
//           borderRadius: 12,
//           overflow: "hidden",
//           boxShadow: "0 2px 12px 0 rgba(99,102,241,0.08)",
//         }}
//         expandIconPosition="end"
//       >
//         <Panel
//           key="autofill"
//           header={
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <ThunderboltOutlined
//                 style={{
//                   fontSize: 18,
//                   color: "#6366f1",
//                   filter: "drop-shadow(0 0 4px #a5b4fc)",
//                 }}
//               />
//               <span style={{ fontWeight: 700, fontSize: 15, color: "#3730a3" }}>
//                 Smart Auto-Fill
//               </span>
//               <span
//                 style={{
//                   fontSize: 12,
//                   color: "#6b7280",
//                   fontWeight: 400,
//                   marginLeft: 4,
//                 }}
//               >
//                 — Document upload karo, form automatic bhar jayega
//               </span>
//               {autoFilledFields.length > 0 && (
//                 <Tag
//                   color="success"
//                   style={{ marginLeft: "auto", fontSize: 11 }}
//                 >
//                   ✅ {autoFilledFields.length} field{autoFilledFields.length > 1 ? "s" : ""} filled
//                 </Tag>
//               )}
//             </div>
//           }
//           style={{ background: "#fafafe" }}
//         >
//           {/*
//            * AutoFillForm ko setFormData ki jagah handleAutoFill pass karo.
//            * AutoFillForm ka internal logic bilkul change nahi hua.
//            * Sirf ye adapter us extracted data ko Trench ke field names me map karta hai.
//            */}
//           <AutoFillForm setFormData={handleAutoFill} />

//           <AutoFillStatus
//             filledFields={autoFilledFields}
//             totalMappedFields={Object.keys(TRENCH_MAPPING).length}
//           />
//         </Panel>
//       </Collapse>
//       {/* ───────────────────────────────────────────────────────────────────── */}

//       <Form
//         form={form}
//         layout="vertical"
//         onValuesChange={handleFormChange}
//         initialValues={formData}
//         className="space-y-6"
//       >
//         {/* 1. VENDOR VISIT DETAILS */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             1. VENDOR VISIT DETAILS
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="LAI No" name="laiNo">
//               <Input />
//             </Form.Item>

//             <Form.Item label="PROPERTY CODE-" name="propertyCode">
//               <Input />
//             </Form.Item>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="DATE OF VISIT" name="dateOfVisit">
//               <DatePicker className="w-full" format="YYYY-MM-DD" />
//             </Form.Item>

//             <Form.Item label="DATE OF REPORT" name="dateOfReport">
//               <DatePicker className="w-full" format="YYYY-MM-DD" />
//             </Form.Item>
//           </div>

//           <Form.Item
//             label="Address of Property (As per site)"
//             name="propertyAddress"
//           >
//             <TextArea rows={3} />
//           </Form.Item>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item
//               label="NAME OF THE PERSON WHO VISITED THE SITE"
//               name="visitedPersonName"
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item label="CONTACT NUMBER" name="contactNumber">
//               <Input type="tel" />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 2. CONSTRUCTION */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             2. CONSTRUCTION
//           </h2>

//           <Form.Item
//             label="CONSTRUCTION STAGE (AS PER SITE)"
//             name="constructionStage"
//             tooltip="FOUNDATION / PLINTH / RCC / BRICK WORK / PLASTER / TILING / INTERNAL FINISHING / COMPLETED"
//           >
//             <Input />
//           </Form.Item>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="CONSTRUCTION (%)" name="constructionPercentage">
//               <InputNumber className="w-full" />
//             </Form.Item>

//             <Form.Item label="CONSTRUCTION IS AS PER" name="constructionAsPer">
//               <Select>
//                 <Option value="PROVIDED PLANS">PROVIDED PLANS</Option>
//                 <Option value="BYELAWS">BYELAWS</Option>
//                 <Option value="BOTH">BOTH</Option>
//               </Select>
//             </Form.Item>
//           </div>
//         </div>

//         {/* 3. AREA */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             3. AREA
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item
//               label="TOTAL CONSIDERED ON SITE (IN SQ.FT)"
//               name="total"
//             >
//               <InputNumber className="w-full" min={0} />
//             </Form.Item>

//             <Form.Item label="REMARKS" name="areaRemarks">
//               <Input />
//             </Form.Item>
//           </div>

//           <LocationPicker
//             ref={geoRef}
//             onLocationChange={handleLocationChange}
//             initialLat={formData.latitude}
//             initialLng={formData.longitude}
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="OVERALL STATUS" name="overallStatus">
//               <Select>
//                 <Option value="POSITIVE">POSITIVE</Option>
//                 <Option value="NEGATIVE">NEGATIVE</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item
//               label="IF NEGATIVE, PLEASE SPECIFY THE REASON"
//               name="negativeReason"
//             >
//               <Input disabled={formData.overallStatus !== "NEGATIVE"} />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 4. CERTIFICATE */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             4. CERTIFICATE
//           </h2>

//           <Form.Item name="certificateText">
//             <TextArea rows={4} />
//           </Form.Item>
//         </div>

//         {/* 5. BILLING */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             5. BILLING
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Form.Item label="CHARGES" name="charges">
//               <InputNumber
//                 className="w-full"
//                 min={0}
//                 onChange={calculateTotalAmount}
//               />
//             </Form.Item>

//             <Form.Item label="GST % (IF APPLICABLE)" name="gstPercentage">
//               <InputNumber
//                 className="w-full"
//                 min={0}
//                 max={100}
//                 onChange={calculateTotalAmount}
//               />
//             </Form.Item>

//             <Form.Item label="TOTAL" name="totalAmount">
//               <InputNumber className="w-full" readOnly />
//             </Form.Item>
//           </div>
//         </div>

//         {/* 6. DECLARATION */}
//         <div className="border-b pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
//             6. DECLARATION
//           </h2>

//           <Form.Item name="declaration1" valuePropName="checked">
//             <Checkbox>
//               We have no direct or indirect interest in the property valued.
//             </Checkbox>
//           </Form.Item>

//           <Form.Item name="declaration2" valuePropName="checked">
//             <Checkbox>
//               The property was inspected by our authorized representative and
//               info is true.
//             </Checkbox>
//           </Form.Item>

//           <Form.Item label="Additional Declaration" name="declaration3">
//             <Input />
//           </Form.Item>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//           <Form.Item label="LATITUDE" name="latitude">
//             <Input readOnly />
//           </Form.Item>

//           <Form.Item label="LONGITUDE" name="longitude">
//             <Input readOnly />
//           </Form.Item>
//         </div>

//         {/* 7. SITE PICS */}
//         <div className="pb-6">
//           <h2 className="bg-blue-100 p-3 font-bold mb-4 rounded-lg">
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
//             onCaptureLocation={handleLocationChange}
//           />
//         </div>

//         {/* Submit Buttons */}
//         <div className="mt-6 text-right">
//           <Button
//             type="primary"
//             size="large"
//             onClick={handleSubmitClick}
//             loading={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg mr-5"
//           >
//             {isEdit ? "Update Report" : "Submit Report"}
//           </Button>

//           <Button
//             type="primary"
//             size="large"
//             loading={loading}
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
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
  Tag,
} from "antd";
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { ShowLoading, HideLoading } from "../../../redux/features/alerts/alertSlice";
import {
  createHomeTrenchReport,
  getHomeTrenchReportById,
  updateHomeTrenchReport,
} from "../../../redux/features/Banks/homeTrench/homeTrenchReportThunks";
import ImageUploader from "../../../components/ImageUploader";
import ConfirmModal from "../../../components/ConfirmModal";
import LocationPicker from "../../../components/GeoLocationInput";
import AutoFillForm from "../../AutoFillForm";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
import { TRENCH_MAPPING } from "../../../config/Bankfieldmappings";

const { TextArea } = Input;
const { Option } = Select;

/* ─────────────────────────────────────────────
   AutoFill status badge
───────────────────────────────────────────── */
const AutoFillStatus = ({ filledFields }) => {
  if (filledFields.length === 0) return null;

  const FIELD_LABELS = {
    propertyAddress: "Property Address",
    dateOfReport: "Date of Report",
    visitedPersonName: "Visitor Name",
  };

  const allFields = Object.keys(TRENCH_MAPPING);
  const filledSet = new Set(filledFields);

  return (
    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex flex-wrap gap-2 items-center">
      <span className="text-xs font-semibold text-gray-700 mr-1">Auto-fill status:</span>
      {allFields.map((field) => (
        <Tag
          key={field}
          icon={filledSet.has(field) ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={filledSet.has(field) ? "success" : "default"}
          style={{ fontSize: 11 }}
        >
          {FIELD_LABELS[field] || field}
        </Tag>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Vertical Stepper Accordion Panel
───────────────────────────────────────────── */
const StepPanel = ({ id, label, icon, children, isOpen, onToggle, isLast }) => (
  <div className="flex">
    {/* Left rail */}
    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 52 }}>
      {/* Circle */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 focus:outline-none transition-all duration-200"
        style={{
          width: 36,
          height: 36,
          background: isOpen ? "#1d4ed8" : "#3d4a5c",
          color: "#fff",
          boxShadow: isOpen ? "0 0 0 4px #dbeafe" : "none",
          marginTop: 4,
          zIndex: 1,
        }}
      >
        {icon || id}
      </button>

      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            flex: 1,
            width: 2,
            background: "#d1d5db",
            marginTop: 4,
            minHeight: isOpen ? 16 : 24,
          }}
        />
      )}
    </div>

    {/* Right: title + content */}
    <div className="flex-1 min-w-0" style={{ paddingBottom: isLast ? 8 : 0 }}>
      {/* Title row */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
        style={{ padding: "10px 8px 10px 12px" }}
      >
        <span
          className="text-sm sm:text-base font-semibold transition-colors duration-150"
          style={{ color: isOpen ? "#1d4ed8" : "#111827" }}
        >
          {label}
        </span>
        <svg
          className={`flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ width: 16, height: 16, color: isOpen ? "#1d4ed8" : "#9ca3af" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? 99999 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div style={{ paddingLeft: 12, paddingRight: 8, paddingBottom: 24, paddingTop: 4 }}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Trench = () => {
  const [form] = Form.useForm();
  const [openSections, setOpenSections] = useState({ 0: true }); // 0 = auto-fill

  // const [createdDate, setCreatedDate] = useState(null)


  const [formData, setFormData] = useState({
    dateOfVisit: "",
    dateOfReport: "",
    propertyAddress: "",
    visitedPersonName: "",
    contactNumber: "",
    laiNo: "",
    propertyCode: "",
    constructionStage: "",
    constructionPercentage: "",
    constructionAsPer: "",
    total: "",
    areaRemarks: "",
    latitude: "",
    longitude: "",
    overallStatus: "",
    negativeReason: "",
    certificateText:
      "THIS IS TO CERTIFY THAT, I HAVE VISITED CONSTRUCTION SITE AS PER ABOVE ADDRESS AND FOUND IT COMPLIANT TO THE BYELAWS / PLANS PROVIDED.",
    charges: "",
    gstPercentage: "",
    totalAmount: "",
    declaration1: true,
    declaration2: true,
    declaration3:
      "information furnished in the report is true & correct to the best of our knowledge & as per the documents provided by financial Institution or Property Owner.",
    sitePics: [],
    createdAt: ""
  });

  const [autoFilledFields, setAutoFilledFields] = useState([]);
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

  /* ── Toggle: exclusive (one open at a time) ── */
  const toggleSection = (sectionId) => {
    setOpenSections((prev) =>
      prev[sectionId] ? {} : { [sectionId]: true }
    );
  };

  /* ── AutoFill handler ── */
  const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mappedData) => {
    setAutoFilledFields(Object.keys(mappedData));
    const processedData = { ...mappedData };

    if (processedData.dateOfReport) {
      const parsed = dayjs(processedData.dateOfReport, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
      processedData.dateOfReport = parsed.isValid() ? parsed : null;
    }
    if (processedData.dateOfVisit) {
      const parsed = dayjs(processedData.dateOfVisit, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
      processedData.dateOfVisit = parsed.isValid() ? parsed : null;
    }
    if (processedData.LandArea) processedData.total = processedData.LandArea;

    setFormData((prev) => ({ ...prev, ...processedData }));
    form.setFieldsValue(processedData);
  });

  /* ── Fetch edit data ── */
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setLoading(true);
        try {
          const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
          setIsEdit(true);
          const formattedData = {
            ...response,
            total: response?.totalAmount,
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
          // Edit mode: open all sections
          setOpenSections({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
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

  useEffect(() => {
    if (user.role === "FieldOfficer") {
      const timeout = setTimeout(() => geoRef.current?.getLocation(), 100);
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
    } catch {
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
        createdAt: values.createdAt
          ? values.createdAt.format("YYYY-MM-DD")
          : "",

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
    const total = charges + charges * (gstPercentage / 100);
    form.setFieldsValue({ totalAmount: total.toFixed(2) });
    setFormData((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [formData.charges, formData.gstPercentage]);

  /* ── Section definitions ── */
  const steps = [
    {
      id: 0,
      label: "Smart Auto-Fill",
      icon: <ThunderboltOutlined style={{ fontSize: 15 }} />,
    },
    { id: 1, label: "Vendor Visit Details" },
    { id: 2, label: "Construction" },
    { id: 3, label: "Area" },
    { id: 4, label: "Certificate" },
    { id: 5, label: "Billing" },
    { id: 6, label: "Declaration" },
    { id: 7, label: "Site Photos" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Confirm Submission"
        message="Are you sure you want to submit this report? This action cannot be undone."
      />

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900">
              {isEdit ? "Edit Trench Report" : "New Trench Report"}
            </h1>
            <p className="text-xs text-gray-500">Home First Bank</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold text-blue-700">
          {steps.length} Sections
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          initialValues={formData}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 py-4">
            {steps.map((step, index) => (
              <StepPanel
                key={step.id}
                id={step.id}
                label={step.label}
                icon={step.icon}
                isOpen={!!openSections[step.id]}
                onToggle={toggleSection}
                isLast={index === steps.length - 1}
              >

                {/* ── Section 0: Auto-Fill ── */}
                {step.id === 0 && (
                  <>
                    {autoFilledFields.length > 0 && (
                      <Tag color="success" className="mb-3" style={{ fontSize: 11 }}>
                        ✅ {autoFilledFields.length} field{autoFilledFields.length > 1 ? "s" : ""} filled
                      </Tag>
                    )}
                    <AutoFillForm setFormData={handleAutoFill} />
                    <AutoFillStatus filledFields={autoFilledFields} />
                  </>
                )}

                {/* ── Section 1: Vendor Visit Details ── */}
                {step.id === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="created Date" name="createdAt">
                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item label="LAI No" name="laiNo">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Property Code" name="propertyCode">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="Date of Visit" name="dateOfVisit">
                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item label="Date of Report" name="dateOfReport">
                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                      </Form.Item>
                    </div>
                    <Form.Item label="Address of Property (As per site)" name="propertyAddress">
                      <TextArea rows={3} />
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="Name of Person Who Visited the Site" name="visitedPersonName">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Contact Number" name="contactNumber">
                        <Input type="tel" />
                      </Form.Item>
                    </div>
                  </>
                )}

                {/* ── Section 2: Construction ── */}
                {step.id === 2 && (
                  <>
                    <Form.Item
                      label="Construction Stage (As per site)"
                      name="constructionStage"
                      tooltip="FOUNDATION / PLINTH / RCC / BRICK WORK / PLASTER / TILING / INTERNAL FINISHING / COMPLETED"
                    >
                      <Input />
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="Construction (%)" name="constructionPercentage">
                        <InputNumber className="w-full" />
                      </Form.Item>
                      <Form.Item label="Construction is as per" name="constructionAsPer">
                        <Select>
                          <Option value="PROVIDED PLANS">PROVIDED PLANS</Option>
                          <Option value="BYELAWS">BYELAWS</Option>
                          <Option value="BOTH">BOTH</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </>
                )}

                {/* ── Section 3: Area ── */}
                {step.id === 3 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="Total Considered on Site (in Sq.ft)" name="total">
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>
                      <Form.Item label="Remarks" name="areaRemarks">
                        <Input />
                      </Form.Item>
                    </div>
                    <LocationPicker
                      ref={geoRef}
                      onLocationChange={handleLocationChange}
                      initialLat={formData.latitude}
                      initialLng={formData.longitude}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Form.Item label="Overall Status" name="overallStatus">
                        <Select>
                          <Option value="POSITIVE">POSITIVE</Option>
                          <Option value="NEGATIVE">NEGATIVE</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="If Negative, Specify Reason" name="negativeReason">
                        <Input disabled={formData.overallStatus !== "NEGATIVE"} />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item label="Latitude" name="latitude">
                        <Input readOnly />
                      </Form.Item>
                      <Form.Item label="Longitude" name="longitude">
                        <Input readOnly />
                      </Form.Item>
                    </div>
                  </>
                )}

                {/* ── Section 4: Certificate ── */}
                {step.id === 4 && (
                  <Form.Item name="certificateText">
                    <TextArea rows={4} />
                  </Form.Item>
                )}

                {/* ── Section 5: Billing ── */}
                {step.id === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item label="Charges" name="charges">
                      <InputNumber className="w-full" min={0} onChange={calculateTotalAmount} />
                    </Form.Item>
                    <Form.Item label="GST % (if applicable)" name="gstPercentage">
                      <InputNumber className="w-full" min={0} max={100} onChange={calculateTotalAmount} />
                    </Form.Item>
                    <Form.Item label="Total" name="totalAmount">
                      <InputNumber className="w-full" readOnly />
                    </Form.Item>
                  </div>
                )}

                {/* ── Section 6: Declaration ── */}
                {step.id === 6 && (
                  <>
                    <Form.Item name="declaration1" valuePropName="checked">
                      <Checkbox>
                        We have no direct or indirect interest in the property valued.
                      </Checkbox>
                    </Form.Item>
                    <Form.Item name="declaration2" valuePropName="checked">
                      <Checkbox>
                        The property was inspected by our authorized representative and info is true.
                      </Checkbox>
                    </Form.Item>
                    <Form.Item label="Additional Declaration" name="declaration3">
                      <Input />
                    </Form.Item>
                  </>
                )}

                {/* ── Section 7: Site Photos ── */}
                {step.id === 7 && (
                  <ImageUploader
                    deleteId={id}
                    images={images}
                    setImages={setImages}
                    setUploadedUrls={setUploadedUrls}
                    maxCount={10}
                    uploadedImages={uploadedImages}
                    url={"home-trench-reports"}
                    uploadedUrls={uploadedUrls}
                    onCaptureLocation={handleLocationChange}
                  />
                )}

              </StepPanel>
            ))}
          </div>

          {/* ── Submit Buttons ── */}
          <div className="mt-5 flex justify-end gap-3">
            <Button
              type="primary"
              size="large"
              onClick={handleSubmitClick}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
            >
              {isEdit ? "Update Report" : "Submit Report"}
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              loading={loading}
              onClick={handleLastUpdate}
              className="font-bold rounded-lg"
            >
              Final Submit
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
};

export default Trench;