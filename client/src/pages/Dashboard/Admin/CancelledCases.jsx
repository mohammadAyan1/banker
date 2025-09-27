import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { Link } from "react-router-dom";

import { getCancelledCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import getBankTagColor from "../getBankTagColor";
import Spinner from "../../../components/Spinner";

import { useState, useMemo } from "react";
import { Input, Select } from "antd";

const getBankRoute = (bankName) => {
  // console.log(bankName, "Cancel");
  if (!bankName) return "";
  const lower = bankName.toLowerCase();
  if (lower === "homefirst" || lower === "home first") return "home-first";
  return lower.replace(/\s+/g, "-");
};

// const CancelledCases = () => {
//   const dispatch = useDispatch();
//   const { cancelledCases, loading, error } = useSelector(
//     (state) => state.assignedCases
//   );

//   useEffect(() => {
//     dispatch(getCancelledCases());
//   }, [dispatch]);

//   // Flatten grouped cancelled cases into one array
//   const flatCases = cancelledCases.cancelledCases.flatMap((group) =>
//     group.cases.map((caseItem) => ({
//       ...caseItem,
//       model: group.model,
//     }))
//   );

//   const columns = [
//     {
//       title: "Bank Name",
//       dataIndex: "bankName",
//       sorter: (a, b) => a.bankName.localeCompare(b.bankName),
//       render: (bankName) => {
//         const color = getBankTagColor(bankName);
//         return <Tag color={color}>{bankName}</Tag>;
//       },
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "customerName",
//       sorter: (a, b) =>
//         (a.customerName || a.applicantName || "").localeCompare(
//           b.customerName || b.applicantName || b.visitedPersonName || ""
//         ),
//       render: (text, record) => {
//         const displayName =
//           record.customerName ||
//           record.applicantName ||
//           record.visitedPersonName ||
//           "N/A";
//         const bankRoute = getBankRoute(record.bankName);
//         return (
//           <Link
//             // to={`/bank/${bankRoute}/${record._id}`}
//             className='text-blue-600 hover:underline'
//           >
//             {displayName}
//           </Link>
//         );
//       },
//     },
//     {
//       title: "Address as per Legal Document",
//       dataIndex: "addressLegal",
//       render: (text, record) => record.addressLegal || record.address || "N/A",
//     },
//     {
//       title: "Assigned To",
//       dataIndex: ["assignedTo", "name"],
//       render: (text, record) => record?.assignedTo?.name || "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       filters: [
//         { text: "Cancelled", value: "cancelled" },
//         { text: "Active", value: "active" },
//       ],
//       onFilter: (value, record) => record.status === value,
//       render: (status) => (
//         <span className='bg-red-600 text-white px-2 py-1 rounded font-semibold inline-block'>
//           {status}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className='p-4'>
//       <h2 className='text-xl font-bold mb-4'>All Cancelled Cases</h2>
//       {loading ? (
//         <Spinner />
//       ) : error ? (
//         <div className='text-red-600'>There are no records to display</div>
//       ) : (
//         <Table
//           dataSource={flatCases}
//           columns={columns}
//           rowKey='_id'
//           bordered
//           pagination={{ pageSize: 10, showSizeChanger: true }}
//         />
//       )}
//     </div>
//   );
// };

const CancelledCases = () => {
  const dispatch = useDispatch();
  const { cancelledCases, loading, error } = useSelector(
    (state) => state.assignedCases
  );

  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    dispatch(getCancelledCases());
  }, [dispatch]);

  const flatCases = useMemo(() => {
    if (!cancelledCases?.cancelledCases) return [];

    return cancelledCases.cancelledCases.flatMap((group) =>
      group.cases.map((caseItem) => ({
        ...caseItem,
        model: group.model,
      }))
    );
  }, [cancelledCases]);

  const bankOptions = useMemo(() => {
    const uniqueBanks = new Set(flatCases.map((c) => c.bankName));
    return Array.from(uniqueBanks).map((bank) => ({
      label: bank,
      value: bank,
    }));
  }, [flatCases]);

  const filteredCases = useMemo(() => {
    return flatCases.filter((item) => {
      const nameMatch = (
        item.customerName ||
        item.applicantName ||
        item.visitedPersonName ||
        ""
      )
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const addressMatch = (item.addressLegal || item.address || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const bankMatch = selectedBank ? item.bankName === selectedBank : true;

      return (nameMatch || addressMatch) && bankMatch;
    });
  }, [flatCases, searchText, selectedBank]);

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
        (a.customerName || a.applicantName || "").localeCompare(
          b.customerName || b.applicantName || b.visitedPersonName || ""
        ),
      render: (text, record) => {
        const displayName =
          record.customerName ||
          record.applicantName ||
          record.visitedPersonName ||
          "N/A";
        return (
          <span className='text-blue-600 hover:underline'>{displayName}</span>
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
      render: (text, record) => record?.assignedTo?.name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Cancelled", value: "cancelled" },
        { text: "Active", value: "active" },
      ],
      onFilter: (value, record) => record.status === value,
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

      {/* Search and Filter Controls */}
      <div className='flex flex-wrap gap-4 mb-4'>
        <Input
          placeholder='Search by customer name or address'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          allowClear
          placeholder='Filter by Bank'
          options={bankOptions}
          onChange={(value) => setSelectedBank(value)}
          style={{ width: 200 }}
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
