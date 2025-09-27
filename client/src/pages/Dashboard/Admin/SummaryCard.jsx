import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchSummaryData } from "../../../redux/features/assignedCase/assignedCasesThunk";
import { useDispatch } from "react-redux";

const columns = [
  {
    title: "Bank",
    dataIndex: "bankName",
    key: "bankName",
    sorter: (a, b) => a.bankName.localeCompare(b.bankName),
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
    render: (_, record) =>
      record.customerName || record.visitedPersonName || "N/A",
  },
  {
    title: "Address",
    dataIndex: "propertyAddress",
    key: "propertyAddress",
    render: (_, record) =>
      record.addressLegal || record.propertyAddress || "N/A",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Pending", value: "Pending" },
      { text: "Approved", value: "Approved" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Construction Stage",
    dataIndex: "constructionStage",
    key: "constructionStage",
  },
  {
    title: "Date of Visit",
    dataIndex: "dateOfVisit",
    key: "dateOfVisit",
  },
];

const SummaryCard = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await dispatch(fetchSummaryData()).unwrap();
        console.log("API response:", response);

        // Add a key to each record for the table (AntD requires it)
        const formattedData = (response?.totalSubmissions || []).map((item, index) => ({
          ...item,
          key: item._id || index,
        }));

        setTableData(formattedData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [dispatch]);

  return (
    <>
      <h1>Summary</h1>
      <Table
        columns={columns}
        dataSource={tableData}
        showSorterTooltip={{ target: "sorter-icon" }}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default SummaryCard;
