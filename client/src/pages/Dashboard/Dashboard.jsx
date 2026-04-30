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

const readValue = (record, paths) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, record);

    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const normalizeStatus = (status = "") => status.toString().toLowerCase().trim();

const getCurrentMonthValue = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return yyyyMm === monthValue;
};

const normalizeAllCaseRecord = (record, index) => {
  const engineer =
    readValue(record, [
      "engineer",
      "engineerName",
      "assignedTo.name",
      "fieldOfficer.name",
      "employee.name",
      "assignedEngineer",
    ]) || "N/A";

  const status =
    readValue(record, ["status", "caseStatus", "portalStatus"]) || "Pending";

  return {
    ...record,
    key: record._id || index,
    bankName: readValue(record, ["bankName", "bank", "bankDetails.bankName"]) || "N/A",
    customerName:
      readValue(record, [
        "customerName",
        "visitedPersonName",
        "applicantName",
        "basicDetails.nameOfClient",
        "propertyInfo.applicantName",
        "summary.applicantName",
        "header.contactedPerson",
      ]) || "N/A",
    city:
      readValue(record, [
        "city",
        "location",
        "propertyCity",
        "locationDetails.city",
        "propertyInfo.city",
      ]) || "N/A",
    engineer,
    status,
   remark:
  readValue(record, [
    // "remarks",
    "remark",
    // "adminRemark",
    // "statusRemark",
    // "summary.remarks",
  ]) || "",
    createdAt:
      readValue(record, ["createdAt", "createdDate", "submissionDate", "dateOfVisit"]) ||
      "",
  };
};

const getRowStyle = (status, createdAt) => {
  const s = normalizeStatus(status);

  if (s.includes("submitted") || s.includes("done") || s.includes("final")) {
    return { backgroundColor: "#dcfce7", className: "" };
  }

  if (s.includes("working") || s.includes("assigned") || s.includes("progress")) {
    return { backgroundColor: "#fef9c3", className: "" };
  }

  if (s.includes("pending")) {
    let isOld = false;
    if (createdAt) {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        const hours = (new Date() - d) / (1000 * 60 * 60);
        isOld = hours > 48;
      }
    }

    return {
      backgroundColor: isOld ? "#fee2e2" : "#fff7ed",
      className: isOld ? "blink-row" : "",
    };
  }

  if (s.includes("query")) {
    return { backgroundColor: "#ffe4e6", className: "" };
  }

  return { backgroundColor: "white", className: "" };
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getBankStats = (data) => {
  const map = {};

  data.forEach((item) => {
    const bank = item.bankName || "N/A";

    if (!map[bank]) {
      map[bank] = {
        bank,
        total: 0,
        done: 0,
        pending: 0,
        query: 0,
        working: 0,
      };
    }

    const s = normalizeStatus(item.status);
    map[bank].total += 1;

    if (s.includes("submitted") || s.includes("done") || s.includes("final")) {
      map[bank].done += 1;
    } else if (s.includes("query")) {
      map[bank].query += 1;
    } else if (s.includes("working") || s.includes("assigned") || s.includes("progress")) {
      map[bank].working += 1;
    } else {
      map[bank].pending += 1;
    }
  });

  return Object.values(map).sort((a, b) => b.total - a.total);
};

const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
      <span className="text-sm text-gray-600">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </span>

      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={onPrev}
          className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        <button
          disabled={page >= totalPages}
          onClick={onNext}
          className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeComponent, setActiveComponent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");

  const [allCasesData, setAllCasesData] = useState([]);
  const [queryRaisedCount, setQueryRaisedCount] = useState(0);
  const [allCasesLoading, setAllCasesLoading] = useState(false);

  const [selectedBankView, setSelectedBankView] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(500);

  const [bankSummaryPage, setBankSummaryPage] = useState(1);
  const [bankCasesPage, setBankCasesPage] = useState(1);
  const rowsPerPage = 10;

  const { FO: fieldOfficers = [] } = useSelector((state) => state.auth);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchAllCasesTable = useCallback(async () => {
    try {
      setAllCasesLoading(true);

      const response = await axiosInstance.get("/case/summary-data", {
        params: {
          page: currentPage,
          limit: pageSize,
          city: selectedZone || undefined,
        },
      });

      const items = (response.data?.tableItems || []).map(normalizeAllCaseRecord);
      setAllCasesData(items);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setAllCasesLoading(false);
    }
  }, [currentPage, pageSize, selectedZone]);



  const fetchQueryRaisedCount = useCallback(async () => {
  try {
    const res = await axiosInstance.get("/notes/get");
    const notes = res.data || [];

    const count = notes.filter((note) =>
      isSameMonth(note.createdAt, selectedMonth)
    ).length;

    setQueryRaisedCount(count);
  } catch (error) {
    console.error("Failed to load query raised count:", error);
    setQueryRaisedCount(0);
  }
}, [selectedMonth]);

  useEffect(() => {
    fetchAllCasesTable();
  }, [fetchAllCasesTable]);

useEffect(() => {
  fetchQueryRaisedCount();
}, [fetchQueryRaisedCount]);

  const statusOptions = useMemo(() => {
    return [...new Set(allCasesData.map((x) => x.status).filter(Boolean))].sort();
  }, [allCasesData]);

  const engineerOptions = useMemo(() => {
    const fromData = allCasesData.map((x) => x.engineer).filter((x) => x && x !== "N/A");
    const fromFO = fieldOfficers.map((x) => x.name).filter(Boolean);
    return [...new Set([...fromData, ...fromFO])].sort();
  }, [allCasesData, fieldOfficers]);

  const monthFilteredData = useMemo(() => {
    return allCasesData.filter((item) => isSameMonth(item.createdAt, selectedMonth));
  }, [allCasesData, selectedMonth]);

  const filteredCases = useMemo(() => {
    let data = [...monthFilteredData];

    if (selectedAgent !== "All Agents") {
      data = data.filter((item) => item.engineer === selectedAgent);
    }

    if (selectedBankView) {
      data = data.filter((item) => item.bankName === selectedBankView);
    }

    if (selectedStatuses.length > 0) {
      data = data.filter((item) => selectedStatuses.includes(item.status));
    }

    if (selectedEngineers.length > 0) {
      data = data.filter((item) => selectedEngineers.includes(item.engineer));
    }

    if (debouncedSearch) {
      data = data.filter((item) => {
        const text = [
          item.bankName,
          item.customerName,
          item.city,
          item.engineer,
          item.status,
          item.remark,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(debouncedSearch);
      });
    }

    return data;
  }, [
    monthFilteredData,
    selectedAgent,
    selectedBankView,
    selectedStatuses,
    selectedEngineers,
    debouncedSearch,
  ]);

  const bankSummary = useMemo(() => getBankStats(filteredCases), [filteredCases]);

  const paginatedBankSummary = useMemo(() => {
    const start = (bankSummaryPage - 1) * rowsPerPage;
    return bankSummary.slice(start, start + rowsPerPage);
  }, [bankSummary, bankSummaryPage]);

  const bankSummaryTotalPages = Math.ceil(bankSummary.length / rowsPerPage) || 1;

  const paginatedBankCases = useMemo(() => {
    const start = (bankCasesPage - 1) * rowsPerPage;
    return filteredCases.slice(start, start + rowsPerPage);
  }, [filteredCases, bankCasesPage]);

  const bankCasesTotalPages = Math.ceil(filteredCases.length / rowsPerPage) || 1;

  useEffect(() => {
    setBankSummaryPage(1);
    setBankCasesPage(1);
  }, [selectedMonth, selectedBankView, searchText, selectedStatuses, selectedEngineers]);

  const dashboardCounts = useMemo(() => {
  const data = monthFilteredData.filter((item) => {
    if (selectedAgent !== "All Agents") return item.engineer === selectedAgent;
    return true;
  });

  const total = data.length;
  let done = 0;
  let pending = 0;
  let working = 0;
  let outOfTat = 0;

  data.forEach((item) => {
    const s = normalizeStatus(item.status);

    if (s.includes("submitted") || s.includes("done") || s.includes("final")) {
      done++;
    } else if (s.includes("working") || s.includes("assigned") || s.includes("progress")) {
      working++;
    } else {
      pending++;
    }

    // 👉 OUT OF TAT LOGIC FIX
    if (s.includes("pending") && item.createdAt) {
      const d = new Date(item.createdAt);
      if (!isNaN(d.getTime())) {
        const hours = (new Date() - d) / (1000 * 60 * 60);
        if (hours > 48) outOfTat++;
      }
    }
  });

  return { total, done, pending, working, outOfTat };
}, [monthFilteredData, selectedAgent]);

  const reports = useMemo(
    () => [
      {
        
        title: "To Be Assigned / File Generated",
        total: dashboardCounts.pending || 0,
        component: "Pending",
      },
      {
        
        title: "Total Assigned / Work in Progress",
        total: dashboardCounts.working || 0,
        component: "Assigned",
      },
      {
        
        title: "Total Submission",
        total: dashboardCounts.done || 0,
        component: "ReportSubmitted",
      },
      {
  title: "Query Raised",
  total: queryRaisedCount || 0,
        component: "QueryRaised",
      },
      {
        
        title: "Cancel Cases",
        total: counts.cancelled || 0,
        component: "CancelCases",
      },
     {
  title: "Out Tat Cases",
  total: dashboardCounts.outOfTat || 0,
        component: "Out_Tat_Cases",
      },
      {
        
        title: "All Cases",
        total: dashboardCounts.total || 0,
        component: "Summary",
      },
    ],
    [counts, dashboardCounts, queryRaisedCount]
  );

  const clearBankView = () => {
    setSelectedBankView(null);
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
  };

  const resetBankCaseFilters = () => {
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
  };

  return (
    <div className="p-4">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
        .blink-row {
          animation: blink 1s ease-in-out infinite;
        }
        .bank-summary-card {
          border: 1px solid #d1d5db;
          border-radius: 14px;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,.08);
        }
        .bank-summary-table th {
          font-size: 12px;
          color: #6b7280;
          letter-spacing: 1.5px;
          font-weight: 700;
          text-transform: uppercase;
          background: #f9fafb;
          padding: 11px 14px;
          border-bottom: 1px solid #d1d5db;
          white-space: nowrap;
        }
        .bank-summary-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 15px;
        }
        .bank-summary-table tr:hover {
          background: #f8fafc;
        }
        .rate-bar {
          height: 5px;
          width: 70px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          display: inline-block;
          margin-left: 8px;
          vertical-align: middle;
        }
        .rate-fill {
          height: 100%;
          background: #16a34a;
          border-radius: 999px;
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
              onClick={() => {
                setActiveTab("dashboard");
                setActiveComponent("");
                clearBankView();
              }}
            >
              📊 Dashboard
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
                clearBankView();
              }}
            >
              📋 My Worklist
            </button>
          </li>
        </ul>
      </div>

      {activeTab === "dashboard" && (
        <>
          {!selectedBankView && (
            <div className="mb-6 mt-1 mr-3 p-6 border border-[#B5121B] rounded-2xl bg-white shadow-lg">
              <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
               

                <div className="flex flex-wrap gap-2 items-center">
                  <label className="text-sm font-semibold text-gray-700">📅 Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setActiveComponent("");
                      clearBankView();
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B5121B]"
                  />

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
                {reports.map((report, key) => (
                  <div
                    key={key}
                    onClick={() => setActiveComponent(report.component)}
                    className={`group relative flex flex-col items-center text-center p-4 h-36 rounded-xl cursor-pointer transition-all duration-300 border shadow hover:shadow-lg ${
                      activeComponent === report.component
                        ? "border-[#B5121B] bg-[#FFF4F4]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    

                    <h6 className="text-[12px] uppercase font-semibold text-gray-500 group-hover:text-[#B5121B]">
                      {report.title}
                    </h6>

                    <h2 className="!text-4xl absolute bottom-5 font-semibold border border-gray-200 px-4 py-2 rounded text-gray-800 group-hover:text-[#B5121B]">
                      <CountUp
                        end={parseInt(report.total, 10) || 0}
                        duration={1.2}
                        separator=","
                      />
                    </h2>
                  </div>
                ))}
              </div>

              <div className="text-base font-medium text-gray-700">
                
                <span className="font-semibold text-gray-900">
                  <CountUp end={dashboardCounts.total} duration={1.2} separator="," />
                </span>
              </div>
            </div>
          )}

          {!activeComponent && !selectedBankView && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
               

                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">📅 Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setSelectedBankView(null);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div className="bank-summary-card">
                <div className="px-4 py-3 text-xs font-bold tracking-[4px] text-gray-500 uppercase">
                  🏦 Bank Summary
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bank-summary-table">
                    <thead>
                      <tr>
                        <th className="text-left">🏦 Bank</th>
                        <th>📦 Total</th>
                        <th className="text-green-700">✅ Done</th>
                        <th className="text-orange-600">⏳ Pend</th>
                        <th className="text-red-600">❓ Query</th>
                        <th>📈 Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allCasesLoading ? (
                        <tr>
                          <td colSpan="6" className="text-center text-gray-500 py-8">
                            Loading...
                          </td>
                        </tr>
                      ) : bankSummary.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center text-gray-500 py-8">
                            No records found
                          </td>
                        </tr>
                      ) : (
                        paginatedBankSummary.map((bank) => {
                          const rate =
                            bank.total > 0 ? Math.round((bank.done / bank.total) * 100) : 0;

                          return (
                            <tr
                              key={bank.bank}
                              onClick={() => setSelectedBankView(bank.bank)}
                              className="cursor-pointer"
                            >
                              <td className="font-bold text-gray-900">{bank.bank}</td>
                              <td className="text-center">{bank.total}</td>
                              <td className="text-center text-green-700">{bank.done}</td>
                              <td className="text-center text-orange-600">{bank.pending}</td>
                              <td className="text-center text-red-600">{bank.query}</td>
                              <td className="font-bold text-green-700">
                                {rate}%
                                <span className="rate-bar">
                                  <span
                                    className="rate-fill"
                                    style={{ width: `${rate}%` }}
                                  />
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={bankSummaryPage}
                  totalPages={bankSummaryTotalPages}
                  onPrev={() => setBankSummaryPage((p) => Math.max(1, p - 1))}
                  onNext={() =>
                    setBankSummaryPage((p) => Math.min(bankSummaryTotalPages, p + 1))
                  }
                />
              </div>
            </div>
          )}

          {!activeComponent && selectedBankView && (
            <div className="mb-6 p-4 border border-gray-300 rounded-2xl bg-white shadow-lg">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    🏦 {selectedBankView} Cases
                  </h2>
                  <p className="text-sm text-gray-500">
                    📅 Selected Month Rows: {filteredCases.length}
                  </p>
                </div>

                <button
                  onClick={clearBankView}
                  className="px-4 py-2 rounded-md bg-[#B5121B] text-white hover:bg-red-800"
                >
                  ← Back To Bank Summary
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Search name, location, engineer, remark..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-[320px]"
                />

                <Select
                  mode="multiple"
                  placeholder="All Status"
                  style={{ minWidth: 200 }}
                  value={selectedStatuses}
                  onChange={setSelectedStatuses}
                  allowClear
                  maxTagCount="responsive"
                >
                  {statusOptions.map((status) => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>

                <Select
                  mode="multiple"
                  placeholder="All Engineers"
                  style={{ minWidth: 220 }}
                  value={selectedEngineers}
                  onChange={setSelectedEngineers}
                  allowClear
                  maxTagCount="responsive"
                >
                  {engineerOptions.map((engineer) => (
                    <Option key={engineer} value={engineer}>
                      {engineer}
                    </Option>
                  ))}
                </Select>

                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <button
                  onClick={resetBankCaseFilters}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Reset Filters
                </button>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        #
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        📅 Date & Time
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        👤 Customer Name
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        📍 Location
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        🧑‍💼 Engineer
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        📌 Status
                      </th>
                      <th className="border px-3 py-3 text-left text-xs uppercase text-gray-600">
                        📝 Remark
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {allCasesLoading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredCases.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-gray-500">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      paginatedBankCases.map((record, index) => {
                        const row = getRowStyle(record.status, record.createdAt);
                        const srNo = (bankCasesPage - 1) * rowsPerPage + index + 1;

                        return (
                          <tr
                            key={record.key}
                            className={`${row.className} hover:brightness-95`}
                            style={{ backgroundColor: row.backgroundColor }}
                          >
                            <td className="border px-3 py-3 text-sm">{srNo}</td>
                            <td className="border px-3 py-3 text-sm whitespace-nowrap">
                              {formatDateTime(record.createdAt)}
                            </td>
                            <td className="border px-3 py-3 text-sm font-semibold">
                              {record.customerName}
                            </td>
                            <td className="border px-3 py-3 text-sm">{record.city}</td>
                            <td className="border px-3 py-3 text-sm text-blue-700 font-semibold">
                              {record.engineer}
                            </td>
                            <td className="border px-3 py-3 text-sm">
                              <span className="px-2 py-1 rounded border bg-white text-xs font-semibold">
                                {record.status}
                              </span>
                            </td>
                            <td className="border px-3 py-3 text-sm">{record.remark}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                <Pagination
                  page={bankCasesPage}
                  totalPages={bankCasesTotalPages}
                  onPrev={() => setBankCasesPage((p) => Math.max(1, p - 1))}
                  onNext={() =>
                    setBankCasesPage((p) => Math.min(bankCasesTotalPages, p + 1))
                  }
                />
              </div>
            </div>
          )}

      {activeComponent === "Pending" && <Pending selectedMonth={selectedMonth} />}
{activeComponent === "Assigned" && <AssignedCase selectedMonth={selectedMonth} />}
{activeComponent === "QueryRaised" && <QueryRaised selectedMonth={selectedMonth} />}
{activeComponent === "ReportSubmitted" && <FinalSubmittedCase selectedMonth={selectedMonth} />}
{activeComponent === "CancelCases" && <CancelledCases selectedMonth={selectedMonth} />}
{activeComponent === "Out_Tat_Cases" && <OutOfTATCase selectedMonth={selectedMonth} />}
{activeComponent === "Summary" && <SummaryCard selectedMonth={selectedMonth} />}
        </>
      )}

      {activeTab === "myworklist" && (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 My Worklist</h2>
          <MyWorklist />
        </div>
      )}
    </div>
  );
};

export default Dashboard;