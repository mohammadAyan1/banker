import React, { useEffect, useState } from "react";
import ManapuramFormOne from "./ManapuramFormOne";
import ManapuramFormTwo from "./ManapuramFormTwo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDetails,
  getDetailsById,
  updateDetails,
} from "../../../redux/features/Banks/manappuram/ManappuramThunks";
import toast from "react-hot-toast";

const Manapuram = () => {
  const [ManipuramData, setManipuramData] = useState({});
  const [ManipuramTwo, setManipuramTwo] = useState({});
  const [isEdit, setIsEdit] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.manappuram);

  const { id } = useParams();

  useEffect(() => {
    const editPageHandle = async (id) => {
      try {
        const response = await dispatch(getDetailsById(id)).unwrap();
        setIsEdit(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    editPageHandle(id);
  }, [id]);

  const handleSubmitAll = async () => {
    const finalData = {
      ...ManipuramData,
      ...ManipuramTwo,
    };

    try {
      if (id) {
        const response = await dispatch(
          updateDetails({ id, formData: finalData })
        ).unwrap();

        toast.success("Data updated successfully!");
      } else {
        const response = await dispatch(createDetails(finalData)).unwrap();
        navigate(`/bank/manappuram/${response._id}`);
        toast.success("Data submitted successfully!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className='max-w-5xl mx-auto mt-6 px-4'>
      <h3 className='text-2xl font-semibold mb-4'>Complete Valuation Report</h3>

      <ManapuramFormOne isEdit={isEdit} onDataChange={setManipuramData} />
      <ManapuramFormTwo isEdit={isEdit} onDataChange={setManipuramTwo} />
      {loading && <p className='text-blue-600'>Submitting...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}

      <div className='flex justify-end mt-4 mb-4'>
        <button
          className='bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition'
          onClick={handleSubmitAll}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default Manapuram;
