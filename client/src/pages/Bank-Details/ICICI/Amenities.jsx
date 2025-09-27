import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Amenities = () => {
  const d = useSelector((state) => state.icici.singleData);
  const [formData, setFormData] = useState(d);



  return (
    <div className='mb-4 w-full border border-gray-300 p-6 rounded-lg bg-gray-50'>
      <div className='space-y-6'>
        <h4 className='text-xl font-semibold text-red-700'>
          Surrounding Amenities
        </h4>

        <div>
          <h5 className='text-lg font-semibold mb-2'>
            Public Transport in 1 Km Vicinity
          </h5>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <p>Airport: {formData?.airport ? "Yes" : "No"}</p>
            <p>Rickshaw Stop: {formData?.rickshawStop ? "Yes" : "No"}</p>
            <p>Bus Stop: {formData?.busStop ? "Yes" : "No"}</p>
            <p>Metro Station: {formData?.metroStation ? "Yes" : "No"}</p>
            <p>Railway Station: {formData?.railwayStation ? "Yes" : "No"}</p>
          </div>
        </div>

        <div>
          <h5 className='text-lg font-semibold mb-2'>
            Other Amenities in 1 Km Vicinity
          </h5>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <p>College: {formData?.college ? "Yes" : "No"}</p>
            <p>School: {formData?.school ? "Yes" : "No"}</p>
            <p>Hospital: {formData?.hospital ? "Yes" : "No"}</p>
            <p>Super Market: {formData?.superMarket ? "Yes" : "No"}</p>
            <p>Mall: {formData?.mall ? "Yes" : "No"}</p>
            <p>Place Of Worship: {formData?.placeOfWorship ? "Yes" : "No"}</p>
          </div>
        </div>

        <div>
          <h5 className='text-lg font-semibold mb-2'>Infra Surroundings</h5>
          <p>Infrastructure: {formData?.infra ? "Developed" : "Developing"}</p>
        </div>

        <div>
          <h5 className='text-lg font-semibold mb-2'>Amenities Images</h5>
          <div className='border border-dashed border-gray-300 p-4 text-center rounded-md'>
            {formData?.image ? (
              <img
                src={formData.image}
                alt='Uploaded'
                className='mx-auto max-w-full mt-2 rounded'
              />
            ) : (
              <p className='text-gray-500'>No Image Uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
