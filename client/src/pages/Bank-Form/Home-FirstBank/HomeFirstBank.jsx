import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LNAssigment from "./Form/LNTAssignmentDetails";
import LocalityDetails from "./Form/LocalityDetails";
import PropertyDetails from "./Form/PropertyDetails";
import ValuationDetails from "./Form/ValuationDetails";
import ViolationObserved from "./Form/ViolationObserved";
import FLoorWise from "./Form/FLoorWise";
import {
  createHFBanks,
  fetchHFBankById,
  updateDetails,
} from "../../../redux/features/Banks/HFBank/HFBankThunk";
import AutoFillForm from "../../AutoFillForm";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

const AccordionPanel = ({ id, label, component, isOpen, onToggle, isLast }) => (
  <div className="flex" style={{ gap: 0 }}>
    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 48 }}>
      <button
        onClick={() => onToggle(id)}
        className="flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0 focus:outline-none transition-all duration-200"
        style={{
          width: 36,
          height: 36,
          background: isOpen ? "#1d4ed8" : "#3d4a5c",
          color: "#fff",
          boxShadow: isOpen ? "0 0 0 4px #dbeafe" : "none",
          marginTop: 4,
          zIndex: 1,
        }}
      >
        {id}
      </button>

      {!isLast && (
        <div
          style={{
            flex: 1,
            width: 2,
            background: "#d1d5db",
            marginTop: 4,
            minHeight: isOpen ? 16 : 24,
          }}
        />
      )}
    </div>

    <div className="flex-1 min-w-0" style={{ paddingBottom: isLast ? 8 : 0 }}>
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
        style={{ padding: "10px 8px 10px 12px" }}
      >
        <span
          className="text-sm sm:text-base font-semibold transition-colors duration-150"
          style={{ color: isOpen ? "#1d4ed8" : "#111827" }}
        >
          {label}
        </span>
        <svg
          className={`flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ width: 16, height: 16, color: isOpen ? "#1d4ed8" : "#9ca3af" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? 99999 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div style={{ paddingLeft: 12, paddingRight: 8, paddingBottom: 24, paddingTop: 4 }}>
          {component}
        </div>
      </div>
    </div>
  </div>
);

const HomeFirstBank = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.hfBanks);
  const user = useSelector((state) => state.auth.user);
  const savedCity = useSelector((state) => state.assignedCases.savedCity);
  const navigate = useNavigate();
  const { id } = useParams();

  const [openSections, setOpenSections] = useState({ 1: true });
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const sectionSubmittersRef = useRef({});
  const [createdDate, setCreatedDate] = useState(null);
  const [finalSubmitting, setFinalSubmitting] = useState(false);

  const isFieldOfficer = user?.role === "FieldOfficer";
  const canFinalSubmit = id && (user?.role === "Admin" || user?.role === "SuperAdmin");

  const primaryActionLabel = isFieldOfficer
    ? "Submit"
    : !id
      ? "Submit"
      : "Update";

  const buildFinalData = (latestSections = {}) => {
    const mergedSections = { ...collectedData, ...latestSections };

    return {
      ...isEdit,
      ...mergedSections.step1,
      ...mergedSections.step2,
      ...mergedSections.step3,
      ...mergedSections.step4,
      ...mergedSections.step5,
      ...mergedSections.step6,
    };
  };

  const fetchEditData = async (fetchId) => {
    try {
      const response = await dispatch(fetchHFBankById(fetchId)).unwrap();
      setIsEdit(response);
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
    }
  };

  useEffect(() => {
    if (isFieldOfficer) {
      setOpenSections({ 1: true });
      if (id) {
        fetchEditData(id);
      }
      return;
    }

    const allOpen = {};
    for (let section = 1; section <= 6; section += 1) {
      allOpen[section] = true;
    }
    setOpenSections(allOpen);

    if (id) {
      fetchEditData(id);
    }
  }, [id, isFieldOfficer]);

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Auto data received:", extractedData);
    }
  }, [extractedData]);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => (prev[sectionId] ? {} : { [sectionId]: true }));
  };

  const registerSectionSubmitter = (sectionId, submitter) => {
    sectionSubmittersRef.current[sectionId] = submitter;
  };

  const allSections = [
    {
      id: 1,
      label: "General Details, Property Overview & Visit Details",
      component: (
        <>
          <LNAssigment
            isEdit={isEdit}
            sectionId={1}
            showActionButtons={false}
            registerSectionSubmitter={registerSectionSubmitter}
            extractedData={extractedData}
            fetchData={() => fetchEditData(id)}
          />
          <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <AutoFillForm setFormData={setExtractedData} />
          </div>
        </>
      ),
    },
    {
      id: 2,
      label: "Locality, Property Plan & NDMA Details",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          sectionId={2}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 3,
      label: "Boundaries, Dimensions & Structural Details",
      component: (
        <PropertyDetails
          isEdit={isEdit}
          sectionId={3}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 4,
      label: "Violation Observed",
      component: (
        <ViolationObserved
          isEdit={isEdit}
          sectionId={4}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 5,
      label: "Valuation Details",
      component: (
        <ValuationDetails
          isEdit={isEdit}
          sectionId={5}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 6,
      label: "Floor Wise Built-Up Area",
      component: (
        <FLoorWise
          isEdit={isEdit}
          sectionId={6}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
        />
      ),
    },
  ];

  const sections = isFieldOfficer
    ? allSections.filter((section) => section.id === 1)
    : allSections;

  const collectSectionData = async () => {
    const latestData = {};

    for (const section of sections) {
      const submitter = sectionSubmittersRef.current[section.id];

      if (typeof submitter !== "function") {
        continue;
      }

      const sectionData = await submitter();
      latestData[`step${section.id}`] = sectionData;
    }

    setCollectedData((prev) => ({ ...prev, ...latestData }));
    return latestData;
  };

  const handlePrimaryAction = async (finalSubmit) => {
    try {
      const latestSections = await collectSectionData();

      const finalData = buildFinalData(latestSections);
      let finalPayload = { ...finalData, city: savedCity };

      if (createdDate) {
        finalPayload = { ...finalData, createdAt: createdDate };
      }

      if (finalSubmit == "final") {
        finalPayload = { ...finalData, status: "FinalSubmitted" };

      }

      if (isFieldOfficer) {
        if (id) {
          await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
        } else {
          await dispatch(createHFBanks(finalPayload)).unwrap();
        }

        toast.success("Form submitted successfully");
        navigate("/");
        return;
      }

      if (!id) {
        const response = await dispatch(createHFBanks(finalPayload)).unwrap();
        toast.success("Form submitted successfully");
        navigate(`/`);
        return;
      }

      const response = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      toast.success("Form updated successfully");
      navigate(`/`);
    } catch (submitError) {
      if (submitError?.errorFields) {
        toast.error("Please complete the required fields");
        return;
      }

      toast.error("Failed to submit form");
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = async () => {
    if (!id || !canFinalSubmit) {
      toast.error("Cannot perform final submit");
      return;
    }

    setFinalSubmitting(true);
    try {
      const latestSections = await collectSectionData();
      const finalData = buildFinalData(latestSections);
      let finalPayload = { ...finalData, city: savedCity };

      if (createdDate) {
        finalPayload = { ...finalData, createdAt: createdDate };
      }

      // First update the report
      await dispatch(updateDetails({ id, ...finalPayload })).unwrap();

      // Then perform final update on the case
      await dispatch(
        finalUpdate({ id, bankName: "HomeFirstBank", updateData: finalPayload })
      ).unwrap();

      toast.success("Case final submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Final submission failed:", error);
      toast.error(error?.message || "Final submission failed");
    } finally {
      setFinalSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900">Home First Bank</h1>
            <p className="text-xs text-gray-500">Property Valuation Report</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold text-blue-700">
          {sections.length} Sections
        </div>
      </header>

      <div className="w-full flex justify-end p-1">
        <div className="bg-[#fff4f4] border border-[#B5121B] px-3 py-2 rounded-lg shadow-sm">
          <input
            type="datetime-local"
            onChange={(e) => setCreatedDate(e.target.value)}
            className="outline-none bg-transparent text-xs text-[#B5121B] font-medium text-right"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 py-4">
          {sections.map((section, index) => (
            <AccordionPanel
              key={section.id}
              id={section.id}
              label={section.label}
              component={section.component}
              isOpen={!!openSections[section.id]}
              onToggle={toggleSection}
              isLast={index === sections.length - 1}
            />
          ))}
        </div>

        {/* TWO BUTTONS - Submit and Final Submit */}
        <div className="mt-6 flex justify-end gap-4">
          {/* Normal Submit/Update Button */}
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={loading}
            className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Processing..." : primaryActionLabel}
          </button>



          <button
            type="button"
            onClick={() => handlePrimaryAction("final")}
            disabled={loading}
            className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Processing..." : "Final Submit"}
          </button>

          {/* Final Submit Button - Only for Admin/SuperAdmin in Edit Mode */}
          {canFinalSubmit && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={finalSubmitting || loading}
              className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition ${finalSubmitting || loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {finalSubmitting ? "Finalizing..." : "Final Submit"}
            </button>
          )}
        </div>

        {loading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Error: {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeFirstBank;