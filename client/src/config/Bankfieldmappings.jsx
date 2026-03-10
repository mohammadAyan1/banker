/**
 * ─────────────────────────────────────────────────────────────────────────────
 * bankFieldMappings.js
 *
 * CENTRALIZED FIELD MAPPING CONFIG — har bank ke liye ek jagah sab kuch.
 *
 * Pattern:
 *   { targetFormField: "extractedDataKey" | ["fallback1", "fallback2"] | fn }
 *
 * extractedData keys (AutoFillForm jo deta hai):
 *   customerName, propertyOwnerName, addressLegal, addressSite,
 *   city, projectPinCode, projectState, propertyName,
 *   dateOfReport, refNo, unitType, documentsAvailable,
 *   zone, usageOfProperty, ownershipType, numberAndDate,
 *   north/south/east/westDocument, plotArea, landArea,
 *   Dimension, linearDimension, typeOfStructure, ...
 *
 * Naya bank add karna ho to bas ek naya object add karo yahan.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// HOME FIRST — TRENCH REPORT
// ─────────────────────────────────────────────────────────────────────────────
export const TRENCH_MAPPING = {
    // Property address → site address (site wali prefer karo, legal fallback)
    propertyAddress: ["addressSite", "addressLegal", "propertyName"],

    // Date of report directly mapped
    dateOfReport: "dateOfReport",

    // Visited person name → buyer ka naam (jo property le raha hai)
    visitedPersonName: "customerName",
};

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE: IDFC BANK — add karo jab chahiye
// ─────────────────────────────────────────────────────────────────────────────
// export const IDFC_MAPPING = {
//   applicantName:   "customerName",
//   ownerName:       "propertyOwnerName",
//   siteAddress:     ["addressSite", "addressLegal"],
//   legalAddress:    ["addressLegal", "addressSite"],
//   pinCode:         "projectPinCode",
//   state:           "projectState",
//   city:            "city",
//   reportDate:      "dateOfReport",
//   docRefNo:        "refNo",
//   propertyType:    "unitType",
//   usageZone:       "zone",
//   northBoundary:   "northDocument",
//   southBoundary:   "southDocument",
//   eastBoundary:    "eastDocument",
//   westBoundary:    "westDocument",
//   plotAreaSqFt:    "plotArea",
//   dimensions:      ["Dimension", "linearDimension"],
// };

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE: BAJAJ FINSERV — custom transform example
// ─────────────────────────────────────────────────────────────────────────────
// export const BAJAJ_MAPPING = {
//   borrowerName:    "customerName",
//   propertyAddr:    ["addressSite", "addressLegal"],
//   propertyUse:     (data) => data.usageOfProperty?.toUpperCase() || null,
//   visitDate:       "dateOfReport",
//   area:            "plotArea",
// };

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE: PIRAMAL — multi-field concat example
// ─────────────────────────────────────────────────────────────────────────────
// export const PIRAMAL_MAPPING = {
//   customerFullName: "customerName",
//   fullAddress:      ["addressLegal", "addressSite"],
//   refNumber:        "refNo",
//   dateReport:       "dateOfReport",
//   propType:         "unitType",
//   plotSize:         "plotArea",
//   pinCode:          "projectPinCode",
//   stateName:        "projectState",
//   // Custom function — seller + buyer naam combine
//   partiesInvolved:  (data) => {
//     const parts = [data.propertyOwnerName, data.customerName].filter(Boolean);
//     return parts.length ? parts.join(" → ") : null;
//   },
// };