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
import { CheckCheck, Eye, FileText, Download, Briefcase, PlusCircle, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayContact,
  getDisplayCustomerName,
} from "../../../utils/dashboardRecord";

const { Search } = Input;

const STATUS_TYPES = [
  { title: "Total Assigned", value: "TOTAL_ASSIGNED", icon: Briefcase },
  { title: "New Cases", value: "NEW_CASES", icon: PlusCircle },
  { title: "Pending", value: "PENDING", icon: Clock },
  { title: "Completed", value: "COMPLETED", icon: CheckCircle2 },
  { title: "Query Raised", value: "QUERY_RAISED", icon: AlertTriangle },
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
  const [selectedCaseDocs, setSelectedCaseDocs] = useState([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  const navigate = useNavigate();

  const downloadFile = async (url, fileName) => {
    try {
      const downloadUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Blob download failed, falling back to direct link:", err);
      const fallbackUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      window.open(fallbackUrl, "_blank");
    }
  };

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
      if (selectedStatus === "NEW_CASES") {
        filtered = filtered?.filter((caseItem) => caseItem.approvalStatus === "Pending");
      } else if (selectedStatus === "PENDING") {
        filtered = filtered?.filter(
          (caseItem) => caseItem.approvalStatus !== "Pending" && !caseItem.isReportSubmitted
        );
      } else if (selectedStatus === "COMPLETED") {
        filtered = filtered?.filter((caseItem) => caseItem.isReportSubmitted === true);
      }
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

    return [
      caseItem.bankName,
      getDisplayCustomerName(caseItem),
      getDisplayAddress(caseItem),
      getDisplayContact(caseItem),
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(searchText)
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
    TOTAL_ASSIGNED: foCases?.length || 0,
    NEW_CASES: foCases?.filter((c) => c.approvalStatus === "Pending").length || 0,
    PENDING: foCases?.filter((c) => c.approvalStatus !== "Pending" && !c.isReportSubmitted).length || 0,
    COMPLETED: foCases?.filter((c) => c.isReportSubmitted === true).length || 0,
    QUERY_RAISED: allCase?.filter((c) => c.addedBy === user._id).length || 0,
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
          {getDisplayCustomerName(record)}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = getDisplayCustomerName(a);
        const nameB = getDisplayCustomerName(b);
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
          {getDisplayAddress(record)}
        </span>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (_, record) => (
        <span className='text-blue-600 hover:underline'>
          {getDisplayContact(record)}
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
            <Link
              to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
              className='flex gap-3 items-center text-blue-600 hover:text-blue-800'
              title="Edit Report"
            >
              <Eye className='w-5 h-5' />
              {record.isReportSubmitted && (
                <CheckCheck className='text-green-500 w-5 h-5' />
              )}
            </Link>
          );
        }
      },
    },
    {
      title: "Property Paper",
      key: "propertyPaper",
      render: (_, record) => {
        const docs = (record.atsDocuments && record.atsDocuments.length > 0)
          ? record.atsDocuments
          : (record.AttachDocuments || []);
        const hasDocs = docs.length > 0;
        if (hasDocs) {
          return (
            <Button
              type="default"
              onClick={() => {
                setSelectedCaseDocs(docs);
                setIsDocsModalOpen(true);
              }}
              className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded transition-colors"
              title="View Property Papers"
              icon={<FileText className="w-4 h-4" />}
            >
              Property Paper
            </Button>
          );
        }
        return <span className="text-gray-400 text-xs">No Docs</span>;
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
        {STATUS_TYPES.map(({ title, value, icon: Icon }) => {
          const isSelected = selectedStatus === value;
          let borderClass = "border-gray-200 hover:border-gray-300";
          let iconColor = "text-gray-400";
          let accentBar = "bg-transparent";
          let bgClass = "bg-white";
          let textHighlight = "text-gray-800";
          
          if (value === "TOTAL_ASSIGNED") {
            borderClass = isSelected ? "border-indigo-500 shadow-md ring-1 ring-indigo-500" : "border-gray-200 hover:border-indigo-300";
            iconColor = "text-indigo-500";
            accentBar = "bg-indigo-500";
            bgClass = isSelected ? "bg-indigo-50/20" : "bg-white";
            textHighlight = "text-indigo-950";
          } else if (value === "NEW_CASES") {
            borderClass = isSelected ? "border-blue-500 shadow-md ring-1 ring-blue-500" : "border-gray-200 hover:border-blue-300";
            iconColor = "text-blue-500";
            accentBar = "bg-blue-500";
            bgClass = isSelected ? "bg-blue-50/20" : "bg-white";
            textHighlight = "text-blue-950";
          } else if (value === "PENDING") {
            borderClass = isSelected ? "border-amber-500 shadow-md ring-1 ring-amber-500" : "border-gray-200 hover:border-amber-300";
            iconColor = "text-amber-500";
            accentBar = "bg-amber-500";
            bgClass = isSelected ? "bg-amber-50/20" : "bg-white";
            textHighlight = "text-amber-955 text-amber-950";
          } else if (value === "COMPLETED") {
            borderClass = isSelected ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-gray-200 hover:border-emerald-300";
            iconColor = "text-emerald-500";
            accentBar = "bg-emerald-500";
            bgClass = isSelected ? "bg-emerald-50/20" : "bg-white";
            textHighlight = "text-emerald-950";
          } else if (value === "QUERY_RAISED") {
            borderClass = isSelected ? "border-rose-500 shadow-md ring-1 ring-rose-500" : "border-gray-200 hover:border-rose-300";
            iconColor = "text-rose-500";
            accentBar = "bg-rose-500";
            bgClass = isSelected ? "bg-rose-50/20" : "bg-white";
            textHighlight = "text-rose-955 text-rose-950";
          }

          return (
            <Card
              key={value}
              hoverable
              onClick={() => setSelectedStatus(value)}
              bodyStyle={{ padding: "16px" }}
              className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${borderClass} ${bgClass}`}
            >
              {/* Left Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
              
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1">{title}</div>
                  <div className={`text-2xl font-bold ${textHighlight}`}>{summaryCounts[value] || 0}</div>
                </div>
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/80' : 'bg-gray-50'} shadow-sm`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
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
          scroll={{ x: "max-content" }}
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

      {/* Property Papers Modal */}
      <Modal
        title='Property Papers / Legal Documents'
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDocsModalOpen(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <div className="p-2">
          {selectedCaseDocs && selectedCaseDocs.length > 0 ? (
            <div className="space-y-3">
              {selectedCaseDocs.map((doc, idx) => {
                const url = typeof doc === "string" ? doc : doc.url || "";
                const name = typeof doc === "string" ? doc.split("/").pop() : doc.name || url.split("/").pop() || `Document_${idx + 1}`;
                const downloadUrl = url.includes("imagekit.io")
                  ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
                  : url;
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs md:max-w-md"
                      title="Click to view document"
                    >
                      {name}
                    </a>
                    <div className="flex gap-2">
                      <Button
                        type="default"
                        href={url}
                        target="_blank"
                        icon={<Eye className="w-4 h-4" />}
                        className="flex items-center"
                        title="View Document"
                      >
                        View
                      </Button>
                      <Button
                        type="primary"
                        href={downloadUrl}
                        download={name}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<Download className="w-4 h-4" />}
                        className="flex items-center text-white bg-blue-600 hover:bg-blue-700"
                        title="Download Document"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              No property papers available for this case.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FieldOfficerDashboard;
