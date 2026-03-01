// import dayjs from "dayjs";
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Form,
//   Input,
//   Button,
//   Upload,
//   DatePicker,
//   Select,
//   Row,
//   Modal,
//   Spin,
// } from "antd";
// import GeoLocationInput from "../../../../components/GeoLocationInput";
// import toast from "react-hot-toast";
// import ImageUploader from "../../../../components/ImageUploader";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useParams } from "react-router-dom";
// import DocumentUploader from "../../../../components/DocumentUploader";

// const { TextArea } = Input;
// const { Option } = Select;

// const LNTAssignmentDetails = ({ isEdit, onNext, extractedData, fetchData }) => {



//   const { user } = useSelector((state) => state.auth);
//   const [form] = Form.useForm();
//   const [images, setImages] = useState([]);
//   const [uploadedImages, setUploadedImagess] = useState([]);

//   const { id } = useParams();

//   const [uploadedUrls, setUploadedUrls] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [docUrls, setDocUrls] = useState([]); // <-- new state for document URLs


//   const initialValues = {
//     customerName: "",
//     customerNo: "",
//     propertyName: "",
//     personMetDuringVisit: "N/A",
//     personContactNo: "N/A",
//     typeOfLoan: "N/A",
//     dateOfReport: null,
//     refNo: "N/A",
//     evaluationType: "N/A",
//     unitType: "N/A",
//     documentsAvailable: "N/A",
//     // latitude: "",
//     // longitude: "",
//   };

//   const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

//   // useEffect(() => {
//   //   if (isEdit) {
//   //     // Try parsing date safely
//   //     const parsedDate = isEdit.dateOfReport
//   //       ? moment(isEdit.dateOfReport, moment.ISO_8601, true).isValid()
//   //         ? moment(isEdit.dateOfReport) // ISO format
//   //         : moment(isEdit.dateOfReport, "DD.MM.YYYY") // fallback format
//   //       : null;

//   //     form.setFieldsValue({
//   //       customerName: isEdit.customerName || "",
//   //       customerNo: isEdit.customerNo || "",
//   //       personMetDuringVisit: isEdit.personMetDuringVisit || "",
//   //       personContactNo: isEdit.personContactNo || "",
//   //       typeOfLoan: isEdit.typeOfLoan || "",
//   //       dateOfReport: parsedDate,
//   //       refNo: isEdit.refNo || "N/A",
//   //       evaluationType: isEdit.evaluationType || "",
//   //       unitType: isEdit.unitType || "",
//   //       documentsAvailable:
//   //         isEdit.documentsAvailable ||
//   //         "A.T.S, DRAFT SALE AGREEMENT, SALE DEED,  ENGG. MAP, KEY-PLAN",
//   //       latitude: isEdit.latitude || "",
//   //       longitude: isEdit.longitude || "",
//   //     });

//   //     if (isEdit.imageUrls && Array.isArray(isEdit.imageUrls)) {
//   //       const fileListFromServer = isEdit.imageUrls.map((url, index) => ({
//   //         uid: `server-${index}`,
//   //         name: url.split("/").pop(),
//   //         status: "done",
//   //         url,
//   //       }));
//   //       setImages(fileListFromServer);
//   //       setUploadedUrls(isEdit.imageUrls);
//   //     }
//   //   }
//   // }, [isEdit, form]);


//   useEffect(() => {
//     const merged = { ...extractedData, ...isEdit };

//     console.log(merged);


//     setUploadedImagess(merged?.imageUrls)
//     setDocUrls(merged?.AttachDocuments)


//     if (merged) {
//       const parsedDate = merged.dateOfReport
//         ? moment(merged.dateOfReport, moment.ISO_8601, true).isValid()
//           ? moment(merged.dateOfReport)
//           : moment(merged.dateOfReport, "DD.MM.YYYY")
//         : null;

//       form.setFieldsValue({
//         customerName: merged.customerName || "",
//         customerNo: merged.customerNo || "",
//         propertyName: merged.propertyName || "",
//         personMetDuringVisit: merged.personMetDuringVisit || "",
//         personContactNo: merged.personContactNo || "",
//         typeOfLoan: merged.typeOfLoan || "",
//         dateOfReport: parsedDate,
//         refNo: merged.refNo || "",
//         evaluationType: merged.evaluationType || "",
//         unitType: merged.unitType || "",
//         documentsAvailable: merged.documentsAvailable || "",
//         latitude: merged.latitude || "",
//         longitude: merged.longitude || "",
//       });
//     }
//   }, [isEdit, extractedData, form]);


//   const geoRef = useRef();

//   useEffect(() => {
//     if (user.role === "FieldOfficer") {
//       const timeout = setTimeout(() => {

//         console.log(geoRef?.current?.getLocation());


//         geoRef.current?.getLocation();
//       }, 100); // slight delay so ref can attach

//       return () => clearTimeout(timeout);
//     }
//   }, [user.role, uploadedUrls]);

//   const handleSubmit = async (values) => {
//     if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
//       toast.error("Please upload images before submitting");
//       return;
//     }

//     setLoading(true);

//     console.log(docUrls, "ASDFGHJKL")

//     try {
//       const fullData = {
//         ...values,
//         imageUrls: uploadedUrls,
//         AttachDocuments: docUrls, // <-- include document URLs
//       };

//       // if (user.role === "FieldOfficer") {
//       //   Modal.confirm({
//       //     title: "Confirm Submission",
//       //     content: "Are you sure you want to submit the report?",
//       //     okText: "Yes, Submit",
//       //     cancelText: "Cancel",
//       //     onOk() {
//       //       onNext(fullData); // ✅ actual submission
//       //     },
//       //   });

//       //   console.log("end");
//       // } else {
//       onNext(fullData); // for non-FieldOfficer
//       // }
//       // toast.success("Saved Successfully");
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Spin />;
//   }

//   return (
//     <div className='max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded shadow'>
//       <h2 className='text-2xl font-bold mb-6'>L & T ASSIGNMENT DETAILS </h2>

//       <Form
//         layout='vertical'
//         form={form}
//         initialValues={initialValues}
//         onFinish={handleSubmit}
//         className='grid grid-cols-2 gap-4'
//       >
//         <Form.Item name='customerName' label='Customer Name'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='customerNo' label='Customer No.'>
//           <Input />
//         </Form.Item>
//         <Form.Item name='propertyName' label='Property Name'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='personMetDuringVisit' label='Person Met During Visit'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='personContactNo' label='Person Contact No.'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='typeOfLoan' label='Type of Loan'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='dateOfReport' label='Date of Report'>
//           <DatePicker className='w-full' format='DD.MM.YYYY' />
//         </Form.Item>

//         <Form.Item name='refNo' label='Reference No.'>
//           <Input />
//         </Form.Item>

//         <Form.Item name='evaluationType' label='Evaluation Type'>
//           <Select allowClear className='w-full'>
//             <Option value='One Off'>One Off</Option>
//             <Option value='Regular'>Regular</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item name='unitType' label='Unit Type'>
//           <Select allowClear className='w-full'>
//             <Option value='Individual House'>Individual House</Option>
//             <Option value='Flat'>Flat</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           className='col-span-2'
//           name='documentsAvailable'
//           label='Documents Available for perusal'
//         >
//           <TextArea rows={2} />
//         </Form.Item>

//         <div className='col-span-2'>
//           {user.role === "FieldOfficer" ? (
//             <GeoLocationInput ref={geoRef} />
//           ) : (
//             <>
//               <Form.Item name='latitude' label='Latitude'>
//                 <Input placeholder='Latitude' />
//               </Form.Item>

//               <Form.Item name='longitude' label='Longitude'>
//                 <Input placeholder='Longitude' />
//               </Form.Item>
//             </>
//           )}
//         </div>

//         <div className='col-span-2 !flex'>
//           {/* <ImageUploader images={images} setImages={setImages} /> */}
//           <ImageUploader
//             deleteId={id}
//             images={images}
//             setImages={setImages}
//             setUploadedUrls={setUploadedUrls}
//             uploadedImages={uploadedImages}
//             uploadedUrls={uploadedUrls}
//             fetchData={fetchData}

//           />
//         </div>

//         <div className="col-span-2 mt-4">
//           <DocumentUploader
//             caseId={id}                // for server-side delete
//             bankName="first-bank"
//             docUrls={docUrls}
//             setDocUrls={setDocUrls}
//             fetchData={fetchData}
//           />
//         </div>

//         <Form.Item className='col-span-2 text-end'>
//           <Button
//             type='primary'
//             htmlType='submit'
//             className='mt-4'
//           // disabled={user.role === "FieldOfficer" && uploadedUrls.length === 0}
//           >
//             {user.role === "FieldOfficer" ? "Submit" : "Next"}
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default LNTAssignmentDetails;



import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Spin,
} from "antd";
import GeoLocationInput from "../../../../components/GeoLocationInput";
import toast from "react-hot-toast";
import ImageUploader from "../../../../components/ImageUploader";
import { useSelector } from "react-redux";
import moment from "moment";
import { useParams } from "react-router-dom";
import DocumentUploader from "../../../../components/DocumentUploader";

const { TextArea } = Input;
const { Option } = Select;

const LNTAssignmentDetails = ({ isEdit, onNext, extractedData, fetchData }) => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImagess] = useState([]);
  const { id } = useParams();
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docUrls, setDocUrls] = useState([]);

  const initialValues = {
    customerName: "",
    customerNo: "",
    propertyName: "",
    personMetDuringVisit: "N/A",
    personContactNo: "N/A",
    relationshipOfPersonMet: "SELF",
    propertyOwnerName: "",
    howFoundOwnerName: "SALE DEED",
    typeOfLoan: "N/A",
    dateOfReport: null,
    refNo: "N/A",
    evaluationType: "N/A",
    unitType: "OPEN PLOT",
    propertyCategory: "INDIVIDUAL",
    propertyLocation: "Town",
    populationCensus2011: "Btw 10000 to 1.0 Lac",
    ruralUrban: "URBAN",
    zone: "Residential",
    propertyAreaLimits: "Municipal",
    eraApplicable: "NA",
    documentsAvailable: "YES",
    nameOnSocietyBoard: "NA",
    addressLegal: "",
    addressSite: "",
    nameOnDoor: "NA",
    nearbyLandmark: "",
    statusOfOccupancy: "Vacant",
    occupiedBy: "SELF",
    usageOfProperty: "Residential",
    propertyEasilyIdentifiable: "YES",
  };

  const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    setUploadedImagess(merged?.imageUrls);
    setDocUrls(merged?.AttachDocuments);

    if (merged) {
      const parsedDate = merged.dateOfReport
        ? moment(merged.dateOfReport, moment.ISO_8601, true).isValid()
          ? moment(merged.dateOfReport)
          : moment(merged.dateOfReport, "DD.MM.YYYY")
        : null;

      form.setFieldsValue({
        customerName: merged.customerName || "",
        customerNo: merged.customerNo || "",
        propertyName: merged.propertyName || "",
        personMetDuringVisit: merged.personMetDuringVisit || "",
        personContactNo: merged.personContactNo || "",
        relationshipOfPersonMet: merged.relationshipOfPersonMet || "",
        propertyOwnerName: merged.propertyOwnerName || "",
        howFoundOwnerName: merged.howFoundOwnerName || "",
        typeOfLoan: merged.typeOfLoan || "",
        dateOfReport: parsedDate,
        refNo: merged.refNo || "",
        evaluationType: merged.evaluationType || "",
        unitType: merged.unitType || "",
        propertyCategory: merged.propertyCategory || "",
        propertyLocation: merged.propertyLocation || "",
        populationCensus2011: merged.populationCensus2011 || "",
        ruralUrban: merged.ruralUrban || "",
        zone: merged.zone || "",
        propertyAreaLimits: merged.propertyAreaLimits || "",
        eraApplicable: merged.eraApplicable || "",
        documentsAvailable: merged.documentsAvailable || "",
        nameOnSocietyBoard: merged.nameOnSocietyBoard || "",
        addressLegal: merged.addressLegal || "",
        addressSite: merged.addressSite || "",
        nameOnDoor: merged.nameOnDoor || "",
        nearbyLandmark: merged.nearbyLandmark || "",
        statusOfOccupancy: merged.statusOfOccupancy || "",
        occupiedBy: merged.occupiedBy || "",
        usageOfProperty: merged.usageOfProperty || "",
        propertyEasilyIdentifiable: merged.propertyEasilyIdentifiable || "",
        latitude: merged.latitude || "",
        longitude: merged.longitude || "",
      });
    }
  }, [isEdit, extractedData, form]);

  const geoRef = useRef();

  useEffect(() => {
    if (user.role === "FieldOfficer") {
      const timeout = setTimeout(() => {
        geoRef.current?.getLocation();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user.role, uploadedUrls]);

  const handleSubmit = async (values) => {
    if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
      toast.error("Please upload images before submitting");
      return;
    }
    setLoading(true);
    try {
      const fullData = {
        ...values,
        imageUrls: uploadedUrls,
        AttachDocuments: docUrls,
      };
      onNext(fullData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">GENERAL DETAILS</h2>

      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        {/* ── Section 1: Vendor / Assignment ── */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 border-b pb-1">Assignment Info</h3>
        </div>

        <Form.Item name="refNo" label="Loan Account No. (LAI)">
          <Input />
        </Form.Item>

        <Form.Item name="dateOfReport" label="Date">
          <DatePicker className="w-full" format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item name="projectPinCode" label="Pin Code">
          <Input />
        </Form.Item>

        {/* ── Section 2: Property Overview ── */}
        <div className="col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 border-b pb-1">Property Overview</h3>
        </div>

        <Form.Item name="propertyCategory" label="Property Category (Project / Individual)">
          <Select allowClear className="w-full">
            <Option value="INDIVIDUAL">Individual</Option>
            <Option value="PROJECT">Project</Option>
          </Select>
        </Form.Item>

        <Form.Item name="unitType" label="Property Type">
          <Select allowClear className="w-full">
            <Option value="Apartment">Apartment</Option>
            <Option value="Row House">Row House</Option>
            <Option value="Individual House">Individual House</Option>
            <Option value="Shop">Shop</Option>
            <Option value="Office">Office</Option>
            <Option value="Industrial">Industrial</Option>
            <Option value="OPEN PLOT">Open Plot</Option>
            <Option value="Flat">Flat</Option>
          </Select>
        </Form.Item>

        <Form.Item name="typeOfLoan" label="Type of Loan">
          <Input />
        </Form.Item>

        <Form.Item name="propertyLocation" label="Property Location">
          <Select allowClear className="w-full">
            <Option value="Town">Town</Option>
            <Option value="Village">Village</Option>
            <Option value="City">City</Option>
          </Select>
        </Form.Item>

        <Form.Item name="populationCensus2011" label="Population as per Census 2011">
          <Select allowClear className="w-full">
            <Option value="Less than 10000">Less than 10000</Option>
            <Option value="Btw 10000 to 1.0 Lac">Btw 10000 to 1.0 Lac</Option>
            <Option value="Above 1.0 Lac">Above 1.0 Lac</Option>
          </Select>
        </Form.Item>

        <Form.Item name="ruralUrban" label="Rural / Urban (>10k = Urban)">
          <Select allowClear className="w-full">
            <Option value="URBAN">Urban</Option>
            <Option value="RURAL">Rural</Option>
          </Select>
        </Form.Item>

        <Form.Item name="zone" label="Zone">
          <Select allowClear className="w-full">
            <Option value="Residential">Residential</Option>
            <Option value="Commercial">Commercial</Option>
            <Option value="Industrial">Industrial</Option>
            <Option value="Agricultural">Agricultural</Option>
            <Option value="Mixed">Mixed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="propertyAreaLimits" label="Property Area Limits">
          <Select allowClear className="w-full">
            <Option value="Municipal">Municipal</Option>
            <Option value="Gram Panchayat">Gram Panchayat</Option>
            <Option value="Town Planning">Town Planning</Option>
            <Option value="Collector">Collector</Option>
          </Select>
        </Form.Item>

        <Form.Item name="eraApplicable" label="RERA No. (If applicable)">
          <Input />
        </Form.Item>

        {/* ── Section 3: Visit Details ── */}
        <div className="col-span-2 mt-2">
          <h3 className="text-lg font-semibold text-blue-700 mb-2 border-b pb-1">Visit Details</h3>
        </div>

        <Form.Item name="customerName" label="Applicant Name">
          <Input />
        </Form.Item>

        <Form.Item name="customerNo" label="Mobile No.">
          <Input />
        </Form.Item>

        <Form.Item name="personMetDuringVisit" label="Person Met At Site">
          <Input />
        </Form.Item>

        <Form.Item name="relationshipOfPersonMet" label="Relationship of Person Met and Property">
          <Select allowClear className="w-full">
            <Option value="SELF">Self</Option>
            <Option value="Owner">Owner</Option>
            <Option value="Tenant">Tenant</Option>
            <Option value="Caretaker">Caretaker</Option>
            <Option value="Neighbor">Neighbor</Option>
          </Select>
        </Form.Item>

        <Form.Item name="propertyOwnerName" label="Property Owner's Name" className="col-span-2">
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item name="howFoundOwnerName" label="How did you find out property owner's name?">
          <Select allowClear className="w-full">
            <Option value="SALE DEED">Sale Deed</Option>
            <Option value="Neighbor">Neighbor</Option>
            <Option value="Self">Self</Option>
            <Option value="Municipal Records">Municipal Records</Option>
          </Select>
        </Form.Item>

        <Form.Item name="documentsAvailable" label="Property Documents Available?">
          <Select allowClear className="w-full">
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
          </Select>
        </Form.Item>

        <Form.Item name="nameOnSocietyBoard" label="Name on Society Board / Signage">
          <Input />
        </Form.Item>

        <Form.Item name="addressLegal" label="Address as per Legal Document" className="col-span-2">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="addressSite" label="Address of Property (As per Site)" className="col-span-2">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="nameOnDoor" label="Name on Door of the Premises">
          <Input />
        </Form.Item>

        <Form.Item name="nearbyLandmark" label="Nearby Landmark (within 500m)">
          <Input />
        </Form.Item>

        <Form.Item name="statusOfOccupancy" label="Occupancy">
          <Select allowClear className="w-full">
            <Option value="Vacant">Vacant</Option>
            <Option value="Occupied">Occupied</Option>
            <Option value="Partially Occupied">Partially Occupied</Option>
          </Select>
        </Form.Item>

        <Form.Item name="occupiedBy" label="Occupied By">
          <Input />
        </Form.Item>

        <Form.Item name="usageOfProperty" label="Usage">
          <Select allowClear className="w-full">
            <Option value="Residential">Residential</Option>
            <Option value="Commercial">Commercial</Option>
            <Option value="Mixed">Mixed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="propertyEasilyIdentifiable" label="Property Easily Identifiable?">
          <Select allowClear className="w-full">
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
          </Select>
        </Form.Item>

        {/* ── Geo Location ── */}
        <div className="col-span-2">
          {user.role === "FieldOfficer" ? (
            <GeoLocationInput ref={geoRef} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="latitude" label="Latitude">
                <Input placeholder="Latitude" />
              </Form.Item>
              <Form.Item name="longitude" label="Longitude">
                <Input placeholder="Longitude" />
              </Form.Item>
            </div>
          )}
        </div>

        {/* ── Images ── */}
        <div className="col-span-2 !flex">
          <ImageUploader
            deleteId={id}
            images={images}
            setImages={setImages}
            setUploadedUrls={setUploadedUrls}
            uploadedImages={uploadedImages}
            uploadedUrls={uploadedUrls}
            fetchData={fetchData}
          />
        </div>

        {/* ── Documents ── */}
        <div className="col-span-2 mt-4">
          <DocumentUploader
            caseId={id}
            bankName="first-bank"
            docUrls={docUrls}
            setDocUrls={setDocUrls}
            fetchData={fetchData}
          />
        </div>

        <Form.Item className="col-span-2 text-end">
          <Button type="primary" htmlType="submit" className="mt-4">
            {user.role === "FieldOfficer" ? "Submit" : "Next"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LNTAssignmentDetails;
