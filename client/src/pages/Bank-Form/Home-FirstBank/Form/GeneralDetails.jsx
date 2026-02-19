
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Table, Divider, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";


const { TextArea } = Input;
const { Option } = Select;

const defaultDocumentData = [
  {
    key: "1",
    type: "NA Converted",
    approvingAuthority: ["Yes", "No"],
    approvalDate: "",
    approvalDetails: "NA",
    file: null,
  },
  {
    key: "2",
    type: "Approved Sanction Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram panchayat (GP)",
      "Collector (Zilla parishad) (ZP)",
      "Architect Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "ENGG MAP",
    file: null,
  },
  {
    key: "3",
    type: "Approved Layout Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram panchayat (GP)",
      "Collector (Zilla parishad) (ZP)",
      "Architect Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "KEY PLAN",
    file: null,
  },
  {
    key: "4",
    type: "Commencement Certificate (if any)",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram panchayat (GP)",
      "Collector (Zilla parishad) (ZP)",
      "Architect Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "NA",
    file: null,
  },
  {
    key: "5",
    type: "Occupancy/Completion Certificate",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram panchayat (GP)",
      "Collector (Zilla parishad) (ZP)",
      "Architect Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "NA",
    file: null,
  },
  {
    key: "6",
    type: "Approved Sub Plotting Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram panchayat (GP)",
      "Collector (Zilla parishad) (ZP)",
      "Architect Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "NA",
    file: null,
  },
];

const GeneralDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [documents, setDocuments] = useState(defaultDocumentData);

  const initialValues = {
    addressLegal: "",
    addressSite: "",
    city: "",
    nearbyLandmark: "",
    projectPinCode: "",
    zone: "RESIDENTIAL",
    projectState: "Madhya Pradesh",
    nameOnSocietyBoard: "N/A",
    nameOnDoor: "N/A",
    latitude: "N/A",
    longitude: "N/A",
    populationCensus2011: "N/A",
    ruralUrban: "Rural",
    statusOfOccupancy: "N/A",
    occupiedBy: "N/A",
    usageOfProperty: "N/A",
    eraApplicable: "No",
    ownershipType: "Freehold",
    numberAndDate: "N/A",
    approvedSubPlottingPlan: "",

  };



  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged) {
      form.setFieldsValue({
        addressLegal: merged.addressLegal || "",
        addressSite: merged.addressSite || "",
        city: merged.city || "",
        nearbyLandmark: merged.nearbyLandmark || "",
        projectPinCode: merged.projectPinCode || "",
        zone: merged.zone || "RESIDENTIAL",
        projectState: merged.projectState || "Madhya Pradesh",
        nameOnSocietyBoard: merged.nameOnSocietyBoard || "",
        nameOnDoor: merged.nameOnDoor || "",
        populationCensus2011: merged.populationCensus2011 || "",
        ruralUrban: merged.ruralUrban || "Rural",
        statusOfOccupancy: merged.statusOfOccupancy || "",
        occupiedBy: merged.occupiedBy || "",
        usageOfProperty: merged.usageOfProperty || "",
        eraApplicable: merged.eraApplicable || "No",
        ownershipType: merged.ownershipType || "Freehold",
        numberAndDate: merged.numberAndDate || "",
      });
      // Optionally handle documents array if needed
    }
  }, [isEdit, extractedData, form]);

  // useEffect(() => {
  //   if (isEdit) {
  //     form.setFieldsValue(isEdit);

  //     // Update document table with existing data
  //     if (isEdit.documents && Array.isArray(isEdit.documents)) {
  //       const updatedDocs = defaultDocumentData.map((defaultDoc) => {
  //         const existing = isEdit.documents.find(
  //           (d) => d.type === defaultDoc.type
  //         );

  //         return {
  //           ...defaultDoc,
  //           ...existing,
  //           selectedApprovingAuthority: existing?.approvingAuthority || "",
  //           approvingAuthority: defaultDoc.approvingAuthority, // Keep the options list consistent
  //         };
  //       });

  //       setDocuments(updatedDocs);
  //     }
  //   }
  // }, [isEdit, form]);



  useEffect(() => {
    if (isEdit?.images) {
      setImages(isEdit.images);
    }
  }, [isEdit]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateField = (key, field, value) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.key === key ? { ...doc, [field]: value } : doc))
    );
  };

  const handleSubmit = (values) => {
    const fullData = {
      ...values,
      images,
      documents: documents.map((doc) => ({
        ...doc,
        approvingAuthority: doc.selectedApprovingAuthority || "",
        approvingAuthorityOptions: doc.approvingAuthority,
      })),
    };
    onNext(fullData);
  };

  const columns = [
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      render: (_, record) => <span>{record.type}</span>,
    },
    {
      title: "Approving Authority",
      dataIndex: "approvingAuthority",
      key: "approvingAuthority",
      render: (_, record) => (
        <Select
          value={record.selectedApprovingAuthority || ""}
          style={{ width: 200 }}
          onChange={(value) =>
            updateField(record.key, "selectedApprovingAuthority", value)
          }
          placeholder='Select'
        >
          {record.approvingAuthority.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Date of approval and Number",
      dataIndex: "approvalDate",
      key: "approvalDate",
      render: (_, record) => (
        <Input
          placeholder='Number & Date'
          defaultValue={record.approvalDate}
          onChange={(e) =>
            updateField(record.key, "approvalDate", e.target.value)
          }
        />
      ),
    },
    {
      title: "Details of Approval",
      dataIndex: "approvalDetails",
      key: "approvalDetails",
      render: (_, record) => (
        <Input
          placeholder='Details'
          defaultValue={record.approvalDetails}
          onChange={(e) =>
            updateField(record.key, "approvalDetails", e.target.value)
          }
        />
      ),
    },
  ];

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>General Details</h2>

      <Form
        layout='vertical'
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        className='grid grid-cols-1 lg:grid-cols-2 gap-4'
      >
        <Form.Item name='addressLegal' label='Address as per Legal Document'>
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>

        <Form.Item name='addressSite' label='Address As per Site'>
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>

        {/* <Form.Item name='city' label='Select your city'>
          <Select>
            <Option value='bhopal'>Bhopal</Option>
            <Option value='indore'>Indore</Option>
            <Option value='jabalpur'>Jabalpur</Option>
            <Option value='gwalior'>Gwalior</Option>
          </Select>
        </Form.Item> */}

        <Form.Item name='city' label='city'>
          <Input />
        </Form.Item>

        <Form.Item name='nearbyLandmark' label='Nearby Landmark'>
          <Input />
        </Form.Item>


        <Form.Item name='projectPinCode' label='Project Pin Code'>
          <Input />
        </Form.Item>


        <Form.Item name='zone' label='Zone'>
          <Select>
            <Option value='RESIDENTIAL'>Residential</Option>
            <Option value='COMMERCIAL'>Commercial</Option>
            <Option value='INDUSTRIAL'>Industrial</Option>
            <Option value='AGRICULTURAL'>Agricultural</Option>
            <Option value='MIXED'>Mixed</Option>
          </Select>
        </Form.Item>

        <Form.Item name='projectState' label='Project State'>
          <Select>
            <Option value='Madhya Pradesh'>Madhya Pradesh</Option>
            <Option value='Maharashtra'>Maharashtra</Option>
            <Option value='Uttar Pradesh'>Uttar Pradesh</Option>
            <Option value='Gujarat'>Gujarat</Option>
            <Option value='Rajasthan'>Rajasthan</Option>
            <Option value='Delhi'>Delhi</Option>
          </Select>
        </Form.Item>

        <Form.Item name='usageOfProperty' label='Usage of the Property'>
          <Input />cd         </Form.Item>

        <Form.Item name='nameOnSocietyBoard' label='Name on Society Board'>
          <Input />
        </Form.Item>

        <Form.Item name='nameOnDoor' label='Name on Door of the Premises'>
          <Input />
        </Form.Item>

        <Form.Item name='populationCensus2011' label='Population Census 2011'>
          <Input />
        </Form.Item>

        <Form.Item name='ruralUrban' label='Rural/Urban'>
          <Select>
            <Option value='Rural'>Rural</Option>
            <Option value='Urban'>Urban</Option>
          </Select>
        </Form.Item>

        <Form.Item name='statusOfOccupancy' label='Status of Occupancy'>
          <Input />
        </Form.Item>

        <Form.Item name='occupiedBy' label='Occupied By'>
          <Input />
        </Form.Item>

        <Form.Item name='usageOfProperty' label='Usage of Property'>
          <Input />
        </Form.Item>

        <Form.Item name='eraApplicable' label='RERA (if applicable)'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item name='ownershipType' label='Ownership Type'>
          <Select>
            <Option value='Freehold'>Freehold</Option>
            <Option value='leasehold'>Leasehold</Option>
          </Select>
        </Form.Item>

        <Form.Item name='numberAndDate' label='Number & Date'>
          <TextArea rows={3} />
        </Form.Item>

        {/* Document Table */}
        <div className='lg:col-span-2'>
          <Divider orientation='left'>DOCUMENT DETAILS</Divider>
          {!isMobile ? (
            <Table
              columns={columns}
              dataSource={documents}
              pagination={false}
              bordered
              rowKey='key'
            />
          ) : (
            documents.map((record) => (
              <div
                key={record.key}
                className='border p-3 rounded bg-gray-50 mb-4'
              >
                <p className='font-semibold'>TYPE: {record.type}</p>
                <Form.Item label='Approving Authority'>
                  <Select
                    value={record.selectedApprovingAuthority || ""}
                    onChange={(value) =>
                      updateField(
                        record.key,
                        "selectedApprovingAuthority",
                        value
                      )
                    }
                  >
                    {record.approvingAuthority.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label='Date & Number'>
                  <Input
                    value={record.approvalDate}
                    onChange={(e) =>
                      updateField(record.key, "approvalDate", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label='Details'>
                  <Input
                    value={record.approvalDetails}
                    onChange={(e) =>
                      updateField(record.key, "approvalDetails", e.target.value)
                    }
                  />
                </Form.Item>
              </div>
            ))
          )}
        </div>

        <Form.Item className='lg:col-span-2 text-end'>
          {onBack && (
            <Button onClick={onBack} className='mr-2'>
              Back
            </Button>
          )}
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralDetails;
