// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   acceptCaseById,
//   fetchCases,
// } from "../../../redux/features/case/caseThunks";
// import { allCaseUserById } from "../../../redux/features/Note/notesSlice";
// import { Card, Spin, Table, Button, Modal, Input, Select, Tag } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import CaseNotes from "../../../components/CaseNotes";
// import dayjs from "dayjs";
// import { CheckCheck, Eye } from "lucide-react";

// const { Search } = Input;
// const { Option } = Select;

// const STATUS_TYPES = [
//   { title: "Total Assigned", value: "TOTAL_ASSIGNED" },
//   // { title: "Today Case", value: "TODAY_CASE" },
//   { title: "Pending for Approval", value: "PENDING_FOR_APPROVAL" },
//   { title: "Query Raised", value: "QUERY_RAISED" },
//   { title: "Action Pending", value: "ACTION_PENDING" },
// ];

// const FieldOfficerDashboard = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { cases, loading } = useSelector((state) => state.case) || {};
//   const foCases = cases;
//   const { allCase } = useSelector((state) => state?.notes || {});

//   const [selectedCaseId, setSelectedCaseId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("TOTAL_ASSIGNED");
//   const [selectedBank, setSelectedBank] = useState(null);

//   const navigate = useNavigate();

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchCases(user._id));
//       dispatch(allCaseUserById());
//     }
//   }, [dispatch, user?._id]);

//   // Get unique banks from cases
//   const bankOptions = [
//     ...new Set(foCases?.map((caseItem) => caseItem.bankName)),
//   ];

//   const handleAccept = async (id, bankName) => {
//     try {
//       const res = await dispatch(acceptCaseById({ id, bankName })).unwrap();
//       toast.success("Case accepted successfully");
//       navigate(0);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const filterCases = () => {
//     let filtered = foCases;

//     // Filter by status first
//     if (selectedStatus !== "TOTAL_ASSIGNED") {
//       if (selectedStatus === "QUERY_RAISED") {
//         return allCase?.filter((c) => c.addedBy === user._id);
//       }
//       filtered = filtered?.filter(
//         (caseItem) => caseItem.status === selectedStatus
//       );
//     }

//     // Then filter by selected bank if any
//     if (selectedBank) {
//       filtered = filtered?.filter(
//         (caseItem) => caseItem.bankName === selectedBank
//       );
//     }

//     return filtered;
//   };

//   const handleSearch = (value) => {
//     setSearchText(value.toLowerCase());
//   };

//   const isToday = (dateString) => {
//     return dayjs(dateString).isSame(dayjs(), "day");
//   };

//   const filteredCases = filterCases()?.filter((caseItem) => {
//     if (!searchText) return true;

//     return (
//       caseItem.bankName?.toLowerCase().includes(searchText) ||
//       caseItem.customerName?.toLowerCase().includes(searchText) ||
//       caseItem.applicantName?.toLowerCase().includes(searchText) ||
//       caseItem.addressLegal?.toLowerCase().includes(searchText) ||
//       caseItem.address?.toLowerCase().includes(searchText) ||
//       caseItem.customerNo?.toLowerCase().includes(searchText) ||
//       caseItem.contactPersonNumber?.toLowerCase().includes(searchText)
//     );
//   });

//   // Sort cases - today's cases first
//   const sortedCases = [...(filteredCases || [])].sort((a, b) => {
//     const aIsToday = a.createdAt ? isToday(a.createdAt) : false;
//     const bIsToday = b.createdAt ? isToday(b.createdAt) : false;

//     if (aIsToday && !bIsToday) return -1;
//     if (!aIsToday && bIsToday) return 1;
//     return 0;
//   });

//   const summaryCounts = {
//     TOTAL_ASSIGNED: foCases?.length,
//     PENDING_FOR_APPROVAL: foCases?.filter(
//       (c) => c.status === "PENDING_FOR_APPROVAL"
//     ).length,
//     QUERY_RAISED: allCase?.filter((c) => c.addedBy === user._id).length,
//     ACTION_PENDING: foCases?.filter((c) => c.status === "ACTION_PENDING")
//       .length,
//   };

//   const defaultColumns = [
//     {
//       title: "Bank",
//       dataIndex: "bankName",
//       key: "bankName",
//       sorter: (a, b) => a.bankName.localeCompare(b.bankName),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "customerName",
//       key: "customerName",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.customerName || record.applicantName || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const nameA = a.customerName || a.applicantName || "";
//         const nameB = b.customerName || b.applicantName || "";
//         return nameA.localeCompare(nameB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Assigned Date",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => (
//         <Tag color={isToday(date) ? "green" : "default"}>
//           {dayjs(date).format("DD/MM/YYYY")}
//         </Tag>
//       ),
//       sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Address",
//       dataIndex: "addressLegal",
//       key: "addressLegal",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.addressLegal || record.address || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const addressA = a.addressLegal || a.address || "";
//         const addressB = b.addressLegal || b.address || "";
//         return addressA.localeCompare(addressB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Contact Number",
//       dataIndex: "contactNumber",
//       key: "contactNumber",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.customerNo || record.contactPersonNumber || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const numA = a.customerNo || a.contactPersonNumber || "";
//         const numB = b.customerNo || b.contactPersonNumber || "";
//         return numA.localeCompare(numB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Action",
//       key: "action",
//       dataIndex: "action",
//       render: (_, record) => {
//         if (record?.approvalStatus === "Pending") {
//           return (
//             <Button
//               type='primary'
//               onClick={() => handleAccept(record._id, record.bankName)}
//             >
//               Accept
//             </Button>
//           );
//         } else {
//           return (
//             <Link
//               to={`${record.route}`}
//               className='flex gap-3 text-5xl text-blue-600 hover:underline items-center group transition-all duration-200'
//             >
//               <Eye className='transition-transform group-hover:scale-110 group-hover:text-blue-800' />

//               {record.isReportSubmitted === true && (
//                 <span className='text-green-500 transition-transform group-hover:scale-110 group-hover:text-green-600'>
//                   <CheckCheck />
//                 </span>
//               )}
//             </Link>
//           );
//         }
//       },
//     },
//     {
//       title: "Create Query",
//       dataIndex: "createQuery",
//       key: "createQuery",
//       render: (_, record) => (
//         <Button
//           disabled={record?.isReportSubmitted === true}
//           type='default'
//           onClick={() => {
//             setSelectedCaseId(record._id);
//             setIsModalOpen(true);
//           }}
//         >
//           Mark Query
//         </Button>
//       ),
//     },
//   ];

//   const queryColumns = [
//     {
//       title: "Case ID",
//       dataIndex: "caseId",
//       key: "caseId",
//       sorter: (a, b) => a.caseId.localeCompare(b.caseId),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Message",
//       dataIndex: "message",
//       key: "message",
//       sorter: (a, b) => a.message.localeCompare(b.message),
//       sortDirections: ["descend", "ascend"],
//     },
//   ];

//   return (
//     <div className='p-4 mb-4'>
//       <h2 className='text-2xl font-bold mb-6'>My Assigned Cases</h2>

//       {/* Summary Cards */}
//       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
//         {STATUS_TYPES.map(({ title, value }) => (
//           <Card
//             key={value}
//             hoverable
//             onClick={() => setSelectedStatus(value)}
//             className={`text-center cursor-pointer border transition-all duration-300 ${
//               selectedStatus === value ? "border-blue-600 shadow-lg" : ""
//             }`}
//           >
//             <div className='text-gray-500 text-sm'>{title}</div>
//             <div className='text-xl font-bold'>{summaryCounts[value] || 0}</div>
//           </Card>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className='flex flex-col md:flex-row gap-4 mb-6'>
//         <div className='flex-1'>
//           <Search
//             placeholder='Search cases...'
//             allowClear
//             enterButton='Search'
//             size='large'
//             onSearch={handleSearch}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>
//         <div className='w-full md:w-64'>
//           <Select
//             placeholder='Filter by Bank'
//             allowClear
//             size='large'
//             style={{ width: "100%" }}
//             onChange={(value) => setSelectedBank(value)}
//           >
//             {bankOptions?.map((bank) => (
//               <Option key={bank} value={bank}>
//                 {bank}
//               </Option>
//             ))}
//           </Select>
//         </div>
//       </div>

//       {/* Table Section */}
//       {loading ? (
//         <div className='flex justify-center mt-10'>
//           <Spin size='large' />
//         </div>
//       ) : (
//         <Table
//           dataSource={sortedCases}
//           columns={
//             selectedStatus === "QUERY_RAISED" ? queryColumns : defaultColumns
//           }
//           rowKey={(record) => record._id || record.caseId}
//           bordered
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50"],
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} items`,
//           }}
//         />
//       )}

//       {/* Notes Modal */}
//       <Modal
//         title='Case Notes'
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         {selectedCaseId && (
//           <CaseNotes caseId={selectedCaseId} onSuccess={closeModal} />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default FieldOfficerDashboard;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptCaseById,
  fetchCases,
} from "../../../redux/features/case/caseThunks";
import { allCaseUserById } from "../../../redux/features/Note/notesSlice";
import { Card, Spin, Table, Button, Modal, Input, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CaseNotes from "../../../components/CaseNotes";
import dayjs from "dayjs";
import { CheckCheck, Eye } from "lucide-react";

const { Search } = Input;

const STATUS_TYPES = [
  { title: "Total Assigned", value: "TOTAL_ASSIGNED" },
  { title: "Pending for Approval", value: "PENDING_FOR_APPROVAL" },
  { title: "Query Raised", value: "QUERY_RAISED" },
  { title: "Action Pending", value: "ACTION_PENDING" },
];

const FieldOfficerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cases, loading } = useSelector((state) => state.case) || {};
  const foCases = cases;
  const { allCase } = useSelector((state) => state?.notes || {});

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("TOTAL_ASSIGNED");
  const [selectedBank, setSelectedBank] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCases(user._id));
      dispatch(allCaseUserById());
    }
  }, [dispatch, user?._id]);

  const bankOptions = [
    ...new Set(foCases?.map((caseItem) => caseItem.bankName).filter(Boolean)),
  ];

  const handleAccept = async (id, bankName) => {
    try {
      await dispatch(acceptCaseById({ id, bankName })).unwrap();
      toast.success("Case accepted successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const isToday = (dateString) => {
    return dayjs(dateString).isSame(dayjs(), "day");
  };

  const filterCases = () => {
    let filtered = foCases;

    if (selectedStatus !== "TOTAL_ASSIGNED") {
      if (selectedStatus === "QUERY_RAISED") {
        return allCase?.filter((c) => c.addedBy === user._id);
      }
      filtered = filtered?.filter(
        (caseItem) => caseItem.status === selectedStatus
      );
    }

    if (selectedBank) {
      filtered = filtered?.filter(
        (caseItem) => caseItem.bankName === selectedBank
      );
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredCases = filterCases()?.filter((caseItem) => {
    if (!searchText) return true;

    return (
      caseItem.bankName?.toLowerCase().includes(searchText) ||
      caseItem.customerName?.toLowerCase().includes(searchText) ||
      caseItem.applicantName?.toLowerCase().includes(searchText) ||
      caseItem.addressLegal?.toLowerCase().includes(searchText) ||
      caseItem.address?.toLowerCase().includes(searchText) ||
      caseItem.customerNo?.toLowerCase().includes(searchText) ||
      caseItem.contactPersonNumber?.toLowerCase().includes(searchText)
    );
  });

  const sortedCases = [...(filteredCases || [])].sort((a, b) => {
    const aIsToday = a.createdAt ? isToday(a.createdAt) : false;
    const bIsToday = b.createdAt ? isToday(b.createdAt) : false;
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return 0;
  });

  const summaryCounts = {
    TOTAL_ASSIGNED: foCases?.length,
    PENDING_FOR_APPROVAL: foCases?.filter(
      (c) => c.status === "PENDING_FOR_APPROVAL"
    ).length,
    QUERY_RAISED: allCase?.filter((c) => c.addedBy === user._id).length,
    ACTION_PENDING: foCases?.filter((c) => c.status === "ACTION_PENDING")
      .length,
  };

  const defaultColumns = [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, record) => (
        <span className='text-blue-600 hover:underline'>
          {record.customerName ||
            record.applicantName ||
            record.visitedPersonName ||
            "N/A"}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = a.customerName || a.applicantName || "";
        const nameB = b.customerName || b.applicantName || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Assigned Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tag color={isToday(date) ? "green" : "default"}>
          {dayjs(date).format("DD/MM/YYYY")}
        </Tag>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Address",
      dataIndex: "addressLegal",
      key: "addressLegal",
      render: (_, record) => (
        <span className='text-blue-600 hover:underline'>
          {record.addressLegal ||
            record.address ||
            record.propertyAddress ||
            "N/A"}
        </span>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (_, record) => (
        <span className='text-blue-600 hover:underline'>
          {record.customerNo || record.contactPersonNumber || "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        if (record?.approvalStatus === "Pending") {
          return (
            <Button
              type='primary'
              onClick={() => handleAccept(record._id, record.bankName)}
            >
              Accept
            </Button>
          );
        } else {
          return (
            <Link to={`${record.route}`} className='flex gap-3 items-center'>
              <Eye className='text-blue-600 hover:text-blue-800' />
              {record.isReportSubmitted && (
                <CheckCheck className='text-green-500' />
              )}
            </Link>
          );
        }
      },
    },
    {
      title: "Create Query",
      dataIndex: "createQuery",
      key: "createQuery",
      render: (_, record) => (
        <Button
          disabled={record?.isReportSubmitted === true}
          type='default'
          onClick={() => {
            setSelectedCaseId(record._id);
            setIsModalOpen(true);
          }}
        >
          Mark Query
        </Button>
      ),
    },
  ];

  const queryColumns = [
    {
      title: "Case ID",
      dataIndex: "caseId",
      key: "caseId",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
  ];

  return (
    <div className='p-4 mb-4'>
      <h2 className='text-2xl font-bold mb-6'>My Assigned Cases</h2>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
        {STATUS_TYPES.map(({ title, value }) => (
          <Card
            key={value}
            hoverable
            onClick={() => setSelectedStatus(value)}
            className={`text-center cursor-pointer ${
              selectedStatus === value ? "border-blue-600 shadow-lg" : ""
            }`}
          >
            <div className='text-gray-500 text-sm'>{title}</div>
            <div className='text-xl font-bold'>{summaryCounts[value] || 0}</div>
          </Card>
        ))}
      </div>

      {/* Search & Bank Tags */}
      <div className='mb-4'>
        {/* <Search
          placeholder='Search cases...'
          allowClear
          enterButton='Search'
          size='large'
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        /> */}
        <div className='flex flex-wrap gap-2 mt-2'>
          {bankOptions.map((bank) => {
            const todayCount = foCases.filter(
              (item) => item.bankName === bank && isToday(item.createdAt)
            ).length;

            return (
              <Tag
                key={bank}
                color={selectedBank === bank ? "blue" : "default"}
                onClick={() =>
                  setSelectedBank(selectedBank === bank ? null : bank)
                }
                className='cursor-pointer px-3 py-1'
              >
                {bank} {todayCount > 0 && `(${todayCount})`}
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className='flex justify-center mt-10'>
          <Spin size='large' />
        </div>
      ) : (
        <Table
          dataSource={sortedCases}
          columns={
            selectedStatus === "QUERY_RAISED" ? queryColumns : defaultColumns
          }
          rowKey={(record) => record._id || record.caseId}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}

      {/* Notes Modal */}
      <Modal
        title='Case Notes'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedCaseId && (
          <CaseNotes
            caseId={selectedCaseId}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default FieldOfficerDashboard;
