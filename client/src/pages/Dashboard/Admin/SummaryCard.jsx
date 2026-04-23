import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummaryData } from "../../../redux/features/assignedCase/assignedCasesThunk";
import { getDisplayCity } from "../../../utils/dashboardRecord";

const readValue = (record, paths) => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce(
        (accumulator, key) =>
          accumulator && accumulator[key] !== undefined
            ? accumulator[key]
            : undefined,
        record
      );

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "N/A";
};

const normalizeSummaryRecord = (record, index) => ({
  ...record,
  key: record._id || index,
  customerName: readValue(record, [
    "customerName",
    "visitedPersonName",
    "applicantName",
    "basicDetails.nameOfClient",
    "propertyInfo.applicantName",
    "summary.applicantName",
    "header.contactedPerson",
  ]),
  propertyAddress: readValue(record, [
    "addressLegal",
    "legalAddress",
    "addressSite",
    "propertyAddress",
    "address",
    "locationDetails.propertyAddressAsVisit",
    "locationDetails.propertyAddressAsDocs",
    "propertyInfo.addressAtSite",
    "propertyInfo.addressAsPerDocument",
    "summary.propertyAddress",
  ]),
  constructionStage: readValue(record, [
    "constructionStage",
    "constructionStatus",
    "propertyStatus",
    "percentCompleted",
    "technicalDetails.percentCompletion",
    "valuationDetails.percentageCompletion",
  ]),
  dateOfVisit: readValue(record, [
    "dateOfVisit",
    "dateOfReport",
    "basicDetails.visitDate",
    "header.dateOfVisit",
  ]),
});

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
  },
  {
    title: "Address",
    dataIndex: "propertyAddress",
    key: "propertyAddress",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "Pending", value: "Pending" },
      { text: "Approved", value: "Approved" },
      { text: "Work in Progress", value: "Work in Progress" },
      { text: "FinalSubmitted", value: "FinalSubmitted" },
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
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await dispatch(fetchSummaryData()).unwrap();
        let formattedData = (response?.totalSubmissions || []).map(
          normalizeSummaryRecord
        );

        if (selectedZone) {
          formattedData = formattedData.filter(item => {
            const city = getDisplayCity(item);
            return city.toLowerCase().includes(selectedZone.toLowerCase());
          });
        }

        setTableData(formattedData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [dispatch, selectedZone]);

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
