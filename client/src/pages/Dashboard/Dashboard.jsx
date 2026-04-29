import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import CountUp from "react-countup";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import Pending from "./Pending";
import QueryRaised from "./Admin/QueryRaised";
import AssignedCase from "./Admin/AssignedCase";
import MyWorklist from "./MyWorklist";
import FinalSubmittedCase from "./Admin/FinalSubmittedCase";
import CancelledCases from "./Admin/CancelledCases";
import OutOfTATCase from "./Admin/OutOfTatCase";
import SummaryCard from "./Admin/SummaryCard";
import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";
import { fetchNotifications } from "../../redux/features/notification/notificationThunk";
import { fetchSummaryData } from "../../redux/features/assignedCase/assignedCasesThunk";
import axiosInstance from "../../config/axios";

const { Option } = Select;

// Helper to read nested values
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

// Normalize record for All Cases table
const normalizeAllCaseRecord = (record, index) => ({
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
  city: readValue(record, [
    "city",
    "location",
    "propertyCity",
    "locationDetails.city",
  ]),
  status: readValue(record, [
    "status",
    "caseStatus",
  ]),
  createdAt: readValue(record, [
    "createdAt",
    "createdDate",
    "submissionDate",
  ]),
});

// Get row color based on status and created date
const getRowColor = (status, createdAt) => {
  if (!status) return { backgroundColor: "transparent", className: "" };

  const statusLower = status.toLowerCase();

  // Check if pending and older than 48 hours
  if (
    (statusLower === "pending") &&
    createdAt
  ) {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);

    if (hoursDiff > 48) {
      return { 
        backgroundColor: "#FEE2E2", 
        className: "blink-row",
        animation: true 
      };
    }
  }

  if (
    statusLower === "final submitted" ||
    statusLower === "finalsubmitted" ||
    statusLower === "submitted"
  ) {
    return { backgroundColor: "#DCFCE7", className: "" };
  }

  if (
    statusLower === "work in progress" ||
    statusLower === "assigned" ||
    statusLower === "working"
  ) {
    return { backgroundColor: "#FEF9C3", className: "" };
  }

  if (statusLower === "cancelled") {
    return { backgroundColor: "#F3F4F6", className: "" };
  }

  return { backgroundColor: "transparent", className: "" };
};

// Columns for All Cases Table
const allCasesColumns = [
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
    title: "City",
    dataIndex: "city",
    key: "city",
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
    title: "Created Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return isNaN(d.getTime())
        ? date
        : d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
    },
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeComponent, setActiveComponent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Self");

  // All Cases table states
  const [allCasesData, setAllCasesData] = useState([]);
  const [allCasesLoading, setAllCasesLoading] = useState(false);
  const [allCasesPagination, setAllCasesPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedBackMonth, setSelectedBackMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterOptions, setFilterOptions] = useState({
    banks: [],
    statuses: [],
    cities: [],
  });

  const { user, FO: fieldOfficers = [] } = useSelector((state) => state.auth);
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);
  const summaryData = useSelector((state) => state.assignedCases.summary) || {};
  const counts = summaryData?.counts || {};

  useEffect(() => {
    dispatch(fetchFieldOfficers());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSummaryData({ city: selectedZone || undefined }));
  }, [dispatch, selectedZone]);

  // Memoized filter values
  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);
  const statusFilter = useMemo(
    () => selectedStatuses.join(","),
    [selectedStatuses]
  );
  const monthFilter = useMemo(() => selectedMonths.join(","), [selectedMonths]);

  // Fetch All Cases Table Data
  const fetchAllCasesTable = useCallback(async () => {
    try {
      setAllCasesLoading(true);
      const response = await axiosInstance.get("/case/summary-data", {
        params: {
          page: currentPage,
          limit: pageSize,
          city: selectedZone || undefined,
          search: debouncedSearch || undefined,
          bankName: bankFilter || undefined,
          status: statusFilter || undefined,
          months: monthFilter || undefined,
        },
      });

      const items = (response.data?.tableItems || []).map(normalizeAllCaseRecord);
      setAllCasesData(items);
      setAllCasesPagination(
        response.data?.pagination || {
          page: 1,
          limit: pageSize,
          total: items.length,
          totalPages: items.length > 0 ? 1 : 0,
        }
      );
      setFilterOptions(
        response.data?.filterOptions || { banks: [], statuses: [], cities: [] }
      );
    } catch (error) {
      console.error("Failed to load all cases table:", error);
    } finally {
      setAllCasesLoading(false);
    }
  }, [
    bankFilter,
    currentPage,
    debouncedSearch,
    pageSize,
    selectedZone,
    statusFilter,
    monthFilter,
  ]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch data when filters change
  useEffect(() => {
    fetchAllCasesTable();
  }, [fetchAllCasesTable]);

  // Reset page when zone changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone]);

  // Month options
  const monthOptions = useMemo(
    () => [
      { label: "January", value: "January" },
      { label: "February", value: "February" },
      { label: "March", value: "March" },
      { label: "April", value: "April" },
      { label: "May", value: "May" },
      { label: "June", value: "June" },
      { label: "July", value: "July" },
      { label: "August", value: "August" },
      { label: "September", value: "September" },
      { label: "October", value: "October" },
      { label: "November", value: "November" },
      { label: "December", value: "December" },
    ],
    []
  );

  // Back month options (1 month back logic)
  const backMonthOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];

    monthOptions.forEach((month, index) => {
      let backMonth;
      let backYear = currentYear;

      if (index >= 1) {
        backMonth = monthOptions[index - 1];
      } else {
        backMonth = monthOptions[11];
        backYear = currentYear - 1;
      }

      options.push({
        label: `${month.label} (shows ${backMonth.label} ${backYear})`,
        value: month.value,
        backValue: backMonth.value,
        backYear: backYear,
      });
    });

    return options;
  }, [monthOptions]);

  // Extract unique cities from allCasesData for filter dropdown
  const cityOptions = useMemo(() => {
    const cities = allCasesData
      .map(record => record.city)
      .filter(city => city && city !== "N/A" && city !== "—");
    return [...new Set(cities)].sort();
  }, [allCasesData]);

  // Filter data on FRONTEND - City filter + BackMonth filter
  const filteredData = useMemo(() => {
    let data = allCasesData;

    // Apply City filter (frontend)
    if (selectedCities.length > 0) {
      data = data.filter((record) => {
        if (!record.city || record.city === "N/A") return false;
        return selectedCities.includes(record.city);
      });
    }

    // Apply Back Month filter (frontend)
    if (selectedBackMonth) {
      const selectedBackMonthOption = backMonthOptions.find(
        (opt) => opt.value === selectedBackMonth
      );

      if (selectedBackMonthOption) {
        const targetMonth = selectedBackMonthOption.backValue;
        const targetYear = selectedBackMonthOption.backYear;

        data = data.filter((record) => {
          if (!record.createdAt) return false;

          const createdDate = new Date(record.createdAt);
          if (isNaN(createdDate.getTime())) return false;

          const recordMonth = createdDate.toLocaleString("en-US", { month: "long" });
          const recordYear = createdDate.getFullYear();

          return recordMonth === targetMonth && recordYear === targetYear;
        });
      }
    }

    return data;
  }, [allCasesData, selectedCities, selectedBackMonth, backMonthOptions]);

  const reports = useMemo(
    () => [
      {
        title: "To Be Assigned / File Generated",
        total: counts.pending || 0,
        component: "Pending",
      },
      {
        title: "Total Assigned / Work in Progress",
        total: counts.working || 0,
        component: "Assigned",
      },
      {
        title: "Total Submission",
        total: counts.finalSubmitted || 0,
        component: "ReportSubmitted",
      },
      {
        title: "Query Raised",
        total: counts.queryRaised || 0,
        component: "QueryRaised",
      },
      {
        title: "Cancel Cases",
        total: counts.cancelled || 0,
        component: "CancelCases",
      },
      { title: "Awaiting Approved", total: "0" },
      { title: "Awaiting Portal Cases", total: "0" },
      {
        title: "Out Tat Cases",
        total: counts.outOfTat || 0,
        component: "Out_Tat_Cases",
      },
      {
        title: "All Cases",
        total: counts.allCases || 0,
        component: "Summary",
      },
    ],
    [counts]
  );

  // Handle card click - hide table, show component
  const handleCardClick = (component) => {
    setActiveComponent(component);
  };

  // Handle Dashboard tab click - reset to show dashboard
  const handleDashboardTabClick = () => {
    setActiveTab("dashboard");
    setActiveComponent("");
  };

  return (
    <div className="p-4">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .blink-row {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>

      <div className="custom-container mb-6 mt-14 border-b border-gray-300">
        <ul className="nav nav-tabs custom-tabs flex gap-2">
          <li className="nav-item">
            <button
              className={`nav-link px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "dashboard"
                  ? "bg-[#B5121B] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={handleDashboardTabClick}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "myworklist"
                  ? "bg-[#B5121B] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => {
                setActiveTab("myworklist");
                setActiveComponent("");
              }}
            >
              My Worklist
            </button>
          </li>
        </ul>
      </div>

      {activeTab === "dashboard" && (
        <>
          {/* Cards Section - ALWAYS visible on dashboard */}
          <div className="mb-6 mt-1 mr-3 p-6 border border-[#B5121B] rounded-2xl bg-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-xl font-semibold text-gray-800">All Cases</h5>
              <Select
                value={selectedAgent}
                onChange={setSelectedAgent}
                suffixIcon={<DownOutlined />}
                className="w-64"
              >
                <Option value="All Agents">All Agents</Option>
                {fieldOfficers?.map((fieldOfficer) => (
                  <Option key={fieldOfficer._id} value={fieldOfficer.name}>
                    {fieldOfficer.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              {reports.map((report, key) => (
                <div
                  key={key}
                  onClick={() => handleCardClick(report.component)}
                  className={`group relative flex flex-col items-center text-center p-4 h-40 rounded-xl cursor-pointer transition-all duration-300 border-1 shadow hover:shadow-lg focus:outline-none ${
                    activeComponent === report.component
                      ? "border-[#B5121B] bg-[#FFF4F4]"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  <h6
                    style={{ fontSize: "0.8rem" }}
                    className="uppercase text-center relative font-semibold text-gray-500 group-hover:text-[#B5121B] transition-colors"
                  >
                    {report.title}
                  </h6>
                  <h2 className="!text-4xl absolute bottom-6 font-semibold mt-2 border-[1px] border-gray-200 group-hover:text-[#B5121B] transition-colors px-4 p-2 rounded text-gray-800 tracking-tight">
                    <CountUp
                      end={parseInt(report.total, 10) || 0}
                      duration={1.5}
                      separator=","
                    />
                  </h2>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h5 className="text-base font-medium text-gray-700">
                Total cases:{" "}
                <span className="font-semibold text-gray-900">
                  <CountUp
                    end={counts.allCases || 0}
                    duration={1.5}
                    separator=","
                  />
                </span>
              </h5>
              <div className="flex flex-col sm:flex-row sm:space-x-8 mt-2 sm:mt-0">
                <h5 className="text-base font-medium text-gray-700">
                  Denied cases:{" "}
                  <span className="font-semibold text-red-600">
                    <CountUp end={0} duration={1.5} separator="," />
                  </span>
                </h5>
                <h5 className="text-base font-medium text-gray-700">
                  Token Back Requests:{" "}
                  <span className="font-semibold text-green-600">
                    <CountUp end={0} duration={1.5} separator="," />
                  </span>
                </h5>
              </div>
            </div>
          </div>

          {/* Show Table ONLY when no component selected */}
          {!activeComponent && (
            <div className="mb-6 p-6 border border-gray-300 rounded-2xl bg-white shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                All Cases
              </h2>

              {/* Filters Row */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {/* Bank Filter */}
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
                  maxTagCount="responsive"
                >
                  {(filterOptions?.banks || []).map((bank) => (
                    <Option key={bank} value={bank}>
                      {bank}
                    </Option>
                  ))}
                </Select>

                {/* Status Filter */}
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
                  maxTagCount="responsive"
                >
                  {(filterOptions?.statuses || []).map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>

                {/* City Filter - Using frontend extracted cities */}
                <Select
                  mode="multiple"
                  placeholder="Filter by City"
                  style={{ minWidth: 200 }}
                  value={selectedCities}
                  onChange={(values) => {
                    setSelectedCities(values);
                    setCurrentPage(1);
                  }}
                  allowClear
                  maxTagCount="responsive"
                >
                  {cityOptions.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>

                {/* Month Filter (Multiple) */}
                <Select
                  mode="multiple"
                  placeholder="Filter by Month"
                  style={{ minWidth: 200 }}
                  value={selectedMonths}
                  onChange={(values) => {
                    setSelectedMonths(values);
                    setCurrentPage(1);
                  }}
                  allowClear
                  maxTagCount="responsive"
                >
                  {monthOptions.map((month) => (
                    <Option key={month.value} value={month.value}>
                      {month.label}
                    </Option>
                  ))}
                </Select>

                {/* Back Month Filter (Single) */}
                <Select
                  placeholder="Back Month"
                  style={{ minWidth: 250 }}
                  value={selectedBackMonth}
                  onChange={(value) => {
                    setSelectedBackMonth(value);
                    setCurrentPage(1);
                  }}
                  allowClear
                >
                  {backMonthOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search all fields..."
                  value={searchText}
                  onChange={(event) => {
                    setSearchText(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#B5121B]"
                  style={{ width: 300 }}
                />
              </div>

              {/* All Cases Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {allCasesColumns.map((col) => (
                        <th
                          key={col.key}
                          className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          {col.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allCasesLoading ? (
                      <tr>
                        <td
                          colSpan={allCasesColumns.length}
                          className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={allCasesColumns.length}
                          className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                        >
                          No records found
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((record) => {
                        const rowColor = getRowColor(record.status, record.createdAt);
                        return (
                          <tr 
                            key={record.key} 
                            className={`hover:bg-opacity-80 ${rowColor.className}`}
                            style={{ 
                              backgroundColor: rowColor.backgroundColor,
                              transition: "background-color 0.3s"
                            }}
                          >
                            {allCasesColumns.map((col) => (
                              <td
                                key={col.key}
                                className="border border-gray-300 px-4 py-3 text-sm text-gray-700"
                              >
                                {col.render
                                  ? col.render(record[col.dataIndex], record)
                                  : record[col.dataIndex] || "N/A"}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!allCasesLoading && filteredData.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {filteredData.length} results
                    {selectedCities.length > 0 && " (filtered by city)"}
                    {selectedBackMonth && " (filtered by back month)"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (allCasesPagination.page > 1) {
                          setCurrentPage(allCasesPagination.page - 1);
                        }
                      }}
                      disabled={allCasesPagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded bg-gray-100">
                      {allCasesPagination.page}
                    </span>
                    <button
                      onClick={() => {
                        if (
                          allCasesPagination.page < allCasesPagination.totalPages
                        ) {
                          setCurrentPage(allCasesPagination.page + 1);
                        }
                      }}
                      disabled={
                        allCasesPagination.page >= allCasesPagination.totalPages
                      }
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Show ONLY the selected component when card is clicked */}
          {activeComponent === "Pending" && <Pending />}
          {activeComponent === "Assigned" && <AssignedCase />}
          {activeComponent === "QueryRaised" && <QueryRaised />}
          {activeComponent === "ReportSubmitted" && <FinalSubmittedCase />}
          {activeComponent === "CancelCases" && <CancelledCases />}
          {activeComponent === "Out_Tat_Cases" && <OutOfTATCase />}
          {activeComponent === "Summary" && <SummaryCard />}
        </>
      )}

      {activeTab === "myworklist" && (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            My Worklist
          </h2>
          <MyWorklist />
        </div>
      )}
    </div>
  );
};

export default Dashboard;