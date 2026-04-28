import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";

import { getCancelledCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import getBankTagColor from "../getBankTagColor";
import Spinner from "../../../components/Spinner";
import {
  getDisplayAddress,
  getDisplayCustomerName,
  getDisplayCity,
} from "../../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const CancelledCases = () => {
  const dispatch = useDispatch();
  const { cancelledCases, loading, error } = useSelector(
    (state) => state.assignedCases
  );

  const [searchText, setSearchText] = useState("");
  
  // ✅ NEW: Multiple filter states
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    dispatch(getCancelledCases());
  }, [dispatch]);

  const flatCases = useMemo(() => {
    if (!cancelledCases?.cancelledCases) return [];

    return cancelledCases.cancelledCases.flatMap((group) =>
      group.cases.map((caseItem) => ({
        ...caseItem,
        bankName: caseItem.bankName || group.bankName,
        model: group.model,
      }))
    );
  }, [cancelledCases]);

  // ✅ NEW: Get unique banks and statuses
  const uniqueBanks = useMemo(() => {
    return [...new Set(flatCases.map((c) => c.bankName).filter(Boolean))];
  }, [flatCases]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set(flatCases.map((c) => c.status).filter(Boolean))];
  }, [flatCases]);

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  const filteredCases = useMemo(() => {
    return flatCases.filter((item) => {
      const nameMatch = getDisplayCustomerName(item)
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const addressMatch = getDisplayAddress(item)
        .toLowerCase()
        .includes(searchText.toLowerCase());

      // ✅ NEW: Multiple bank filter
      const bankMatch = selectedBanks.length > 0 
        ? selectedBanks.includes(item.bankName) 
        : true;

      // ✅ NEW: Multiple status filter
      const statusMatch = selectedStatuses.length > 0 
        ? selectedStatuses.includes(item.status) 
        : true;

      let zoneMatch = true;
      if (selectedZone) {
        const city = getDisplayCity(item);
        zoneMatch = city.toLowerCase().includes(selectedZone.toLowerCase());
      }

      return (nameMatch || addressMatch) && bankMatch && statusMatch && zoneMatch;
    });
  }, [flatCases, searchText, selectedBanks, selectedStatuses, selectedZone]);

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
      render: (bankName) => {
        const color = getBankTagColor(bankName);
        return <Tag color={color}>{bankName}</Tag>;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      sorter: (a, b) =>
        getDisplayCustomerName(a).localeCompare(getDisplayCustomerName(b)),
      render: (text, record) => {
        return (
          <span className='text-blue-600 hover:underline'>
            {getDisplayCustomerName(record)}
          </span>
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
      render: (text, record) => record?.assignedTo?.name || "N/A",
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
      <h2 className='text-xl font-bold mb-4'>All Cancelled Cases</h2>

      {/* ✅ UPDATED: Filter Row with multiple Bank & Status select */}
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
          placeholder='Search by customer name or address'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className='text-red-600'>There are no records to display</div>
      ) : (
        <Table
          dataSource={filteredCases}
          columns={columns}
          rowKey='_id'
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      )}
    </div>
  );
};

export default CancelledCases;