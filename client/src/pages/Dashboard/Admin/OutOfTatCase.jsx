// pages/Case/OutOfTATCases.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
// import { fetchOutOfTATCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import getBankTagColor from "../getBankTagColor";

const getBankRoute = (bankName) => {
  if (!bankName) return "";
  const lower = bankName.toLowerCase();
  if (lower === "homefirst" || lower === "home first") return "home-first";
  return lower.replace(/\s+/g, "-");
};

const OutOfTATCase = () => {
  const dispatch = useDispatch();
  // const { outOfTATCases, loading } = useSelector(
  //   (state) => state.assignedCases
  // );

  const {
    data: cases,
    pendingCases,
    final,
    cancelledCases,
    outOfTatCases,
    loading,
  } = useSelector((state) => state.assignedCases);

  const OUTCase = outOfTatCases?.data;

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bank",
      render: (bank) => {
        const color = getBankTagColor(bank);
        return <Tag color={color}>{bank}</Tag>;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      render: (text, record) => {
        const displayName =
          record.customerName || record.applicantName || "N/A";
        const bankRoute = getBankRoute(record.bank);
        return (
          <Link
            to={`/bank/${bankRoute}/${record._id}`}
            className='text-blue-600 hover:underline'
          >
            {displayName}
          </Link>
        );
      },
    },
    {
      title: "Address as per Legal Document",
      dataIndex: "addressLegal",
      render: (text, record) => record.addressLegal || record.address || "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) =>
        new Date(createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className='bg-red-600 text-white px-2 py-1 rounded font-semibold inline-block'>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>⏰ Out of TAT Cases</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table dataSource={OUTCase} columns={columns} rowKey='_id' bordered />
      )}
    </div>
  );
};

export default OutOfTATCase;
