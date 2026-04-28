// pages/Case/FinalSubmittedCases.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { fetchTotalSubmitCase } from "../../../redux/features/assignedCase/assignedCasesThunk";
import Spinner from "../../../components/Spinner";
import getBankTagColor from "../getBankTagColor";
import { Edit3, Trash2 } from "lucide-react";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayCustomerName,
  getDisplayCity,
} from "../../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const FinalSubmittedCases = () => {
  const dispatch = useDispatch();
  const { final, loading, selectedZone } = useSelector((state) => state.assignedCases);

  // ✅ NEW: Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    dispatch(fetchTotalSubmitCase());
  }, [dispatch]);

  // ✅ NEW: Get unique banks and statuses
  const uniqueBanks = useMemo(() => {
    return [...new Set((final || []).map(item => item.bankName).filter(Boolean))];
  }, [final]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set((final || []).map(item => item.status).filter(Boolean))];
  }, [final]);

  // ✅ UPDATED: Filtered data with multiple filters
  const filteredFinal = useMemo(() => {
    return (final || []).filter(item => {
      // Zone filter
      if (selectedZone) {
        const city = getDisplayCity(item);
        if (!city.toLowerCase().includes(selectedZone.toLowerCase())) {
          return false;
        }
      }

      // Multiple bank filter
      if (selectedBanks.length > 0 && !selectedBanks.includes(item.bankName)) {
        return false;
      }

      // Multiple status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(item.status)) {
        return false;
      }

      // Search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const customerName = getDisplayCustomerName(item).toLowerCase();
        const address = getDisplayAddress(item).toLowerCase();
        const assignedTo = (item?.assignedTo?.name || "").toLowerCase();
        
        if (
          !customerName.includes(searchLower) &&
          !address.includes(searchLower) &&
          !assignedTo.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [final, selectedZone, selectedBanks, selectedStatuses, searchText]);

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
        const displayName = getDisplayCustomerName(record);
        const bankRoute = getBankRoute(record);
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
      render: (text, record) => getDisplayAddress(record),
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
              to={record.route || `/bank/${getBankRoute(record)}/edit/${record._id}`}
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

      {/* ✅ NEW: Filter Row */}
      <div className='flex flex-wrap gap-4 mb-4'>
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
          placeholder='Search by customer, address or assignee'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table dataSource={filteredFinal} columns={columns} rowKey='_id' bordered />
      )}
    </div>
  );
};

export default FinalSubmittedCases;