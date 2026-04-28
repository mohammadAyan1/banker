import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Select } from "antd";
import { useSelector } from "react-redux";

import axiosInstance from "../../../config/axios";

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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    banks: [],
    statuses: [],
  });

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);
  const statusFilter = useMemo(
    () => selectedStatuses.join(","),
    [selectedStatuses]
  );

  const fetchSummaryTable = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/case/summary-data", {
        params: {
          page: currentPage,
          limit: pageSize,
          city: selectedZone || undefined,
          search: debouncedSearch || undefined,
          bankName: bankFilter || undefined,
          status: statusFilter || undefined,
        },
      });

      const items = (response.data?.tableItems || []).map(normalizeSummaryRecord);
      setTableData(items);
      setPagination(
        response.data?.pagination || {
          page: 1,
          limit: pageSize,
          total: items.length,
          totalPages: items.length > 0 ? 1 : 0,
        }
      );
      setFilterOptions(
        response.data?.filterOptions || { banks: [], statuses: [] }
      );
    } catch (error) {
      console.error("Failed to load summary table:", error);
    } finally {
      setLoading(false);
    }
  }, [bankFilter, currentPage, debouncedSearch, pageSize, selectedZone, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchSummaryTable();
  }, [fetchSummaryTable]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Select
          mode="multiple"
          placeholder="Filter by Bank"
          style={{ minWidth: 200 }}
          value={selectedBanks}
          onChange={(values) => {
            setSelectedBanks(values);
            setCurrentPage(1);
          }}
          allowClear
          maxTagCount={2}
        >
          {(filterOptions?.banks || []).map((bank) => (
            <Option key={bank} value={bank}>
              {bank}
            </Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Filter by Status"
          style={{ minWidth: 200 }}
          value={selectedStatuses}
          onChange={(values) => {
            setSelectedStatuses(values);
            setCurrentPage(1);
          }}
          allowClear
          maxTagCount={2}
        >
          {(filterOptions?.statuses || []).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Search all fields..."
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <h1>Summary</h1>
      <Table
        columns={columns}
        dataSource={tableData}
        showSorterTooltip={{ target: "sorter-icon" }}
        bordered
        loading={loading}
        pagination={{
          current: pagination.page || currentPage,
          pageSize: pagination.limit || pageSize,
          total: pagination.total || 0,
          showSizeChanger: true,
        }}
        onChange={(tablePagination) => {
          if (tablePagination.current !== currentPage) {
            setCurrentPage(tablePagination.current);
          }

          if (tablePagination.pageSize !== pageSize) {
            setPageSize(tablePagination.pageSize);
            setCurrentPage(1);
          }
        }}
      />
    </>
  );
};

export default SummaryCard;
