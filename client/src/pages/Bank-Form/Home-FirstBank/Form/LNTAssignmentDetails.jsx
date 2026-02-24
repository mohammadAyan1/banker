import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  DatePicker,
  Select,
  Row,
  Modal,
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

  const [docUrls, setDocUrls] = useState([]); // <-- new state for document URLs


  const initialValues = {
    customerName: "",
    customerNo: "",
    propertyName: "",
    personMetDuringVisit: "N/A",
    personContactNo: "N/A",
    typeOfLoan: "N/A",
    dateOfReport: null,
    refNo: "N/A",
    evaluationType: "N/A",
    unitType: "N/A",
    documentsAvailable: "N/A",
    // latitude: "",
    // longitude: "",
  };

  const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

  // useEffect(() => {
  //   if (isEdit) {
  //     // Try parsing date safely
  //     const parsedDate = isEdit.dateOfReport
  //       ? moment(isEdit.dateOfReport, moment.ISO_8601, true).isValid()
  //         ? moment(isEdit.dateOfReport) // ISO format
  //         : moment(isEdit.dateOfReport, "DD.MM.YYYY") // fallback format
  //       : null;

  //     form.setFieldsValue({
  //       customerName: isEdit.customerName || "",
  //       customerNo: isEdit.customerNo || "",
  //       personMetDuringVisit: isEdit.personMetDuringVisit || "",
  //       personContactNo: isEdit.personContactNo || "",
  //       typeOfLoan: isEdit.typeOfLoan || "",
  //       dateOfReport: parsedDate,
  //       refNo: isEdit.refNo || "N/A",
  //       evaluationType: isEdit.evaluationType || "",
  //       unitType: isEdit.unitType || "",
  //       documentsAvailable:
  //         isEdit.documentsAvailable ||
  //         "A.T.S, DRAFT SALE AGREEMENT, SALE DEED,  ENGG. MAP, KEY-PLAN",
  //       latitude: isEdit.latitude || "",
  //       longitude: isEdit.longitude || "",
  //     });

  //     if (isEdit.imageUrls && Array.isArray(isEdit.imageUrls)) {
  //       const fileListFromServer = isEdit.imageUrls.map((url, index) => ({
  //         uid: `server-${index}`,
  //         name: url.split("/").pop(),
  //         status: "done",
  //         url,
  //       }));
  //       setImages(fileListFromServer);
  //       setUploadedUrls(isEdit.imageUrls);
  //     }
  //   }
  // }, [isEdit, form]);


  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };

    console.log(merged);


    setUploadedImagess(merged?.imageUrls)
    setDocUrls(merged?.AttachDocuments)


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
        typeOfLoan: merged.typeOfLoan || "",
        dateOfReport: parsedDate,
        refNo: merged.refNo || "",
        evaluationType: merged.evaluationType || "",
        unitType: merged.unitType || "",
        documentsAvailable: merged.documentsAvailable || "",
        latitude: merged.latitude || "",
        longitude: merged.longitude || "",
      });
    }
  }, [isEdit, extractedData, form]);


  const geoRef = useRef();

  useEffect(() => {
    if (user.role === "FieldOfficer") {
      const timeout = setTimeout(() => {

        console.log(geoRef?.current?.getLocation());


        geoRef.current?.getLocation();
      }, 100); // slight delay so ref can attach

      return () => clearTimeout(timeout);
    }
  }, [user.role, uploadedUrls]);

  const handleSubmit = async (values) => {
    if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
      toast.error("Please upload images before submitting");
      return;
    }

    setLoading(true);

    console.log(docUrls, "ASDFGHJKL")

    try {
      const fullData = {
        ...values,
        imageUrls: uploadedUrls,
        AttachDocuments: docUrls, // <-- include document URLs
      };

      // if (user.role === "FieldOfficer") {
      //   Modal.confirm({
      //     title: "Confirm Submission",
      //     content: "Are you sure you want to submit the report?",
      //     okText: "Yes, Submit",
      //     cancelText: "Cancel",
      //     onOk() {
      //       onNext(fullData); // ✅ actual submission
      //     },
      //   });

      //   console.log("end");
      // } else {
      onNext(fullData); // for non-FieldOfficer
      // }
      // toast.success("Saved Successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className='max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>L & T ASSIGNMENT DETAILS </h2>

      <Form
        layout='vertical'
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        className='grid grid-cols-2 gap-4'
      >
        <Form.Item name='customerName' label='Customer Name'>
          <Input />
        </Form.Item>

        <Form.Item name='customerNo' label='Customer No.'>
          <Input />
        </Form.Item>
        <Form.Item name='propertyName' label='Property Name'>
          <Input />
        </Form.Item>

        <Form.Item name='personMetDuringVisit' label='Person Met During Visit'>
          <Input />
        </Form.Item>

        <Form.Item name='personContactNo' label='Person Contact No.'>
          <Input />
        </Form.Item>

        <Form.Item name='typeOfLoan' label='Type of Loan'>
          <Input />
        </Form.Item>

        <Form.Item name='dateOfReport' label='Date of Report'>
          <DatePicker className='w-full' format='DD.MM.YYYY' />
        </Form.Item>

        <Form.Item name='refNo' label='Reference No.'>
          <Input />
        </Form.Item>

        <Form.Item name='evaluationType' label='Evaluation Type'>
          <Select allowClear className='w-full'>
            <Option value='One Off'>One Off</Option>
            <Option value='Regular'>Regular</Option>
          </Select>
        </Form.Item>

        <Form.Item name='unitType' label='Unit Type'>
          <Select allowClear className='w-full'>
            <Option value='Individual House'>Individual House</Option>
            <Option value='Flat'>Flat</Option>
          </Select>
        </Form.Item>

        <Form.Item
          className='col-span-2'
          name='documentsAvailable'
          label='Documents Available for perusal'
        >
          <TextArea rows={2} />
        </Form.Item>

        <div className='col-span-2'>
          {user.role === "FieldOfficer" ? (
            <GeoLocationInput ref={geoRef} />
          ) : (
            <>
              <Form.Item name='latitude' label='Latitude'>
                <Input placeholder='Latitude' />
              </Form.Item>

              <Form.Item name='longitude' label='Longitude'>
                <Input placeholder='Longitude' />
              </Form.Item>
            </>
          )}
        </div>

        <div className='col-span-2 !flex'>
          {/* <ImageUploader images={images} setImages={setImages} /> */}
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

        <div className="col-span-2 mt-4">
          <DocumentUploader
            caseId={id}                // for server-side delete
            bankName="first-bank"
            docUrls={docUrls}
            setDocUrls={setDocUrls}
            fetchData={fetchData}
          />
        </div>

        <Form.Item className='col-span-2 text-end'>
          <Button
            type='primary'
            htmlType='submit'
            className='mt-4'
          // disabled={user.role === "FieldOfficer" && uploadedUrls.length === 0}
          >
            {user.role === "FieldOfficer" ? "Submit" : "Next"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LNTAssignmentDetails;
