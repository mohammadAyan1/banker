// import React, { useState } from "react";
// import LocationForm from "./Form/LocationForm";
// import JobInfoForm from "./Form/JobInfoForm";
// import Attachments from "./Form/Attachments";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createValuation } from "../../../redux/features/Banks/HeroFinCorp/HeroFinCorpThunks";

// const HeroFinCorp = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleNext = (formData) => {
//     const updated = {
//       ...collectedData,
//       [`step${step}`]: formData,
//     };

//     setCollectedData(updated);

//     if (step < 3) {
//       setStep(step + 1);
//       toast.success(`Step ${step} completed`);
//     } else {
//       // Final step done — combine and submit all data
//       const final = {
//         ...updated.step1,
//         ...updated.step2,
//         ...updated.step3,
//       };
//       //   console.log("Final Submission Data:", final);
//       const response = dispatch(createValuation(final)).unwrap();
//       navigate(`/bank/hero-fincorp/${response._id}`);
//       toast.success("All steps completed successfully!");
//     }
//   };

//   return (
//     <div className='bg-gray-100 py-4 px-2 min-h-screen'>
//       <div className='max-w-5xl mx-auto bg-white shadow-lg rounded p-6'>
//         <h1 className='text-3xl font-bold mb-2'>Hero FinCorp Valuation Form</h1>
//         <p className='text-gray-500 mb-6'>Step {step} of 3</p>

//         <LocationForm onNext={handleNext} />
//         <JobInfoForm onNext={handleNext} />
//         <Attachments onNext={handleNext} />
//       </div>
//     </div>
//   );
// };

// export default HeroFinCorp;

import React, { useEffect, useState } from "react";
import LocationForm from "./Form/LocationForm";
import JobInfoForm from "./Form/JobInfoForm";
import Attachments from "./Form/Attachments";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createValuation,
  updateValuation,
  getValuationById,
} from "../../../redux/features/Banks/HeroFinCorp/HeroFinCorpThunks";

const HeroFinCorp = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  if (id) {
    useEffect(() => {
      const editPageHandle = async (id) => {
        try {
          const response = await dispatch(getValuationById(id)).unwrap();
          setIsEdit(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      editPageHandle(id);
    }, [id]);
  }

  const handleNext = async (formData) => {
    const updated = {
      ...collectedData,
      [`step${step}`]: formData,
    };

    setCollectedData(updated);

    if (step < 3) {
      setStep(step + 1);
      toast.success(`Step ${step} completed`);
    } else {
      // Final step done — combine and submit all data
      const final = {
        ...updated.step1,
        ...updated.step2,
        ...updated.step3,
      };
      //   console.log("Final Submission Data:", final);
      if (!id) {
        await dispatch(createValuation(final)).unwrap();
        navigate(`/bank/hero-fincorp/${response._id}`);
        toast.success("All steps completed successfully!");
      } else {
        const response = await dispatch(
          updateValuation({ id, formData: final })
        ).unwrap();
        navigate(`/`);
        toast.success("updated successfully!");
      }
    }
  };

  return (
    <div className='bg-gray-100 py-4 px-2 min-h-screen'>
      <div className='max-w-5xl mx-auto bg-white shadow-lg rounded p-6'>
        <h1 className='text-3xl font-bold mb-2'>Hero FinCorp Valuation Form</h1>
        <p className='text-gray-500 mb-6'>Step {step} of 3</p>

        <LocationForm isEdit={isEdit} onNext={handleNext} />
        <JobInfoForm isEdit={isEdit} onNext={handleNext} />
        <Attachments isEdit={isEdit} onNext={handleNext} />
      </div>
    </div>
  );
};

export default HeroFinCorp;
