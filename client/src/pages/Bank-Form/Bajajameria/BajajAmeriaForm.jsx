import React, { useState } from "react";
import AgencyName from "./Form/AgencyName";
import ApprovedPlanForm from "./Form/ApprovedPlanForm";
import PermissibleArea from "./Form/PermissibleArea";
import PanchayatPropertyForm from "./Form/PanchayatPropertyForm";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../../redux/features/Banks/bajajAmeriya/bajajThunks";

const BajajAmeriya = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({}); // Static for now (no API)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };

    setCollectedData(updatedData);

    if (step === 4) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
      };

      try {
        const response = await dispatch(createReport(finalData)).unwrap();
        // console.log(response, "RES_DATA");
        navigate(`/bank/bajaj-ameriya-bank/${response.data._id}`);
        toast.success("Form submitted successfully");
      } catch (err) {
        console.error("dmi-finance form submission failed:", err);
      }
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className='bg-gray-100 py-2 px-2'>
      <div className='max-w-8xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Bajaj Ameriya Form</h1>
          <p className='text-gray-500'>Step {step <= 4 ? step : 4} of 4</p>
        </div>

        {step === 1 && <AgencyName isEdit={isEdit} onNext={handleNext} />}
        {step === 2 && <ApprovedPlanForm isEdit={isEdit} onNext={handleNext} />}
        {step === 3 && <PermissibleArea isEdit={isEdit} onNext={handleNext} />}
        {step === 4 && (
          <PanchayatPropertyForm isEdit={isEdit} onNext={handleNext} />
        )}

        {step > 4 && (
          <div className='text-green-600 font-semibold mt-4'>
            ✅ All steps completed. Bajaj Ameriya form filled successfully.
          </div>
        )}
      </div>
    </div>
  );
};

export default BajajAmeriya;
