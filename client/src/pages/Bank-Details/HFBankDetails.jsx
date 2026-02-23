// import { useParams } from "react-router-dom";
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import FileDownload from "../../components/FileDownload";
// import moment from "moment";
// import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
// import { ReactSortable } from "react-sortablejs";

// const HFBankDetails = () => {

//   const CPANEL = import.meta.env.VITE_API_URL


//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const reportRef = useRef();
//   const { singleBank } = useSelector((state) => state.hfBanks);
//   const reportData = singleBank;

//   console.log(reportData, " home first bank data ");

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchHFBankById(id));
//     }
//   }, [id, dispatch]);


//   useEffect(() => {
//     console.log(singleBank)
//   }, [singleBank])

//   // const defaultObservations = [
//   //   " GIVEN XEROX COPY CO-OWNERSHIP DEED IN FAVOUR OF MR.JEEVAN LAL S/O MR.GHISILAL AND SMT.MAMTA W/O MR.JEEVAN LAL",
//   //   " DURING PROPERTY VISIT MR.PHOOL SINGH JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT NO. 9200182821. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.",
//   //   " RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.",
//   //   " PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESIDENTIAL CUM AGRICULTURE ZONING SURROUNDING AREA DEVELOPMENT IS 40%.",
//   //   " AT SITE PROPERTY IS OPEN AND GF UNDER CONSTRUCTION PREMISES WHERE PLINTH WORK DONE.",
//   //   " CONST COST CONSIDER AFTER COMPLETION OF WORK.",
//   //   " PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN CO-OWNERSHIP DEED AND PRIVATE KEY LOCATION PLAN WHICH IS DRAWN BY ARCHITECT.",
//   //   " AT SITE AREA OF UNDER CONSTRUCTION IS 15 X 30 = 450 SQFT AND OPEN AREA IS 15 X 30 = 450 SQFT.",
//   //   " AS PER CO-OWNERSHIP DEED AND AS PER SITE LAND AREA IS 30 X 30 = 900 SQFT.",
//   //   " OBTAIN COPY OF ARCHITECT MAP GF - 500 SQFT.",
//   //   " AS PER DEED LAND USES IS RESIDENTIAL.",
//   //   " VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.",
//   //   " SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.",
//   // ];
//   const userRemarks = Array.isArray(reportData?.valuationRemarks)
//     ? reportData.valuationRemarks
//     : reportData?.valuationRemarks
//       ? [reportData.valuationRemarks]
//       : [];

//   // Merge and remove duplicates (optional)
//   const observations = [...new Set([...userRemarks])];

//   const [sortedImages, setSortedImages] = useState([]);

//   useEffect(() => {
//     if (reportData?.imageUrls?.length > 0) {
//       const updated = reportData.imageUrls.map((url, index) => ({
//         id: index + 1,
//         url,
//       }));
//       setSortedImages(updated);
//     }
//   }, [reportData?.imageUrls]);

//   return (
//     <div className="container mx-auto p-4">
//       <FileDownload data={reportData} tableId="reportTable" />

//       <div id="report" ref={reportRef} className="valuation-report">
//         <div
//           ref={reportRef}
//           className="p-3 bg-white shadow border"
//           id="reportTable"
//         >
//           <div
//             id="print-section"
//             ref={reportRef}
//             className="bg-white shadow-md mt-1 rounded-lg overflow-hidden flex"
//           >
//             {/* Right side tables */}
//             <div className="flex-1 overflow-x-auto">
//               {/* ====== TABLE 1 ====== */}

//               <table className="w-full border-collapse border">
//                 <thead>
//                   <tr className="bg-blue-50">
//                     <th colSpan="6" className="py-3 text-center">
//                       <img src="/assets/images/header1.jpg" alt="" />
//                       <h1 className="  text-center text-xl items-center">
//                         VALUATION REPORT <br />
//                         FOR <br /> HOME FIRST FINANCE COMPANY (HFFC)
//                       </h1>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       className="border  text-center font-normal "
//                       rowSpan="8"
//                     >
//                       1
//                     </th>
//                     <td
//                       className="text-red-500   bg-[#FDE9D9] text-start border border-black font-bold  px-4 "
//                       colSpan="5"
//                     >
//                       L & T ASSIGNMENT DETAILS
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Customer Name</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.customerName || ""}
//                     </td>
//                     <td className="border px-4 ">Date of Report</td>
//                     <td className="font-bold border px-4 whitespace-nowrap">
//                       {reportData?.dateOfReport
//                         ? moment(reportData.dateOfReport).format(
//                           "MM / DD / YYYY"
//                         )
//                         : ""}
//                     </td>
//                   </tr>
//                   {/* baaki rows same */}
//                   <tr>
//                     <td className="border px-4 ">Property Name</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.propertyName || ""}
//                     </td>
//                     <td className="border px-4 ">Ref No.</td>
//                     <td className="border px-4 ">{reportData?.refNo || ""}</td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Customer No.</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.customerNo || ""}
//                     </td>
//                     <td className="border px-4 whitespace-nowrap ">
//                       Evaluation Type
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.evaluationType || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Person Met during visit</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.personMetDuringVisit || ""}
//                     </td>
//                     <td className="border px-4 ">Unit Type</td>
//                     <td className="border px-4 ">
//                       {reportData?.unitType || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Person Contact No.</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.personContactNo || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Type of Loan</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.typeOfLoan || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Documents Available for perusal
//                     </td>
//                     <td colSpan="4" className="border px-4  text-center">
//                       <b>{reportData?.documentsAvailable || ""}</b>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ====== TABLE 2: GENERAL DETAILS ====== */}

//                 <thead>
//                   <tr>
//                     <th
//                       style={{ backgroundColor: "#EFF6FF", border: "none" }}
//                     ></th>
//                     <th
//                       style={{ backgroundColor: "" }}
//                       colSpan="5"
//                       className="text-red-500  bg-[#FDE9D9] text-start border border-black font-bold  px-4 "
//                     >
//                       GENERAL DETAILS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       className=" border-b text-center "
//                       rowSpan="11"
//                     >
//                       2
//                     </td>
//                     <td className="border px-4 ">
//                       Address as per Legal Document
//                     </td>
//                     <td colSpan="4" className="border px-4  font-bold">
//                       {reportData?.addressLegal || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Address As per Site</td>
//                     <td colSpan="4" className="border px-4  font-bold">
//                       {reportData?.addressSite || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Nearby landmark (within 500m)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.nearbyLandmark || ""}
//                     </td>
//                     <td className="border px-4 ">Project Pin Code</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.projectPinCode || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Zone</td>
//                     <td className="border px-4 ">{reportData?.zone || ""}</td>
//                     <td className="border px-4 ">Project State</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.projectState || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Name on society board:</td>
//                     <td className="border px-4 ">
//                       {reportData?.nameOnSocietyBoard || ""}
//                     </td>
//                     <td className="border px-4 ">
//                       Name on door of the premises
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.nameOnDoor || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Latitude</td>
//                     <td className="border px-4  font-bold">
//                       {reportData?.latitude || ""}
//                     </td>
//                     <td className="border px-4 ">Longitude</td>
//                     <td colSpan="2" className="border px-4  font-bold">
//                       {reportData?.longitude || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Population as per Census 2011
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.populationCensus2011 || ""}
//                     </td>
//                     <td className="border px-4 ">Rural/ Urban</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.ruralUrban || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Status of Occupancy</td>
//                     <td className="border px-4 ">
//                       {reportData?.statusOfOccupancy || ""}
//                     </td>
//                     <td className="border px-4 ">Occupied by</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.occupiedBy || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Usage of the property</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.usageOfProperty || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">RERA (If applicable)</td>
//                     <td className="border px-4 ">
//                       {reportData?.eraApplicable || ""}
//                     </td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.numberAndDate || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Ownership Type</td>
//                     <td className="border px-4 ">
//                       {reportData?.ownershipType || ""}
//                     </td>
//                     <td className="border px-4 ">Lease Details (If any)</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.leaseDetails || ""}
//                     </td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     {/* <td className="border"  rowSpan="6">3</td> */}
//                     <th
//                       style={{ backgroundColor: "#EFF6FF", border: "none" }}
//                     ></th>
//                     <th
//                       colSpan="5"
//                       className="text-red-500  bg-[#FDE9D9] text-start border border-black font-bold  px-4 "
//                     >
//                       DOCUMENT DETAILS
//                     </th>
//                   </tr>
//                   <tr>
//                     <th style={{ backgroundColor: "#F0F8FF" }}></th>
//                     <th className="border px-4  font-bold">TYPE</th>
//                     <th className="border px-4  font-bold">
//                       Approving Authority / Applicability
//                     </th>
//                     <th className="border px-4  font-bold">
//                       Date of approval and Number
//                     </th>
//                     <th colSpan="2" className="border px-4  font-bold">
//                       Details of the approval.
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       className="border-b text-center"
//                       rowSpan="7 "
//                     >
//                       3
//                     </td>
//                     {/* <td className="border"  rowSpan="6">3</td> */}
//                     <td className="border px-4 ">NA Converted</td>
//                     <td className="border px-4 ">{reportData?.naConverted}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.numberAndDate}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Approved Sanction Plan</td>
//                     <td className="border px-4 ">{reportData?.sanctionPlan}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.sanctionDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Approved Layout Plan</td>
//                     <td className="border px-4 ">{reportData?.layoutPlan}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.layoutDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Commencement Certificate (If any)
//                     </td>
//                     <td className="border px-4 ">{reportData?.commencement}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.commencementDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Occupancy/ Completion/ Building usage certificate
//                     </td>
//                     <td className="border px-4 ">{reportData?.occupancy}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.occupancyDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Approved Sub Plotting Plan</td>
//                     <td className="border px-4 ">{reportData?.subPlotting}</td>
//                     <td className="border px-4 ">Number & Date</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.subPlottingDetails}
//                     </td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       LOCALITY DETAILS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       className="border-b text-center"
//                       rowSpan="7"
//                     >
//                       4
//                     </td>

//                     <td className="border px-4 ">Locality Development</td>
//                     <td className="border px-4 ">
//                       {reportData?.localityDevelopment}
//                     </td>
//                     <td className="border px-4 ">
//                       Occupancy of Project/Area (%)
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.occupancyPercentage}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Type of Approach Road</td>
//                     <td className="border px-4 ">
//                       {reportData?.approachRoadType}
//                     </td>
//                     <td className="border px-4 ">
//                       Habitation in surrounding Area (%)
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.habitationPercentage}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Approach Road Width (In Feet)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.approachRoadWidth}
//                     </td>
//                     <td className="border px-4 ">Proposed Road Widening</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.proposedRoadWidening}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Distance from city centre (in KM)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.distanceFromCityCentre}
//                     </td>
//                     <td className="border px-4 ">
//                       Name of City Centre Considered
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.cityCentreName}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Distance from Railway Station (in KM)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.distanceFromRailwayStation}
//                     </td>
//                     <td className="border px-4 ">Drainage Line connection</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.drainageLine}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Distance from Bus Stand (in KM)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.distanceFromBusStand}
//                     </td>
//                     <td className="border px-4 ">
//                       Water & Electricity Supply Connection
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.waterElectricitySupply}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Distance from Hospital (in KM)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.distanceFromHospital}
//                     </td>
//                     <td className="border px-4 ">
//                       Nallah, River, High tension line if any
//                     </td>
//                     <td colSpan="2" className="border px-4  font-bold">
//                       {reportData?.nallahRiverHighTension}
//                     </td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500  bg-[#FDE9D9] text-start border-black font-bold border px-4 "
//                     >
//                       NDMA GUIDELINE
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       className="border-b text-center "
//                       rowSpan="4"
//                     >
//                       5
//                     </td>

//                     <td className="border px-4 ">
//                       Property Falls under Sesimic Zone
//                     </td>
//                     <td className="border px-4 ">{reportData?.seismicZone}</td>
//                     <td className="border px-4 ">
//                       Property Falls under Flood Zone
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.floodZone}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Property Falls under Cyclone Zone
//                     </td>
//                     <td className="border px-4 ">{reportData?.cycloneZone}</td>
//                     <td className="border px-4 ">Property Falls in CR Zone</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.crZone}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Property Falls under Landslide Prone Zone
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.landslideZone}
//                     </td>
//                     <td className="border px-4 ">Follows NMDA Guidelines</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.followsreportData}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Degree of Risk Associated</td>
//                     <td className="border px-4 ">{reportData?.riskDegree}</td>
//                     <td className="border px-4 ">
//                       Any Demolition Risk with Details
//                     </td>
//                     <td colSpan="2" className="border px-4  font-bold">
//                       {reportData?.demolitionRisk}
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ====== TABLE 6: PROPERTY DETAILS ====== */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold  border border-black px-4 "
//                     >
//                       PROPERTY DETAILS
//                     </th>
//                   </tr>
//                   <tr>
//                     <th
//                       style={{
//                         borderBottom: "none",
//                         backgroundColor: "#F0F8FF",
//                       }}
//                       className="border-b"
//                     ></th>
//                     <th className="border row-span-5 px-4 ">
//                       Boundaries on Site
//                     </th>

//                     <th className="border px-4  font-bold">Directions</th>
//                     <th className="border px-4  font-bold">
//                       As per Document/ATS
//                     </th>
//                     <th className="border px-4  font-bold">Actual at site</th>
//                     <th className="border px-4  font-bold">As per plan</th>
//                   </tr>
//                 </thead>
//                 <tbody style={{ borderTop: "none" }} className="border">
//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "none",
//                         outline: "none",
//                         backgroundColor: "#F0F8FF",
//                       }}
//                       className=""
//                     ></td>
//                     <td className=" col-span-3 border px-4 "></td>
//                     <td className="border px-4 ">North</td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.North?.document}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.North?.actual}
//                     </td>
//                     <td className="border white-nowwrap px-4 ">
//                       {reportData?.directions?.North?.plan}
//                     </td>
//                   </tr>
//                   {/* <tr></tr> */}

//                   <tr>
//                     <td
//                       style={{
//                         borderTop: "none",
//                         backgroundColor: "#F0F8FF",
//                       }}
//                       className="border text-center "
//                       rowSpan="9"
//                     >
//                       6
//                     </td>

//                     <td className=" col-span-3 border px-4 "></td>

//                     <td className="border px-4 ">South</td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.South?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.South?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.South?.actual}
//                     </td>
//                   </tr>
//                   <tr></tr>
//                   <tr>
//                     <td className=" col-span-3 border px-4 "></td>

//                     <td className="border px-4 ">East</td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.East?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.East?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.East?.actual}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className=" col-span-3 border px-4 "></td>

//                     <td className="border px-4 ">West</td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.West?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.West?.actual}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.directions?.West?.actual}
//                     </td>
//                   </tr>
//                   <tr></tr>

//                   <tr>
//                     <td className="border px-4 ">Boundaries Matching</td>
//                     <td className="border px-4 ">
//                       {reportData?.boundariesMatching || "Boundaries Matching"}
//                     </td>

//                     <td className="border px-4 ">If No - Detail Remak</td>
//                     {/* <td className='border px-4 '></td> */}

//                     <td className="border px-4 ">NA</td>
//                     <td className="border px-4 ">Dimension:</td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Plot Area (Sq. ft)</td>

//                     <td className="border px-4 ">
//                       {reportData?.plotArea || ""}
//                     </td>
//                     {/* <td className='border px-4 '></td> */}
//                     <td className="border px-4 ">Property is Demarcated</td>

//                     <td className="border px-4 ">
//                       {reportData?.isPropertyDemarcated || "Yes"}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.dimension || "30 * 30"}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border px-4 ">
//                       Is the property within which limit
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.isPropertyWithinLimit || ""}
//                     </td>
//                     <td className="border px-4 ">
//                       Property Easily Identifiable
//                     </td>
//                     {/* <td className='border px-4 '>

//                     </td> */}
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.propertyIdentifiable || "If no, Remarks:"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Marketability</td>
//                     <td className="border px-4 ">
//                       {reportData?.marketability || "Good/ Average/ Poor"}
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.marketability ? "Yes" : ""}
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       NA
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* table 7 */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold  border-black border px-4 "
//                     >
//                       STRUCTURAL DETAILS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF " }}
//                       className="border-b text-center"
//                       rowSpan="8"
//                     >
//                       7
//                     </td>

//                     <td className="border px-4 ">Type of Structure</td>
//                     <td className="border px-4 ">
//                       {reportData?.typeOfStructure || ""}
//                     </td>
//                     <td className="border px-4 ">Quality of Construction</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.qualityOfConstruction}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Unit / Flat Configuration</td>
//                     <td className="border px-4 ">
//                       {reportData?.unitFlatConfiguration || ""}
//                     </td>
//                     <td className="border px-4 ">
//                       If quality of construction is poor
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.ifQualityPoor}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">No. Of Floors Permissible</td>
//                     <td className="border px-4 ">
//                       {reportData?.noOfFloorsPermissible || ""}
//                     </td>
//                     <td className="border px-4 ">No. Of Floors Actual</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.noOfFloorsActual}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       No. of Unit / Flat on each Floor
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.noOfUnitFlatOnEachFloor || ""}
//                     </td>
//                     <td className="border px-4 ">
//                       Internal composition of the property
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.internalComposition}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Approx. Age of Property (Years)
//                     </td>
//                     <td className="border px-4 ">
//                       {reportData?.approxAgeOfProperty || "0"}
//                     </td>
//                     <td className="border px-4 ">
//                       Whether construction is as per plan / permission /
//                       building by laws
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.constructionAsPerPlan}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Residual Age (Years)</td>
//                     <td className="border px-4 ">
//                       {reportData?.residualAge || "50"}
//                     </td>
//                     <td className="border px-4 ">
//                       Current Construction Status (in % only)
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.constructionStatus}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Whether Lift Available</td>
//                     <td className="border px-4 ">
//                       {reportData?.liftAvailable || "No"}
//                     </td>
//                     <td className="border px-4 ">
//                       Height of the building (Approx in Meters)
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.buildingHeight}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Construction stage</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.constructionStage || "Plinth"}
//                     </td>
//                   </tr>
//                 </tbody>
//                 {/* TABLE 8 */}

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="8"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       VIOLATION OBSERVED, IF ANY
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td
//                       style={{ backgroundColor: "#F0F8FF" }}
//                       rowSpan="3"
//                       className="border-b text-center"
//                     >
//                       8
//                     </td>
//                     {/* <td className="border"  rowSpan="3">81/td>  */}
//                     <td className="border  px-4 ">Deviation to Plan</td>
//                     <td className="border px-4 ">
//                       {reportData?.deviationToPlan}
//                     </td>
//                     <td className="border px-4 ">If yes</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.deviationDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Demolition Risk</td>
//                     <td className="border px-4 ">
//                       {reportData?.demolitionRisk}
//                     </td>
//                     <td className="border px-4 ">If yes</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.demolitionDetails}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Encroachment of Land</td>
//                     <td className="border px-4 ">{reportData?.encroachment}</td>
//                     <td className="border px-4 ">If yes</td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.encroachmentDetails}
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* TABLE 9  */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"></th>
//                     <th
//                       colSpan="9"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       VALUATION
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <td
//                     style={{ backgroundColor: "#F0F8FF" }}
//                     rowSpan="19" // updated from 16 to 19 (3 rows added)
//                     className="border-b text-center"
//                   >
//                     9
//                   </td>

//                   {/* Land area section */}
//                   <tr>
//                     <td rowSpan="3" className="border px-4 ">
//                       Land area (Sq. ft)
//                     </td>
//                     <td className="border px-4 ">Document</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.document || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Plan</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.landAreaPlan || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Site</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.landAreaSite || ""}
//                     </td>
//                   </tr>

//                   {/* Built Up Area (Proposed) */}
//                   <tr>
//                     <td rowSpan="3" className="border px-4 ">
//                       Built Up Area (Proposed)
//                     </td>
//                     <td className="border px-4 ">GF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.landAreaGF || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">FF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.builtUpAreaFF || "0"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">SF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.builtUpAreaSF || "0"}
//                     </td>
//                   </tr>

//                   {/* Built Up Area (Existing) */}
//                   <tr>
//                     <td rowSpan="3" className="border px-4 ">
//                       Built Up Area (Existing)
//                     </td>
//                     <td className="border px-4 ">GF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.existingBuiltUpGF || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">FF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.existingBuiltUpFF || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">SF</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.existingBuiltUpSF || ""}
//                     </td>
//                   </tr>

//                   {/* Remaining rows as is */}
//                   <tr>
//                     <td className="border px-4 ">
//                       Land Area considered for Valuation
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       Deed / ATS
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.deedArea || reportData?.siteArea || reportData?.planArea || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Land Rate considered per sq. Ft.
//                     </td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.landRate || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Total Land Valuation</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.totalLandValuation || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Construction Area considered for Valuation
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       Plan
//                     </td>
//                     <td colSpan="2" className="border px-4 ">
//                       {reportData?.landAreaGF || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Construction Rate considered per sq. Ft
//                     </td>
//                     <td className="border px-4 ">BUA</td>
//                     <td colSpan="3" className="border px-4 ">
//                       {reportData?.constructionRate || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Total Construction Valuation</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.totalConstructionValuation || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Fair Market Value / Total Value of the unit after completion
//                     </td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.fairMarketValue || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">Valuation at Present Stage</td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.presentStageValuation || ""}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border px-4 ">
//                       Valuation as per Govt. Guideline
//                     </td>
//                     <td colSpan="4" className="border px-4 ">
//                       {reportData?.govtGuidelineValuation || ""}
//                     </td>
//                   </tr>
//                 </tbody>


//                 {/* TABLE 10 */}

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]"> </th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500  bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       OBSERVATION AND REMARKS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <td
//                     style={{ backgroundColor: "#F0F8FF" }}
//                     rowSpan="50"
//                     className="border-b p-1"
//                   >
//                     10
//                   </td>
//                   {observations.map((obs, index) => (
//                     <tr key={index}>
//                       <td colSpan="5" className="border pl-4">
//                         <span
//                           dangerouslySetInnerHTML={{
//                             __html: `${index + 1}.   ${obs}`,
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 {/* //! tbody k andr likhna hai */}
//                 <tr>
//                   <td className="bg-[#F0F8FF] "></td>
//                   <td
//                     className="border border-black font-bold px-4 bg-[#FDE9D9] text-start text-red-500"
//                     colSpan="5"
//                   >
//                     SITE PHOTOGRAPHS
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border-b bg-[#F0F8FF] p-1">11 </td>

//                   <td
//                     className=" border border-black px-4 mt font-semibold"
//                     colSpan="8"
//                   >
//                     {/* <p id="drag" className="text-sm text-gray-600 mb-2">
//                       You can{" "}
//                       <span className="font-medium text-blue-600">
//                         drag and drop
//                       </span>{" "}
//                       the images below to reorder them.
//                     </p> */}
//                     {/* <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2   '>
//                       {reportData?.imageUrls?.length > 0 ? (
//                         reportData.imageUrls.map((imageUrl, index) => (
//                           <div key={index} className='  overflow-hidden '>
//                             <img
//                               src={imageUrl}
//                               alt={`Property Image ${index + 1}`}
//                               className='w-full h-100 object-cover object-bottom p-1 '
//                             />
//                           </div>
//                         ))
//                       ) : (
//                         <p>No images available.</p>
//                       )}
//                     </div> */}

//                     {/* //    <div className='w-full'> */}
//                     {sortedImages.length === 0 ? (
//                       <p className="text-gray-500">Loading images...</p>
//                     ) : (
//                       <ReactSortable
//                         list={sortedImages}
//                         setList={setSortedImages}
//                         className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-2"
//                         animation={200}
//                       >
//                         {sortedImages.map((item, index) => {
//                           console.log(item)
//                           {/* 
//                           const imageUrl = item?.url?.replace("undefined", "");
//                           console.log(imageUrl); */}

//                           return (
//                             <div
//                               key={item.id}
//                               className="overflow-hidden border p-1"
//                             >
//                               <img
//                                 src={`${item?.url?.url}`}
//                                 alt={`Image ${index + 1}`}
//                                 className="w-full h-80 object-cover object-bottom"
//                               />
//                             </div>
//                           )
//                         })}
//                       </ReactSortable>
//                     )}

//                     {/* //   </div> */}

//                     {/* Optional: Save Order Button */}
//                     {/* <button
//                       onClick={() =>
//                         onSaveNewOrder?.(sortedImages.map((item) => item.url))
//                       }
//                       className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'
//                     >
//                       Save New Order
//                     </button> */}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="bg-[#F0F8FF]"></td>
//                   <td
//                     className="border text-start border-black font-bold px-4 bg-[#FDE9D9] text-red-500"
//                     colSpan="5"
//                   >
//                     LOCATION
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="bg-[#F0F8FF] p-1">12</td>
//                   <td className="border border-black px-4 font-semibold">
//                     Geo-Coordinates
//                   </td>
//                   <td className="border px-4 text-center" colSpan="1">
//                     <b>Latitude</b>
//                     <br />
//                   </td>
//                   <td colSpan=""> {reportData?.latitude || ""}</td>
//                   <td className="border px-4 text-center" colSpan="1">
//                     <b>Longitude</b>
//                   </td>
//                   <td> {reportData?.longitude || ""}</td>
//                 </tr>

//                 <tr>
//                   <td className="bg-[#F0F8FF]"></td>
//                   <td colSpan="6" className="border border-black">
//                     {reportData?.latitude && reportData?.longitude ? (
//                       <iframe
//                         width="100%"
//                         height="300"
//                         loading="lazy"
//                         allowFullScreen
//                         src={`https://www.google.com/maps?q=${reportData.latitude},${reportData.longitude}&hl=es;z=14&output=embed`}
//                         title="location-map"
//                       ></iframe>
//                     ) : (
//                       <p className="text-center text-gray-500 p-4">
//                         Coordinates not available
//                       </p>
//                     )}
//                   </td>
//                 </tr>
//               </table>
//               <div className="print-footer opacity-0">
//                 Unique Engineering and Associate
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HFBankDetails;




import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileDownload from "../../components/FileDownload";
import moment from "moment";
import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
import { ReactSortable } from "react-sortablejs";

const HFBankDetails = () => {
  const CPANEL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const dispatch = useDispatch();
  const reportRef = useRef();
  const { singleBank } = useSelector((state) => state.hfBanks);
  const reportData = singleBank;

  console.log(reportData, " home first bank data ");

  useEffect(() => {
    if (id) {
      dispatch(fetchHFBankById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    console.log(singleBank);
  }, [singleBank]);

  const userRemarks = Array.isArray(reportData?.valuationRemarks)
    ? reportData.valuationRemarks
    : reportData?.valuationRemarks
      ? [reportData.valuationRemarks]
      : [];

  const observations = [...new Set([...userRemarks])];

  const [sortedImages, setSortedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // for modal

  useEffect(() => {
    if (reportData?.imageUrls?.length > 0) {
      const updated = reportData.imageUrls.map((url, index) => ({
        id: index + 1,
        url,
      }));
      setSortedImages(updated);
    }
  }, [reportData?.imageUrls]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto p-4">
      <FileDownload data={reportData} tableId="reportTable" />

      <div id="report" ref={reportRef} className="valuation-report">
        <div
          ref={reportRef}
          className="p-3 bg-white shadow border"
          id="reportTable"
        >
          <div
            id="print-section"
            ref={reportRef}
            className="bg-white shadow-md mt-1 rounded-lg overflow-hidden flex"
          >
            {/* Right side tables */}
            <div className="flex-1 overflow-x-auto">
              {/* ====== TABLE 1 ====== */}

              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-blue-50">
                    <th colSpan="6" className="py-3 text-center">
                      <img src="/assets/images/header1.jpg" alt="" />
                      <h1 className="text-center text-xl items-center">
                        VALUATION REPORT <br />
                        FOR <br /> HOME FIRST FINANCE COMPANY (HFFC)
                      </h1>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      style={{ backgroundColor: "#F0F8FF" }}
                      className="border text-center font-normal "
                      rowSpan="8"
                    >
                      1
                    </th>
                    <td
                      className="text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-4 "
                      colSpan="5"
                    >
                      L & T ASSIGNMENT DETAILS
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Customer Name</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.customerName || ""}
                    </td>
                    <td className="border px-4 ">Date of Report</td>
                    <td className="font-bold border px-4 whitespace-nowrap">
                      {reportData?.dateOfReport
                        ? moment(reportData.dateOfReport).format(
                          "MM / DD / YYYY"
                        )
                        : ""}
                    </td>
                  </tr>
                  {/* baaki rows same */}
                  <tr>
                    <td className="border px-4 ">Property Name</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.propertyName || ""}
                    </td>
                    <td className="border px-4 ">Ref No.</td>
                    <td className="border px-4 ">{reportData?.refNo || ""}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Customer No.</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.customerNo || ""}
                    </td>
                    <td className="border px-4 whitespace-nowrap ">
                      Evaluation Type
                    </td>
                    <td className="border px-4 ">
                      {reportData?.evaluationType || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Person Met during visit</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.personMetDuringVisit || ""}
                    </td>
                    <td className="border px-4 ">Unit Type</td>
                    <td className="border px-4 ">
                      {reportData?.unitType || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Person Contact No.</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.personContactNo || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Type of Loan</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.typeOfLoan || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Documents Available for perusal
                    </td>
                    <td colSpan="4" className="border px-4 text-center">
                      <b>{reportData?.documentsAvailable || ""}</b>
                    </td>
                  </tr>
                </tbody>

                {/* ====== TABLE 2: GENERAL DETAILS ====== */}

                <thead>
                  <tr>
                    <th
                      style={{ backgroundColor: "#EFF6FF", border: "none" }}
                    ></th>
                    <th
                      style={{ backgroundColor: "" }}
                      colSpan="5"
                      className="text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-4 "
                    >
                      GENERAL DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF" }}
                      className="border-b text-center "
                      rowSpan="11"
                    >
                      2
                    </td>
                    <td className="border px-4 ">
                      Address as per Legal Document
                    </td>
                    <td colSpan="4" className="border px-4 font-bold">
                      {reportData?.addressLegal || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Address As per Site</td>
                    <td colSpan="4" className="border px-4 font-bold">
                      {reportData?.addressSite || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Nearby landmark (within 500m)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.nearbyLandmark || ""}
                    </td>
                    <td className="border px-4 ">Project Pin Code</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.projectPinCode || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Zone</td>
                    <td className="border px-4 ">{reportData?.zone || ""}</td>
                    <td className="border px-4 ">Project State</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.projectState || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Name on society board:</td>
                    <td className="border px-4 ">
                      {reportData?.nameOnSocietyBoard || ""}
                    </td>
                    <td className="border px-4 ">
                      Name on door of the premises
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.nameOnDoor || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Latitude</td>
                    <td className="border px-4 font-bold">
                      {reportData?.latitude || ""}
                    </td>
                    <td className="border px-4 ">Longitude</td>
                    <td colSpan="2" className="border px-4 font-bold">
                      {reportData?.longitude || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Population as per Census 2011
                    </td>
                    <td className="border px-4 ">
                      {reportData?.populationCensus2011 || ""}
                    </td>
                    <td className="border px-4 ">Rural/ Urban</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.ruralUrban || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Status of Occupancy</td>
                    <td className="border px-4 ">
                      {reportData?.statusOfOccupancy || ""}
                    </td>
                    <td className="border px-4 ">Occupied by</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.occupiedBy || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Usage of the property</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.usageOfProperty || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">RERA (If applicable)</td>
                    <td className="border px-4 ">
                      {reportData?.eraApplicable || ""}
                    </td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.numberAndDate || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Ownership Type</td>
                    <td className="border px-4 ">
                      {reportData?.ownershipType || ""}
                    </td>
                    <td className="border px-4 ">Lease Details (If any)</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.leaseDetails || ""}
                    </td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    {/* <td className="border"  rowSpan="6">3</td> */}
                    <th
                      style={{ backgroundColor: "#EFF6FF", border: "none" }}
                    ></th>
                    <th
                      colSpan="5"
                      className="text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-4 "
                    >
                      DOCUMENT DETAILS
                    </th>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: "#F0F8FF" }}></th>
                    <th className="border px-4 font-bold">TYPE</th>
                    <th className="border px-4 font-bold">
                      Approving Authority / Applicability
                    </th>
                    <th className="border px-4 font-bold">
                      Date of approval and Number
                    </th>
                    <th colSpan="2" className="border px-4 font-bold">
                      Details of the approval.
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF" }}
                      className="border-b text-center"
                      rowSpan="7 "
                    >
                      3
                    </td>
                    {/* <td className="border"  rowSpan="6">3</td> */}
                    <td className="border px-4 ">NA Converted</td>
                    <td className="border px-4 ">{reportData?.naConverted}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.numberAndDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Approved Sanction Plan</td>
                    <td className="border px-4 ">{reportData?.sanctionPlan}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.sanctionDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Approved Layout Plan</td>
                    <td className="border px-4 ">{reportData?.layoutPlan}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.layoutDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Commencement Certificate (If any)
                    </td>
                    <td className="border px-4 ">{reportData?.commencement}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.commencementDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Occupancy/ Completion/ Building usage certificate
                    </td>
                    <td className="border px-4 ">{reportData?.occupancy}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.occupancyDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Approved Sub Plotting Plan</td>
                    <td className="border px-4 ">{reportData?.subPlotting}</td>
                    <td className="border px-4 ">Number & Date</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.subPlottingDetails}
                    </td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="6"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
                    >
                      LOCALITY DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF" }}
                      className="border-b text-center"
                      rowSpan="7"
                    >
                      4
                    </td>

                    <td className="border px-4 ">Locality Development</td>
                    <td className="border px-4 ">
                      {reportData?.localityDevelopment}
                    </td>
                    <td className="border px-4 ">
                      Occupancy of Project/Area (%)
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.occupancyPercentage}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Type of Approach Road</td>
                    <td className="border px-4 ">
                      {reportData?.approachRoadType}
                    </td>
                    <td className="border px-4 ">
                      Habitation in surrounding Area (%)
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.habitationPercentage}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Approach Road Width (In Feet)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.approachRoadWidth}
                    </td>
                    <td className="border px-4 ">Proposed Road Widening</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.proposedRoadWidening}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Distance from city centre (in KM)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.distanceFromCityCentre}
                    </td>
                    <td className="border px-4 ">
                      Name of City Centre Considered
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.cityCentreName}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Distance from Railway Station (in KM)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.distanceFromRailwayStation}
                    </td>
                    <td className="border px-4 ">Drainage Line connection</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.drainageLine}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Distance from Bus Stand (in KM)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.distanceFromBusStand}
                    </td>
                    <td className="border px-4 ">
                      Water & Electricity Supply Connection
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.waterElectricitySupply}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Distance from Hospital (in KM)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.distanceFromHospital}
                    </td>
                    <td className="border px-4 ">
                      Nallah, River, High tension line if any
                    </td>
                    <td colSpan="2" className="border px-4 font-bold">
                      {reportData?.nallahRiverHighTension}
                    </td>
                  </tr>
                </tbody>

                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="6"
                      className="text-red-500 bg-[#FDE9D9] text-start border-black font-bold border px-4 "
                    >
                      NDMA GUIDELINE
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF" }}
                      className="border-b text-center "
                      rowSpan="4"
                    >
                      5
                    </td>

                    <td className="border px-4 ">
                      Property Falls under Sesimic Zone
                    </td>
                    <td className="border px-4 ">{reportData?.seismicZone}</td>
                    <td className="border px-4 ">
                      Property Falls under Flood Zone
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.floodZone}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Property Falls under Cyclone Zone
                    </td>
                    <td className="border px-4 ">{reportData?.cycloneZone}</td>
                    <td className="border px-4 ">Property Falls in CR Zone</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.crZone}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Property Falls under Landslide Prone Zone
                    </td>
                    <td className="border px-4 ">
                      {reportData?.landslideZone}
                    </td>
                    <td className="border px-4 ">Follows NMDA Guidelines</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.followsreportData}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Degree of Risk Associated</td>
                    <td className="border px-4 ">{reportData?.riskDegree}</td>
                    <td className="border px-4 ">
                      Any Demolition Risk with Details
                    </td>
                    <td colSpan="2" className="border px-4 font-bold">
                      {reportData?.demolitionRisk}
                    </td>
                  </tr>
                </tbody>

                {/* ====== TABLE 6: PROPERTY DETAILS ====== */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="6"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
                    >
                      PROPERTY DETAILS
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        borderBottom: "none",
                        backgroundColor: "#F0F8FF",
                      }}
                      className="border-b"
                    ></th>
                    <th className="border row-span-5 px-4 ">
                      Boundaries on Site
                    </th>

                    <th className="border px-4 font-bold">Directions</th>
                    <th className="border px-4 font-bold">
                      As per Document/ATS
                    </th>
                    <th className="border px-4 font-bold">Actual at site</th>
                    <th className="border px-4 font-bold">As per plan</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: "none" }} className="border">
                  <tr>
                    <td
                      style={{
                        borderTop: "none",
                        outline: "none",
                        backgroundColor: "#F0F8FF",
                      }}
                      className=""
                    ></td>
                    <td className=" col-span-3 border px-4 "></td>
                    <td className="border px-4 ">North</td>
                    <td className="border px-4 ">
                      {reportData?.directions?.North?.document}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.North?.actual}
                    </td>
                    <td className="border white-nowwrap px-4 ">
                      {reportData?.directions?.North?.plan}
                    </td>
                  </tr>
                  {/* <tr></tr> */}

                  <tr>
                    <td
                      style={{
                        borderTop: "none",
                        backgroundColor: "#F0F8FF",
                      }}
                      className="border text-center "
                      rowSpan="9"
                    >
                      6
                    </td>

                    <td className=" col-span-3 border px-4 "></td>

                    <td className="border px-4 ">South</td>
                    <td className="border px-4 ">
                      {reportData?.directions?.South?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.South?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.South?.actual}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td className=" col-span-3 border px-4 "></td>

                    <td className="border px-4 ">East</td>
                    <td className="border px-4 ">
                      {reportData?.directions?.East?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.East?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.East?.actual}
                    </td>
                  </tr>
                  <tr>
                    <td className=" col-span-3 border px-4 "></td>

                    <td className="border px-4 ">West</td>
                    <td className="border px-4 ">
                      {reportData?.directions?.West?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.West?.actual}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.directions?.West?.actual}
                    </td>
                  </tr>
                  <tr></tr>

                  <tr>
                    <td className="border px-4 ">Boundaries Matching</td>
                    <td className="border px-4 ">
                      {reportData?.boundariesMatching || "Boundaries Matching"}
                    </td>

                    <td className="border px-4 ">If No - Detail Remak</td>
                    {/* <td className='border px-4 '></td> */}

                    <td className="border px-4 ">NA</td>
                    <td className="border px-4 ">Dimension:</td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Plot Area (Sq. ft)</td>

                    <td className="border px-4 ">
                      {reportData?.plotArea || ""}
                    </td>
                    {/* <td className='border px-4 '></td> */}
                    <td className="border px-4 ">Property is Demarcated</td>

                    <td className="border px-4 ">
                      {reportData?.isPropertyDemarcated || "Yes"}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.dimension || "30 * 30"}
                    </td>
                  </tr>

                  <tr>
                    <td className="border px-4 ">
                      Is the property within which limit
                    </td>
                    <td className="border px-4 ">
                      {reportData?.isPropertyWithinLimit || ""}
                    </td>
                    <td className="border px-4 ">
                      Property Easily Identifiable
                    </td>
                    {/* <td className='border px-4 '>
                      
                    </td> */}
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.propertyIdentifiable || "If no, Remarks:"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Marketability</td>
                    <td className="border px-4 ">
                      {reportData?.marketability || "Good/ Average/ Poor"}
                    </td>
                    <td className="border px-4 ">
                      {reportData?.marketability ? "Yes" : ""}
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      NA
                    </td>
                  </tr>
                </tbody>

                {/* table 7 */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="6"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border-black border px-4 "
                    >
                      STRUCTURAL DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF " }}
                      className="border-b text-center"
                      rowSpan="8"
                    >
                      7
                    </td>

                    <td className="border px-4 ">Type of Structure</td>
                    <td className="border px-4 ">
                      {reportData?.typeOfStructure || ""}
                    </td>
                    <td className="border px-4 ">Quality of Construction</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.qualityOfConstruction}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Unit / Flat Configuration</td>
                    <td className="border px-4 ">
                      {reportData?.unitFlatConfiguration || ""}
                    </td>
                    <td className="border px-4 ">
                      If quality of construction is poor
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.ifQualityPoor}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">No. Of Floors Permissible</td>
                    <td className="border px-4 ">
                      {reportData?.noOfFloorsPermissible || ""}
                    </td>
                    <td className="border px-4 ">No. Of Floors Actual</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.noOfFloorsActual}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      No. of Unit / Flat on each Floor
                    </td>
                    <td className="border px-4 ">
                      {reportData?.noOfUnitFlatOnEachFloor || ""}
                    </td>
                    <td className="border px-4 ">
                      Internal composition of the property
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.internalComposition}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Approx. Age of Property (Years)
                    </td>
                    <td className="border px-4 ">
                      {reportData?.approxAgeOfProperty || "0"}
                    </td>
                    <td className="border px-4 ">
                      Whether construction is as per plan / permission /
                      building by laws
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.constructionAsPerPlan}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Residual Age (Years)</td>
                    <td className="border px-4 ">
                      {reportData?.residualAge || "50"}
                    </td>
                    <td className="border px-4 ">
                      Current Construction Status (in % only)
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.constructionStatus}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Whether Lift Available</td>
                    <td className="border px-4 ">
                      {reportData?.liftAvailable || "No"}
                    </td>
                    <td className="border px-4 ">
                      Height of the building (Approx in Meters)
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.buildingHeight}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Construction stage</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.constructionStage || "Plinth"}
                    </td>
                  </tr>
                </tbody>
                {/* TABLE 8 */}

                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="8"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
                    >
                      VIOLATION OBSERVED, IF ANY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ backgroundColor: "#F0F8FF" }}
                      rowSpan="3"
                      className="border-b text-center"
                    >
                      8
                    </td>
                    {/* <td className="border"  rowSpan="3">81/td>  */}
                    <td className="border px-4 ">Deviation to Plan</td>
                    <td className="border px-4 ">
                      {reportData?.deviationToPlan}
                    </td>
                    <td className="border px-4 ">If yes</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.deviationDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Demolition Risk</td>
                    <td className="border px-4 ">
                      {reportData?.demolitionRisk}
                    </td>
                    <td className="border px-4 ">If yes</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.demolitionDetails}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Encroachment of Land</td>
                    <td className="border px-4 ">{reportData?.encroachment}</td>
                    <td className="border px-4 ">If yes</td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.encroachmentDetails}
                    </td>
                  </tr>
                </tbody>

                {/* TABLE 9  */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th
                      colSpan="9"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
                    >
                      VALUATION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <td
                    style={{ backgroundColor: "#F0F8FF" }}
                    rowSpan="19" // updated from 16 to 19 (3 rows added)
                    className="border-b text-center"
                  >
                    9
                  </td>

                  {/* Land area section */}
                  <tr>
                    <td rowSpan="3" className="border px-4 ">
                      Land area (Sq. ft)
                    </td>
                    <td className="border px-4 ">Document</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.document || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Plan</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.landAreaPlan || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Site</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.landAreaSite || ""}
                    </td>
                  </tr>

                  {/* Built Up Area (Proposed) */}
                  <tr>
                    <td rowSpan="3" className="border px-4 ">
                      Built Up Area (Proposed)
                    </td>
                    <td className="border px-4 ">GF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.landAreaGF || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">FF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.builtUpAreaFF || "0"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">SF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.builtUpAreaSF || "0"}
                    </td>
                  </tr>

                  {/* Built Up Area (Existing) */}
                  <tr>
                    <td rowSpan="3" className="border px-4 ">
                      Built Up Area (Existing)
                    </td>
                    <td className="border px-4 ">GF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.existingBuiltUpGF || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">FF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.existingBuiltUpFF || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">SF</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.existingBuiltUpSF || ""}
                    </td>
                  </tr>

                  {/* Remaining rows as is */}
                  <tr>
                    <td className="border px-4 ">
                      Land Area considered for Valuation
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      Deed / ATS
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.deedArea ||
                        reportData?.siteArea ||
                        reportData?.planArea ||
                        ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Land Rate considered per sq. Ft.
                    </td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.landRate || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Total Land Valuation</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.totalLandValuation || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Construction Area considered for Valuation
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      Plan
                    </td>
                    <td colSpan="2" className="border px-4 ">
                      {reportData?.landAreaGF || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Construction Rate considered per sq. Ft
                    </td>
                    <td className="border px-4 ">BUA</td>
                    <td colSpan="3" className="border px-4 ">
                      {reportData?.constructionRate || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Total Construction Valuation
                    </td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.totalConstructionValuation || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Fair Market Value / Total Value of the unit after
                      completion
                    </td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.fairMarketValue || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">Valuation at Present Stage</td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.presentStageValuation || ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 ">
                      Valuation as per Govt. Guideline
                    </td>
                    <td colSpan="4" className="border px-4 ">
                      {reportData?.govtGuidelineValuation || ""}
                    </td>
                  </tr>
                </tbody>

                {/* TABLE 10 */}

                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"> </th>
                    <th
                      colSpan="6"
                      className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
                    >
                      OBSERVATION AND REMARKS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <td
                    style={{ backgroundColor: "#F0F8FF" }}
                    rowSpan="50"
                    className="border-b p-1"
                  >
                    10
                  </td>
                  {observations.map((obs, index) => (
                    <tr key={index}>
                      <td colSpan="5" className="border pl-4">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${index + 1}.   ${obs}`,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* //! tbody k andr likhna hai */}
                <tr>
                  <td className="bg-[#F0F8FF] "></td>
                  <td
                    className="border border-black font-bold px-4 bg-[#FDE9D9] text-start text-red-500"
                    colSpan="5"
                  >
                    SITE PHOTOGRAPHS
                  </td>
                </tr>
                <tr>
                  <td className="border-b bg-[#F0F8FF] p-1">11 </td>

                  <td
                    className="border border-black px-4 mt font-semibold"
                    colSpan="8"
                  >
                    {sortedImages.length === 0 ? (
                      <p className="text-gray-500">Loading images...</p>
                    ) : (
                      <ReactSortable
                        list={sortedImages}
                        setList={setSortedImages}
                        className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-2"
                        animation={200}
                      >
                        {sortedImages.map((item, index) => {
                          return (
                            <div
                              key={item.id}
                              className="overflow-hidden border p-1 cursor-pointer"
                              onClick={() => handleImageClick(item?.url?.url)}
                            >
                              <img
                                src={`${item?.url?.url}`}
                                alt={`Image ${index + 1}`}
                                className="w-full h-80 object-cover object-bottom"
                              />
                            </div>
                          );
                        })}
                      </ReactSortable>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="bg-[#F0F8FF]"></td>
                  <td
                    className="border text-start border-black font-bold px-4 bg-[#FDE9D9] text-red-500"
                    colSpan="5"
                  >
                    LOCATION
                  </td>
                </tr>
                <tr>
                  <td className="bg-[#F0F8FF] p-1">12</td>
                  <td className="border border-black px-4 font-semibold">
                    Geo-Coordinates
                  </td>
                  <td className="border px-4 text-center" colSpan="1">
                    <b>Latitude</b>
                    <br />
                  </td>
                  <td colSpan=""> {reportData?.latitude || ""}</td>
                  <td className="border px-4 text-center" colSpan="1">
                    <b>Longitude</b>
                  </td>
                  <td> {reportData?.longitude || ""}</td>
                </tr>

                <tr>
                  <td className="bg-[#F0F8FF]"></td>
                  <td colSpan="6" className="border border-black">
                    {reportData?.latitude && reportData?.longitude ? (
                      <iframe
                        width="100%"
                        height="300"
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps?q=${reportData.latitude},${reportData.longitude}&hl=es;z=14&output=embed`}
                        title="location-map"
                      ></iframe>
                    ) : (
                      <p className="text-center text-gray-500 p-4">
                        Coordinates not available
                      </p>
                    )}
                  </td>
                </tr>
              </table>
              <div className="print-footer opacity-0">
                Unique Engineering and Associate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 z-10"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HFBankDetails;