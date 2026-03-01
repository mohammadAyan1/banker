// import { useParams } from "react-router-dom";
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import FileDownload from "../../components/FileDownload";

// import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
// import { ReactSortable } from "react-sortablejs";

// const HFBankDetails = () => {
//   const CPANEL = import.meta.env.VITE_API_URL;

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
//     console.log(singleBank);
//   }, [singleBank]);

//   const userRemarks = Array.isArray(reportData?.valuationRemarks)
//     ? reportData.valuationRemarks
//     : reportData?.valuationRemarks
//       ? [reportData.valuationRemarks]
//       : [];

//   const observations = [...new Set([...userRemarks])];

//   const [sortedImages, setSortedImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null); // for modal

//   useEffect(() => {
//     console.log(reportData);


//     if (reportData?.imageUrls?.length > 0) {
//       const updated = reportData.imageUrls.map((url, index) => ({
//         id: index + 1,
//         url,
//       }));
//       setSortedImages(updated);
//     }
//   }, [reportData?.imageUrls]);

//   const handleImageClick = (imageUrl) => {
//     setSelectedImage(imageUrl);
//   };

//   const closeModal = () => {
//     setSelectedImage(null);
//   };

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
//                   <tr className="border">
//                     <th colSpan="6" className="py-1 text-center">
//                       <img src="/assets/images/header1.jpg" alt="" />
//                       <h1 className="text-center text-xl items-center">
//                         VALUATION REPORT <br />
//                         {/* FOR <br /> HOME FIRST FINANCE COMPANY (HFFC) */}
//                       </h1>
//                     </th>
//                   </tr>
//                 </thead>
//                 {/* ====== TABLE 2: GENERAL DETAILS ====== */}
//                 <thead>
//                   <tr>
//                     <th
//                       className="text-start pl-2 w-[10px]"
//                       style={{ backgroundColor: "#EFF6FF", border: "none" }}
//                     >1</th>
//                     <th
//                       colSpan="5"
//                       className="text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-2 "
//                     >
//                       GENERAL DETAILS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold  bg-blue-50">
//                       Vendor Name:
//                     </td>
//                     <td colSpan="5" className="border font-bold bg-blue-50">
//                       {/* {reportData?.addressLegal || ""} */}
//                       <p className="text-blue-500 text-center">UNIQUE ENGINEERING AND ASSOCIATE</p>
//                     </td>
//                   </tr>
//                   <tr >
//                     <td className="border font-bold" colSpan="2">Loan account no. (LAI)</td>
//                     <td className="border text-center" colSpan="1">237209</td>
//                     <td className="border font-bold" colSpan="1">Date</td>
//                     <td className="border text-center" colSpan="2">11.12.2025</td>
//                   </tr>
//                   <tr >
//                     <td className="border font-bold" colSpan="2">Pin Code</td>
//                     <td className="border text-center" colSpan="1">474005</td>
//                     <td className="border font-bold" colSpan="1">Geo Coord</td>
//                     <td className="border text-center" colSpan="2">26.285941,78.193743</td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     <th
//                       className="text-start pl-1 w-[10px] border"
//                       style={{ backgroundColor: "#EFF6FF" }}
//                     >2</th>
//                     <th
//                       colSpan="5"
//                       className="text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-4 "
//                     >
//                       Property Overview
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td colSpan="2" className="m-0">
//                       <span className="font-bold">
//                         Property Category
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{Project/ Individual}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">INDIVIDUAL</td>
//                     <td colSpan="2" className="">
//                       <span className="font-bold">
//                         Property Type
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{Apartment, Row House, Individual House, Shop, Office, Industrial}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       OPEN PLOT
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Tye of Loan</td>
//                     <td colSpan="1" className="border font-bold text-center">SECO</td>
//                     <td colSpan="2" className="border font-bold">Property location</td>
//                     <td colSpan="1" className="border font-bold text-center">
//                       Town
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold ">Population as per Census 2011</td>
//                     <td colSpan="1" className="border">Btw 10000 to 1.0 Lac</td>
//                     <td colSpan="2" className="border font-bold">Rural/ Urban {"(> 10k = Urban)"}</td>
//                     <td colSpan="1" className="border font-bold">
//                       URBAN
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">
//                       Zone
//                     </td>
//                     <td colSpan="1" className="border text-center">Residential</td>
//                     <td colSpan="2" className="border font-bold">Property Area Limits</td>
//                     <td colSpan="1" className="border text-center">
//                       Municipal
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span className="font-bold">
//                         RERA No.
//                       </span>
//                       <span className="text-blue-500">
//                         {"{If applicable}"}
//                       </span>
//                     </td>
//                     <td colSpan="4" className="border text-center">NA</td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF] pl-1 text-start">3</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Visit Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Applicant Name</td>
//                     <td className="border text-center" colSpan="2">
//                       RAM PRAKASH TEJ SINGH
//                     </td>
//                     <td className="border font-bold" colSpan="1">
//                       Mobile No.
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       9662397945
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Person Met At Site</td>
//                     <td colSpan="1" className="border text-center">
//                       RAM PRAKASH
//                     </td>
//                     <td colSpan="2" className="border font-bold">
//                       Relationship of person met and property
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       SELF
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="1">
//                       Property Owner’s Name
//                     </td>
//                     <td className="border text-center" colSpan="2">
//                       1.RAI SINGH S/O SHRI TEJ SINGH
//                       <br />
//                       2.RAM PRAKASH S/O SHRI TEJ SINGH
//                     </td>
//                     <td className="border font-bold" colSpan="2">How did you find out property owner’s name?</td>
//                     <td colSpan="1" className="border text-center">
//                       SALE DEED
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Property Documents Available?
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       YES
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Name on Society Board/Signage
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       NA
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Address as per legal document
//                     </td>
//                     <td className="border font-bold text-center" colSpan="4">
//                       PROPERTY AT, OPEN PLOT NO. 7 PART OF PLOT NO.8,PART OF K.H.NO.544/2 AND PART OF 558/2 , P.H.NO.99, WARD NO. 62,GRAM
//                       .SENTHARI , TEHSIL- DIST.GWALIOR , M.P. 474005
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Address of Property (As per site)
//                     </td>
//                     <td className="border text-center" colSpan="4">
//                       PROPERTY AT, OPEN PLOT NO. 7 PART OF PLOT NO.8,PART OF K.H.NO.544/2 AND PART OF 558/2 , P.H.NO.99, WARD NO. 62,GRAM
//                       .SENTHARI , TEHSIL- DIST.GWALIOR , M.P. 474005
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Name on door of the premises
//                     </td>
//                     <td className="border font-bold w-[30px] text-center" colSpan="1">
//                       NA
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Nearby landmark {"[within 500m]"}
//                     </td>
//                     <td className="border font-bold text-center" colSpan="1">
//                       NEAR BY PARSHURAM CHORAHA
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Occupancy
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       Vacant
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Occupied by
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       SELF
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Usage
//                     </td>
//                     <td className="border font-bold text-center" colSpan="1">
//                       Residential
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Property easily identifiable?
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       YES
//                     </td>
//                   </tr>
//                 </tbody>

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">4</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start border-black font-bold border px-4 "
//                     >
//                       Locality
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Nearest City/Town
//                     </td>
//                     <td className="border text-center" colSpan="1">GWALIOR</td>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold pr-1">
//                         Location Category
//                       </span>
//                       <span className="text-blue-500">
//                         {"{TP / ZP / GP}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       MC
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Distance of property from city centre
//                     </td>

//                     <td className="border text-center">
//                       11 Km
//                     </td>

//                     <td className="border text-center font-bold">
//                       Distance from:
//                     </td>

//                     {/* Nested Table for Distance Labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Railway Stn</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Bus Stand</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Hospital</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     {/* Nested Table for Distance Values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border text-center font-bold">9 Km</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">10 Km</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">9 Km</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold pr-1">
//                         Approach Road Width
//                       </span>
//                       <span className="text-blue-500">
//                         {"{In Feet}"}
//                       </span>
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       20 ft
//                     </td>
//                     <td className="border font-bold" colSpan="2">Approach Road Type</td>
//                     <td colSpan="1" className="border text-center">
//                       Mud Road
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Occupancy in Project</td>
//                     <td className="border text-center" colSpan="1">50%</td>
//                     <td className="border font-bold" colSpan="2">
//                       Habitation of nearby area
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       Medium
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Negative Markers If Any
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{HT Wire, Nallah, River, Lake, Road Widening}"}
//                       </span>
//                     </td>

//                     <td className="border text-center">
//                       NA
//                     </td>

//                     <td className="border text-center font-bold">
//                       Availability :
//                     </td>

//                     {/* Nested Table for Distance Labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Electricity</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Water</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Drainage</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     {/* Nested Table for Distance Values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border text-center font-bold">NA</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">NA</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">NA</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>

//                 </tbody>

//                 {/* ====== TABLE 6: PROPERTY DETAILS ====== */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">5</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Property Plan
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody style={{ borderTop: "none" }} className="border">
//                   <tr>

//                     <td className="border " colSpan="2">
//                       <span className="font-bold">
//                         NA Conversion Order
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{Yes, No, NA}"}
//                       </span>
//                     </td>
//                     <td className="border text-center">YES</td>
//                     <td className="border font-bold">
//                       NA Order Number/Date
//                     </td>
//                     <td className="border px-4 ">

//                     </td>
//                     <td className="border white-nowwrap px-4 ">

//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Layout Plan
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{TP, ZP, GP, Licensed Surveyor}"}
//                       </span>
//                     </td>

//                     <td className="border text-center" colSpan="1">Licensed Surveyor Plan</td>
//                     <td className="border font-bold " colSpan="1">
//                       Plan Number/Date
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       Lic. No. IMC-82-16
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       11.12.2025
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Building Plan
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{TP, ZP, GP, Licensed Surveyor}"}
//                       </span>
//                     </td>

//                     <td className="border text-center" colSpan="1">Licensed Surveyor Plan</td>
//                     <td className="border font-bold " colSpan="1">
//                       Plan Number/Date
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       Lic. No. IMC-82-16
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       11.12.2025
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Commencement Certificate
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{TP, ZP, GP}"}
//                       </span>
//                     </td>

//                     <td className="border text-center" colSpan="1"></td>
//                     <td className="border font-bold " colSpan="1">
//                       Plan Number/Date
//                     </td>
//                     <td className="border text-center" colSpan="1">

//                     </td>
//                     <td className="border text-center" colSpan="1">
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Occupancy/Completion/Buildin g Usage Certificate
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{TP, ZP, GP, Licensed Surveyor}"}
//                       </span>
//                     </td>

//                     <td className="border text-center" colSpan="1"></td>
//                     <td className="border font-bold " colSpan="1">
//                       Plan Number/Date
//                     </td>
//                     <td className="border text-center" colSpan="1">

//                     </td>
//                     <td className="border text-center" colSpan="1">

//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">
//                         Sub Plotting Plan
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{TP, ZP, GP, Licensed Surveyor}"}
//                       </span>
//                     </td>

//                     <td className="border text-center" colSpan="1">Licensed Surveyor Plan</td>
//                     <td className="border font-bold " colSpan="1">
//                       Plan Number/Date
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       Lic. No. IMC-82-16
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       11.12.2025
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* table 7 */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">6</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border-black border px-4 "
//                     >
//                       NDMA Guidelines
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under Seismic Zone
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       ||
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under Flood Zone
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       NO
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under Cyclone Zone
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       NO
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under Landslide Prone Zone
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       NO
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under CR Zone
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       NO
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Property falls under Demolition Risk
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       LOW
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">
//                       Demolition Risk Details
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       NA
//                     </td>
//                     <td className="border font-bold" colSpan="2">
//                       Property Follows NDMA Guidelines
//                     </td>
//                     <td className="border text-center" colSpan="1">
//                       YES
//                     </td>
//                   </tr>
//                 </tbody>
//                 {/* TABLE 8 */}

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">7</th>
//                     <th
//                       colSpan="8"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Boundaries and Dimensions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>

//                   <tr>
//                     <td className="border" colSpan="2">
//                       Boundaries
//                     </td>

//                     {/* Nested Table for Distance Labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Directions</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">North</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">South</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">East</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">West</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     {/* Nested Table for Distance Values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border text-center font-bold">As per documents</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">PLOT NO.6</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">PART OF PLOT NO.8</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">20 FEET COLONY ROAD</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">20 FEET COLONY ROAD</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">As per site</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">OPEN PLOT NO.6</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">OPEN PLOT NO.8</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">ROAD</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">ROAD</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">As per site</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">OPEN PLOT NO.6</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">OPEN PLOT NO.8</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">ROAD</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">ROAD</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td colSpan="2" className="border px-4 ">Boundaries Matching?</td>
//                     <td colSpan="1" className="border px-4 ">
//                       YES
//                     </td>
//                     <td colSpan="2" className="border px-4 ">Property Demarcated?</td>
//                     <td colSpan="1" className="border px-4 ">
//                       YES
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border px-4 ">Boundary Remarks in Detail</td>
//                     <td colSpan="4" className="border px-4 ">
//                       Identified by as per sale deed
//                     </td>
//                   </tr>

//                   <tr>

//                     <td colSpan="2" className="border px-4 ">
//                       Marketability
//                       <span className="text-blue-500">
//                         {"{Good / Average / Poor}"}
//                       </span>
//                     </td>
//                     <td colSpan="4" className="border px-4 ">Avg.</td>
//                   </tr>
//                 </tbody>

//                 {/* TABLE 9  */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">8</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Structural Details
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {/* Land area section */}
//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span>
//                         Type of structure
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{RCC / Load bearing}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">Open plot</td>
//                     <td colSpan="2" className="border">
//                       <span>
//                         Type of roof
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{ACC Sheet/ Stone Patti/ Tin Sheet/ Terracotta Tiles, Thatch roof}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       G.F PROPOSED
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       No. of floors permissible
//                     </td>
//                     <td colSpan="1" className="border text-center">NA</td>
//                     <td colSpan="2" className="border">
//                       No. of floors - Actual
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       1
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       No. of units/flats on each floor
//                     </td>
//                     <td colSpan="1" className="border text-center">NA</td>
//                     <td colSpan="2" className="border">
//                       <span>
//                         Quality of construction
//                       </span>
//                       <span>
//                         {"{Good / Avg./ Poor}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       Avg.
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Age of property
//                     </td>
//                     <td colSpan="1" className="border text-center">0</td>
//                     <td colSpan="2" className="border">
//                       Residual age
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       60
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Land Area
//                     </td>
//                     <td colSpan="2" className="border text-center">1980 SQFT</td>
//                     <td colSpan="1" className="border">
//                       Linear Dimension
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       30*66
//                     </td>
//                   </tr>
//                 </tbody>


//                 {/* TABLE 11 */}

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">9</th>
//                     <th
//                       colSpan="6"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Violation Observed (if any)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Demolition risk due to violation?
//                     </td>
//                     <td colSpan="1" className="border text-center">NO</td>
//                     <td colSpan="2" className="border">
//                       Remarks
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       NA
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Encroachment of land?
//                     </td>
//                     <td colSpan="1" className="border text-center">NO</td>
//                     <td colSpan="2" className="border">
//                       Remarks
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       NA
//                     </td>
//                   </tr>
//                 </tbody>


//                 {/*  */}

//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">10</th>
//                     <th
//                       colSpan="8"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Valuation
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border" colSpan="2">
//                       Land
//                     </td>

//                     {/* Nested Table for Distance Labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">As per</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Document (L1)</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Plan (L2)</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Site (L3)</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     {/* Nested Table for Distance Values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border text-center font-bold">Area</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">1980</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">1980</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>

//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Rate per sq.ft</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">1700</td>
//                           </tr>

//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Valuation</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">3366000</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                   {/*  */}
//                   <tr>
//                     <td className="border" colSpan="2">
//                       Construction
//                     </td>
//                     {/* Nested Table for Distance Labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">As per</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Document (L1)</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Plan (L2)</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">Site (L3)</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     {/* Nested Table for Distance Values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border text-center font-bold">Area</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">990</td>
//                           </tr>
//                           <tr>
//                             <td className="border text-center font-bold">0</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Rate per sq.ft</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">1200</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>

//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr>
//                             <td className="border px-2 font-bold">Valuation</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">1188000</td>
//                           </tr>
//                           <tr>
//                             <td className="border px-2 font-bold">0</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>

//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span className="pr-1">
//                         Amenities
//                       </span>

//                       <span className="text-blue-500">
//                         {"{Mention details}"}
//                       </span>
//                     </td>
//                     <td colSpan="2" className="border text-center">NA</td>
//                     <td colSpan="1" className="border">
//                       Value of amenities (A)
//                     </td>
//                     <td colSpan="1" className="border text-center">

//                     </td>
//                   </tr>

//                   <tr>
//                     <td colSpan="2" className="border p-1">
//                       <span>
//                         Lift Available?
//                       </span>

//                       <span className="text-blue-500">
//                         {"{Yes/ No}"}
//                       </span>
//                     </td>
//                     <td colSpan="2" className="border text-center">NO</td>
//                     <td colSpan="1" className="border">
//                       <span>
//                         Height of the building

//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {"{in Meters}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       3.5
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       <span>
//                         Realizable Value after completion
//                       </span>
//                       <span>
//                         {"{L3 + C3 + A}"}
//                       </span>
//                     </td>
//                     <td className="border">4554000</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="3" className="border p-1">
//                       <span>
//                         Construction Stage
//                       </span>
//                       <br />
//                       <span className="text-blue-500">
//                         {`{Foundation/Plinth/Brick Work/RCC/Plaster/Tiling/Internal Finishing/Completed}`}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">G.F PROPOSED</td>
//                     <td colSpan="1" className="border">
//                       Construction %
//                     </td>
//                     <td colSpan="1" className="border text-center">
//                       0%
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Valuation at current stage
//                     </td>
//                     <td className="border">3366000</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       <span>
//                         Valuation as per Govt. guideline
//                       </span>
//                       <span>
//                         {"{L3+C3+A}"}
//                       </span>
//                     </td>
//                     <td className="border">4554000</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       <span>
//                         Construction estimate shared by customer
//                       </span>
//                       <span>
//                         {"{L3+C3+A}"}
//                       </span>
//                     </td>
//                     <td className="border">4554000</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Estimate recommended (by valuer)
//                     </td>
//                     <td className="border">4554000</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Market rate for similar properties in the locality (Rs/sq.ft)
//                     </td>
//                     <td className="border">1600-1700</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Whether construction is as per plan / permission / building by laws
//                     </td>
//                     <td className="border">Yes</td>
//                   </tr>
//                 </tbody>


//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">11</th>
//                     <th
//                       colSpan="8"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Observations Remark:
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td colSpan="6" className="border p-2">
//                       <ol className="list-decimal pl-5">
//                         <li>GIVEN XEROX COPY OF SALE DEED IS BETWEEN OF 1.RAI SINGH S/O SHRI TEJ SINGH & 2.RAM PRAKASH S/O SHRI
//                           TEJ SINGH.</li>
//                         <li>DURING PROPERTY VISIT MR.RAM PRAKASH JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT
//                           NO.9662397945 . IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION
//                           PURPOSE IN RELATION WITH LOAN PROPOSAL.</li>
//                         <li>RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.</li>
//                         <li>PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESI-CUM AGRI. ZONING SURROUNDING AREA
//                           DEVELOPMENT IS 35%</li>
//                         <li>AT SITE PROPERTY IS OPEN PLOT WHICH IS DEMARCATED BY STONE WALL.</li>
//                         <li>AS PER SALE DEED AND ACTUAL LAND AREA IS 30*66=1980 SQFT.</li>
//                         <li>PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN SALE DEED AND PRIVATE KEY LOCATION PLAN
//                           WHICH IS DRAW BY ARCHITECT.</li>
//                         <li>ARCHITECT MAP RECEIVE FOR G.F.</li>
//                         <li>BUILDING ESTIMATE NOT PROVIDED JUSTIFY CONST. COST CONSIDER AS PER HOME FIRST POLICY.</li>
//                         <li>CONST COST CONSIDER AFTER COMPLETION OF WORK.</li>
//                         <li>CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.</li>
//                         <li>SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.</li>
//                         <li>VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.</li>
//                       </ol>
//                     </td>
//                   </tr>
//                 </tbody>



//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">12</th>
//                     <th
//                       colSpan="8"
//                       className="text-red-500 bg-[#FDE9D9] text-start font-bold border border-black px-4 "
//                     >
//                       Property Photos
//                     </th>
//                   </tr>
//                 </thead>


//                 {/* //! tbody k andr likhna hai */}

//                 <tr>
//                   {/* <td className="border-b bg-[#F0F8FF] p-1">11 </td> */}

//                   <td
//                     className="border border-black px-4 mt font-semibold"
//                     colSpan="8"
//                   >
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
//                           return (
//                             <div
//                               key={item.id}
//                               className="overflow-hidden border p-1 cursor-pointer"
//                               onClick={() => handleImageClick(item?.url?.url)}
//                             >
//                               <img
//                                 src={`${item?.url?.url}`}
//                                 alt={`Image ${index + 1}`}
//                                 className="w-full h-80 object-cover object-bottom"
//                               />
//                             </div>
//                           );
//                         })}
//                       </ReactSortable>
//                     )}
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
//                   {/* <td className="bg-[#F0F8FF] p-1">12</td> */}
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

//       {/* Image Modal */}
//       {
//         selectedImage && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
//             onClick={closeModal}
//           >
//             <div className="relative max-w-5xl max-h-full">
//               <button
//                 className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 z-10"
//                 onClick={closeModal}
//               >
//                 &times;
//               </button>
//               <img
//                 src={selectedImage}
//                 alt="Enlarged view"
//                 className="max-w-full max-h-full object-contain"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>
//           </div>
//         )
//       }
//     </div>
//   );
// };

// export default HFBankDetails;



import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileDownload from "../../components/FileDownload";
import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
import { ReactSortable } from "react-sortablejs";
import moment from "moment";

// ─────────────────────────────────────────────────────────────────────────────
// Word Doc ke 14 default remarks — DB data se auto-fill
// ─────────────────────────────────────────────────────────────────────────────
const buildDefaultRemarks = (d = {}) => {
  const sellerNames = d?.propertyOwnerName || "..........";
  const buyerNames = d?.customerName || "..........";
  const personMet = d?.personMetDuringVisit || "..........";
  const contactNo = d?.customerNo || "..........";
  const plotArea = d?.landArea || "......";
  const dimensions = d?.linearDimension || "";
  const areaStr = dimensions ? `${plotArea} (${dimensions})` : plotArea;
  const landRate = d?.landSiteRate || d?.marketRatePerSqft || "......";

  return [
    `GIVEN XEROX COPY OF SALE DEED IS FAVOUR OF ${sellerNames} / GIVEN XEROX COPY OF DRAFT/SALE AGREEMENT IT IS BETWEEN OF (SEELER: ${sellerNames}) AND (BUYER: ${buyerNames}).`,
    `DURING PROPERTY VISIT MR. ${personMet} JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT NO. ${contactNo}. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.`,
    "RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.",
    "PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESI-CUM A. ZONING SURROUNDING AREA DEVELOPMENT IS 45 %.",
    "AT SITE PROPERTY IS GROUND FLOOR UNDER CONST RESIDENTIAL HOUSE WHICH IS OCCUPIED BY OWNER AND WORK DONE UPTO BRICK AND SLAB WORK COMPLETED.",
    `AS PER SALE DEED/ DRAFT /A.T.S/ ACTUAL LAND AREA IS ${areaStr} SQFT.`,
    "PROPERTY IS NOT IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN SALE DEED/ AGREEMENT AND KEY LOCATION PLAN IS REQUIRE FOR IDENTIFICATION / PRIVATE KEY LOCATION PLAN WHICH IS DRAW BY ARCHITECT.",
    "BUILDING PERMISSION AND MAP IS NOT OBTAIN / ARCHITECT MAP RECEIVE FOR G.F.",
    "BUILDING ESTIMATE NOT PROVIDED JUSTIFY CONST. COST CONSIDER AS PER HOME FIRST POLICY.",
    "CONST COST CONSIDER FOR EXISTING STRUCTURE AS PRESENT CONDITION OF STRUCTURE, ALSO CONST COST OF PROPOSED EXTENSION WORK WILL BE CONSIDER AFTER COMPLETION OF WORK./ CONST COST CONSIDER AFTER COMPLETION OF WORK.",
    "CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.",
    "SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.",
    "VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.",
    `TENTATIVE LAND RATE IS RS. ${landRate}/- SQFT`,
  ];
};

const HFBankDetails = () => {
  const CPANEL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const dispatch = useDispatch();
  const reportRef = useRef();
  const { singleBank } = useSelector((state) => state.hfBanks);
  const reportData = singleBank;

  useEffect(() => {
    if (id) dispatch(fetchHFBankById(id));
  }, [id, dispatch]);

  // Use saved remarks from DB; if none saved yet, fall back to 14 defaults from Word doc
  const savedRemarks = Array.isArray(reportData?.valuationRemarks)
    ? reportData.valuationRemarks
    : reportData?.valuationRemarks
      ? [reportData.valuationRemarks]
      : [];

  const userRemarks = savedRemarks.length > 0
    ? savedRemarks
    : buildDefaultRemarks(reportData);

  const [sortedImages, setSortedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (reportData?.imageUrls?.length > 0) {
      const updated = reportData.imageUrls.map((url, index) => ({
        id: index + 1,
        url,
      }));
      setSortedImages(updated);
    }
  }, [reportData?.imageUrls]);

  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);

  // Helper: show value or fallback
  const val = (v, fallback = "—") => (v !== undefined && v !== null && v !== "" ? v : fallback);

  // Format date
  const formatDate = (d) => {
    if (!d) return "—";
    const m = moment(d);
    return m.isValid() ? m.format("DD.MM.YYYY") : d;
  };

  // Documents plan table rows config (matches PDF Section 5)
  const planDocs = [
    { label: "NA Conversion Order", hint: "{Yes, No, NA}", planLabel: "NA Order Number/Date" },
    { label: "Layout Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
    { label: "Building Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
    { label: "Commencement Certificate", hint: "{TP, ZP, GP}", planLabel: "Plan Number/Date" },
    { label: "Occupancy/Completion/Building Usage Certificate", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
    { label: "Sub Plotting Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
  ];

  const thStyle = { backgroundColor: "#EFF6FF" };
  const sectionHead = "text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-2";

  return (
    <div className="container mx-auto p-4">
      <FileDownload data={reportData} tableId="reportTable" />

      <div id="report" ref={reportRef} className="valuation-report">
        <div className="p-3 bg-white shadow border" id="reportTable">
          <div
            id="print-section"
            className="bg-white shadow-md mt-1 rounded-lg overflow-hidden flex"
          >
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse border">

                {/* ── HEADER ── */}
                <thead>
                  <tr className="border">
                    <th colSpan="6" className="py-1 text-center">
                      <img src="/assets/images/header1.jpg" alt="" />
                      <h1 className="text-center text-xl">VALUATION REPORT</h1>
                    </th>
                  </tr>
                </thead>

                {/* ══════════════════════════════════════════
                    SECTION 1 — GENERAL DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="text-start pl-2 w-[10px]" style={thStyle}>1</th>
                    <th colSpan="5" className={sectionHead}>GENERAL DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold bg-blue-50">Vendor Name:</td>
                    <td colSpan="5" className="border font-bold bg-blue-50 text-center">
                      <p className="text-blue-500">UNIQUE ENGINEERING AND ASSOCIATE</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Loan Account No. (LAI)</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.refNo)}</td>
                    <td className="border font-bold" colSpan="1">Date</td>
                    <td className="border text-center" colSpan="2">{formatDate(reportData?.dateOfReport)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Pin Code</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.projectPinCode)}</td>
                    <td className="border font-bold" colSpan="1">Geo Coord</td>
                    <td className="border text-center" colSpan="2">
                      {reportData?.latitude && reportData?.longitude
                        ? `${reportData.latitude}, ${reportData.longitude}`
                        : "—"}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 2 — PROPERTY OVERVIEW
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="text-start pl-1 w-[10px] border" style={thStyle}>2</th>
                    <th colSpan="5" className={sectionHead}>Property Overview</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      <span className="font-bold">Property Category</span><br />
                      <span className="text-blue-500">{"{Project/ Individual}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.propertyCategory)}</td>
                    <td colSpan="2" className="border">
                      <span className="font-bold">Property Type</span><br />
                      <span className="text-blue-500">{"{Apartment, Row House, Individual House, Shop, Office, Industrial}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.unitType)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">Type of Loan</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.typeOfLoan)}</td>
                    <td colSpan="2" className="border font-bold">Property Location</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.propertyLocation)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">Population as per Census 2011</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.populationCensus2011)}</td>
                    <td colSpan="2" className="border font-bold">Rural / Urban {`(> 10k = Urban)`}</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.ruralUrban)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">Zone</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.zone)}</td>
                    <td colSpan="2" className="border font-bold">Property Area Limits</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.propertyAreaLimits)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      <span className="font-bold">RERA No.</span>
                      <span className="text-blue-500"> {"{If applicable}"}</span>
                    </td>
                    <td colSpan="4" className="border text-center">{val(reportData?.eraApplicable)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 3 — VISIT DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF] pl-1 text-start">3</th>
                    <th colSpan="5" className={sectionHead}>Visit Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">Applicant Name</td>
                    <td className="border text-center" colSpan="2">{val(reportData?.customerName)}</td>
                    <td className="border font-bold" colSpan="1">Mobile No.</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.customerNo)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">Person Met At Site</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.personMetDuringVisit)}</td>
                    <td colSpan="2" className="border font-bold">Relationship of person met and property</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.relationshipOfPersonMet)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="1">Property Owner's Name</td>
                    <td className="border text-center whitespace-pre-line" colSpan="2">{val(reportData?.propertyOwnerName)}</td>
                    <td className="border font-bold" colSpan="2">How did you find out property owner's name?</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.howFoundOwnerName)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Property Documents Available?</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.documentsAvailable)}</td>
                    <td className="border font-bold" colSpan="2">Name on Society Board/Signage</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.nameOnSocietyBoard)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Address as per legal document</td>
                    <td className="border text-center" colSpan="4">{val(reportData?.addressLegal)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Address of Property (As per site)</td>
                    <td className="border text-center" colSpan="4">{val(reportData?.addressSite)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Name on door of the premises</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.nameOnDoor)}</td>
                    <td className="border font-bold" colSpan="2">Nearby landmark {`[within 500m]`}</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.nearbyLandmark)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Occupancy</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.statusOfOccupancy)}</td>
                    <td className="border font-bold" colSpan="2">Occupied by</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.occupiedBy)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Usage</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.usageOfProperty)}</td>
                    <td className="border font-bold" colSpan="2">Property easily identifiable?</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.propertyEasilyIdentifiable)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 4 — LOCALITY
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">4</th>
                    <th colSpan="5" className={sectionHead}>Locality</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">Nearest City/Town</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.nearestCityTown)}</td>
                    <td className="border font-bold" colSpan="2">
                      Location Category <span className="text-blue-500">{"{TP / ZP / GP}"}</span>
                    </td>
                    <td className="border text-center" colSpan="1">{val(reportData?.locationCategory)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Distance of property from city centre</td>
                    <td className="border text-center">{val(reportData?.distanceFromCityCentre)}</td>
                    <td className="border text-center font-bold">Distance from:</td>
                    {/* nested distance labels */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Railway Stn</td></tr>
                          <tr><td className="border px-2 font-bold">Bus Stand</td></tr>
                          <tr><td className="border px-2 font-bold">Hospital</td></tr>
                        </tbody>
                      </table>
                    </td>
                    {/* nested distance values */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border text-center font-bold">{val(reportData?.distanceFromRailwayStation)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.distanceFromBusStand)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.distanceFromHospital)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan="2">
                      <span className="font-bold">Approach Road Width</span>
                      <span className="text-blue-500"> {"{In Feet}"}</span>
                    </td>
                    <td className="border text-center" colSpan="1">{val(reportData?.approachRoadWidth)}</td>
                    <td className="border font-bold" colSpan="2">Approach Road Type</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.approachRoadType)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Occupancy in Project</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.occupancyPercentage)}</td>
                    <td className="border font-bold" colSpan="2">Habitation of nearby area</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.habitationPercentage)}</td>
                  </tr>
                  <tr>
                    <td className="border" colSpan="2">
                      <span className="font-bold">Negative Markers If Any</span><br />
                      <span className="text-blue-500">{"{HT Wire, Nallah, River, Lake, Road Widening}"}</span>
                    </td>
                    <td className="border text-center">{val(reportData?.nallahRiverHighTension)}</td>
                    <td className="border text-center font-bold">Availability :</td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Electricity</td></tr>
                          <tr><td className="border px-2 font-bold">Water</td></tr>
                          <tr><td className="border px-2 font-bold">Drainage</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border text-center font-bold">{val(reportData?.electricityAvailability)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.waterAvailability)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.drainageAvailability)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 5 — PROPERTY PLAN
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">5</th>
                    <th colSpan="5" className={sectionHead}>Property Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {planDocs.map((planRow, idx) => {
                    const saved = reportData?.documents?.find((d) => d.type === planRow.label) || {};
                    return (
                      <tr key={idx}>
                        <td className="border" colSpan="2">
                          <span className="font-bold">{planRow.label}</span><br />
                          <span className="text-blue-500">{planRow.hint}</span>
                        </td>
                        <td className="border text-center" colSpan="1">{val(saved.approvingAuthority)}</td>
                        <td className="border font-bold" colSpan="1">{planRow.planLabel}</td>
                        <td className="border text-center" colSpan="1">{val(saved.approvalDate)}</td>
                        <td className="border text-center" colSpan="1">{val(saved.approvalDetails)}</td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 6 — NDMA GUIDELINES
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">6</th>
                    <th colSpan="5" className={sectionHead}>NDMA Guidelines</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">Property falls under Seismic Zone</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.seismicZone)}</td>
                    <td className="border font-bold" colSpan="2">Property falls under Flood Zone</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.floodZone)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Property falls under Cyclone Zone</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.cycloneZone)}</td>
                    <td className="border font-bold" colSpan="2">Property falls under Landslide Prone Zone</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.landslideProneZone)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Property falls under CR Zone</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.crZone)}</td>
                    <td className="border font-bold" colSpan="2">Property falls under Demolition Risk</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.demolitionRisk)}</td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">Demolition Risk Details</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.demolitionRiskDetails)}</td>
                    <td className="border font-bold" colSpan="2">Property Follows NDMA Guidelines</td>
                    <td className="border text-center" colSpan="1">{val(reportData?.followsNDMAGuidelines)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 7 — BOUNDARIES & DIMENSIONS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">7</th>
                    <th colSpan="5" className={sectionHead}>Boundaries and Dimensions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border" colSpan="2">Boundaries</td>
                    {/* Direction headers */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Directions</td></tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}><td className="border px-2 font-bold">{d}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    {/* As per documents */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border text-center font-bold">As per documents</td></tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border text-center font-bold">
                                {val(reportData?.directions?.[d]?.document)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    {/* As per site */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">As per site</td></tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border px-2 font-bold">
                                {val(reportData?.directions?.[d]?.actual)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    {/* As per plan */}
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">As per plan</td></tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border px-2 font-bold">
                                {val(reportData?.directions?.[d]?.plan)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">Boundaries Matching?</td>
                    <td colSpan="1" className="border px-4">{val(reportData?.boundariesMatching)}</td>
                    <td colSpan="2" className="border px-4">Property Demarcated?</td>
                    <td colSpan="1" className="border px-4">{val(reportData?.propertyDemarcated)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">Boundary Remarks in Detail</td>
                    <td colSpan="4" className="border px-4">{val(reportData?.boundaryRemarks)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">
                      Marketability <span className="text-blue-500">{"{Good / Average / Poor}"}</span>
                    </td>
                    <td colSpan="4" className="border px-4">{val(reportData?.marketability)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 8 — STRUCTURAL DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">8</th>
                    <th colSpan="5" className={sectionHead}>Structural Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      <span>Type of structure</span><br />
                      <span className="text-blue-500">{"{RCC / Load bearing}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.typeOfStructure)}</td>
                    <td colSpan="2" className="border">
                      <span>Type of roof</span><br />
                      <span className="text-blue-500">
                        {"{ACC Sheet/ Stone Patti/ Tin Sheet/ Terracotta Tiles, Thatch roof}"}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.typeOfRoof)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">No. of floors permissible</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.noOfFloorsPermissible)}</td>
                    <td colSpan="2" className="border">No. of floors – Actual</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.noOfFloorsActual)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">No. of units/flats on each floor</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.noOfUnitFlatOnEachFloor)}</td>
                    <td colSpan="2" className="border">
                      <span>Quality of construction</span>
                      <span className="text-blue-500"> {"{Good / Avg./ Poor}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.qualityOfConstruction)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">Age of property</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.approxAgeOfProperty)}</td>
                    <td colSpan="2" className="border">Residual age</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.residualAge)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">Land Area</td>
                    <td colSpan="2" className="border text-center">{val(reportData?.landArea)}</td>
                    <td colSpan="1" className="border">Linear Dimension</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.linearDimension)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 9 — VIOLATION OBSERVED
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">9</th>
                    <th colSpan="5" className={sectionHead}>Violation Observed (if any)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">Demolition risk due to violation?</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.demolitionRisk)}</td>
                    <td colSpan="2" className="border">Remarks</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.demolitionDetails)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">Encroachment of land?</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.encroachment)}</td>
                    <td colSpan="2" className="border">Remarks</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.encroachmentDetails)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">Deviation to Plan?</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.deviationToPlan)}</td>
                    <td colSpan="2" className="border">Remarks</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.deviationDetails)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 10 — VALUATION
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">10</th>
                    <th colSpan="5" className={sectionHead}>Valuation</th>
                  </tr>
                </thead>
                <tbody>
                  {/* ── Land ── */}
                  <tr>
                    <td className="border" colSpan="2">Land</td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">As per</td></tr>
                          <tr><td className="border px-2 font-bold">Document (L1)</td></tr>
                          <tr><td className="border px-2 font-bold">Plan (L2)</td></tr>
                          <tr><td className="border px-2 font-bold">Site (L3)</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border text-center font-bold">Area</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.landDocumentArea, 0)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.landPlanArea, 0)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.landSiteArea, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Rate per sq.ft</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landDocumentRate, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landPlanRate, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landSiteRate, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Valuation</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landDocumentValuation, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landPlanValuation, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.landSiteValuation, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* ── Construction ── */}
                  <tr>
                    <td className="border" colSpan="2">Construction</td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">As per</td></tr>
                          <tr><td className="border px-2 font-bold">Document (L1)</td></tr>
                          <tr><td className="border px-2 font-bold">Plan (L2)</td></tr>
                          <tr><td className="border px-2 font-bold">Site (L3)</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border text-center font-bold">Area</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.constructionDocumentArea, 0)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.constructionPlanArea, 0)}</td></tr>
                          <tr><td className="border text-center font-bold">{val(reportData?.constructionSiteArea, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Rate per sq.ft</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionDocumentRate, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionPlanRate, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionSiteRate, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr><td className="border px-2 font-bold">Valuation</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionDocumentValuation, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionPlanValuation, 0)}</td></tr>
                          <tr><td className="border px-2 font-bold">{val(reportData?.constructionSiteValuation, 0)}</td></tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* ── Amenities ── */}
                  <tr>
                    <td colSpan="2" className="border">
                      Amenities <span className="text-blue-500">{"{Mention details}"}</span>
                    </td>
                    <td colSpan="2" className="border text-center">{val(reportData?.amenitiesDetails)}</td>
                    <td colSpan="1" className="border">Value of amenities (A)</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.amenitiesValue)}</td>
                  </tr>

                  {/* ── Lift / Height ── */}
                  <tr>
                    <td colSpan="2" className="border">
                      Lift Available? <span className="text-blue-500">{"{Yes/ No}"}</span>
                    </td>
                    <td colSpan="2" className="border text-center">{val(reportData?.liftAvailable)}</td>
                    <td colSpan="1" className="border">
                      Height of the building<br />
                      <span className="text-blue-500">{"{in Meters}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.buildingHeight)}</td>
                  </tr>

                  {/* ── Realizable Value ── */}
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Realizable Value after completion <span>{"{L3 + C3 + A}"}</span>
                    </td>
                    <td className="border text-center">{val(reportData?.realizableValue)}</td>
                  </tr>

                  {/* ── Construction Stage ── */}
                  <tr>
                    <td colSpan="3" className="border p-1">
                      Construction Stage<br />
                      <span className="text-blue-500">
                        {`{Foundation/Plinth/Brick Work/RCC/Plaster/Tiling/Internal Finishing/Completed}`}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">{val(reportData?.constructionStage)}</td>
                    <td colSpan="1" className="border">Construction %</td>
                    <td colSpan="1" className="border text-center">{val(reportData?.constructionStatus)}</td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="border p-1">Valuation at current stage</td>
                    <td className="border text-center">{val(reportData?.ValuationatPresentStage)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Valuation as per Govt. guideline <span>{"{L3+C3+A}"}</span>
                    </td>
                    <td className="border text-center">{val(reportData?.ValuationasperGovtGuideline)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Construction estimate shared by customer <span>{"{L3+C3+A}"}</span>
                    </td>
                    <td className="border text-center">{val(reportData?.constructionEstimateByCustomer)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">Estimate recommended (by valuer)</td>
                    <td className="border text-center">{val(reportData?.estimateRecommendedByValuer)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Market rate for similar properties in the locality (Rs/sq.ft)
                    </td>
                    <td className="border text-center">{val(reportData?.marketRatePerSqft)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Whether construction is as per plan / permission / building by laws
                    </td>
                    <td className="border text-center">{val(reportData?.constructionAsPerPlan)}</td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 11 — OBSERVATIONS / REMARKS
                    14 default remarks from Word doc, DB data se auto-filled
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">11</th>
                    <th colSpan="5" className={sectionHead}>Observations Remark:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" className="border p-3">
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        {userRemarks.map((remark, idx) => (
                          <li key={idx} className="py-0.5 leading-snug">{remark}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 11b — ANALYSIS (Word doc ke questions + DB answers)
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]"></th>
                    <th colSpan="5" className="text-orange-600 bg-orange-50 text-start border border-black font-bold px-2">
                      Analysis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" className="border p-3">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {[
                            {
                              q: "As per doc plot area",
                              a: val(reportData?.landArea)
                                + (reportData?.linearDimension ? ` (${reportData.linearDimension})` : ""),
                            },
                            {
                              q: "What is land uses of property",
                              a: val(reportData?.usageOfProperty),
                            },
                            {
                              q: "The property is Leasehold or Freehold",
                              a: "As per documents available at site",
                            },
                            {
                              q: "What is the issue in this property",
                              a: [
                                reportData?.deviationToPlan === "Yes" && `Deviation to plan: ${val(reportData?.deviationDetails)}`,
                                reportData?.demolitionRisk && reportData?.demolitionRisk !== "No" && `Demolition risk: ${val(reportData?.demolitionRisk)}`,
                                reportData?.encroachment === "Yes" && `Encroachment: ${val(reportData?.encroachmentDetails)}`,
                              ].filter(Boolean).join("; ") || "No major issues observed",
                            },
                            {
                              q: "What is uses of this property",
                              a: `${val(reportData?.unitType)} — ${val(reportData?.usageOfProperty)}`,
                            },
                            {
                              q: "Which kind of documents I received",
                              a: reportData?.documents?.length > 0
                                ? reportData.documents
                                  .filter((d) => d.approvingAuthority && d.approvingAuthority !== "No")
                                  .map((d) => `${d.type} (${d.approvingAuthority})`)
                                  .join(", ") || "Documents available"
                                : val(reportData?.documentsAvailable),
                            },
                          ].map(({ q, a }, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="border px-3 py-2 bg-orange-50 font-semibold text-orange-700 w-[40%]">
                                {q}
                              </td>
                              <td className="border px-3 py-2 text-gray-800">
                                {a}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 12 — PROPERTY PHOTOS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">12</th>
                    <th colSpan="5" className={sectionHead}>Property Photos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-4 font-semibold" colSpan="6">
                      {sortedImages.length === 0 ? (
                        <p className="text-gray-500 p-2">No images uploaded.</p>
                      ) : (
                        <ReactSortable
                          list={sortedImages}
                          setList={setSortedImages}
                          className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-2"
                          animation={200}
                        >
                          {sortedImages.map((item, index) => (
                            <div
                              key={item.id}
                              className="overflow-hidden border p-1 cursor-pointer"
                              onClick={() => handleImageClick(item?.url?.url)}
                            >
                              <img
                                src={item?.url?.url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-80 object-cover object-bottom"
                              />
                            </div>
                          ))}
                        </ReactSortable>
                      )}
                    </td>
                  </tr>
                </tbody>

                {/* ── LOCATION ── */}
                <tbody>
                  <tr>
                    <td className="bg-[#F0F8FF]"></td>
                    <td className="border text-start border-black font-bold px-4 bg-[#FDE9D9] text-red-500" colSpan="5">
                      LOCATION
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-4 font-semibold">Geo-Coordinates</td>
                    <td className="border px-4 text-center" colSpan="1">
                      <b>Latitude</b>
                    </td>
                    <td colSpan="1">{val(reportData?.latitude)}</td>
                    <td className="border px-4 text-center" colSpan="1">
                      <b>Longitude</b>
                    </td>
                    <td colSpan="2">{val(reportData?.longitude)}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#F0F8FF]"></td>
                    <td colSpan="5" className="border border-black">
                      {reportData?.latitude && reportData?.longitude ? (
                        <iframe
                          width="100%"
                          height="300"
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps?q=${reportData.latitude},${reportData.longitude}&hl=es;z=14&output=embed`}
                          title="location-map"
                        />
                      ) : (
                        <p className="text-center text-gray-500 p-4">Coordinates not available</p>
                      )}
                    </td>
                  </tr>
                </tbody>

              </table>
              <div className="print-footer opacity-0">Unique Engineering and Associate</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Modal ── */}
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



// import { useParams } from "react-router-dom";
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import FileDownload from "../../components/FileDownload";
// import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
// import { ReactSortable } from "react-sortablejs";
// import moment from "moment";

// const HFBankDetails = () => {
//   const CPANEL = import.meta.env.VITE_API_URL;
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const reportRef = useRef();
//   const { singleBank } = useSelector((state) => state.hfBanks);
//   const reportData = singleBank;

//   useEffect(() => {
//     if (id) dispatch(fetchHFBankById(id));
//   }, [id, dispatch]);

//   const userRemarks = Array.isArray(reportData?.valuationRemarks)
//     ? reportData.valuationRemarks
//     : reportData?.valuationRemarks
//       ? [reportData.valuationRemarks]
//       : [];

//   const [sortedImages, setSortedImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);

//   useEffect(() => {
//     if (reportData?.imageUrls?.length > 0) {
//       const updated = reportData.imageUrls.map((url, index) => ({
//         id: index + 1,
//         url,
//       }));
//       setSortedImages(updated);
//     }
//   }, [reportData?.imageUrls]);

//   const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
//   const closeModal = () => setSelectedImage(null);

//   // Helper: show value or fallback
//   const val = (v, fallback = "—") => (v !== undefined && v !== null && v !== "" ? v : fallback);

//   // Format date
//   const formatDate = (d) => {
//     if (!d) return "—";
//     const m = moment(d);
//     return m.isValid() ? m.format("DD.MM.YYYY") : d;
//   };

//   // Documents plan table rows config (matches PDF Section 5)
//   const planDocs = [
//     { label: "NA Conversion Order", hint: "{Yes, No, NA}", planLabel: "NA Order Number/Date" },
//     { label: "Layout Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
//     { label: "Building Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
//     { label: "Commencement Certificate", hint: "{TP, ZP, GP}", planLabel: "Plan Number/Date" },
//     { label: "Occupancy/Completion/Building Usage Certificate", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
//     { label: "Sub Plotting Plan", hint: "{TP, ZP, GP, Licensed Surveyor}", planLabel: "Plan Number/Date" },
//   ];

//   const thStyle = { backgroundColor: "#EFF6FF" };
//   const sectionHead = "text-red-500 bg-[#FDE9D9] text-start border border-black font-bold px-2";

//   return (
//     <div className="container mx-auto p-4">
//       <FileDownload data={reportData} tableId="reportTable" />

//       <div id="report" ref={reportRef} className="valuation-report">
//         <div className="p-3 bg-white shadow border" id="reportTable">
//           <div
//             id="print-section"
//             className="bg-white shadow-md mt-1 rounded-lg overflow-hidden flex"
//           >
//             <div className="flex-1 overflow-x-auto">
//               <table className="w-full border-collapse border">

//                 {/* ── HEADER ── */}
//                 <thead>
//                   <tr className="border">
//                     <th colSpan="6" className="py-1 text-center">
//                       <img src="/assets/images/header1.jpg" alt="" />
//                       <h1 className="text-center text-xl">VALUATION REPORT</h1>
//                     </th>
//                   </tr>
//                 </thead>

//                 {/* ══════════════════════════════════════════
//                     SECTION 1 — GENERAL DETAILS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="text-start pl-2 w-[10px]" style={thStyle}>1</th>
//                     <th colSpan="5" className={sectionHead}>GENERAL DETAILS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold bg-blue-50">Vendor Name:</td>
//                     <td colSpan="5" className="border font-bold bg-blue-50 text-center">
//                       <p className="text-blue-500">UNIQUE ENGINEERING AND ASSOCIATE</p>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Loan Account No. (LAI)</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.refNo)}</td>
//                     <td className="border font-bold" colSpan="1">Date</td>
//                     <td className="border text-center" colSpan="2">{formatDate(reportData?.dateOfReport)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Pin Code</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.projectPinCode)}</td>
//                     <td className="border font-bold" colSpan="1">Geo Coord</td>
//                     <td className="border text-center" colSpan="2">
//                       {reportData?.latitude && reportData?.longitude
//                         ? `${reportData.latitude}, ${reportData.longitude}`
//                         : "—"}
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 2 — PROPERTY OVERVIEW
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="text-start pl-1 w-[10px] border" style={thStyle}>2</th>
//                     <th colSpan="5" className={sectionHead}>Property Overview</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span className="font-bold">Property Category</span><br />
//                       <span className="text-blue-500">{"{Project/ Individual}"}</span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.propertyCategory)}</td>
//                     <td colSpan="2" className="border">
//                       <span className="font-bold">Property Type</span><br />
//                       <span className="text-blue-500">{"{Apartment, Row House, Individual House, Shop, Office, Industrial}"}</span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.unitType)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Type of Loan</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.typeOfLoan)}</td>
//                     <td colSpan="2" className="border font-bold">Property Location</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.propertyLocation)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Population as per Census 2011</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.populationCensus2011)}</td>
//                     <td colSpan="2" className="border font-bold">Rural / Urban {`(> 10k = Urban)`}</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.ruralUrban)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Zone</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.zone)}</td>
//                     <td colSpan="2" className="border font-bold">Property Area Limits</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.propertyAreaLimits)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span className="font-bold">RERA No.</span>
//                       <span className="text-blue-500"> {"{If applicable}"}</span>
//                     </td>
//                     <td colSpan="4" className="border text-center">{val(reportData?.eraApplicable)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 3 — VISIT DETAILS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF] pl-1 text-start">3</th>
//                     <th colSpan="5" className={sectionHead}>Visit Details</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Applicant Name</td>
//                     <td className="border text-center" colSpan="2">{val(reportData?.customerName)}</td>
//                     <td className="border font-bold" colSpan="1">Mobile No.</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.customerNo)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border font-bold">Person Met At Site</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.personMetDuringVisit)}</td>
//                     <td colSpan="2" className="border font-bold">Relationship of person met and property</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.relationshipOfPersonMet)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="1">Property Owner's Name</td>
//                     <td className="border text-center whitespace-pre-line" colSpan="2">{val(reportData?.propertyOwnerName)}</td>
//                     <td className="border font-bold" colSpan="2">How did you find out property owner's name?</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.howFoundOwnerName)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Property Documents Available?</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.documentsAvailable)}</td>
//                     <td className="border font-bold" colSpan="2">Name on Society Board/Signage</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.nameOnSocietyBoard)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Address as per legal document</td>
//                     <td className="border text-center" colSpan="4">{val(reportData?.addressLegal)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Address of Property (As per site)</td>
//                     <td className="border text-center" colSpan="4">{val(reportData?.addressSite)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Name on door of the premises</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.nameOnDoor)}</td>
//                     <td className="border font-bold" colSpan="2">Nearby landmark {`[within 500m]`}</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.nearbyLandmark)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Occupancy</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.statusOfOccupancy)}</td>
//                     <td className="border font-bold" colSpan="2">Occupied by</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.occupiedBy)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Usage</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.usageOfProperty)}</td>
//                     <td className="border font-bold" colSpan="2">Property easily identifiable?</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.propertyEasilyIdentifiable)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 4 — LOCALITY
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">4</th>
//                     <th colSpan="5" className={sectionHead}>Locality</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Nearest City/Town</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.nearestCityTown)}</td>
//                     <td className="border font-bold" colSpan="2">
//                       Location Category <span className="text-blue-500">{"{TP / ZP / GP}"}</span>
//                     </td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.locationCategory)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Distance of property from city centre</td>
//                     <td className="border text-center">{val(reportData?.distanceFromCityCentre)}</td>
//                     <td className="border text-center font-bold">Distance from:</td>
//                     {/* nested distance labels */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Railway Stn</td></tr>
//                           <tr><td className="border px-2 font-bold">Bus Stand</td></tr>
//                           <tr><td className="border px-2 font-bold">Hospital</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     {/* nested distance values */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border text-center font-bold">{val(reportData?.distanceFromRailwayStation)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.distanceFromBusStand)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.distanceFromHospital)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">Approach Road Width</span>
//                       <span className="text-blue-500"> {"{In Feet}"}</span>
//                     </td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.approachRoadWidth)}</td>
//                     <td className="border font-bold" colSpan="2">Approach Road Type</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.approachRoadType)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Occupancy in Project</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.occupancyPercentage)}</td>
//                     <td className="border font-bold" colSpan="2">Habitation of nearby area</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.habitationPercentage)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border" colSpan="2">
//                       <span className="font-bold">Negative Markers If Any</span><br />
//                       <span className="text-blue-500">{"{HT Wire, Nallah, River, Lake, Road Widening}"}</span>
//                     </td>
//                     <td className="border text-center">{val(reportData?.nallahRiverHighTension)}</td>
//                     <td className="border text-center font-bold">Availability :</td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Electricity</td></tr>
//                           <tr><td className="border px-2 font-bold">Water</td></tr>
//                           <tr><td className="border px-2 font-bold">Drainage</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border text-center font-bold">{val(reportData?.electricityAvailability)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.waterAvailability)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.drainageAvailability)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 5 — PROPERTY PLAN
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">5</th>
//                     <th colSpan="5" className={sectionHead}>Property Plan</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {planDocs.map((planRow, idx) => {
//                     const saved = reportData?.documents?.find((d) => d.type === planRow.label) || {};
//                     return (
//                       <tr key={idx}>
//                         <td className="border" colSpan="2">
//                           <span className="font-bold">{planRow.label}</span><br />
//                           <span className="text-blue-500">{planRow.hint}</span>
//                         </td>
//                         <td className="border text-center" colSpan="1">{val(saved.approvingAuthority)}</td>
//                         <td className="border font-bold" colSpan="1">{planRow.planLabel}</td>
//                         <td className="border text-center" colSpan="1">{val(saved.approvalDate)}</td>
//                         <td className="border text-center" colSpan="1">{val(saved.approvalDetails)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 6 — NDMA GUIDELINES
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">6</th>
//                     <th colSpan="5" className={sectionHead}>NDMA Guidelines</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Property falls under Seismic Zone</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.seismicZone)}</td>
//                     <td className="border font-bold" colSpan="2">Property falls under Flood Zone</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.floodZone)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Property falls under Cyclone Zone</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.cycloneZone)}</td>
//                     <td className="border font-bold" colSpan="2">Property falls under Landslide Prone Zone</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.landslideProneZone)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Property falls under CR Zone</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.crZone)}</td>
//                     <td className="border font-bold" colSpan="2">Property falls under Demolition Risk</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.demolitionRisk)}</td>
//                   </tr>
//                   <tr>
//                     <td className="border font-bold" colSpan="2">Demolition Risk Details</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.demolitionRiskDetails)}</td>
//                     <td className="border font-bold" colSpan="2">Property Follows NDMA Guidelines</td>
//                     <td className="border text-center" colSpan="1">{val(reportData?.followsNDMAGuidelines)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 7 — BOUNDARIES & DIMENSIONS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">7</th>
//                     <th colSpan="5" className={sectionHead}>Boundaries and Dimensions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border" colSpan="2">Boundaries</td>
//                     {/* Direction headers */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Directions</td></tr>
//                           {["North", "South", "East", "West"].map((d) => (
//                             <tr key={d}><td className="border px-2 font-bold">{d}</td></tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                     {/* As per documents */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border text-center font-bold">As per documents</td></tr>
//                           {["North", "South", "East", "West"].map((d) => (
//                             <tr key={d}>
//                               <td className="border text-center font-bold">
//                                 {val(reportData?.directions?.[d]?.document)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                     {/* As per site */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">As per site</td></tr>
//                           {["North", "South", "East", "West"].map((d) => (
//                             <tr key={d}>
//                               <td className="border px-2 font-bold">
//                                 {val(reportData?.directions?.[d]?.actual)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                     {/* As per plan */}
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">As per plan</td></tr>
//                           {["North", "South", "East", "West"].map((d) => (
//                             <tr key={d}>
//                               <td className="border px-2 font-bold">
//                                 {val(reportData?.directions?.[d]?.plan)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border px-4">Boundaries Matching?</td>
//                     <td colSpan="1" className="border px-4">{val(reportData?.boundariesMatching)}</td>
//                     <td colSpan="2" className="border px-4">Property Demarcated?</td>
//                     <td colSpan="1" className="border px-4">{val(reportData?.propertyDemarcated)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border px-4">Boundary Remarks in Detail</td>
//                     <td colSpan="4" className="border px-4">{val(reportData?.boundaryRemarks)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border px-4">
//                       Marketability <span className="text-blue-500">{"{Good / Average / Poor}"}</span>
//                     </td>
//                     <td colSpan="4" className="border px-4">{val(reportData?.marketability)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 8 — STRUCTURAL DETAILS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">8</th>
//                     <th colSpan="5" className={sectionHead}>Structural Details</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan="2" className="border">
//                       <span>Type of structure</span><br />
//                       <span className="text-blue-500">{"{RCC / Load bearing}"}</span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.typeOfStructure)}</td>
//                     <td colSpan="2" className="border">
//                       <span>Type of roof</span><br />
//                       <span className="text-blue-500">
//                         {"{ACC Sheet/ Stone Patti/ Tin Sheet/ Terracotta Tiles, Thatch roof}"}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.typeOfRoof)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">No. of floors permissible</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.noOfFloorsPermissible)}</td>
//                     <td colSpan="2" className="border">No. of floors – Actual</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.noOfFloorsActual)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">No. of units/flats on each floor</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.noOfUnitFlatOnEachFloor)}</td>
//                     <td colSpan="2" className="border">
//                       <span>Quality of construction</span>
//                       <span className="text-blue-500"> {"{Good / Avg./ Poor}"}</span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.qualityOfConstruction)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">Age of property</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.approxAgeOfProperty)}</td>
//                     <td colSpan="2" className="border">Residual age</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.residualAge)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">Land Area</td>
//                     <td colSpan="2" className="border text-center">{val(reportData?.landArea)}</td>
//                     <td colSpan="1" className="border">Linear Dimension</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.linearDimension)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 9 — VIOLATION OBSERVED
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">9</th>
//                     <th colSpan="5" className={sectionHead}>Violation Observed (if any)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan="2" className="border">Demolition risk due to violation?</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.demolitionRisk)}</td>
//                     <td colSpan="2" className="border">Remarks</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.demolitionDetails)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">Encroachment of land?</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.encroachment)}</td>
//                     <td colSpan="2" className="border">Remarks</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.encroachmentDetails)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="2" className="border">Deviation to Plan?</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.deviationToPlan)}</td>
//                     <td colSpan="2" className="border">Remarks</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.deviationDetails)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 10 — VALUATION
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">10</th>
//                     <th colSpan="5" className={sectionHead}>Valuation</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* ── Land ── */}
//                   <tr>
//                     <td className="border" colSpan="2">Land</td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">As per</td></tr>
//                           <tr><td className="border px-2 font-bold">Document (L1)</td></tr>
//                           <tr><td className="border px-2 font-bold">Plan (L2)</td></tr>
//                           <tr><td className="border px-2 font-bold">Site (L3)</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border text-center font-bold">Area</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.landDocumentArea, 0)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.landPlanArea, 0)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.landSiteArea, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Rate per sq.ft</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landDocumentRate, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landPlanRate, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landSiteRate, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Valuation</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landDocumentValuation, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landPlanValuation, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.landSiteValuation, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>

//                   {/* ── Construction ── */}
//                   <tr>
//                     <td className="border" colSpan="2">Construction</td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">As per</td></tr>
//                           <tr><td className="border px-2 font-bold">Document (L1)</td></tr>
//                           <tr><td className="border px-2 font-bold">Plan (L2)</td></tr>
//                           <tr><td className="border px-2 font-bold">Site (L3)</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border text-center font-bold">Area</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.constructionDocumentArea, 0)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.constructionPlanArea, 0)}</td></tr>
//                           <tr><td className="border text-center font-bold">{val(reportData?.constructionSiteArea, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Rate per sq.ft</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionDocumentRate, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionPlanRate, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionSiteRate, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                     <td className="border p-0">
//                       <table className="w-full border-collapse">
//                         <tbody>
//                           <tr><td className="border px-2 font-bold">Valuation</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionDocumentValuation, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionPlanValuation, 0)}</td></tr>
//                           <tr><td className="border px-2 font-bold">{val(reportData?.constructionSiteValuation, 0)}</td></tr>
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>

//                   {/* ── Amenities ── */}
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Amenities <span className="text-blue-500">{"{Mention details}"}</span>
//                     </td>
//                     <td colSpan="2" className="border text-center">{val(reportData?.amenitiesDetails)}</td>
//                     <td colSpan="1" className="border">Value of amenities (A)</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.amenitiesValue)}</td>
//                   </tr>

//                   {/* ── Lift / Height ── */}
//                   <tr>
//                     <td colSpan="2" className="border">
//                       Lift Available? <span className="text-blue-500">{"{Yes/ No}"}</span>
//                     </td>
//                     <td colSpan="2" className="border text-center">{val(reportData?.liftAvailable)}</td>
//                     <td colSpan="1" className="border">
//                       Height of the building<br />
//                       <span className="text-blue-500">{"{in Meters}"}</span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.buildingHeight)}</td>
//                   </tr>

//                   {/* ── Realizable Value ── */}
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Realizable Value after completion <span>{"{L3 + C3 + A}"}</span>
//                     </td>
//                     <td className="border text-center">{val(reportData?.realizableValue)}</td>
//                   </tr>

//                   {/* ── Construction Stage ── */}
//                   <tr>
//                     <td colSpan="3" className="border p-1">
//                       Construction Stage<br />
//                       <span className="text-blue-500">
//                         {`{Foundation/Plinth/Brick Work/RCC/Plaster/Tiling/Internal Finishing/Completed}`}
//                       </span>
//                     </td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.constructionStage)}</td>
//                     <td colSpan="1" className="border">Construction %</td>
//                     <td colSpan="1" className="border text-center">{val(reportData?.constructionStatus)}</td>
//                   </tr>

//                   <tr>
//                     <td colSpan="5" className="border p-1">Valuation at current stage</td>
//                     <td className="border text-center">{val(reportData?.ValuationatPresentStage)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Valuation as per Govt. guideline <span>{"{L3+C3+A}"}</span>
//                     </td>
//                     <td className="border text-center">{val(reportData?.ValuationasperGovtGuideline)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Construction estimate shared by customer <span>{"{L3+C3+A}"}</span>
//                     </td>
//                     <td className="border text-center">{val(reportData?.constructionEstimateByCustomer)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">Estimate recommended (by valuer)</td>
//                     <td className="border text-center">{val(reportData?.estimateRecommendedByValuer)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Market rate for similar properties in the locality (Rs/sq.ft)
//                     </td>
//                     <td className="border text-center">{val(reportData?.marketRatePerSqft)}</td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5" className="border p-1">
//                       Whether construction is as per plan / permission / building by laws
//                     </td>
//                     <td className="border text-center">{val(reportData?.constructionAsPerPlan)}</td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 11 — OBSERVATIONS / REMARKS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">11</th>
//                     <th colSpan="5" className={sectionHead}>Observations Remark:</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td colSpan="6" className="border p-2">
//                       {userRemarks.length > 0 ? (
//                         <ol className="list-decimal pl-5">
//                           {userRemarks.map((remark, idx) => (
//                             <li key={idx}>{remark}</li>
//                           ))}
//                         </ol>
//                       ) : (
//                         <p className="text-gray-400 italic">No remarks added.</p>
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ══════════════════════════════════════════
//                     SECTION 12 — PROPERTY PHOTOS
//                 ══════════════════════════════════════════ */}
//                 <thead>
//                   <tr>
//                     <th className="bg-[#F0F8FF]">12</th>
//                     <th colSpan="5" className={sectionHead}>Property Photos</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="border border-black px-4 font-semibold" colSpan="6">
//                       {sortedImages.length === 0 ? (
//                         <p className="text-gray-500 p-2">No images uploaded.</p>
//                       ) : (
//                         <ReactSortable
//                           list={sortedImages}
//                           setList={setSortedImages}
//                           className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-2"
//                           animation={200}
//                         >
//                           {sortedImages.map((item, index) => (
//                             <div
//                               key={item.id}
//                               className="overflow-hidden border p-1 cursor-pointer"
//                               onClick={() => handleImageClick(item?.url?.url)}
//                             >
//                               <img
//                                 src={item?.url?.url}
//                                 alt={`Image ${index + 1}`}
//                                 className="w-full h-80 object-cover object-bottom"
//                               />
//                             </div>
//                           ))}
//                         </ReactSortable>
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>

//                 {/* ── LOCATION ── */}
//                 <tbody>
//                   <tr>
//                     <td className="bg-[#F0F8FF]"></td>
//                     <td className="border text-start border-black font-bold px-4 bg-[#FDE9D9] text-red-500" colSpan="5">
//                       LOCATION
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="border border-black px-4 font-semibold">Geo-Coordinates</td>
//                     <td className="border px-4 text-center" colSpan="1">
//                       <b>Latitude</b>
//                     </td>
//                     <td colSpan="1">{val(reportData?.latitude)}</td>
//                     <td className="border px-4 text-center" colSpan="1">
//                       <b>Longitude</b>
//                     </td>
//                     <td colSpan="2">{val(reportData?.longitude)}</td>
//                   </tr>
//                   <tr>
//                     <td className="bg-[#F0F8FF]"></td>
//                     <td colSpan="5" className="border border-black">
//                       {reportData?.latitude && reportData?.longitude ? (
//                         <iframe
//                           width="100%"
//                           height="300"
//                           loading="lazy"
//                           allowFullScreen
//                           src={`https://www.google.com/maps?q=${reportData.latitude},${reportData.longitude}&hl=es;z=14&output=embed`}
//                           title="location-map"
//                         />
//                       ) : (
//                         <p className="text-center text-gray-500 p-4">Coordinates not available</p>
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>

//               </table>
//               <div className="print-footer opacity-0">Unique Engineering and Associate</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Image Modal ── */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
//           onClick={closeModal}
//         >
//           <div className="relative max-w-5xl max-h-full">
//             <button
//               className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 z-10"
//               onClick={closeModal}
//             >
//               &times;
//             </button>
//             <img
//               src={selectedImage}
//               alt="Enlarged view"
//               className="max-w-full max-h-full object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HFBankDetails;