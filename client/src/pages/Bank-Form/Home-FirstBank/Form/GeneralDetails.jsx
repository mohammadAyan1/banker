

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, Divider, Select, Row, Col } from "antd";

const { TextArea } = Input;
const { Option } = Select;

// PDF Section 5 - Property Plan document types
const defaultDocumentData = [
  {
    key: "1",
    type: "NA Converted",
    approvingAuthority: ["Yes", "No", "NA"],
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "2",
    type: "Layout Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram Panchayat (GP)",
      "Collector (Zilla Parishad) (ZP)",
      "Licensed Surveyor Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "3",
    type: "Building Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram Panchayat (GP)",
      "Collector (Zilla Parishad) (ZP)",
      "Licensed Surveyor Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "4",
    type: "Commencement Certificate",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram Panchayat (GP)",
      "Collector (Zilla Parishad) (ZP)",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "5",
    type: "Occupancy / Completion / Building Usage Certificate",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram Panchayat (GP)",
      "Collector (Zilla Parishad) (ZP)",
      "Licensed Surveyor Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "6",
    type: "Sub Plotting Plan",
    approvingAuthority: [
      "Municipal/Town Planning (TP)",
      "Gram Panchayat (GP)",
      "Collector (Zilla Parishad) (ZP)",
      "Licensed Surveyor Plan",
      "No",
    ],
    approvalDate: "",
    approvalDetails: "",
  },
];

const GeneralDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);
  const [documents, setDocuments] = useState(defaultDocumentData);

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged) {
      form.setFieldsValue({
        nearestCityTown: merged.nearestCityTown || merged.cityCentreName || "",
        locationCategory: merged.locationCategory || "",
        electricityAvailability: merged.electricityAvailability || "",
        waterAvailability: merged.waterAvailability || "",
        drainageAvailability: merged.drainageAvailability || "",
      });

      // Restore documents if saved
      if (merged.documents && Array.isArray(merged.documents)) {
        const updatedDocs = defaultDocumentData.map((defaultDoc) => {
          const existing = merged.documents.find((d) => d.type === defaultDoc.type);
          return {
            ...defaultDoc,
            ...existing,
            selectedApprovingAuthority: existing?.approvingAuthority || "",
            approvingAuthority: defaultDoc.approvingAuthority,
          };
        });
        setDocuments(updatedDocs);
      }
    }
  }, [isEdit, extractedData, form]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
      documents: documents.map((doc) => ({
        key: doc.key,
        type: doc.type,
        approvingAuthority: doc.selectedApprovingAuthority || "",
        approvalDate: doc.approvalDate,
        approvalDetails: doc.approvalDetails,
      })),
    };
    onNext(fullData);
  };

  const columns = [
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      render: (_, record) => <span className="font-medium">{record.type}</span>,
    },
    {
      title: "Approving Authority",
      dataIndex: "approvingAuthority",
      key: "approvingAuthority",
      render: (_, record) => (
        <Select
          value={record.selectedApprovingAuthority || ""}
          style={{ width: 220 }}
          onChange={(value) => updateField(record.key, "selectedApprovingAuthority", value)}
          placeholder="Select"
          allowClear
        >
          {record.approvingAuthority.map((option) => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Plan Number / Date",
      dataIndex: "approvalDate",
      key: "approvalDate",
      render: (_, record) => (
        <Input
          placeholder="Number & Date"
          defaultValue={record.approvalDate}
          onChange={(e) => updateField(record.key, "approvalDate", e.target.value)}
        />
      ),
    },
    {
      title: "Details",
      dataIndex: "approvalDetails",
      key: "approvalDetails",
      render: (_, record) => (
        <Input
          placeholder="Details"
          defaultValue={record.approvalDetails}
          onChange={(e) => updateField(record.key, "approvalDetails", e.target.value)}
        />
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Property Plan & Availability</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Nearest City / Location Category */}
        <Divider orientation="left" className="lg:col-span-2">Location Info</Divider>

        <Form.Item name="nearestCityTown" label="Nearest City / Town">
          <Input />
        </Form.Item>

        <Form.Item name="locationCategory" label="Location Category (TP / ZP / GP / MC)">
          <Select allowClear className="w-full">
            <Option value="TP">TP – Town Planning</Option>
            <Option value="ZP">ZP – Zilla Parishad</Option>
            <Option value="GP">GP – Gram Panchayat</Option>
            <Option value="MC">MC – Municipal Corporation</Option>
          </Select>
        </Form.Item>

        {/* Availability */}
        <Divider orientation="left" className="lg:col-span-2">Availability</Divider>

        <Form.Item name="electricityAvailability" label="Electricity">
          <Select allowClear className="w-full">
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
            <Option value="NA">NA</Option>
          </Select>
        </Form.Item>

        <Form.Item name="waterAvailability" label="Water">
          <Select allowClear className="w-full">
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
            <Option value="NA">NA</Option>
          </Select>
        </Form.Item>

        <Form.Item name="drainageAvailability" label="Drainage">
          <Select allowClear className="w-full">
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
            <Option value="NA">NA</Option>
          </Select>
        </Form.Item>

        {/* Document / Plan Table */}
        <div className="lg:col-span-2">
          <Divider orientation="left">PROPERTY PLAN DETAILS</Divider>
          {!isMobile ? (
            <Table
              columns={columns}
              dataSource={documents}
              pagination={false}
              bordered
              rowKey="key"
            />
          ) : (
            documents.map((record) => (
              <div key={record.key} className="border p-3 rounded bg-gray-50 mb-4">
                <p className="font-semibold mb-2">TYPE: {record.type}</p>
                <Form.Item label="Approving Authority">
                  <Select
                    value={record.selectedApprovingAuthority || ""}
                    onChange={(value) => updateField(record.key, "selectedApprovingAuthority", value)}
                    className="w-full"
                    allowClear
                  >
                    {record.approvingAuthority.map((option) => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Plan Number & Date">
                  <Input
                    value={record.approvalDate}
                    onChange={(e) => updateField(record.key, "approvalDate", e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Details">
                  <Input
                    value={record.approvalDetails}
                    onChange={(e) => updateField(record.key, "approvalDetails", e.target.value)}
                  />
                </Form.Item>
              </div>
            ))
          )}
        </div>

        <Form.Item className="lg:col-span-2 text-end">
          {onBack && (
            <Button onClick={onBack} className="mr-2">Back</Button>
          )}
          <Button type="primary" htmlType="submit">Next</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralDetails;
