import React, { useEffect, useState, useMemo } from "react";
import { Table, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummaryData } from "../../../redux/features/assignedCase/assignedCasesThunk";
import { getDisplayCity } from "../../../utils/dashboardRecord";

const { Option } = Select;

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
  
  // ✅ NEW: Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await dispatch(fetchSummaryData()).unwrap();
        const formattedData = (response?.totalSubmissions || []).map(
          normalizeSummaryRecord
        );
        setTableData(formattedData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [dispatch]);

  // ✅ NEW: Get unique banks and statuses dynamically
  const uniqueBanks = useMemo(() => {
    return [...new Set(tableData.map(item => item.bankName).filter(Boolean))];
  }, [tableData]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set(tableData.map(item => item.status).filter(Boolean))];
  }, [tableData]);

  // ✅ NEW: Filtered data with all filters
  const filteredData = useMemo(() => {
    return tableData.filter(item => {
      // Multiple bank filter
      if (selectedBanks.length > 0 && !selectedBanks.includes(item.bankName)) {
        return false;
      }

      // Multiple status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(item.status)) {
        return false;
      }

      // Zone filter
      if (selectedZone) {
        const city = getDisplayCity(item);
        if (!city.toLowerCase().includes(selectedZone.toLowerCase())) {
          return false;
        }
      }

      // Search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const searchableValues = [
          item.bankName,
          item.customerName,
          item.propertyAddress,
          item.status,
          item.constructionStage,
          item.dateOfVisit,
        ];
        
        if (!searchableValues.some(value => 
          String(value || "").toLowerCase().includes(searchLower)
        )) {
          return false;
        }
      }

      return true;
    });
  }, [tableData, selectedBanks, selectedStatuses, selectedZone, searchText]);

  return (
    <>
      {/* ✅ NEW: Filter Row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Select
          mode="multiple"
          placeholder="Filter by Bank"
          style={{ minWidth: 200 }}
          value={selectedBanks}
          onChange={setSelectedBanks}
          allowClear
          maxTagCount={2}
        >
          {uniqueBanks.map(bank => (
            <Option key={bank} value={bank}>{bank}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Filter by Status"
          style={{ minWidth: 200 }}
          value={selectedStatuses}
          onChange={setSelectedStatuses}
          allowClear
          maxTagCount={2}
        >
          {uniqueStatuses.map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>

        <Input
          placeholder="Search all fields..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <h1>Summary</h1>
      <Table
        columns={columns}
        dataSource={filteredData}
        showSorterTooltip={{ target: "sorter-icon" }}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default SummaryCard;