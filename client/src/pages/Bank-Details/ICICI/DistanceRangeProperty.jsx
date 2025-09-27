import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const DistanceRangeProperty = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const d = useSelector((state) => state.icici.singleData) || {};
  const [distanceData, setDistanceData] = useState(d);

  return (
    <div className='mb-8 border border-gray-300 p-6 rounded-xl bg-gray-100'>
      <div className='p-6'>
        <h4 className='text-xl font-semibold text-[#AC2321] mb-4'>
          Distance Range of the Property
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <p>
              <strong>Distance From CPC (kms):</strong>
              <br />
              {distanceData.distanceFromCPC || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Distance From City Center (kms):</strong>
              <br />
              {distanceData.distanceFromCityCenter || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Distance From ICICI Bank Sourcing Branch (kms):</strong>
              <br />
              {distanceData.distanceFromBank || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Latitude:</strong>
              <br />
              {distanceData.latitude || "N/A"}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
          <div>
            <p>
              <strong>Longitude:</strong>
              <br />
              {distanceData.longitude || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>One Way Distance From Operating Location (kms):</strong>
              <br />
              {distanceData.oneWayDistance || "N/A"}
            </p>
          </div>
        </div>

        <h4 className='text-lg font-semibold mt-8 mb-4'>Location Map</h4>
        <div className='bg-white rounded-md overflow-hidden shadow p-4'>
          <iframe
            title='Google Map'
            width='100%'
            height='400'
            frameBorder='0'
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${distanceData.latitude},${distanceData.longitude}&z=15&output=embed`}
            allowFullScreen
          ></iframe>
        </div>

        <div className='flex justify-end mt-6'>
          <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistanceRangeProperty;
