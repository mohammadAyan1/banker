// const mongoose = require("mongoose");

// const ValuationReportSchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: [
//       "Pending",
//       "Assigned",
//       "Visited",
//       "Reported",
//       "Reviewed",
//       "Approved",
//       "Rejected",
//     ],
//     default: "Pending",
//   },
//   AttachDocuments: {
//     type: [String],
//     default: [],
//   },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   timeline: {
//     status: { type: String },
//     updatedAt: { type: Date, default: Date.now },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     note: { type: String },
//   },

//   // timeline: [
//   //   {
//   //     status: { type: String },
//   //     updatedAt: { type: Date, default: Date.now },
//   //     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   //     note: { type: String },
//   //   },
//   // ],
//   route: { type: String },
//   bankName: { type: String, default: "HomeFirst" },
//   imageUrls: { type: [String], default: [] },

//   approvalStatus: { type: String, default: "Pending" },
//   isReportSubmitted: { type: Boolean, default: false },

//   customerName: { type: String },
//   approvedSubPlottingPlan: { type: String },
//   customerNo: { type: String },
//   personMetDuringVisit: { type: String },
//   personContactNo: { type: String },
//   typeOfLoan: { type: String },
//   dateOfReport: {
//     type: String,
//     default: () => new Date().toISOString().slice(0, 10),
//   },
//   refNo: { type: String },
//   evaluationType: { type: String },
//   unitType: { type: String },

//   documentsAvailable: {
//     type: String,
//   },

//   propertyName: { type: String },
//   addressLegal: { type: String },
//   addressSite: { type: String },
//   nearbyLandmark: { type: String },
//   projectPinCode: { type: String },
//   zone: { type: String },
//   projectState: { type: String },
//   nameOnSocietyBoard: { type: String },
//   nameOnDoor: { type: String },
//   latitude: { type: String },
//   longitude: { type: String },
//   populationCensus2011: { type: String },
//   ruralUrban: { type: String },
//   statusOfOccupancy: { type: String },
//   occupiedBy: { type: String },
//   usageOfProperty: { type: String },
//   eraApplicable: { type: String },
//   ownershipType: { type: String },
//   numberAndDate: { type: String },

//   document: { type: Number },
//   landAreaPlan: { type: Number },
//   landAreaSite: { type: Number },
//   landAreaGF: { type: Number },
//   builtUpAreaFF: { type: Number },
//   builtUpAreaSF: { type: Number },
//   landAreaForValuation: { type: Number },
//   landRate: { type: Number },
//   totalLandValuation: { type: Number },
//   constructionAreaForValuation: { type: Number },
//   constructionRate: { type: Number },
//   totalConstructionValuation: { type: Number },
//   fairMarketValue: { type: Number },
//   valueAfterCompletion: { type: Number },
//   presentStageValuation: { type: Number },
//   govtGuidelineValuation: { type: Number },

//   directions: {
//     North: { type: String },
//     South: { type: String },
//     East: { type: String },
//     West: { type: String },
//   },
//   boundariesMatching: { type: String },
//   plotArea: { type: Number },
//   isPropertyWithinLimit: { type: String },
//   marketability: { type: String },
//   typeOfStructure: { type: String },
//   unitFlatConfiguration: { type: String },
//   noOfFloorsPermissible: { type: String },
//   noOfUnitFlatOnEachFloor: { type: String },
//   approxAgeOfProperty: { type: Number },
//   residualAge: { type: Number },
//   liftAvailable: { type: String },
//   constructionStage: { type: String },
//   qualityOfConstruction: { type: String },
//   noOfFloorsActual: { type: String },

//   valuationRemarks: { type: String },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ValuationReportSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("HomeFirst", ValuationReportSchema);

const mongoose = require("mongoose");

const ValuationReportSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Pending",
      "Assigned",
      "Visited",
      "Reported",
      "Reviewed",
      "Approved",
      "Rejected",
      "Work in Progress",
      "FinalSubmitted",
    ],
    default: "Pending",
  },
  AttachDocuments: { type: [String], default: [] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeline: [
    {
      status: { type: String },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      note: { type: String },
    },
  ],
  route: { type: String },
  bankName: { type: String, default: "HomeFirst" },
  approvalStatus: { type: String, default: "Pending" },
  isReportSubmitted: { type: Boolean, default: false },

  customerName: { type: String },
  customerNo: { type: String },
  propertyName: { type: String },
  personMetDuringVisit: { type: String },
  personContactNo: { type: String },
  typeOfLoan: { type: String },
  dateOfReport: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
  refNo: { type: String },
  evaluationType: { type: String },
  unitType: { type: String },
  documentsAvailable: { type: String },
  imageUrls: { type: [String], default: [] },
  addressLegal: { type: String },
  addressSite: { type: String },
  nearbyLandmark: { type: String },
  projectPinCode: { type: String },
  zone: { type: String },
  projectState: { type: String },
  nameOnSocietyBoard: { type: String },
  nameOnDoor: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  populationCensus2011: { type: String },
  ruralUrban: { type: String },
  statusOfOccupancy: { type: String },
  occupiedBy: { type: String },
  usageOfProperty: { type: String },
  eraApplicable: { type: String },
  ownershipType: { type: String },
  numberAndDate: { type: String },
  city: { type: String },

  documents: [
    {
      key: { type: String },
      type: { type: String },
      approvingAuthority: { type: String },
      approvalDate: { type: String },
      approvalDetails: { type: String },
      file: { type: mongoose.Schema.Types.Mixed },
    },
  ],

  localityDevelopment: { type: String },
  approachRoadType: { type: String },
  approachRoadWidth: { type: String },
  distanceFromCityCentre: { type: String },
  distanceFromRailwayStation: { type: String },
  distanceFromBusStand: { type: String },
  distanceFromHospital: { type: String },
  occupancyPercentage: { type: String },
  habitationPercentage: { type: String },
  proposedRoadWidening: { type: String },
  cityCentreName: { type: String },
  drainageConnection: { type: String },
  waterElectricityConnection: { type: String },
  nallahRiverHighTension: { type: String },
  seismicZone: { type: String },
  cycloneZone: { type: String },
  landslideProneZone: { type: String },
  degreeOfRisk: { type: String },
  floodZone: { type: String },
  crZone: { type: String },
  followsNDMAGuidelines: { type: String },
  demolitionRisk: { type: String },
  ifQualityPoor: {type: String},
  internalComposition: { type: String },
  openPlot: { type: String,  },
  constructionStatus:{type: String },
  buildingHeight: { type: String, },

  directions: {
    North: {
      document: { type: String },
      actual: { type: String },
      plan: { type: String },
    },
    South: {
      document: { type: String },
      actual: { type: String },
      plan: { type: String },
    },
    East: {
      document: { type: String },
      actual: { type: String },
      plan: { type: String },
    },
    West: {
      document: { type: String },
      actual: { type: String },
      plan: { type: String },
    },
  },

  boundariesMatching: { type: String },
  plotArea: { type: Number },
  isPropertyWithinLimit: { type: String },
  marketability: { type: String },
  typeOfStructure: { type: String },
  unitFlatConfiguration: { type: String },
  noOfFloorsPermissible: { type: String },
  noOfUnitFlatOnEachFloor: { type: String },
  approxAgeOfProperty: { type: Number },
  residualAge: { type: Number },
  liftAvailable: { type: String },
  constructionStage: { type: String },
  qualityOfConstruction: { type: String },
  noOfFloorsActual: { type: String },
  constructionAsPerPlan: { type: String },
  distressValue: { type: String },
  deviationToPlan: { type: String },
  deviationDetails: { type: String },
  demolitionDetails: { type: String },
  encroachment: { type: String },
  encroachmentDetails: { type: String },

  siteArea: { type: Number },
  planArea: { type: Number },
  deedArea: { type: Number },
  // Valuation
  document: { type: Number },
  landAreaPlan: { type: Number },
  landAreaSite: { type: Number },
  landAreaGF: { type: Number },
  builtUpAreaFF: { type: Number },
  builtUpAreaSF: { type: Number },
  existingBuiltUpGF: { type: Number }, // GF (Existing)
  existingBuiltUpFF: { type: Number }, // FF (Existing)
  existingBuiltUpSF: { type: Number }, // SF (Existing)


  landAreaForValuation: { type: Number },
  landRate: { type: Number },
  totalLandValuation: { type: Number },
  constructionAreaForValuation: { type: Number },
  constructionRate: { type: Number },
  totalConstructionValuation: { type: Number },
  fairMarketValue: { type: Number },
  valueAfterCompletion: { type: Number },
  presentStageValuation: { type: Number },
  govtGuidelineValuation: { type: Number },

  valuationRemarks: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ValuationReportSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("HomeFirst", ValuationReportSchema);
