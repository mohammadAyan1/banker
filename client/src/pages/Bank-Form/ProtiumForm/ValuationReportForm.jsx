import React, { useState } from 'react';

const ValuationForm = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({

     leadId: "A068301-LAP",
    valuerName: "UNIQUE ENGINEERING & ASSOCIATES",
    date: "2023-05-16",
    nameOfApplicant: "AB COLLECTION",
    nameOfPropertyOwner: "COMMERCIAL SHOP NO. 03...",
    propertyAddressSite: "COMMERCIAL SHOP NO. 03...",
    legalAddress: "COMMERCIAL SHOP NO. 03...",
    contactNoOfOwner: "7869416171",
    landmark: "NEAR RAMI LAXSHMI BAI...",
    dateOfTechnicalVisit: "2023-05-16",
    propertyUsage: "COMMERCIAL",
    occupancy: "COMMERCIAL",
    habitation: "COMMERCIAL",
    wardNo: "WARD NO. 26",
    typeOfLocality: "RESIDENTIAL",
    distanceFromCityCentre: "14 KM",
    siteAccess: "CLEAR",
    corporationLimit: "18-20 KM",
    panchayatUnion: "NA",
    conditionsOfApproachRoad: "Good/Bad",
    noOfFloors: "3",
    floorWiseUsage: "B+G+2",
    ageOfTheProperty: "57"
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
    <div className="mb-6 border rounded">
      <div
        className="bg-gray-800 text-white p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold m-0">PROPERTY VALUATION FORM</h4>
        <button
          type="button"
          className="bg-white text-gray-800 text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <form className="p-4 bg-gray-100 rounded mt-2">
          <h5 className="text-lg font-medium mb-4 mt-4">A. GENERAL DETAILS</h5>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Lead ID / LAN NO.:</label>
              <input type="text" name="leadId" defaultValue="A068301-LAP" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Valuer Name:</label>
              <input type="text" name="valuerName" defaultValue="UNIQUE ENGINEERING & ASSOCIATES" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Date:</label>
              <input type="date" name="date" defaultValue="2023-05-16" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Name of Applicant:</label>
            <input type="text" name="nameOfApplicant" defaultValue="AB COLLECTION" onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Name of Property Owner:</label>
            <textarea name="nameOfPropertyOwner" rows="3" defaultValue="COMMERCIAL SHOP NO. 03..." onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Property Address as per site:</label>
              <textarea name="propertyAddressSite" rows="3" defaultValue="COMMERCIAL SHOP NO. 03..." onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Legal address of property:</label>
              <textarea name="legalAddress" rows="3" defaultValue="COMMERCIAL SHOP NO. 03..." onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Contact No. of the Owner:</label>
              <input type="text" name="contactNoOfOwner" defaultValue="7869416171" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Landmark:</label>
            <input type="text" name="landmark" defaultValue="NEAR RAMI LAXSHMI BAI..." onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Date of technical visit:</label>
              <input type="date" name="dateOfTechnicalVisit" defaultValue="2023-05-16" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Property Usage:</label>
              <select name="propertyUsage" defaultValue="COMMERCIAL" onChange={handleChange} className="w-full border p-2 rounded">
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="LAND">LAND</option>
                <option value="VACANT">VACANT</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Occupancy:</label>
              <select name="occupancy" defaultValue="COMMERCIAL" onChange={handleChange} className="w-full border p-2 rounded">
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="VACANT">VACANT</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Habitation:</label>
            <input type="text" name="habitation" defaultValue="COMMERCIAL" onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <h5 className="text-lg font-medium mb-4 mt-6">B. SURROUNDING LOCALITY DETAILS</h5>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Ward No/ Municipal land No:</label>
              <input type="text" name="wardNo" defaultValue="WARD NO. 26" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Type of locality:</label>
              <input type="text" name="typeOfLocality" defaultValue="RESIDENTIAL" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Distance From City Centre:</label>
              <input type="text" name="distanceFromCityCentre" defaultValue="14 KM" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Site Access:</label>
            <input type="text" name="siteAccess" defaultValue="CLEAR" onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Corporation limit:</label>
              <input type="text" name="corporationLimit" defaultValue="18-20 KM" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Panchayat Union:</label>
              <input type="text" name="panchayatUnion" defaultValue="NA" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Conditions of Approach Road:</label>
              <input type="text" name="conditionsOfApproachRoad" defaultValue="Good/Bad" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <h5 className="text-lg font-medium mb-4 mt-6">C. PROPERTY DETAILS (Proposed)</h5>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">No of Floors:</label>
              <input type="text" name="noOfFloors" defaultValue="3" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Floor Wise Usage:</label>
              <input type="text" name="floorWiseUsage" defaultValue="B+G+2" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-medium">Age of the property:</label>
              <input type="text" name="ageOfTheProperty" defaultValue="57" onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
        </form>
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

export default ValuationForm;
