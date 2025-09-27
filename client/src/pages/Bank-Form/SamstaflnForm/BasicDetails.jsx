

import React, { useState } from "react";

const BasicDetails = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "BHOPAL",
    valuerName: "Unique Engineering and Associate",
    typeOfCase: "Valuation Report",
    lanNo: "210225257489700",
    dateOfVisit: "2021-03-09",
    dateOfReport: "2021-03-09",
    contactedPerson: "MR. DILIP MEHRA CONT NO 6266737358",
    applicantsName: "BHAVAR LAL MEHRA",
    propertyOwner: "MR. BHAVARLAL S/O DEVILAL JI MEHRA",
    documentHolder: "MR. BHAVARLAL S/O DEVILAL JI MEHRA",
    originalPropertyType: "Residential",
    currentUsage: "Residential",
    addressAsPerRequest: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    addressAtSite: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    addressAsPerDocument: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    pinCode: "462030",
    latitude: "23.330544",
    longitude: "77.31751",
    mainLocality: "Middle Class",
    previousValuation: "No"
  });

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
}
    const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="mb-4 border border-gray-700 rounded">
      <div
        className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="m-0 font-semibold text-lg">BASIC DETAILS</h4>
        <button
          type="button"
          className="bg-white text-gray-800 px-3 py-1 text-sm rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Valuer Name</label>
              <input
                type="text"
                name="valuerName"
                value={formData.valuerName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Type of Case</label>
              <input
                type="text"
                name="typeOfCase"
                value={formData.typeOfCase}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* You can continue the pattern for each row/field below */}
          {/* For brevity, I'll skip to a textarea example */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Address at Site</label>
              <textarea
                name="addressAtSite"
                rows="3"
                value={formData.addressAtSite}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address as per Document</label>
              <textarea
                name="addressAsPerDocument"
                rows="3"
                value={formData.addressAsPerDocument}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* Final fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Main Locality of the Property</label>
            <input
              type="text"
              name="mainLocality"
              value={formData.mainLocality}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>
      )}
       <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
         onClick={handleSubmit} >
            Next
          </button>
    </div>
  );
};

export default BasicDetails;
