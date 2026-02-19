// pages/Case/FinalSubmittedCases.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { fetchTotalSubmitCase } from "../../../redux/features/assignedCase/assignedCasesThunk";
import Spinner from "../../../components/Spinner";
import getBankTagColor from "../getBankTagColor";
import { Edit3, Trash2 } from "lucide-react";

const getBankRoute = (bankName) => {
  if (!bankName) return "";
  const lower = bankName.toLowerCase();
  if (lower === "homefirst" || lower === "home first") return "home-first";
  return lower.replace(/\s+/g, "-");
};

const FinalSubmittedCases = () => {
  const dispatch = useDispatch();
  const { final, loading } = useSelector((state) => state.assignedCases);

  useEffect(() => {
    dispatch(fetchTotalSubmitCase());
  }, [dispatch]);

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName) => {
        const color = getBankTagColor(bankName);
        return <Tag color={color}>{bankName}</Tag>;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      render: (text, record) => {

        console.log('====================================');
        console.log(record);
        console.log('====================================');

        const displayName =
          record.customerName ||
          record.applicantName ||
          record.visitedPersonName ||
          "N/A";
        const bankRoute = getBankRoute(record.bankName);
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
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"],
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <div className='flex gap-4 items-center'>
            <Link
              to={`/bank/home-first/edit/${record._id}`}
              className='!text-green-600 hover:underline border p-1'
            >
              <Edit3 size={18} />
            </Link>
            {/* <Button
              onClick={() => {
                dispatch(deletedCases(record._id));
                toast.success("Case deleted successfully!");
                navigate(0);
              }}
              className='!text-red-600 hover:underline'
            >
              <Trash2 size={18} />
            </Button> */}
          </div>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className='bg-blue-600 text-white px-2 py-1 rounded font-semibold inline-block'>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Final Submitted Cases</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table dataSource={final} columns={columns} rowKey='_id' bordered />
      )}
    </div>
  );
};

export default FinalSubmittedCases;
