import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LNAssigment from "./Form/LNTAssignmentDetails";
import GeneralDetails from "./Form/GeneralDetails";
import PropertyDetails from "./Form/PropertyDetails";
import ValuationDetails from "./Form/ValuationDetails";
// import DocomentDetails from "./Form/DocomentDetails";
import LocalityDetails from "./Form/LocalityDetails";
// import NDMAGuidelines from "./Form/NDMAGuidelines";
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

const HomeFirstBank = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.hfBanks);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isEdit, setIsEdit] = useState({});
  const [collectedData, setCollectedData] = useState({});
  const { id } = useParams();

  const [extractedData, setExtractedData] = useState({});
  // const [formDatas, setFormData] = useState()

  const fetchEditData = async (id) => {
    try {
      const response = await dispatch(fetchHFBankById(id)).unwrap();
      setIsEdit(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEditData(id);
    }
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
        // setStep(6);
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
        const response = await dispatch(
          updateDetails({ id, ...finalData })
        ).unwrap();
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

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleTabClick = (tabId) => {
    setStep(tabId);
  };

  const isFieldOfficer = user?.role === "FieldOfficer";

  const tabs = [
    {
      id: 1,
      label: "L & T ASSIGNMENT DETAILS",
      component: <LNAssigment isEdit={isEdit} onNext={handleNext} extractedData={extractedData} />,
    },
    {
      id: 2,
      label: "General & Document Details ",
      component: (
        <GeneralDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 3,
      label: "Locality & NDMA Details",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          extractedData={extractedData}
        />
      ),
    },
    {
      id: 4,
      label: "Property & Strultural  Details",
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
  ].filter((tab) => !isFieldOfficer || tab.id === 1); // 👈 Only Step 1 for FieldOfficer


  return (
    <div className='bg-gray-100 py-2 px-2  relative'>
      <div className='max-w-6xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Home First Bank Report Form</h1>
          {/* <p className='text-gray-500'>Step {step} of 6</p> */}
        </div>

        <AutoFillForm setFormData={setExtractedData} />

        {/* Unified Tabs Navigation */}
        <div className='flex  border-gray-200 gap-2 p-5  '>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-4 rounded-sm  px-4 font-medium border  text-sm focus:outline-none ${step === tab.id
                ? "border-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => handleTabClick(tab.id)} // ✅ Tab change on click
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Single Content Area */}
        <div className='p-4'>
          {tabs.find((tab) => tab.id === step)?.component}
        </div>

        {step === 6 && id && user?.role === "Admin" && (
          <div className='mt-6 text-right'>
            <button
              onClick={lastUpdate}
              className='ml-4 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700'
            >
              Final Submit
            </button>
          </div>
        )}

        {loading && <p className='text-blue-600'>Submitting...</p>}
        {error && <p className='text-red-600'>Error: {error}</p>}
      </div>
    </div>
  );
};

export default HomeFirstBank;
