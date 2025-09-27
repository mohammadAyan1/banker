import React from "react";
import { useSelector } from "react-redux";

const PropertyValuation = () => {
  const data = useSelector((state) => state.icici.singleData);
  console.log(data, "data in property valuation");

  const formatCurrency = (value) => `₹ ${value?.toLocaleString("en-IN") || 0}`;

  return (
    <div className='mb-8 border border-gray-300 p-6 rounded-lg bg-gray-50'>
      <div className='p-4'>
        <h4 className='text-xl text-red-700 font-semibold mb-2'>
          Valuation Methodology
        </h4>
        <p className='text-gray-600 mb-1'>Valuation Methodology</p>
        <h6 className='text-lg font-medium mb-4'>Sale Comparison</h6>

        {/* Land/Existing Structure Value */}
        <h5 className='text-lg text-red-700 font-semibold mt-4 mb-2'>
          Land/Existing Structure Value
        </h5>
        <table className='table-auto w-full border border-gray-300 mb-6'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-4 py-2'>Description</th>
              <th className='border px-4 py-2'>Area (sq.ft)</th>
              <th className='border px-4 py-2'>Rate Per sq.ft (₹)</th>
              <th className='border px-4 py-2'>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border px-4 py-2'>Plot Area (Sqft)</td>
              <td className='border px-4 py-2'>{data?.plotArea || 0}</td>
              <td className='border px-4 py-2'>1200</td>
              <td className='border px-4 py-2'>
                {formatCurrency((data?.plotArea || 0) * 1200)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Unit Value */}
        <h5 className='text-lg text-red-700 font-semibold mt-6 mb-1'>
          Unit Value **
        </h5>
        <p className='text-gray-600 mb-1'>Valuation on</p>
        <h6 className='text-lg font-medium mb-2'>Saleable Area</h6>

        <table className='table-auto w-full border border-gray-300 mb-6'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-4 py-2'>Description</th>
              <th className='border px-4 py-2'>Carpet Area (sq.ft)</th>
              <th className='border px-4 py-2'>Saleable Area (sq.ft)</th>
              <th className='border px-4 py-2'>Rate Per sq.ft (₹)</th>
              <th className='border px-4 py-2'>Amount (₹)</th>
              <th className='border px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border px-4 py-2 font-semibold'>Ground Floor</td>
              <td colSpan={5} className='border px-4 py-2'></td>
            </tr>
            <tr>
              <td className='border px-4 py-2'>G.F.</td>
              <td className='border px-4 py-2'>937.5</td>
              <td className='border px-4 py-2'>800</td>
              <td className='border px-4 py-2'>1000</td>
              <td className='border px-4 py-2'>{formatCurrency(800 * 1000)}</td>
              <td className='border px-4 py-2'></td>
            </tr>
            <tr>
              <td className='border px-4 py-2 font-semibold'>First Floor</td>
              <td colSpan={5} className='border px-4 py-2'></td>
            </tr>
            <tr>
              <td className='border px-4 py-2'>F.F.</td>
              <td className='border px-4 py-2'>937.5</td>
              <td className='border px-4 py-2'>800</td>
              <td className='border px-4 py-2'>1000</td>
              <td className='border px-4 py-2'>{formatCurrency(800 * 1000)}</td>
              <td className='border px-4 py-2'></td>
            </tr>
            <tr>
              <td className='border px-4 py-2 font-semibold'>Total</td>
              <td className='border px-4 py-2'>0</td>
              <td className='border px-4 py-2'>1600</td>
              <td className='border px-4 py-2'>1000</td>
              <td className='border px-4 py-2'>
                {formatCurrency(1600 * 1000)}
              </td>
              <td className='border px-4 py-2'></td>
            </tr>
          </tbody>
        </table>

        {/* Appraised Value */}
        <div className='bg-gray-100 border border-gray-300 p-3 mb-2'>
          <p className='font-semibold'>
            Total Appraised Value: {formatCurrency(data?.recommendedValue)}
          </p>
        </div>
        <div className='bg-gray-100 border border-gray-300 p-3 mb-6'>
          <p className='font-semibold'>
            Round Off Total: {formatCurrency(data?.recommendedValue)} (Thirty
            Three Lakh Rupees Only)
          </p>
        </div>

        {/* Government Rates Table */}
        <h5 className='text-lg text-red-700 font-semibold mt-6 mb-1'>
          Valuation As Per Government Rates
        </h5>
        <h6 className='text-gray-600 mb-2'>Building Usage</h6>

        <table className='table-auto w-full border border-gray-300 mb-4'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-4 py-2'>Description</th>
              <th className='border px-4 py-2'>Area (sq.ft)</th>
              <th className='border px-4 py-2'>Rate Per sq.ft (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border px-4 py-2'>Land/BU/SBU</td>
              <td className='border px-4 py-2'>0</td>
              <td className='border px-4 py-2'>0</td>
            </tr>
          </tbody>
        </table>

        <div className='bg-gray-100 border border-gray-300 p-3 mb-6'>
          <p className='font-semibold'>
            Total Value (Gross Value): ₹ 0 (Zero Rupees Only)
          </p>
        </div>

        {/* Footer values */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <div className='w-full md:w-1/3'>
            <p>
              <strong>Construction Area (sq.ft):</strong> 0
            </p>
          </div>
          <div className='w-full md:w-1/3'>
            <p>
              <strong>Approved Covg (FAR, sq.ft):</strong> 0
            </p>
          </div>
          <div className='w-full md:w-1/3'>
            <p>
              <strong>Cost of Construction:</strong> 0
            </p>
          </div>
        </div>

        <div className='text-right mt-4'>
          <button className='bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyValuation;
