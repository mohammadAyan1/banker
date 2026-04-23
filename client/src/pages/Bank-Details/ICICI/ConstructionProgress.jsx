import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ConstructionProgress = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const d = useSelector((state) => state.icici.singleData);
  const [constructionData, setConstructionData] = useState(d);

  return (
    <div className='mb-6 border border-gray-300 p-6 rounded-xl bg-gray-100'>
      <div className='p-4'>
        <h4 className='text-xl font-semibold text-red-700 mb-4'>
          Construction Progress Details
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div>
            <strong>Type Of Structure: *</strong>
            <div>{constructionData.typeOfStructure || "N/A"}</div>
          </div>
          <div>
            <strong>Structure Configuration:</strong>
            <div>{constructionData.structureConfiguration || "N/A"}</div>
          </div>
          <div>
            <strong>Stage Of Completion Amenities (%):</strong>
            <div>{constructionData.stageOfCompletion || "N/A"}</div>
          </div>
          <div>
            <strong>Stage Of Recommendation Amenities (%):</strong>
            <div>{constructionData.stageOfRecommendation || "N/A"}</div>
          </div>
        </div>

        <div className='bg-gray-200 border-2 border-gray-300 rounded-md p-4 mb-6'>
          <h5 className='text-lg font-semibold mb-2'>Stage of Amenity</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <strong>% Completion:</strong>{" "}
              {constructionData.amenityCompletion || "N/A"}
            </div>
            <div>
              <strong>% Recommendation:</strong>{" "}
              {constructionData.amenityRecommendation || "N/A"}
            </div>
          </div>

          <h5 className='text-lg font-semibold mt-6 mb-2'>
            Stage of Structure
          </h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <strong>% Completion:</strong>{" "}
              {constructionData.structureCompletion || "N/A"}
            </div>
            <div>
              <strong>% Recommendation:</strong>{" "}
              {constructionData.structureRecommendation || "N/A"}
            </div>
          </div>
        </div>

        <div className='bg-white border rounded-md p-4 mb-6'>
          <strong>Recommended Value:</strong> ₹
          {constructionData.recommendedValue || "0"} (
          {constructionData.recommendedValueWords || "N/A"})
        </div>

        <h4 className='text-xl font-semibold text-red-700 mb-2'>
          Comments on Construction
        </h4>
        <textarea
          className='w-full p-3 border border-gray-300 rounded-md'
          placeholder='Please enter your remarks here...'
          maxLength='1000'
          defaultValue={constructionData.comments || ""}
        />

        <div className='text-right mt-4'>
          <button className='bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstructionProgress;
