// !abhishek

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Input, Tag, Select, Modal, Button, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// --- Import all memoized selectors from your selectors.js file ---
import {
  selectIciciData,
  selectHfBanksData,
  selectAdityaData,
  selectPrimalData,
  selectSundaramData,
  selectCholaData,
  selectAgriwiseData,
  selectHeroFinCorpData,
  selectManapuramData,
  selectPiramalNPAData,
  selectSamstaData,
  selectProtiumData,
  selectIciciHFCData,
  selectFedralData,
  selectProfectusData,
  selectIdfcBankData,
  selectBajajData,
  selectBajajAmeriyaData,
  selectDmiFinanceData,
  selectFieldOfficers,
  selectOverallLoading,
} from "../../redux/selectors";

// --- Thunks for fetching bank data ---
import { fetchAllHFBanks } from "../../redux/features/Banks/HFBank/HFBankThunk";
import { getAllDetails } from "../../redux/features/Banks/Primal/piramalThunks";
import { fetchDetails } from "../../redux/features/Banks/AdityaBank/adityaThunks";
import { fetchAllDetails } from "../../redux/features/Banks/CholaBank/CholaThunks";
import { getAllIdfcDetails } from "../../redux/features/Banks/IDFCbank/idfclThunks";
import { fetchValuations } from "../../redux/features/Banks/agriwise/agriwiseThunks";
import { fetchAllReports } from "../../redux/features/Banks/bajajAmeriya/bajajThunks";
import { getAllIciciBanks } from "../../redux/features/Banks/IciciBank/iciciBankThunk";
import { getAllProtiumBanks } from "../../redux/features/Banks/Protium/ProtiumBankThunk";
import { getAllBankReports } from "../../redux/features/Banks/Profectus/profectusThunks";
import { getAllValuationReports } from "../../redux/features/Banks/bajaj/BajajAsyncThunks";
import { getAllValuations } from "../../redux/features/Banks/HeroFinCorp/HeroFinCorpThunks";
import { getAllFedralBank } from "../../redux/features/Banks/FedralBankForm/FedralBankThunk";
import { getAllIciciHFCBanks } from "../../redux/features/Banks/IciciHfCBank/IciciHFCBankThunk";
import { fetchAllExtendedValuations } from "../../redux/features/Banks/sundaram/sundaramThunks";
import { getAllManapuramDetails } from "../../redux/features/Banks/manappuram/ManappuramThunks";
import { getAllDmiFinanceReports } from "../../redux/features/Banks/dmiFinance/dmiFinanceThunks";
import { getAllSamstaflnBank } from "../../redux/features/Banks/SamstaflnBankForm/SamstaflnBankThunk";
import { getAllHomeTrenchReports } from "../../redux/features/Banks/homeTrench/homeTrenchReportThunks";
import { fetchPiramalFinanceRecords } from "../../redux/features/Banks/piramalFinance/piramalFinanceThunks";

import { assignCase, deletedCases } from "../../redux/features/case/caseThunks";
import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";

import getBankTagColor from "./getBankTagColor";

const { Search: AntSearch } = Input;
const { Option } = Select;

import { Edit3, Trash2, Plus } from "lucide-react";
import DocumentAttach from "../../components/DocumentAttach";
import ImageUploader from "../../components/ImageUploader";
import { getOutOfTatCases } from "../../redux/features/assignedCase/assignedCasesThunk";

const Pending = () => {
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  const [reportData, setReportData] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [selectedFO, setSelectedFO] = useState(null);

  const homeTrenchReport = useSelector(
    (state) => state.homeTrenchReport.reports
  );

  // --- Use memoized selectors to get data from Redux state ---
  const icici = useSelector(selectIciciData);
  const hfBanks = useSelector(selectHfBanksData);

  const aditya = useSelector(selectAdityaData);
  const primal = useSelector(selectPrimalData);
  const sundaram = useSelector(selectSundaramData);
  const chola = useSelector(selectCholaData);
  const agriwise = useSelector(selectAgriwiseData);
  const heroFinCorp = useSelector(selectHeroFinCorpData);
  const mannapuram = useSelector(selectManapuramData);
  const piramalNPA = useSelector(selectPiramalNPAData);
  const Samsta = useSelector(selectSamstaData);
  const protium = useSelector(selectProtiumData);
  const iciciHFC = useSelector(selectIciciHFCData);
  const Fedral = useSelector(selectFedralData);
  const Profectus = useSelector(selectProfectusData);
  const IDFCbank = useSelector(selectIdfcBankData);
  const Bajaj = useSelector(selectBajajData);
  const BajajAmeriya = useSelector(selectBajajAmeriyaData);
  const DmiFinance = useSelector(selectDmiFinanceData);
  const fieldOfficers = useSelector(selectFieldOfficers);
  const overallLoading = useSelector(selectOverallLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAllBankData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getAllIciciBanks()).unwrap(),
        dispatch(fetchAllHFBanks()).unwrap(),
        dispatch(getAllHomeTrenchReports()).unwrap(),
        dispatch(fetchDetails()).unwrap(),
        dispatch(getAllDetails()).unwrap(),
        dispatch(fetchAllExtendedValuations()).unwrap(),
        dispatch(getAllValuations()).unwrap(),
        dispatch(fetchAllDetails()).unwrap(),
        dispatch(fetchValuations()).unwrap(),
        dispatch(getAllManapuramDetails()).unwrap(),
        dispatch(fetchPiramalFinanceRecords()).unwrap(),
        dispatch(getAllIciciHFCBanks()).unwrap(),
        dispatch(getAllSamstaflnBank()).unwrap(),
        dispatch(getAllFedralBank()).unwrap(),
        dispatch(getAllBankReports()).unwrap(),
        dispatch(getAllProtiumBanks()).unwrap(),
        dispatch(getAllIdfcDetails()).unwrap(),
        dispatch(getAllValuationReports()).unwrap(),
        dispatch(fetchAllReports()).unwrap(),
        dispatch(getAllDmiFinanceReports()).unwrap(),
        dispatch(fetchFieldOfficers()).unwrap(),
      ]);
    } catch (error) {
      console.error("Error in parallel fetching:", error);
      toast.error("Failed to fetch all bank data.");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllBankData();
  }, [fetchAllBankData]);

  const handleDelete = async ({ id }) => {
    try {
      await dispatch(deletedCases(id)).unwrap();
      toast.success("Case deleted successfully.");
      navigate(0);
    } catch (error) {
      toast.error("Failed to delete case.");
      console.error("Delete Error:", error);
    }
  };

  const assignToFieldOfficer = useCallback(async () => {
    if (!selectedFO) {
      toast.error("Please select a Field Officer.");
      return;
    }

    try {
      await dispatch(
        assignCase({
          caseId: currentCase._id,
          fieldOfficerId: selectedFO,
          route: `/bank/${currentCase.route}/edit/${currentCase._id}`,
        })
      ).unwrap();

      toast.success("Assigned successfully!");
      setIsModalVisible(false);
      setSelectedFO(null);
      // await fetchAllBankData();
      navigate(0);
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign case.");
    }
  }, [dispatch, navigate, currentCase, selectedFO]);

  const showModal = (record) => {
    setCurrentCase(record);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedFO(null);
  };

  const memoizedReportData = useMemo(() => {
    const normalizeData = (
      items,
      bankName,
      route,
      customerNameKey,
      contactNoKey
    ) =>
      items
        .filter((item) => item.status === "Pending")
        .map((item) => ({
          ...item,
          _id: item._id,
          bankName,
          route,
          displayCustomerName: item[customerNameKey] || "N/A",
          customerNo: item[contactNoKey] || "N/A",
          createdAt: item.createdAt || new Date().toISOString(),
          assignedTo: item.assignedTo || null,
          status: item.status || "Pending",
        }));

    const HFTrenchWithBank = normalizeData(
      homeTrenchReport,
      homeTrenchReport[0]?.bankName,
      "home-first-trench",
      "visitedPersonName",
      "contactPerson"
    );

    const iciciHFCWithBank = normalizeData(
      iciciHFC,
      "ICICI HFC Bank",
      "icici-hfc",
      "applicantName",
      "contactPerson"
    );
    const DmiFinanceWithBank = normalizeData(
      DmiFinance,
      "DmiFinance Bank",
      "dmi-finance",
      "applicantName",
      "contactPerson"
    );
    const BajajAWithBank = normalizeData(
      BajajAmeriya,
      "Bajaj Ameriya Bank",
      "bajaj-ameriya-bank",
      "applicantName",
      "contactPerson"
    );
    const BajajWithBank = normalizeData(
      Bajaj,
      "Bajaj Bank",
      "bajaj",
      "applicantName",
      "contactPerson"
    );
    const idfcWithBank = normalizeData(
      IDFCbank,
      "IDFC Bank",
      "idfc-first-bank",
      "applicantNames",
      "contactPerson"
    );
    const agriwiseWithBank = normalizeData(
      agriwise,
      "Agriwise Bank",
      "agriwise",
      "customerName",
      "contactPerson"
    );
    const protiumWithBank = normalizeData(
      protium,
      "Protium Bank",
      "protium",
      "nameOfApplicant",
      "contactPerson"
    );
    const ProfectusWithBank = normalizeData(
      Profectus,
      "Profectus Bank",
      "profectus",
      "developerName",
      "contactPerson"
    );
    const FedralWithBank = normalizeData(
      Fedral,
      "Fedral Bank",
      "federal-bank",
      "customerName",
      "contactPerson"
    );
    const SamstaWithBank = normalizeData(
      Samsta,
      "Samasta Bank",
      "samasta",
      "applicantsName",
      "contactPerson"
    );
    const piramalNPAWithBank = normalizeData(
      piramalNPA,
      "piramalNPA Bank",
      "piramalnpa-form",
      "environmentExposureCondition",
      "contactPerson"
    );
    const manapuramWithBank = normalizeData(
      mannapuram,
      "Manapuram Bank",
      "manappuram",
      "applicantsName",
      "contactPerson"
    );
    const chholaWithBank = normalizeData(
      chola,
      "Chola Bank",
      "chola",
      "propertyOwner",
      "contactPerson"
    );
    const sundaramWithBank = normalizeData(
      sundaram,
      "Sundaram Bank",
      "sundaram",
      "propertyIdentifiedBy",
      "contactPerson"
    );
    const heroWithFinCorp = normalizeData(
      heroFinCorp,
      "HeroFinCorp Bank",
      "hero-fincorp",
      "applicantName",
      "contactPerson"
    );
    const hfWithBank = normalizeData(
      hfBanks,
      "HFFC Bank",
      "home-first",
      "customerName",
      "customerNo"
    );
    const iciciWithBank = normalizeData(
      icici,
      "ICICI Bank",
      "icici",
      "verifiedBy",
      "contactPerson"
    );
    const adityaWithBank = normalizeData(
      aditya,
      "Aditya Bank",
      "aditya",
      "clientName",
      "contactPerson"
    );
    const primalWithBank = normalizeData(
      primal,
      "Primal Bank",
      "piramal",
      "applicantName",
      "contactPerson"
    );

    return [
      ...hfWithBank,
      ...HFTrenchWithBank,
      ...iciciWithBank,
      ...adityaWithBank,
      ...primalWithBank,
      ...heroWithFinCorp,
      ...sundaramWithBank,
      ...chholaWithBank,
      ...manapuramWithBank,
      ...piramalNPAWithBank,
      ...SamstaWithBank,
      ...FedralWithBank,
      ...ProfectusWithBank,
      ...protiumWithBank,
      ...agriwiseWithBank,
      ...idfcWithBank,
      ...BajajWithBank,
      ...BajajAWithBank,
      ...DmiFinanceWithBank,
      ...iciciHFCWithBank,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [
    iciciHFC,
    DmiFinance,
    BajajAmeriya,
    Bajaj,
    IDFCbank,
    agriwise,
    protium,
    Profectus,
    Fedral,
    Samsta,
    piramalNPA,
    mannapuram,
    chola,
    sundaram,
    heroFinCorp,
    hfBanks,
    icici,
    aditya,
    primal,
    homeTrenchReport,
  ]);

  useEffect(() => {
    setReportData(memoizedReportData);
  }, [memoizedReportData]);

  const filteredData = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return [];
    }

    // First filter by bank if selected
    let data = reportData;
    if (selectedBank !== "All") {
      data = reportData.filter((item) => item.bankName === selectedBank);
    }

    // Then filter by search term
    const lowerCaseSearch = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [search, reportData, selectedBank]);

  const bankOptions = [
    { value: "All", label: "All Banks" },
    { value: "HFFC Bank", label: "HFFC Bank" },
    { value: "HomeFirstTrench", label: "HomeFirstTrench" },
    { value: "ICICI Bank", label: "ICICI Bank" },
    { value: "Aditya Bank", label: "Aditya Bank" },
    { value: "Primal Bank", label: "Primal Bank" },
    { value: "HeroFinCorp Bank", label: "HeroFinCorp Bank" },
    { value: "Sundaram Bank", label: "Sundaram Bank" },
    { value: "Chola Bank", label: "Chola Bank" },
    { value: "Manapuram Bank", label: "Manapuram Bank" },
    { value: "piramalNPA Bank", label: "PiramalNPA Bank" },
    { value: "Samasta Bank", label: "Samasta Bank" },
    { value: "Fedral Bank", label: "Fedral Bank" },
    { value: "Profectus Bank", label: "Profectus Bank" },
    { value: "Protium Bank", label: "Protium Bank" },
    { value: "Agriwise Bank", label: "Agriwise Bank" },
    { value: "IDFC Bank", label: "IDFC Bank" },
    { value: "Bajaj Bank", label: "Bajaj Bank" },
    { value: "Bajaj Ameriya Bank", label: "Bajaj Ameriya Bank" },
    { value: "DmiFinance Bank", label: "DmiFinance Bank" },
    { value: "ICICI HFC Bank", label: "ICICI HFC Bank" },
  ];

  const columns = [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      render: (bankName) => (
        <Tag color={getBankTagColor(bankName)}>{bankName}</Tag>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "displayCustomerName",
      key: "displayCustomerName",
      sorter: (a, b) =>
        a.displayCustomerName?.localeCompare(b.displayCustomerName),
      render: (text, record) => (
        <Link
          to={`/bank/${record.route}/${record._id}`}
          className='text-blue-600 hover:underline'
        >
          {text || "N/A"}
        </Link>
      ),
    },
    {
      title: "Address as per Legal Document",
      key: "addressLegal",
      render: (record) =>
        record.addressLegal ||
        record.address ||
        record.propertyAddress ||
        "N/A",
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY hh:mm A"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Assigned",
      key: "assigned",
      render: (record) => {
        const assignedFO = fieldOfficers.find(
          (fo) => fo._id === record.assignedTo
        );

        return (
          <div>
            {record.status === "Work in Progress" ? (
              <div className='text-green-700 font-semibold'>
                Assigned to: {assignedFO?.name || "Unknown"}
              </div>
            ) : (
              <Button type='primary' onClick={() => showModal(record)}>
                Assign
                <Plus size={20} />
              </Button>
            )}
          </div>
        );
      },
    },
    // {
    //   title: "Status",
    //   key: "status",
    //   render: (record) => (
    //     <span
    //       className={`px-2 py-1 rounded text-white text-xs ${
    //         record.status === "Pending"
    //           ? "!bg-yellow-500"
    //           : record.status === "Assigned"
    //           ? "!bg-blue-500"
    //           : "!bg-green-600"
    //       }`}
    //     >
    //       {record.status}
    //     </span>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className='flex gap-4 items-center'>
          <Link
            to={`/bank/${record.route}/edit/${record._id}`}
            className='!text-green-600 hover:underline  border p-1'
          >
            <Edit3 size={38} />
          </Link>
          <Button
            onClick={() => handleDelete({ id: record._id })}
            className='!text-red-600 hover:underline'
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
    {
      title: "Upload Document",
      key: "upload",
      render: (record) => (
        <ImageUploader
          images={images}
          setImages={setImages}
          setUploadedUrls={setUploadedUrls}
          caseId={record._id}
          // bankName={hfBanks[0]?.bankName || "Bank"}
          bankName={record.bankName}
          fetchData={fetchAllBankData}
        />
      ),
    },
    {
      title: "Attachments",
      key: "AttachDocuments",
      render: (record) => {
        const attachments = record.AttachDocuments;

        if (!attachments || attachments.length === 0) return "No Attachments";

        return (
          <div className='flex  gap-1'>
            {attachments.map((url, index) => {
              const fileName = url.split("/").pop();

              return (
                <a
                  key={index}
                  href={url}
                  download
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline !flex'
                >
                  📄 {fileName.slice(0, 3) || `Attachment ${index + 1}`}
                </a>
              );
            })}
          </div>
        );
      },
    },
  ];

  if (overallLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='bg-gray-100 p-6 rounded-xl shadow-md min-h-screen'>
      <div className='flex items-center gap-2 mb-4'>
        <Select
          style={{ width: 200 }}
          placeholder='Select Bank'
          value={selectedBank}
          onChange={setSelectedBank}
          options={bankOptions}
        />
        <AntSearch
          placeholder='Search customer names, addresses...'
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          style={{ width: 300 }}
        />
      </div>

      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>All Bank Valuation Reports</h2>
        <span className='text-sm text-gray-500'>
          Showing {filteredData.length} records (newest first)
        </span>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey='_id'
        pagination={{ pageSize: 10 }}
        bordered
        className='rounded-xl'
        scroll={{ x: true }}
      />

      <Modal
        title='Assign Field Officer'
        visible={isModalVisible}
        onOk={assignToFieldOfficer}
        onCancel={handleModalCancel}
        okText='Assign'
        cancelText='Cancel'
      >
        <div className='mb-4'>
          <p className='font-semibold'>
            Case: {currentCase?.displayCustomerName || "N/A"}
          </p>
          <p className='text-gray-600'>
            Bank: {currentCase?.bankName || "N/A"}
          </p>
        </div>

        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder='Select Field Officer'
          optionFilterProp='children'
          onChange={(value) => setSelectedFO(value)}
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {fieldOfficers.map((fo) => (
            <Option key={fo._id} value={fo._id}>
              {fo.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Pending;
