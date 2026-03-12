import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LNAssigment from "./Form/LNTAssignmentDetails";
import GeneralDetails from "./Form/GeneralDetails";
import PropertyDetails from "./Form/PropertyDetails";
import ValuationDetails from "./Form/ValuationDetails";
import LocalityDetails from "./Form/LocalityDetails";
import ViolationObserved from "./Form/ViolationObserved";
import {
  createHFBanks,
  fetchHFBankById,
  updateDetails,
} from "../../../redux/features/Banks/HFBank/HFBankThunk";
import { useNavigate, useParams } from "react-router-dom";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import toast from "react-hot-toast";
import AutoFillForm from "../../AutoFillForm";
import FLoorWise from "./Form/FLoorWise";

const HomeFirstBank = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.hfBanks);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isEdit, setIsEdit] = useState({});
  const [collectedData, setCollectedData] = useState({});
  const { id } = useParams();

  // extractedData holds the auto-fill data from the uploaded document.
  // It is passed as a prop to every step component.
  const [extractedData, setExtractedData] = useState({});

  const fetchEditData = async (id) => {
    try {
      const response = await dispatch(fetchHFBankById(id)).unwrap();
      setIsEdit(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) fetchEditData(id);
  }, [id, dispatch]);

  const lastUpdate = async () => {
    const finalData = {
      ...collectedData.step1,
      ...collectedData.step2,
      ...collectedData.step3,
      ...collectedData.step4,
      ...collectedData.step5,
      ...collectedData.step6,
    };
    try {
      await dispatch(
        finalUpdate({ id, bankName: "home-first", updateData: finalData })
      ).unwrap();
      toast.success("Case submitted finally!");
      navigate("/");
    } catch (err) {
      console.error("Final submission failed", err);
      toast.error("Final submission failed");
    }
  };

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };
    setCollectedData(updatedData);

    if (id) {
      try {
        await dispatch(updateDetails({ id, ...formData })).unwrap();
        toast.success(`Step ${step} updated successfully`);
        await fetchEditData(id);
      } catch (err) {
        console.error("Step update failed:", err);
        toast.error("Failed to update this step");
        return;
      }
    }

    if (user.role === "FieldOfficer" && step === 1) {
      try {
        await dispatch(updateDetails({ id, ...formData })).unwrap();
        toast.success("Form updated successfully");
        navigate("/field/dashboard");
      } catch (err) {
        console.error("Submission failed:", err);
        toast.error("Failed to submit form");
      }
      return;
    }

    if (step === 6 && id && user.role === "Admin") {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
        ...updatedData.step6,
      };
      try {
        const response = await dispatch(updateDetails({ id, ...finalData })).unwrap();
        toast.success("Form updated successfully");
        navigate(`/bank/home-first/${response?._id}`);
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update form");
      }
      return;
    }

    if (step === 6) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
        ...updatedData.step6,
      };
      try {
        const response = await dispatch(createHFBanks(finalData)).unwrap();
        toast.success("Form submitted successfully");
        navigate(`/bank/home-first/${response._id}`);
      } catch (err) {
        console.error("Creation failed:", err);
        toast.error("Failed to submit form");
      }
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));
  const handleTabClick = (tabId) => setStep(tabId);

  const isFieldOfficer = user?.role === "FieldOfficer";

  const tabs = [
    {
      id: 1,
      label: "General Details & Property Overview & Visit Details",
      component: (
        <>
          <LNAssigment
            isEdit={isEdit}
            onNext={handleNext}
            extractedData={extractedData}
            fetchData={() => fetchEditData(id)}
          />

          <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <AutoFillForm setFormData={setExtractedData} />
          </div>
        </>
      ),
    },
    {
      id: 2,
      label: "LOCALITY & Property Plan & NDMA DETAILS ",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          extractedData={extractedData}
        />
      ),
    },
    // {
    //   id: 3,
    //   label: "Property Plan & Availability",
    //   component: (
    //     <GeneralDetails
    //       isEdit={isEdit}
    //       onNext={handleNext}
    //       onBack={handleBack}
    //       extractedData={extractedData}
    //     />
    //   ),
    // },
    {
      id: 3,
      label: "Boundaries, Dimensions & Structural Details",
      component: (
        <PropertyDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
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
          onNext={handleNext}
          onBack={handleBack}
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
          onNext={handleNext}
          onBack={handleBack}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 6,
      label: "Floor wise built-up area",
      component: (
        <FLoorWise
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          extractedData={extractedData}
        />
      ),
    },

  ].filter((tab) => !isFieldOfficer || tab.id === 1);


  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Auto data received:", extractedData);
    }
  }, [extractedData]);

  return (
    <div className="bg-gray-100 py-2 px-2 relative">
      <div className="max-w-6xl mx-auto bg-white shadow rounded p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Home First Bank Report Form</h1>
        </div>

        {/* ── Auto-fill section — ABOVE TABS so user uploads BEFORE filling ──
        <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
          <AutoFillForm setFormData={setExtractedData} />
        </div> */}

        {/* ── Tab Navigation ── */}
        <div className="flex flex-wrap border-gray-200 gap-2 p-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 rounded-sm px-4 font-medium border text-sm focus:outline-none ${step === tab.id
                ? "border-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Active Step Content ── */}
        <div className="p-4">
          {tabs.find((tab) => tab.id === step)?.component}
        </div>

        {step === 6 && id && user?.role === "Admin" && (
          <div className="mt-6 text-right">
            <button
              onClick={lastUpdate}
              className="ml-4 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Final Submit
            </button>
          </div>
        )}

        {loading && <p className="text-blue-600">Submitting...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {/* ── Auto-fill section — ABOVE TABS so user uploads BEFORE filling ── */}
        {/* <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
          <AutoFillForm setFormData={setExtractedData} />
        </div> */}
      </div>
    </div>
  );
};

export default HomeFirstBank;
