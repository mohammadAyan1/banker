// import React, { useState, useEffect } from "react";
// import { Card } from "antd";
// import ValuationReportForm from "./Form/ValuationReportForm";
// import NDMAParametersForm from "./Form/NDMAParametersForm";
// import TechnicalDetails from "./Form/TechnicalDetails";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createValuationReport,
//   updateValuationReport,
//   getValuationReportById,
// } from "../../../redux/features/Banks/bajaj/BajajAsyncThunks";

// import { getCurrentLocation } from "../../../utils/getCurrentLocation";

// const Bajajbank = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});
//   const [isEdit, setIsEdit] = useState({}); // Static for now (no API)

//   const user = useSelector((state) => state.auth.user);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const editPageHandle = async (id) => {
//         try {
//           const response = await dispatch(getValuationReportById(id)).unwrap();
//           console.log(response, "DSS");

//           setIsEdit(response.data);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };
//       editPageHandle(id);
//     }
//   }, [id]);

//   const handleNext = async (formData) => {
//     const updatedData = { ...collectedData, [`step${step}`]: formData };

//     setCollectedData(updatedData);

//     if (step === 3) {
//       const finalData = {
//         ...updatedData.step1,
//         ...updatedData.step2,
//         ...updatedData.step3,
//       };

//       let location = null;
//       let isReportSubmitted = false;

//       if (user.role === "FieldOfficer") {
//         try {
//           location = await getCurrentLocation();
//           isReportSubmitted = true;
//         } catch (locErr) {
//           console.warn("Location fetch failed:", locErr);
//           // Optionally notify user or just skip location
//         }
//       }

//       const payload = {
//         ...finalData,
//         ...(location && { location }), // Only attach if available
//         isReportSubmitted,
//       };

//       // console.log(finalData, "FInal_DATA");
//       try {
//         if (id) {
//           await dispatch(
//             updateValuationReport({ id, finalData: payload })
//           ).unwrap();
//           user.role === "Admin" ? navigate("/") : navigate("/field/dashboard");
//           toast.success(" submitted successfully");
//         } else {
//           const response = await dispatch(
//             createValuationReport(finalData)
//           ).unwrap();
//           navigate(`/bank/bajaj/${response._id}`);
//           toast.success("Form submitted successfully");
//         }
//       } catch (err) {
//         console.error("dmi-finance form submission failed:", err);
//       }
//     }
//     setStep((prev) => prev + 1);
//   };
//   return (
//     <div className='mb-3 max-w-6xl mt-4 mx-auto'>
//       <Card
//         title={
//           <div className='flex justify-between items-center'>
//             <span className='font-semibold text-lg'>
//               Bajaj Bank Technical Report
//             </span>
//             <span className='text-gray-500'>
//               Step {step <= 3 ? step : 3} of 3
//             </span>
//           </div>
//         }
//         className='shadow-md rounded-2xl'
//       >
//         {step === 1 && <ValuationReportForm onNext={handleNext} />}
//         {step === 2 && <NDMAParametersForm onNext={handleNext} />}
//         {step === 3 && <TechnicalDetails onNext={handleNext} />}

//         {step > 3 && (
//           <div className='text-green-600 font-semibold mt-4'>
//             ✅ All steps completed. Data saved locally.
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default Bajajbank;

import React, { useState, useEffect } from "react";
import { Card } from "antd";
import ValuationReportForm from "./Form/ValuationReportForm";
import NDMAParametersForm from "./Form/NDMAParametersForm";
import TechnicalDetails from "./Form/TechnicalDetails";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createValuationReport,
  updateValuationReport,
  getValuationReportById,
} from "../../../redux/features/Banks/bajaj/BajajAsyncThunks";

import { getCurrentLocation } from "../../../utils/getCurrentLocation";

const Bajajbank = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const editPageHandle = async (id) => {
        try {
          const response = await dispatch(getValuationReportById(id)).unwrap();
          setIsEdit(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      editPageHandle(id);
    }
  }, [id, dispatch]);

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };
    setCollectedData(updatedData);

    if (step === 3) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
      };

      let location = null;

      // console.log(location)
      if (user.role === "FieldOfficer") {
        try {
          location = await getCurrentLocation();
          isReportSubmitted = true;
        } catch (locErr) {
          console.warn("Location fetch failed:", locErr);
        }
      }

      const payload = {
        ...finalData,
        location: location, // locationValue should not be null here
        isReportSubmitted: true, // true or false based on condition
      };

      try {
        if (id) {
          await dispatch(updateValuationReport({ id, ...payload })).unwrap();
          user.role === "Admin" ? navigate("/") : navigate("/field/dashboard");
          toast.success("Form updated successfully");
        } else {
          const response = await dispatch(
            createValuationReport(finalData)
          ).unwrap();
          navigate(`/bank/bajaj/${response._id}`);
          toast.success("Form submitted successfully");
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        toast.error("Submission failed. Try again.");
      }
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className='mb-3 max-w-6xl mt-4 mx-auto'>
      <Card
        title={
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-lg'>
              Bajaj Bank Technical Report
            </span>
            <span className='text-gray-500'>
              Step {step <= 3 ? step : 3} of 3
            </span>
          </div>
        }
        className='shadow-md rounded-2xl'
      >
        {step === 1 && (
          <ValuationReportForm onNext={handleNext} defaultValues={isEdit} />
        )}
        {step === 2 && (
          <NDMAParametersForm onNext={handleNext} defaultValues={isEdit} />
        )}
        {step === 3 && (
          <TechnicalDetails onNext={handleNext} defaultValues={isEdit} />
        )}

        {step > 3 && (
          <div className='text-green-600 font-semibold mt-4'>
            ✅ All steps completed. Data saved locally.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Bajajbank;
