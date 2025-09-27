// import React, { useState, useEffect } from "react";
// import { Card } from "antd";
// import PropertyForm from "./Form/PropertyForm";
// import BoundariesForm from "./Form/BoundariesForm";
// import SurroundingAmenitiesForm from "./Form/SurroundingAmenitiesForm";
// import CautionAreaForm from "./Form/CautionAreaForm";
// import ValuationForm from "./Form/ValuationFom";
// import ConstructionProgressForm from "./Form/ConstructionProgressForm";
// import DistanceRangeForm from "./Form/DistanceRangeForm";
// import toast from "react-hot-toast";
// // import SitePhotographsForm from "./Form/SitePhotographsForm";
// import RemarksForm from "./Form/RemarksForm";
// import { useDispatch } from "react-redux";

// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createIciciBank,
//   getIciciBankById,
//   updateIciciBank,
// } from "../../../redux/features/Banks/IciciBank/iciciBankThunk";

// const IciciBank = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isEdit, setIsEdit] = useState(null);

//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const editPageHandle = async () => {
//         try {
//           const response = await dispatch(getIciciBankById(id)).unwrap();
//           // console.log(response, "RESPONSE");
//           setIsEdit(response);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };
//       editPageHandle();
//     }
//   }, [id]);

//   const handleNext = async (formData) => {
//     const updated = { ...collectedData, [`step${step}`]: formData };
//     setCollectedData(updated);

//     if (step === 8) {
//       const finalData = {
//         ...updated.step1,
//         ...updated.step2,
//         ...updated.step3,
//         ...updated.step4,
//         ...updated.step5,
//         ...updated.step6,
//         ...updated.step7,
//         ...updated.step8,
//       };

//       // console.log(finalData, "Final Data to be sent to the server");

//       try {
//         if (id) {
//           const response = await dispatch(
//             updateIciciBank({ id, formData: finalData })
//           ).unwrap();
//           navigate(`/`);
//           toast.success("Property Report Updated Successfully");
//         } else {
//           const response = await dispatch(createIciciBank(finalData)).unwrap();
//           navigate(`/bank/icici/${response._id}`);
//           toast.success("Property Report Created Successfully");
//         }
//       } catch (err) {
//         console.error("Submission failed:", err);
//       }
//     }

//     setStep((prev) => prev + 1);
//   };

//   return (
//     <div className='mb-3 max-w-6xl mt-4 mx-auto'>
//       <Card
//         title={
//           <div className='flex justify-between items-center'>
//             <span className='font-semibold text-lg'>ICICI Property Report</span>
//             <span className='text-gray-500'>
//               Step {step <= 8 ? step : 8} of 8
//             </span>
//           </div>
//         }
//         className='shadow-md rounded-2xl'
//       >
//         {step === 1 && <PropertyForm isEdit={isEdit} onNext={handleNext} />}
//         {step === 2 && <BoundariesForm isEdit={isEdit} onNext={handleNext} />}
//         {step === 3 && (
//           <SurroundingAmenitiesForm isEdit={isEdit} onNext={handleNext} />
//         )}
//         {step === 4 && <CautionAreaForm isEdit={isEdit} onNext={handleNext} />}
//         {step === 5 && <ValuationForm isEdit onNext={handleNext} />}
//         {step === 6 && <ConstructionProgressForm isEdit onNext={handleNext} />}
//         {step === 7 && (
//           <DistanceRangeForm isEdit={isEdit} onNext={handleNext} />
//         )}
//         {/* {step === 8 && <SitePhotographsForm onNext={handleNext} />} */}
//         {step === 8 && <RemarksForm isEdit={isEdit} onNext={handleNext} />}

//         {step > 8 && (
//           <div className='text-green-600 font-semibold mt-4'>
//             ✅ All steps completed. Data saved.
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default IciciBank;

import React, { useState, useEffect } from "react";
import { Card, Button, Spin } from "antd";
import PropertyForm from "./Form/PropertyForm";
import BoundariesForm from "./Form/BoundariesForm";
import SurroundingAmenitiesForm from "./Form/SurroundingAmenitiesForm";
import CautionAreaForm from "./Form/CautionAreaForm";
import ValuationForm from "./Form/ValuationForm"; 
import ConstructionProgressForm from "./Form/ConstructionProgressForm";
import DistanceRangeForm from "./Form/DistanceRangeForm";
import RemarksForm from "./Form/RemarksForm";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createIciciBank,
  getIciciBankById,
  updateIciciBank,
} from "../../../redux/features/Banks/IciciBank/iciciBankThunk";

const IciciBank = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchEditData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getIciciBankById(id)).unwrap();
      setEditData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchEditData();
    }
  }, [id]);

  const handleNext = async (formData) => {
    const stepKey = getStepKey(step);
    const updated = { ...collectedData, [stepKey]: formData };
    setCollectedData(updated);

    const partialData = Object.assign({}, ...Object.values(updated));

    try {
      if (id) {
        // ✅ Save on every step
        await dispatch(updateIciciBank({ id, formData: partialData })).unwrap();
        toast.success(`Step ${step} data saved`);
        await fetchEditData();
      }

      if (!id && step === 8) {
        // ✅ Create at final step if new
        const response = await dispatch(createIciciBank(partialData)).unwrap();
        toast.success("Property Report Created Successfully");
        navigate(`/bank/icici/${response._id}`);
        return;
      }

      if (id && step === 8) {
        toast.success("All steps updated");
        navigate(`/`);
        return;
      }

      setStep((prev) => prev + 1);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save step data.");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const getStepKey = (step) => {
    const keys = [
      "propertyDetails",
      "boundaries",
      "surroundingAmenities",
      "cautionArea",
      "valuation",
      "constructionProgress",
      "distanceRange",
      "remarks",
    ];
    return keys[step - 1];
  };

  const formProps = {
    onNext: handleNext,
    isEdit: editData,
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PropertyForm {...formProps} />;
      case 2:
        return <BoundariesForm {...formProps} />;
      case 3:
        return <SurroundingAmenitiesForm {...formProps} />;
      case 4:
        return <CautionAreaForm {...formProps} />;
      case 5:
        return <ValuationForm {...formProps} />;
      case 6:
        return <ConstructionProgressForm {...formProps} />;
      case 7:
        return <DistanceRangeForm {...formProps} />;
      case 8:
        return <RemarksForm {...formProps} />;
      // case 8:
      //   return <SitePhotographsForm {...formProps} />;
      default:
        return (
          <div className='text-green-600 font-semibold mt-4'>
            ✅ All steps completed. Data saved.
          </div>
        );
    }
  };

  return (
    <div className='mb-3 max-w-6xl mt-4 mx-auto'>
      <Card
        title={
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-lg'>ICICI Property Report</span>
            <span className='text-gray-500'>Step {Math.min(step, 8)} of 8</span>
          </div>
        }
        className='shadow-md rounded-2xl'
      >
        {loading ? (
          <div className='flex justify-center py-10'>
            <Spin size='large' />
          </div>
        ) : (
          <>
            {renderStep()}

            <div className='mt-4 flex justify-between'>
              <Button onClick={handleBack} disabled={step === 1}>
                Back
              </Button>
              {step < 9 && (
                <span className='text-sm text-gray-400'>
                  {step < 8 ? "Continue to next step" : "Submitting..."}
                </span>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default IciciBank;
