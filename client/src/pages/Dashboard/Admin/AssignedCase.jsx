

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
import {
  getBankRoute,
  getDisplayCustomerName,
  getDisplayCity,
} from "../../../utils/dashboardRecord";

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
  const [BankName, setBankName] = useState(null);

  // Fetch cases
  useEffect(() => {
    dispatch(fetchAssignedCases());
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  // Filter search
  useEffect(() => {
    let filtered = cases;

    if (selectedZone) {
      filtered = filtered.filter((item) => {
        const city = getDisplayCity(item);
        return city.toLowerCase().includes(selectedZone.toLowerCase());
      });
    }

    if (searchText) {
      const normalizedSearchText = searchText.toLowerCase();
      filtered = filtered.filter((item) =>
        [
          item.bankName,
          getDisplayCustomerName(item),
          item?.assignedTo?.name,
          item.status,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearchText)
        )
      );
    }

    setFilteredData(filtered);
  }, [cases, searchText, selectedZone]);

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
  const openAssignModal = (caseId, bankName) => {
    setSelectedCaseId(caseId);
    setBankName(bankName);
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
        bankName: BankName
      });

      toast.success("Assignment updated");
      setIsModalOpen(false);
      setSelectedOfficer(null);
      dispatch(fetchAssignedCases());
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };


  useEffect(() => {
    console.log("this is loadinng ");
    console.log(loading);


  }, [loading])

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
          to={record.route || `/bank/${getBankRoute(record)}/${record._id}`}
          className="text-blue-600"
        >
          {getDisplayCustomerName(record)}
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
        <Button onClick={() => openAssignModal(record._id, record?.bankName)}>
          Change Assign
        </Button>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex gap-3">
          <Link to={record.route || `/bank/${getBankRoute(record)}/edit/${record._id}`}>
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
        <>
          <Spinner />

        </>
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
