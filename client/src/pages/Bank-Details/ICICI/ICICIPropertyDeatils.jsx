import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PropertyDetails = () => {
  const [propertyData, setPropertyData] = useState(null);

  const d = useSelector((state) => state.icici.singleData) || {};

  // console.log(data, "ICICI DATAss");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/form-data");
  //       const data = await response.json();
  //       console.log(data); // Check structure
  //       setPropertyData(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (!propertyData) {
  //   return <div>Loading...</div>;
  // }

  // const d = propertyData.property;

  return (
    <div className='mb-4 border border-gray-300 p-5 rounded-lg bg-gray-100'>
      <h4 className='text-red-700 mb-5'>Property Details</h4>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div>
          <label className='text-gray-800'>Pincode</label>
          <p className='text-gray-600'>{d.pincode}</p>
        </div>
        <div>
          <label className='text-gray-800'>State</label>
          <p className='text-gray-600'>{d.state}</p>
        </div>
        <div>
          <label className='text-gray-800'>City</label>
          <p className='text-gray-600'>{d.city}</p>
        </div>
        <div>
          <label className='text-gray-800'>District</label>
          <p className='text-gray-600'>{d.district}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3'>
        <div>
          <label className='text-gray-800'>Locality</label>
          <p className='text-gray-600'>{d.locality}</p>
        </div>
        <div>
          <label className='text-gray-800'>Street Name & No.</label>
          <p className='text-gray-600'>{d.streetName}</p>
        </div>
        <div>
          <label className='text-gray-800'>Landmark</label>
          <p className='text-gray-600'>{d.landmark}</p>
        </div>
        <div>
          <label className='text-gray-800'>Plot No.</label>
          <p className='text-gray-600'>{d.plotNo}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3'>
        <div>
          <label className='text-gray-800'>Property Type</label>
          <p className='text-gray-600'>{d.propertyType}</p>
        </div>
        <div>
          <label className='text-gray-800'>Unit Type</label>
          <p className='text-gray-600'>{d.unitType}</p>
        </div>
        <div className='lg:col-span-2'>
          <label className='text-gray-800'>Revenue Record Type & Number</label>
          <p className='text-gray-600'>{d.revenueRecordTypeNumber}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3'>
        <div>
          <label className='text-gray-800'>Sanction Usage</label>
          <p className='text-gray-600'>{d.sanctionUsage}</p>
        </div>
        <div>
          <label className='text-gray-800'>Actual Usage</label>
          <p className='text-gray-600'>{d.actualUsage}</p>
        </div>
        <div>
          <label className='text-gray-800'>Plot Area (Sqft)</label>
          <p className='text-gray-600'>{d.plotArea}</p>
        </div>
        <div>
          <label className='text-gray-800'>Property Jurisdiction</label>
          <p className='text-gray-600'>{d.propertyJurisdiction}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3'>
        <div>
          <label className='text-gray-800'>Sanction Authority Name</label>
          <p className='text-gray-600'>{d.sanctionAuthorityName}</p>
        </div>
        <div>
          <label className='text-gray-800'>Society Registered</label>
          <p className='text-gray-600'>{d.societyRegistered}</p>
        </div>
        <div>
          <label className='text-gray-800'>Unique Property ID</label>
          <p className='text-gray-600'>{d.uniquePropertyId}</p>
        </div>
        <div>
          <label className='text-gray-800'>Property Entrance Facing</label>
          <p className='text-gray-600'>{d.propertyEntranceFacing}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3'>
        <div>
          <label className='text-gray-800'>AFF Flag</label>
          <p className='text-gray-600'>{d.affFlag}</p>
        </div>
        <div>
          <label className='text-gray-800'>Property Transaction Type</label>
          <p className='text-gray-600'>{d.propertyTransactionType}</p>
        </div>
        <div>
          <label className='text-gray-800'>Count Of Properties</label>
          <p className='text-gray-600'>{d.countOfProperties}</p>
        </div>
        <div>
          <label className='text-gray-800'>Door Photo With Name Plate</label>
          <p className='text-gray-600'>{d.doorPhotoWithNamePlate}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
