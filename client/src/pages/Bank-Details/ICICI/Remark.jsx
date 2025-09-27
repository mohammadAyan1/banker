import React from "react";
import { useSelector } from "react-redux";

const Remarks = () => {
  const remarksData = useSelector((state) => state.icici.singleData) || {};

  const getValue = (val) => (val && val.trim() !== "" ? val : "N/A");

  return (
    <div className='mb-6 border border-gray-300 p-6 rounded-xl bg-gray-50'>
      <h4 className='text-[#AC2321] text-xl font-semibold mb-4'>Remarks</h4>

      {/* NFSA Check */}
      <div className='mb-4'>
        <h5 className='text-[#AC2321] text-lg font-medium'>
          NFSA Check Required
        </h5>
        <p className='text-sm bg-white border border-gray-300 p-3 rounded-md'>
          {getValue(remarksData.nfsaCheckRequired)}
        </p>
      </div>

      {/* General Observations */}
      <div className='mb-4'>
        <h5 className='text-[#AC2321] text-lg font-medium'>
          General Observations
        </h5>
        <p className='text-sm bg-white border border-gray-300 p-3 rounded-md'>
          {getValue(remarksData.generalObservations)}
        </p>
      </div>

      {/* RALE References */}
      <div className='mb-4'>
        <h5 className='text-[#AC2321] text-lg font-medium'>RALE References</h5>
        <p className='text-sm bg-white border border-gray-300 p-3 rounded-md'>
          {getValue(remarksData.raleReferences)}
        </p>
      </div>

      {/* Document Info */}
      <h5 className='text-[#AC2321] text-lg font-medium mb-2'>
        Document Details
      </h5>
      <div className='overflow-x-auto mb-4'>
        <table className='min-w-full table-auto border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left text-sm'>Document Name</th>
              <th className='px-4 py-2 text-left text-sm'>Reference</th>
              <th className='px-4 py-2 text-left text-sm'>Date</th>
              <th className='px-4 py-2 text-left text-sm'>Authority</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t border-gray-200'>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.documentName)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.documentReference)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.documentDate)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.documentAuthority)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Person Met at Site */}
      <h5 className='text-[#AC2321] text-lg font-medium mb-2'>
        Person Met at Site
      </h5>
      <div className='overflow-x-auto mb-4'>
        <table className='min-w-full table-auto border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left text-sm'>Name</th>
              <th className='px-4 py-2 text-left text-sm'>Contact</th>
              <th className='px-4 py-2 text-left text-sm'>Evaluation Mode</th>
              <th className='px-4 py-2 text-left text-sm'>Site Visits</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t border-gray-200'>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.personName)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.personContact)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.evaluationMode)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {remarksData.siteVisits || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verification Info */}
      <h5 className='text-[#AC2321] text-lg font-medium mb-2'>
        Verification Info
      </h5>
      <div className='overflow-x-auto'>
        <table className='min-w-full table-auto border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left text-sm'>Verified By</th>
              <th className='px-4 py-2 text-left text-sm'>Visit Date</th>
              <th className='px-4 py-2 text-left text-sm'>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t border-gray-200'>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.verifiedBy)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.visitDate)}
              </td>
              <td className='px-4 py-2 text-sm'>
                {getValue(remarksData.rejectionReason)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Preview Button */}
      <button className='bg-[#AC2321] text-white px-4 py-2 mt-6 rounded-md'>
        Preview Report
      </button>
    </div>
  );
};

export default Remarks;
