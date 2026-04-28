// pages/Case/OutOfTATCases.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import getBankTagColor from "../getBankTagColor";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayCustomerName,
  getDisplayCity,
} from "../../../utils/dashboardRecord";

const { Option } = Select;

const OutOfTATCase = () => {
  const dispatch = useDispatch();
  
  // ✅ NEW: Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const {
    data: cases,
    pendingCases,
    final,
    cancelledCases,
    loading,
    outOfTatCases,
    selectedZone,
  } = useSelector((state) => state.assignedCases);

  // ✅ NEW: Get unique banks and statuses dynamically
  const uniqueBanks = useMemo(() => {
    const rawData = outOfTatCases?.data || [];
    return [...new Set(rawData.map(item => item.bank).filter(Boolean))];
  }, [outOfTatCases]);

  const uniqueStatuses = useMemo(() => {
    const rawData = outOfTatCases?.data || [];
    return [...new Set(rawData.map(item => item.status).filter(Boolean))];
  }, [outOfTatCases]);

  // ✅ UPDATED: Filtered data with multiple filters
  const OUTCase = useMemo(() => {
    let filtered = (outOfTatCases?.data || []);

    // Multiple bank filter
    if (selectedBanks.length > 0) {
      filtered = filtered.filter(item => selectedBanks.includes(item.bank));
    }

    // Multiple status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(item => selectedStatuses.includes(item.status));
    }

    // Zone filter
    if (selectedZone) {
      filtered = filtered.filter(item => {
        const city = getDisplayCity(item);
        return city.toLowerCase().includes(selectedZone.toLowerCase());
      });
    }

    // Search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item => {
        const customerName = getDisplayCustomerName(item).toLowerCase();
        const address = getDisplayAddress(item).toLowerCase();
        const bank = (item.bank || "").toLowerCase();
        const status = (item.status || "").toLowerCase();

        return (
          customerName.includes(searchLower) ||
          address.includes(searchLower) ||
          bank.includes(searchLower) ||
          status.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [outOfTatCases, selectedBanks, selectedStatuses, selectedZone, searchText]);

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
          placeholder="Search by customer, address, bank or status"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table dataSource={OUTCase} columns={columns} rowKey='_id' bordered />
      )}
    </div>
  );
};

export default OutOfTATCase;