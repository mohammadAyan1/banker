// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import toast from "react-hot-toast";
// import { Table, Spin, Button, Tag, Input, Select, Popconfirm } from "antd";
// import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
// import { Edit3, Trash2 } from "lucide-react";

// import { fetchFieldOfficers } from "../../../redux/features/auth/authThunks";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchAssignedCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
// import { deletedCases } from "../../../redux/features/case/caseThunks";
// import getBankTagColor from "../getBankTagColor";

// import { selectFieldOfficers } from "../../../redux/selectors";

// import Spinner from "../../../components/Spinner";
// import ImageUploader from "../../../components/ImageUploader";
// import axiosInstance from "../../../config/axios";
// // import { markNotificationAsRead } from "../../../redux/features/notification/notificationThunk";

// const getBankRoute = (bankName) => {
//   if (!bankName) return "";

//   const lower = bankName.toLowerCase();

//   if (lower === "homefirst" || lower === "home first") {
//     return "home-first";
//   }

//   return lower.replace(/\s+/g, "-");
// };

// const { Search } = Input;
// const { Option } = Select;

// const AssignedCase = ({ onCountChange }) => {
//   const dispatch = useDispatch();
//   const { data: cases, loading } = useSelector((state) => state.assignedCases);
//   // const { notifications } = useSelector((state) => state.notification);


//   const { user } = useSelector((state) => state.auth);

//   const navigate = useNavigate();

//   const [searchText, setSearchText] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   // const [statusFilter, setStatusFilter] = useState(null);
//   const [openModel, setOpenModel] = useState(false);

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   useEffect(() => {
//     if (onCountChange) {
//       onCountChange(cases.length);
//     }
//   }, [cases]);




//   useEffect(() => {
//     dispatch(fetchAssignedCases());
//   }, [dispatch]);

//   useEffect(() => {
//     let filtered = cases;

//     // Apply search filter
//     if (searchText) {
//       filtered = filtered.filter((item) =>
//         Object.values(item).some(
//           (val) =>
//             val &&
//             val.toString().toLowerCase().includes(searchText.toLowerCase())
//         )
//       );
//     }

//     // Apply status filter
//     // if (statusFilter) {
//     //   filtered = filtered.filter((item) => item.status === statusFilter);
//     // }

//     // // Apply bank filter
//     // if (bankFilter) {
//     //   filtered = filtered.filter((item) => item.bankName === bankFilter);
//     // }

//     setFilteredData(filtered);
//   }, [cases, searchText,]);

//   const handleRemoveAssignment = async (id) => {
//     try {
//       await axiosInstance.put(`/case/unassign-case/${id}`);
//       toast.success("Assignment removed successfully");
//       dispatch(fetchAssignedCases());

//       // navigate("/");
//     } catch (err) {
//       console.error("Failed to remove assignment:", err);
//       toast.error("Failed to remove assignment");
//     }
//   };

//   const handleTableChange = (pagination, filters, sorter) => {
//     setPagination(pagination);

//     // Handle sorting
//     if (sorter.field) {
//       const sortedData = [...filteredData].sort((a, b) => {
//         const aValue = a[sorter.field];
//         const bValue = b[sorter.field];

//         if (typeof aValue === "string" && typeof bValue === "string") {
//           return sorter.order === "ascend"
//             ? aValue.localeCompare(bValue)
//             : bValue.localeCompare(aValue);
//         }
//         return sorter.order === "ascend" ? aValue - bValue : bValue - aValue;
//       });

//       setFilteredData(sortedData);
//     }
//   };

//   const columns = [
//     {
//       title: "Bank Name",
//       dataIndex: "bankName",
//       render: (bankName, record) => {

//         console.log(bankName)
//         console.log(record)

//         const color = getBankTagColor(bankName);
//         // TED Indicator Color Logic
//         let indicatorColor = ""; // Default
//         switch (record.timeline[0]?.status) {
//           case "submitted-by-fo":
//             indicatorColor = "red";
//             break;
//           case "submitted-by-tm":
//             indicatorColor = "yellow";
//             break;
//           case "complete":
//             indicatorColor = "green";
//             break;
//         }

//         return (
//           <div className='flex items-center gap-2'>
//             {/* TED Indicator */}
//             <span
//               className='w-3 h-3 rounded-full inline-block'
//               style={{ backgroundColor: indicatorColor }}
//             ></span>
//             {/* Bank Name Tag */}
//             <Tag color={color}>{bankName}</Tag>
//           </div>
//         );
//       },
//     },

//     {
//       title: "Customer Name",
//       dataIndex: "customerName",
//       render: (text, record) => {
//         const displayName =
//           record.customerName ||
//           record.applicantName ||
//           record.personName ||
//           "N/A";

//         const bankRoute = getBankRoute(record.bankName);
//         // console.log(record.route, "KNOWN");
//         const route =
//           bankRoute === "homefirsttrench" ? "home-first-trench" : bankRoute;
//         return (
//           <Link
//             to={`/bank/${route}/${record._id}`}
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
//       render: (text, record) => (
//         <div className='flex items-center gap-2'>
//           <span>{text || "Not Assigned"}</span>
//           {record.assignedTo && user.role === "Admin" && (
//             <Popconfirm
//               title='Are you sure you want to remove this assignment?'
//               onConfirm={() => handleRemoveAssignment(record._id)}
//               okText='Yes'
//               cancelText='No'
//             >
//               <button className='text-gray-800 p-1 hover:bg-red-500 px-2 bg-red-300 rounded-full text-sm cursor-pointer'>
//                 R
//               </button>
//             </Popconfirm>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => (
//         <span className='bg-green-600 text-white px-2 py-1 rounded font-semibold inline-block'>
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (record) => (
//         <>
//           <div className='flex gap-4 items-center'>
//             <Link
//               to={`${record.route}`}
//               className='!text-green-600 hover:underline border p-1'
//             >
//               <Edit3 size={18} />
//             </Link>
//             <Button
//               onClick={() => {
//                 dispatch(deletedCases(record._id));
//                 toast.success("Case deleted successfully!");
//                 navigate(0);
//               }}
//               className='!text-red-600 hover:underline'
//             >
//               <Trash2 size={18} />
//             </Button>
//           </div>
//         </>
//       ),
//     },

//     {
//       title: "Change Assign",
//       key: "change Assign",
//       render: () => (
//         <>
//           <div className='flex gap-4 items-center'>

//             <Button
//               onClick={() => { setOpenModel(true) }}
//               className='!text-red-600 hover:underline'
//             >
//               Change Assign
//             </Button>
//           </div>
//         </>
//       ),
//     },


//   ];


//   const fieldOfficers = useSelector(selectFieldOfficers);


//   useEffect(() => {
//     dispatch(fetchFieldOfficers()).unwrap();
//   }, [dispatch])


//   useEffect(() => {
//     console.log(fieldOfficers);

//   }, [fieldOfficers])


//   const Modal = () => {
//     if (!openModel) return

//     console.log('SDFGHjk');
//     return (

//       <div>
//         <select>
//           {fieldOfficers?.map((item, index) => {
//             return (
//               <option key={index} value={item?._id}>{item?.name}</option>
//             )
//           })}
//         </select>
//       </div>
//     )
//   }

//   return (
//     <div className='p-4'>
//       <Modal />
//       <h2 className='text-xl font-bold mb-4'>All Assigned Cases</h2>

//       {/* Search and Filter Controls */}
//       <div className='flex gap-4 mb-4'>
//         <Search
//           placeholder='Search cases...'
//           allowClear
//           enterButton
//           size='large'
//           onChange={(e) => setSearchText(e.target.value)}
//         // style={{ width: 400 }}
//         />
//       </div>

//       {loading ? (
//         <Spinner />
//       ) : (
//         <Table
//           dataSource={filteredData}
//           columns={columns}
//           rowKey='_id'
//           bordered
//           pagination={{
//             ...pagination,
//             total: filteredData.length,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50", "100"],
//           }}
//           onChange={handleTableChange}
//         />
//       )}
//     </div>
//   );
// };

// export default AssignedCase;





import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Table, Button, Tag, Input, Popconfirm, Modal, Select } from "antd";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { fetchFieldOfficers } from "../../../redux/features/auth/authThunks";
import { fetchAssignedCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import { deletedCases } from "../../../redux/features/case/caseThunks";
import axiosInstance from "../../../config/axios";
import getBankTagColor from "../getBankTagColor";
import { selectFieldOfficers } from "../../../redux/selectors";
import Spinner from "../../../components/Spinner";

const { Search } = Input;
const { Option } = Select;

const AssignedCase = () => {
  const dispatch = useDispatch();
  const { data: cases, loading } = useSelector((state) => state.assignedCases);
  const { user } = useSelector((state) => state.auth);

  const fieldOfficers = useSelector(selectFieldOfficers);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Fetch cases
  useEffect(() => {
    dispatch(fetchAssignedCases());
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  // Filter search
  useEffect(() => {
    let filtered = cases;

    if (searchText) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
  }, [cases, searchText]);

  // Remove assignment
  const handleRemoveAssignment = async (id) => {
    try {
      await axiosInstance.put(`/case/unassign-case/${id}`);
      toast.success("Assignment removed");
      dispatch(fetchAssignedCases());
    } catch {
      toast.error("Failed to remove assignment");
    }
  };

  // Open modal
  const openAssignModal = (caseId) => {
    setSelectedCaseId(caseId);
    setIsModalOpen(true);
  };

  // Assign officer
  const handleAssign = async () => {
    if (!selectedOfficer) {
      toast.error("Select field officer");
      return;
    }

    try {
      await axiosInstance.put("/case/change-assignment", {
        caseId: selectedCaseId,
        officerId: selectedOfficer,
        bankName: "HomeFirst"
      });

      toast.success("Assignment updated");
      setIsModalOpen(false);
      setSelectedOfficer(null);
      dispatch(fetchAssignedCases());
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName, record) => {
        const color = getBankTagColor(bankName);

        let indicatorColor = "";
        switch (record.timeline?.[0]?.status) {
          case "submitted-by-fo":
            indicatorColor = "red";
            break;
          case "submitted-by-tm":
            indicatorColor = "yellow";
            break;
          case "complete":
            indicatorColor = "green";
            break;
          default:
            indicatorColor = "gray";
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: indicatorColor }}
            />
            <Tag color={color}>{bankName}</Tag>
          </div>
        );
      },
    },
    {
      title: "Customer",
      render: (record) => (
        <Link
          to={`/bank/${record.bankName}/${record._id}`}
          className="text-blue-600"
        >
          {record.customerName || "N/A"}
        </Link>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"],
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <span>{text || "Not Assigned"}</span>

          {record.assignedTo && user.role === "Admin" && (
            <Popconfirm
              title="Remove assignment?"
              onConfirm={() => handleRemoveAssignment(record._id)}
            >
              <button className="bg-red-300 px-2 rounded">R</button>
            </Popconfirm>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="bg-green-600 text-white px-2 py-1 rounded">
          {status}
        </span>
      ),
    },
    {
      title: "Change Assign",
      render: (record) => (
        <Button onClick={() => openAssignModal(record._id)}>
          Change Assign
        </Button>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex gap-3">
          <Link to={record.route}>
            <Edit3 size={18} />
          </Link>
          <Button
            danger
            onClick={() => {
              dispatch(deletedCases(record._id));
              toast.success("Deleted");
            }}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Cases</h2>

      <Search
        placeholder="Search..."
        size="large"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <Spinner />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          bordered
        />
      )}

      {/* ✅ ASSIGN MODAL */}
      <Modal
        title="Change Assignment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAssign}
        okText="Assign"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Field Officer"
          onChange={setSelectedOfficer}
        >
          {fieldOfficers?.map((fo) => (
            <Option key={fo._id} value={fo._id}>
              {fo.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default AssignedCase;