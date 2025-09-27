import React, { useEffect, useState } from "react";
import Pending from "./Pending";
import QueryRaised from "./Admin/QueryRaised";
import AssignedCase from "./Admin/AssignedCase";
// import ReportSubmitted from "./ReportSubmitted";
import { Select } from "antd";
import CountUp from "react-countup";
import MyWorklist from "./MyWorklist";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignedCases,
  fetchPendingCases,
  fetchTotalSubmitCase,
  getCancelledCases,
  getOutOfTatCases,
} from "../../redux/features/assignedCase/assignedCasesThunk";
import axiosInstance from "../../config/axios";
import FinalSubmittedCase from "./Admin/FinalSubmittedCase";

import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";
import CancelledCases from "./Admin/CancelledCases";
import { fetchNotifications } from "../../redux/features/notification/notificationThunk";
import { fetchSummaryData } from "../../redux/features/assignedCase/assignedCasesThunk";

import OutOfTATCase from "./Admin/OutOfTatCase";
import SummaryCard from "./Admin/SummaryCard";

const { Option } = Select;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeComponent, setActiveComponent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Self");

  const {
    data: cases,
    pendingCases,
    final,
    cancelledCases,
    outOfTatCases,
  } = useSelector((state) => state.assignedCases);

  const fieldOfficers = useSelector((state) => state.auth.FO) || [];
  const summaryData = useSelector((state) => state.assignedCases.summary) || [];

  const dispatch = useDispatch();

  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes/get");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchPendingCases());
    dispatch(fetchTotalSubmitCase());
    dispatch(getCancelledCases());
    dispatch(fetchNotifications());

    //!
    dispatch(getOutOfTatCases()), fetchNotes();
  }, []);

  useEffect(() => {
    dispatch(fetchAssignedCases());
    dispatch(fetchFieldOfficers());
    dispatch(fetchSummaryData());
  }, [dispatch]);

  const reports = [
    {
      title: "To Be Assigned / File Generated",
      total: pendingCases.length,
      component: "Pending",
    },
    {
      title: "Total Assigned / Work in Progress",
      total: cases?.length,
      component: "Assigned",
    },
    {
      title: "Total Submission",
      total: final?.length,
      component: "ReportSubmitted",
    },
    { title: "Query Raised", total: notes?.length, component: "QueryRaised" },
    {
      title: "Cancel Cases",
      total: cancelledCases?.totalCancelledCount,
      component: "CancelCases",
    },
    { title: "Awaiting Approved", total: "0" },
    { title: "Awaiting Portal Cases", total: "0" },
    {
      title: "Out Tat Cases",
      total: outOfTatCases?.data?.length,
      component: "Out_Tat_Cases",
    },
    {
      title: "Summary",
      total: summaryData?.totalSubmissions?.length,
      component: "Summary",
    },
  ];

  const handleSelect = (value) => {
    setSelectedAgent(value);
  };

  return (
    <div className='p-4'>
      {/* Tab Navigation */}
      <div className='custom-container mb-6 mt-14 border-b border-gray-300'>
        <ul className='nav nav-tabs custom-tabs flex gap-2'>
          <li className='nav-item'>
            <button
              className={`nav-link px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "dashboard"
                  ? "bg-[#B5121B] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li className='nav-item'>
            <button
              className={`nav-link px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "myworklist"
                  ? "bg-[#B5121B] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setActiveTab("myworklist")}
            >
              My Worklist
            </button>
          </li>
        </ul>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className='mb-6 mt-1 mr-3 p-6 border border-[#B5121B] rounded-2xl bg-white shadow-lg'>
            <div className='flex justify-between items-center mb-6'>
              <h5 className='text-xl font-semibold text-gray-800'>All Cases</h5>
              <Select
                value={selectedAgent}
                onChange={handleSelect}
                suffixIcon={<DownOutlined />}
                className='w-64'
              >
                <Option value='All Agents'>All Agents</Option>
                {fieldOfficers?.map((f) => (
                  <Option key={f._id} value={f.name}>
                    {f.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6'>
              {reports.map((report, key) => (
                <div
                  key={key}
                  onClick={() => setActiveComponent(report.component)}
                  className={`group relative flex flex-col items-center  text-center p-4 h-40 rounded-xl cursor-pointer transition-all duration-300 border-1 shadow hover:shadow-lg focus:outline-none ${
                    activeComponent === report.component
                      ? "border-[#B5121B] bg-[#FFF4F4]"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  <h6
                    style={{ fontSize: "0.8rem" }}
                    className='uppercase text-center   relative  font-semibold text-gray-500 group-hover:text-[#B5121B] transition-colors'
                  >
                    {report.title}
                  </h6>
                  <h2 className='!text-4xl absolute bottom-6 font-semibold mt-2 border-[1px] border-gray-200   group-hover:text-[#B5121B] transition-colors px-4 p-2 rounded text-gray-800 tracking-tight'>
                    <CountUp
                      end={parseInt(report.total)}
                      duration={1.5}
                      separator=','
                    />
                  </h2>
                </div>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
              <h5 className='text-base font-medium text-gray-700'>
                Total cases:{" "}
                <span className='font-semibold text-gray-900'>
                  <CountUp end={2000} duration={1.5} separator=',' />
                </span>
              </h5>
              <div className='flex flex-col sm:flex-row sm:space-x-8 mt-2 sm:mt-0'>
                <h5 className='text-base font-medium text-gray-700'>
                  Denied cases:{" "}
                  <span className='font-semibold text-red-600'>
                    <CountUp end={50} duration={1.5} separator=',' />
                  </span>
                </h5>
                <h5 className='text-base font-medium text-gray-700'>
                  Token Back Requests:{" "}
                  <span className='font-semibold text-green-600'>
                    <CountUp end={0} duration={1.5} separator=',' />
                  </span>
                </h5>
              </div>
            </div>
          </div>

          <div>
            {activeComponent === "Pending" && <Pending />}
            {activeComponent === "Assigned" && <AssignedCase />}
            {activeComponent === "QueryRaised" && <QueryRaised />}
            {activeComponent === "ReportSubmitted" && <FinalSubmittedCase />}
            {activeComponent === "CancelCases" && <CancelledCases />}
            {activeComponent === "Out_Tat_Cases" && <OutOfTATCase />}
            {activeComponent === "Summary" && <SummaryCard />}
          </div>
        </>
      )}

      {activeTab === "myworklist" && (
        <div className='p-6 bg-white rounded-xl border border-gray-200 shadow-md'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            My Worklist
          </h2>
          <MyWorklist />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
