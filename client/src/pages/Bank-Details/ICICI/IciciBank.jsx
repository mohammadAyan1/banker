// // IciciBank.jsx
// import React, { useEffect, useState } from "react";
// import { Spin } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createIciciBank,
//   getIciciBankById,
//   updateIciciBank,
//   submitIciciBank,
// } from "../../../redux/features/Banks/IciciBank/iciciBankThunk";
// import { finalUpdate } from "../../../redux/features/case/caseThunks";

// import PropertyDetailsForm from "../../Bank-Details/ICICI/PropertyDetailsForm";
// import MaintenanceBoundariesForm from "../../Bank-Details/ICICI/MaintenanceBoundariesForm";
// import AmenitiesForm from "../../Bank-Details/ICICI/AmenitiesForm";
// import CautionAreaForm from "../../Bank-Details/ICICI/CautionAreaForm";
// import RealizableValueForm from "../../Bank-Details/ICICI/RealizableValueForm";
// import ConstructionProgressForm from "../../Bank-Details/ICICI/ConstructionProgressForm";
// import DistanceRangeForm from "../../Bank-Details/ICICI/DistanceRangeForm";
// import SitePhotographsForm from "../../Bank-Details/ICICI/SitePhotographsForm";
// import RemarksForm from "../../Bank-Details/ICICI/RemarksForm";

// import toast from "react-hot-toast";

// const Icon = ({ children }) => (
//   <svg
//     width="52"
//     height="52"
//     viewBox="0 0 64 64"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.4"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     {children}
//   </svg>
// );

// const cardIcons = {
//   propertyDetails: (
//     <Icon>
//       <path d="M12 30 L32 14 L52 30" />
//       <path d="M18 28 V52 H46 V28" />
//       <path d="M27 52 V38 H37 V52" />
//       <rect x="8" y="22" width="10" height="30" rx="1" />
//       <path d="M8 22 L18 14 L18 22" />
//     </Icon>
//   ),

//   maintenanceBoundaries: (
//     <Icon>
//       <path d="M10 22 H54" />
//       <path d="M10 34 H54" />
//       <path d="M10 46 H54" />
//       <path d="M18 14 V22" />
//       <path d="M32 14 V22" />
//       <path d="M46 14 V22" />
//       <path d="M24 22 V34" />
//       <path d="M40 22 V34" />
//       <path d="M16 34 V46" />
//       <path d="M32 34 V46" />
//       <path d="M48 34 V46" />
//     </Icon>
//   ),

//   amenities: (
//     <Icon>
//       <circle cx="20" cy="26" r="7" />
//       <circle cx="44" cy="26" r="7" />
//       <circle cx="32" cy="18" r="7" />
//       <path d="M20 33 V42" />
//       <path d="M32 25 V42" />
//       <path d="M44 33 V42" />
//       <path d="M24 48 H40" />
//       <path d="M32 42 V48" />
//     </Icon>
//   ),

//   cautionArea: (
//     <Icon>
//       <rect x="20" y="10" width="24" height="42" rx="3" />
//       <path d="M32 18 L42 36 H22 Z" />
//       <path d="M32 25 V31" />
//       <path d="M32 35 H32.1" />
//       <path d="M16 16 H12 V46 H16" />
//     </Icon>
//   ),

//   realizableValue: (
//     <Icon>
//       <path d="M14 42 H50" />
//       <path d="M18 42 V28 L32 18 L46 28 V42" />
//       <path d="M27 42 V32 H37 V42" />
//       <circle cx="32" cy="15" r="8" />
//       <path d="M29 12 H36" />
//       <path d="M29 16 H35" />
//       <path d="M33 12 C37 15 33 20 29 16" />
//       <path d="M12 18 L14 15" />
//       <path d="M50 18 L52 15" />
//       <path d="M18 10 L20 7" />
//       <path d="M44 10 L46 7" />
//     </Icon>
//   ),

//   constructionProgress: (
//     <Icon>
//       <path d="M10 26 H42" />
//       <path d="M10 38 H48" />
//       <path d="M16 14 V26" />
//       <path d="M30 14 V26" />
//       <path d="M22 26 V38" />
//       <path d="M38 26 V38" />
//       <path d="M14 38 V50" />
//       <path d="M32 38 V50" />
//       <path d="M48 38 V50" />
//       <path d="M42 18 L54 10" />
//       <path d="M46 16 L52 24" />
//     </Icon>
//   ),

//   distanceRange: (
//     <Icon>
//       <path d="M24 30 C24 20 16 16 12 24 C8 32 24 48 24 48 C24 48 40 32 36 24 C32 16 24 20 24 30Z" />
//       <path d="M44 30 C44 22 38 18 34 24 C31 31 44 44 44 44 C44 44 57 31 54 24 C51 18 44 22 44 30Z" />
//       <circle cx="24" cy="28" r="3" />
//       <circle cx="44" cy="28" r="3" />
//     </Icon>
//   ),

//   sitePhotographs: (
//     <Icon>
//       <rect x="18" y="16" width="34" height="28" rx="3" />
//       <rect x="12" y="22" width="34" height="28" rx="3" />
//       <circle cx="24" cy="31" r="3" />
//       <path d="M16 46 L28 36 L36 43 L42 38 L50 46" />
//     </Icon>
//   ),

//   remarks: (
//     <Icon>
//       <rect x="18" y="12" width="30" height="40" rx="3" />
//       <path d="M25 22 H40" />
//       <path d="M25 30 H40" />
//       <path d="M25 38 H34" />
//       <circle cx="43" cy="41" r="7" />
//       <path d="M43 37 V41 L46 44" />
//     </Icon>
//   ),
// };

// const cardList = [
//   { key: "propertyDetails", label: "Property Details", icon: cardIcons.propertyDetails },
//   { key: "maintenanceBoundaries", label: "Maintenance & Boundaries", icon: cardIcons.maintenanceBoundaries },
//   { key: "amenities", label: "Amenities", icon: cardIcons.amenities },
//   { key: "cautionArea", label: "Caution Area", icon: cardIcons.cautionArea },
//   { key: "realizableValue", label: "Realizable value", icon: cardIcons.realizableValue },
//   { key: "constructionProgress", label: "Construction Progress Details", icon: cardIcons.constructionProgress },
//   { key: "distanceRange", label: "Distance Range of The Project", icon: cardIcons.distanceRange },
//   { key: "sitePhotographs", label: "Site Photographs", icon: cardIcons.sitePhotographs },
//   { key: "remarks", label: "Remarks", icon: cardIcons.remarks },
// ];

// const IciciBank = () => {
//   const [activeCard, setActiveCard] = useState("propertyDetails");
//   const [formData, setFormData] = useState({});
//   const [editData, setEditData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (id) fetchEditData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchEditData = async () => {
//     setLoading(true);
//     try {
//       const response = await dispatch(getIciciBankById(id)).unwrap();
//       setEditData(response);
//       setFormData(response);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Helper: populated MongoDB objects ko sanitize karo (sirf _id bhejo) ──
//   const sanitizeIds = (obj) => ({
//     ...obj,
//     createdBy: obj?.createdBy?._id || obj?.createdBy,
//     assignedTo: obj?.assignedTo?._id || obj?.assignedTo,
//   });

//   // ─── Save only (no navigation) ───────────────────────────────────────────
//   const handleSave = async (cardKey, data) => {
//     setSaving(true);
//     const updated = sanitizeIds({ ...formData, ...data });
//     setFormData(updated);

//     try {
//       if (id) {
//         await dispatch(updateIciciBank({ id, formData: updated })).unwrap();
//         toast.success(`${cardList.find((c) => c.key === cardKey)?.label} saved!`);
//         await fetchEditData();
//       } else {
//         toast.success("Data saved locally!");
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       toast.error("Failed to save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Save & move to NEXT card ─────────────────────────────────────────────
//   const handleSaveAndNext = async (cardKey, data) => {
//     setSaving(true);
//     const updated = sanitizeIds({ ...formData, ...data });
//     setFormData(updated);

//     try {
//       if (id) {
//         await dispatch(updateIciciBank({ id, formData: updated })).unwrap();
//         toast.success(`${cardList.find((c) => c.key === cardKey)?.label} saved!`);
//         await fetchEditData();
//       } else {
//         toast.success("Data saved locally! Fill all steps then submit.");
//       }

//       // Move to next card
//       const currentIndex = cardList.findIndex((c) => c.key === cardKey);
//       if (currentIndex < cardList.length - 1) {
//         setActiveCard(cardList[currentIndex + 1].key);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       toast.error("Failed to save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Submit: save full form, mark submitted, then open ICICI report ─────────
//   const handleSubmitForm = async (data) => {
//     setSaving(true);
//     const finalData = sanitizeIds({
//       ...formData,
//       ...data,
//       bankName: "Icici",
//       route: "icici",
//       isReportSubmitted: true,
//       approvalStatus: "Submitted",
//       status: formData?.status || "Pending",
//     });

//     try {
//       if (id) {
//         await dispatch(submitIciciBank({ id, formData: finalData })).unwrap();
//         toast.success("Report submitted successfully");
//         navigate(`/bank/icici/${id}`);
//       } else {
//         const response = await dispatch(createIciciBank(finalData)).unwrap();
//         toast.success("Report created & submitted successfully");
//         navigate(`/bank/icici/${response._id}`);
//       }
//     } catch (err) {
//       console.error("Submission failed:", err);
//       toast.error(err || "Submission failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Final Submit: admin finalizes directly from last form and opens report ──
//   const handleFinalSubmitAdmin = async (data) => {
//     setSaving(true);
//     const finalData = sanitizeIds({
//       ...formData,
//       ...data,
//       bankName: "Icici",
//       route: "icici",
//       isReportSubmitted: true,
//       approvalStatus: "Submitted",
//       status: "FinalSubmitted",
//     });

//     try {
//       if (id) {
//         await dispatch(updateIciciBank({ id, formData: finalData })).unwrap();
//         await dispatch(finalUpdate({ id, bankName: "Icici", updateData: finalData })).unwrap();
//         toast.success("Report finalized successfully");
//         navigate(`/bank/icici/${id}`);
//       } else {
//         const response = await dispatch(createIciciBank(finalData)).unwrap();
//         await dispatch(finalUpdate({ id: response._id, bankName: "Icici", updateData: finalData })).unwrap();
//         toast.success("Report created & finalized successfully");
//         navigate(`/bank/icici/${response._id}`);
//       }
//     } catch (err) {
//       console.error("Final submit failed:", err);
//       toast.error(err || "Final submit failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const renderForm = () => {
//     const commonProps = {
//       data: formData,
//       editData,
//       onSave: handleSave,
//       onSaveAndNext: handleSaveAndNext,
//       saving,
//     };

//     switch (activeCard) {
//       case "propertyDetails":
//         return <PropertyDetailsForm {...commonProps} />;

//       case "maintenanceBoundaries":
//         return <MaintenanceBoundariesForm {...commonProps} />;

//       case "amenities":
//         return <AmenitiesForm {...commonProps} />;

//       case "cautionArea":
//         return <CautionAreaForm {...commonProps} />;

//       case "realizableValue":
//         return <RealizableValueForm {...commonProps} />;

//       case "constructionProgress":
//         return <ConstructionProgressForm {...commonProps} />;

//       case "distanceRange":
//         return <DistanceRangeForm {...commonProps} />;

//       case "sitePhotographs":
//         return <SitePhotographsForm {...commonProps} />;

//       case "remarks":
//         return (
//           <RemarksForm
//             {...commonProps}
//             onSubmit={handleSubmitForm}
//             onFinalSubmit={handleFinalSubmitAdmin}
//             isAdmin={user?.role === "Admin" || user?.role === "SuperAdmin"}
//           />
//         );

//       default:
//         return (
//           <div className="min-h-[300px] flex items-center justify-center text-gray-500 text-lg">
//             {cardList.find((c) => c.key === activeCard)?.label} form coming soon
//           </div>
//         );
//     }
//   };

//   const activeIndex = cardList.findIndex((c) => c.key === activeCard);
//   const activeItem = cardList[activeIndex];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-white">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* TOP NAV */}
//       <div className="bg-white border-b border-[#e5e5e5] px-8 h-[70px] flex justify-between items-center sticky top-0 z-30">
//         <div className="flex items-center gap-8">
//           <div className="text-[24px] font-bold">
//             <span className="text-[#cf0000]">Unique</span>{" "}
//             <span className="text-[#12233f] text-[18px]">Engineering</span>
//           </div>

//           <div className="flex items-center gap-2 text-[#041b3d] border-b-2 border-[#1d4ed8] pb-1">
//             <span>⌂</span>
//             <span className="text-[15px]">Home</span>
//           </div>

//           <div className="text-[#475569] text-[15px]">▱ Application Pipeline</div>
//           <div className="text-[#475569] text-[15px]">? Help/FAQs</div>
//         </div>

//         <div className="flex items-center gap-6 text-[#334155] text-[24px]">
//           <span>⌕</span>
//           <span>🌐</span>
//           <span className="relative">
//             🔔
//             <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-[11px] rounded-full flex items-center justify-center">
//               6
//             </span>
//           </span>
//           <span>♙</span>
//         </div>
//       </div>

//       {/* APPLICATION INFO */}
//       <div className="max-w-[1550px] mx-auto px-4">
//         <div className="bg-white border-b border-[#eeeeee] px-6 py-4 flex justify-between">
//           {/* <div className="text-[16px]">
//             <span className="font-semibold text-[#061b3a]">Pooja Traders</span>
//             <span className="text-gray-400 mx-2">|</span>
//             <span className="text-[#334155]">Poojatraders125</span>
//             <span className="text-gray-400 mx-2">|</span>
//             <span className="text-[#334155]">IND-15758767</span>
//             <span className="text-gray-400 mx-2">|</span>
//             <span className="text-[#334155]">BBG</span>
//             <span className="text-gray-400 mx-2">|</span>
//             <span className="text-[#334155]">Resale (Others)</span>
//           </div> */}

         
//         </div>

//         {/* CARDS */}
//         <div className="bg-white pt-8 pb-6">
//           <div className="flex gap-8 overflow-x-auto pb-3">
//             {cardList.map((card, index) => {
//               const isActive = activeCard === card.key;

//               return (
//                 <button
//                   key={card.key}
//                   type="button"
//                   onClick={() => setActiveCard(card.key)}
//                   className={`
//                     relative w-[150px] h-[150px] shrink-0
//                     bg-white border rounded-[4px]
//                     flex flex-col items-center justify-center
//                     cursor-pointer transition-all duration-200
//                     ${isActive ? "border-[#a50000]" : "border-[#c9c9c9]"}
//                   `}
//                 >
//                   {/* Step number badge */}
//                   <span className="absolute top-[6px] left-[8px] text-[11px] text-gray-400 font-medium">
//                     {index + 1}
//                   </span>

//                   <span className="absolute top-[6px] right-[8px] text-[#f59e0b] text-[20px] leading-none">
                    
//                   </span>

//                   <div className={`mb-4 ${isActive ? "text-[#9b0000]" : "text-[#0b1d3a]"}`}>
//                     {card.icon}
//                   </div>

//                   <div
//                     className={`
//                       text-[17px] leading-[24px] text-center px-2
//                       ${isActive ? "text-[#9b0000] font-semibold" : "text-[#00133a] font-medium"}
//                     `}
//                   >
//                     {card.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* FORM AREA */}
//         <div className="bg-white border-t border-[#eeeeee] pt-6 pb-12">
//           <div className="mb-6">
//             <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <div className={activeCard === "remarks" ? "text-[#9b0000]" : "text-[#0b1d3a]"}>
//                   {activeItem?.icon}
//                 </div>
//                 <div>
//                   <h2 className="text-[22px] font-semibold text-[#9b0000]">
//                     {activeItem?.label}
//                   </h2>
//                   <p className="text-sm text-gray-500">Fill in the details below</p>
//                 </div>
//               </div>

//               <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
//                 {activeIndex + 1} of {cardList.length}
//               </span>
//             </div>

//             {renderForm()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IciciBank;