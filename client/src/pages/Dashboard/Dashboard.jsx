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
import axiosInstance from "../../config/axios";

const { Option } = Select;

const readValue = (record, paths) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], record);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const normalizeStatus = (status = "") =>
  status.toString().toLowerCase().trim().replace(/\s+/g, " ");

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
    ]) || "N/A";

  const status =
    readValue(record, ["status", "caseStatus", "portalStatus"]) || "Pending";

  return {
    ...record,
    key: record._id || index,
    bankName:
      readValue(record, ["bankName", "bank", "bankDetails.bankName"]) || "N/A",
    customerName:
      readValue(record, [
        "customerName",
        "visitedPersonName",
        "applicantName",
        "applicantsName",
        "clientName",
        "basicDetails.nameOfClient",
        "propertyInfo.applicantName",
        "summary.applicantName",
      ]) || "N/A",
    city:
      readValue(record, [
        "city",
        "location",
        "propertyCity",
        "propertyLocation",
        "nearestCityTown",
        "locationDetails.mainLocality",
        "basicDetails.city",
        "propertyInfo.city",
        "summary.city",
      ]) || "N/A",
    engineer,
    status,
    remark: readValue(record, ["remark", "remarks", "report_remarks"]) || "",
    createdAt:
      readValue(record, [
        "createdAt",
        "uploadDate",
        "createdDate",
        "submissionDate",
        "dateOfVisit",
      ]) || "",
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
      const hours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
      if (hours > 48) isOld = true;
    }

    return {
      backgroundColor: isOld ? "#fee2e2" : "#fff7ed",
      className: isOld ? "blink-row" : "",
    };
  }

  if (s.includes("query")) return { backgroundColor: "#ffe4e6", className: "" };

  return { backgroundColor: "white", className: "" };
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);

  return isNaN(d.getTime())
    ? date
    : d.toLocaleString("en-IN", {
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

    map[bank].total++;

    if (s.includes("submitted") || s.includes("done") || s.includes("final")) {
      map[bank].done++;
    } else if (s.includes("query")) {
      map[bank].query++;
    } else if (
      s.includes("working") ||
      s.includes("assigned") ||
      s.includes("progress")
    ) {
      map[bank].working++;
    } else {
      map[bank].pending++;
    }
  });

  return Object.values(map).sort((a, b) => b.total - a.total);
};

const Pagination = ({ page, totalPages, onPrev, onNext }) => (
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

const Dashboard = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeComponent, setActiveComponent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [allCasesData, setAllCasesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBankView, setSelectedBankView] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(1000);
  const [bankSummaryPage, setBankSummaryPage] = useState(1);
  const [bankCasesPage, setBankCasesPage] = useState(1);

  const rowsPerPage = 10;

  const { FO: fieldOfficers = [] } = useSelector((state) => state.auth);
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  useEffect(() => {
    dispatch(fetchFieldOfficers());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchText.trim().toLowerCase()),
      300
    );

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchAllCases = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/case/summary-data", {
        params: {
          page: currentPage,
          limit: pageSize,
          city: selectedZone || undefined,
          month: selectedMonth,
        },
      });

      const items = (
        res.data?.totalSubmissions ||
        res.data?.tableItems ||
        []
      ).map(normalizeAllCaseRecord);

      setAllCasesData(items);
    } catch (err) {
      console.error(err);
      setAllCasesData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedZone, selectedMonth]);

  useEffect(() => {
    fetchAllCases();
  }, [fetchAllCases]);

  const monthFiltered = useMemo(() => {
    return allCasesData.filter((item) => {
      if (!selectedMonth) return true;
      return isSameMonth(item.createdAt, selectedMonth);
    });
  }, [allCasesData, selectedMonth]);

  const filteredCases = useMemo(() => {
    let data = [...monthFiltered];

    if (selectedAgent !== "All Agents") {
      data = data.filter((item) => item.engineer === selectedAgent);
    }

    if (selectedBankView) {
      data = data.filter((item) => item.bankName === selectedBankView);
    }

    if (selectedStatuses.length) {
      data = data.filter((item) => selectedStatuses.includes(item.status));
    }

    if (selectedEngineers.length) {
      data = data.filter((item) => selectedEngineers.includes(item.engineer));
    }

    if (selectedCities.length) {
      data = data.filter((item) => selectedCities.includes(item.city));
    }

    if (debouncedSearch) {
      data = data.filter((item) =>
        [
          item.bankName,
          item.customerName,
          item.city,
          item.engineer,
          item.status,
          item.remark,
        ]
          .join(" ")
          .toLowerCase()
          .includes(debouncedSearch)
      );
    }

    return data;
  }, [
    monthFiltered,
    selectedAgent,
    selectedBankView,
    selectedStatuses,
    selectedEngineers,
    selectedCities,
    debouncedSearch,
  ]);

  const cardCounts = useMemo(() => {
    return {
      pending: filteredCases.filter((item) =>
        normalizeStatus(item.status).includes("pending")
      ).length,

      working: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return (
          s.includes("working") ||
          s.includes("assigned") ||
          s.includes("progress")
        );
      }).length,

      finalSubmitted: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return (
          s.includes("final") ||
          s.includes("submitted") ||
          s.includes("done")
        );
      }).length,

      query: filteredCases.filter((item) =>
        normalizeStatus(item.status).includes("query")
      ).length,

      cancelled: filteredCases.filter((item) =>
        normalizeStatus(item.status).includes("cancel")
      ).length,

      outOfTat: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);

        if (
          s.includes("working") ||
          s.includes("assigned") ||
          s.includes("progress") ||
          s.includes("final") ||
          s.includes("submitted") ||
          s.includes("done") ||
          s.includes("cancel")
        ) {
          return false;
        }

        if (!item.createdAt) return false;

        const d = new Date(item.createdAt);
        if (isNaN(d.getTime())) return false;

        const hours = (new Date() - d) / (1000 * 60 * 60);
        return hours > 48;
      }).length,

      allCases: filteredCases.length,
    };
  }, [filteredCases]);

  const reports = useMemo(
    () => [
      {
        title: "To Be Assigned / File Generated",
        total: cardCounts.pending,
        component: "Pending",
      },
      {
        title: "Total Assigned / Work in Progress",
        total: cardCounts.working,
        component: "Assigned",
      },
      {
        title: "Total Submission",
        total: cardCounts.finalSubmitted,
        component: "ReportSubmitted",
      },
      {
        title: "Query Raised",
        total: cardCounts.query,
        component: "QueryRaised",
      },
      {
        title: "Cancel Cases",
        total: cardCounts.cancelled,
        component: "CancelCases",
      },
      {
        title: "Out Tat Cases",
        total: cardCounts.outOfTat,
        component: "Out_Tat_Cases",
      },
      {
        title: "All Cases",
        total: cardCounts.allCases,
        component: "Summary",
      },
    ],
    [cardCounts]
  );

  const bankSummary = useMemo(() => getBankStats(filteredCases), [filteredCases]);

  const paginatedBankSummary = useMemo(
    () =>
      bankSummary.slice(
        (bankSummaryPage - 1) * rowsPerPage,
        bankSummaryPage * rowsPerPage
      ),
    [bankSummary, bankSummaryPage]
  );

  const bankSummaryTotalPages = Math.ceil(bankSummary.length / rowsPerPage) || 1;

  const paginatedBankCases = useMemo(
    () =>
      filteredCases.slice(
        (bankCasesPage - 1) * rowsPerPage,
        bankCasesPage * rowsPerPage
      ),
    [filteredCases, bankCasesPage]
  );

  const bankCasesTotalPages = Math.ceil(filteredCases.length / rowsPerPage) || 1;

  useEffect(() => {
    setBankSummaryPage(1);
    setBankCasesPage(1);
  }, [
    selectedMonth,
    selectedBankView,
    searchText,
    selectedStatuses,
    selectedEngineers,
    selectedCities,
    selectedAgent,
  ]);

  const clearBankView = () => {
    setSelectedBankView(null);
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
    setSelectedCities([]);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
    setSelectedCities([]);
  };

  const statusOptions = [
    ...new Set(allCasesData.map((x) => x.status).filter(Boolean)),
  ].sort();

  const engineerOptions = [
    ...new Set(
      [
        ...allCasesData.map((x) => x.engineer),
        ...fieldOfficers.map((x) => x.name),
      ].filter((x) => x && x !== "N/A")
    ),
  ].sort();

  const cityOptions = [
    ...new Set(allCasesData.map((x) => x.city).filter((x) => x && x !== "N/A")),
  ].sort();

  return (
    <div className="p-4">
      <style>{`
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.45;} }
        .blink-row { animation: blink 1s ease-in-out infinite; }
        .bank-summary-card { border:1px solid #d1d5db; border-radius:14px; background:#fff; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,.08); }
        .bank-summary-table th { font-size:12px; color:#6b7280; letter-spacing:1.5px; font-weight:700; text-transform:uppercase; background:#f9fafb; padding:11px 14px; border-bottom:1px solid #d1d5db; white-space:nowrap; }
        .bank-summary-table td { padding:10px 14px; border-bottom:1px solid #e5e7eb; font-size:15px; }
        .bank-summary-table tr:hover { background:#f8fafc; cursor:pointer; }
        .rate-bar { height:5px; width:70px; background:#e5e7eb; border-radius:999px; overflow:hidden; display:inline-block; margin-left:8px; vertical-align:middle; }
        .rate-fill { height:100%; background:#16a34a; border-radius:999px; }
      `}</style>

      <div className="custom-container mb-6 mt-14 border-b border-gray-300">
        <ul className="nav nav-tabs custom-tabs flex gap-2">
          <li>
            <button
              className={`px-4 py-2 rounded-t-lg font-medium ${
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

          <li>
            <button
              className={`px-4 py-2 rounded-t-lg font-medium ${
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
                  <label className="text-sm font-semibold text-gray-700">
                    📅 Month
                  </label>

                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setActiveComponent("");
                      clearBankView();
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />

                  <Select
                    value={selectedAgent}
                    onChange={setSelectedAgent}
                    suffixIcon={<DownOutlined />}
                    className="w-64"
                  >
                    <Option value="All Agents">All Agents</Option>
                    {fieldOfficers?.map((fo) => (
                      <Option key={fo._id} value={fo.name}>
                        {fo.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
                {reports.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveComponent(r.component)}
                    className={`group relative flex flex-col items-center text-center p-4 h-36 rounded-xl cursor-pointer transition-all border shadow hover:shadow-lg ${
                      activeComponent === r.component
                        ? "border-[#B5121B] bg-[#FFF4F4]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <h6 className="text-[12px] uppercase font-semibold text-gray-500 group-hover:text-[#B5121B]">
                      {r.title}
                    </h6>

                    <h2 className="!text-4xl absolute bottom-5 font-semibold border border-gray-200 px-4 py-2 rounded text-gray-800 group-hover:text-[#B5121B]">
                      <CountUp
                        end={Number(r.total) || 0}
                        duration={1.2}
                        separator=","
                      />
                    </h2>
                  </div>
                ))}
              </div>

              <div className="text-base font-medium text-gray-700">
                <span className="font-semibold text-gray-900">
                  <CountUp
                    end={cardCounts.allCases}
                    duration={1.2}
                    separator=","
                  />
                </span>
              </div>
            </div>
          )}

          {!activeComponent && !selectedBankView && (
            <div className="mb-6">
              <div className="bank-summary-card">
                <div className="px-4 py-3 text-xs font-bold tracking-[4px] text-gray-500 uppercase">
                  🏦 Bank Summary
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bank-summary-table">
                    <thead>
                      <tr>
                        <th>🏦 Bank</th>
                        <th>📦 Total</th>
                        <th className="text-green-700">✅ Done</th>
                        <th className="text-orange-600">⏳ Pend</th>
                        <th className="text-red-600">❓ Query</th>
                        <th>📈 Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8">
                            Loading...
                          </td>
                        </tr>
                      ) : bankSummary.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8">
                            No records
                          </td>
                        </tr>
                      ) : (
                        paginatedBankSummary.map((bank) => {
                          const rate = bank.total
                            ? Math.round((bank.done / bank.total) * 100)
                            : 0;

                          return (
                            <tr
                              key={bank.bank}
                              onClick={() => setSelectedBankView(bank.bank)}
                            >
                              <td className="font-bold">{bank.bank}</td>
                              <td className="text-center">{bank.total}</td>
                              <td className="text-center text-green-700">
                                {bank.done}
                              </td>
                              <td className="text-center text-orange-600">
                                {bank.pending}
                              </td>
                              <td className="text-center text-red-600">
                                {bank.query}
                              </td>
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
                    setBankSummaryPage((p) =>
                      Math.min(bankSummaryTotalPages, p + 1)
                    )
                  }
                />
              </div>
            </div>
          )}

          {!activeComponent && selectedBankView && (
            <div className="mb-6 p-4 border border-gray-300 rounded-2xl bg-white shadow-lg">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    🏦 {selectedBankView} Cases
                  </h2>
                  <p className="text-sm text-gray-500">
                    Showing {filteredCases.length} cases
                  </p>
                </div>

                <button
                  onClick={clearBankView}
                  className="px-4 py-2 rounded-md bg-[#B5121B] text-white hover:bg-red-800"
                >
                  ← Back
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border rounded-md px-3 py-2 w-[320px]"
                />

                <Select
                  mode="multiple"
                  placeholder="Status"
                  style={{ minWidth: 200 }}
                  value={selectedStatuses}
                  onChange={setSelectedStatuses}
                  allowClear
                >
                  {statusOptions.map((s) => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Select>

                <Select
                  mode="multiple"
                  placeholder="Engineers"
                  style={{ minWidth: 220 }}
                  value={selectedEngineers}
                  onChange={setSelectedEngineers}
                  allowClear
                >
                  {engineerOptions.map((e) => (
                    <Option key={e} value={e}>
                      {e}
                    </Option>
                  ))}
                </Select>

                <Select
                  mode="multiple"
                  placeholder="Cities"
                  style={{ minWidth: 200 }}
                  value={selectedCities}
                  onChange={setSelectedCities}
                  allowClear
                >
                  {cityOptions.map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>

                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Reset
                </button>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-3">#</th>
                      <th className="border px-3 py-3">📅 Date & Time</th>
                      <th className="border px-3 py-3">👤 Customer</th>
                      <th className="border px-3 py-3">📍 City</th>
                      <th className="border px-3 py-3">🧑‍💼 Engineer</th>
                      <th className="border px-3 py-3">📌 Status</th>
                      <th className="border px-3 py-3">📝 Remark</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8">
                          Loading...
                        </td>
                      </tr>
                    ) : paginatedBankCases.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8">
                          No data
                        </td>
                      </tr>
                    ) : (
                      paginatedBankCases.map((rec, idx) => {
                        const row = getRowStyle(rec.status, rec.createdAt);

                        return (
                          <tr
                            key={rec.key}
                            className={row.className}
                            style={{ backgroundColor: row.backgroundColor }}
                          >
                            <td className="border px-3 py-3 text-sm">
                              {(bankCasesPage - 1) * rowsPerPage + idx + 1}
                            </td>
                            <td className="border px-3 py-3 text-sm whitespace-nowrap">
                              {formatDateTime(rec.createdAt)}
                            </td>
                            <td className="border px-3 py-3 text-sm font-semibold">
                              {rec.customerName}
                            </td>
                            <td className="border px-3 py-3 text-sm">
                              {rec.city}
                            </td>
                            <td className="border px-3 py-3 text-sm text-blue-700 font-semibold">
                              {rec.engineer}
                            </td>
                            <td className="border px-3 py-3 text-sm">
                              <span className="px-2 py-1 rounded border bg-white text-xs">
                                {rec.status}
                              </span>
                            </td>
                            <td className="border px-3 py-3 text-sm">
                              {rec.remark}
                            </td>
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
                    setBankCasesPage((p) =>
                      Math.min(bankCasesTotalPages, p + 1)
                    )
                  }
                />
              </div>
            </div>
          )}

          {activeComponent === "Pending" && (
            <Pending selectedMonth={selectedMonth} />
          )}

          {activeComponent === "Assigned" && (
            <AssignedCase selectedMonth={selectedMonth} />
          )}

          {activeComponent === "QueryRaised" && (
            <QueryRaised selectedMonth={selectedMonth} />
          )}

          {activeComponent === "ReportSubmitted" && (
            <FinalSubmittedCase selectedMonth={selectedMonth} />
          )}

          {activeComponent === "CancelCases" && (
            <CancelledCases selectedMonth={selectedMonth} />
          )}

          {activeComponent === "Out_Tat_Cases" && (
            <OutOfTATCase selectedMonth={selectedMonth} />
          )}

          {activeComponent === "Summary" && (
            <SummaryCard selectedMonth={selectedMonth} />
          )}
        </>
      )}

      {activeTab === "myworklist" && (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold mb-4">📋 My Worklist</h2>
          <MyWorklist />
        </div>
      )}
    </div>
  );
};

export default Dashboard;