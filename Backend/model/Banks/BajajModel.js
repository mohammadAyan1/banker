const mongoose = require("mongoose");

const BajajSchema = new mongoose.Schema(
  {
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
      ],
      default: "Pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Field Officer
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Coordinator
    timeline: [
      {
        status: String,
        updatedAt: Date,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],

    route: { type: String },
    bankName: { type: String, default: "Bajaj" },

    location: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },
    approvalStatus: { type: String, default: "" },
    isReportSubmitted: {
      type: Boolean,
      default: false,
    },
    // Document Identification (3 fields)
    fileNo: String,
    dateOfReport: String,
    applicantName: String,

    // Contact Information (3 fields)
    contactPerson: String,
    loanType: String,
    personMet: String,

    // Ownership Details (2 fields)
    propertyOwner: String,
    documentsProvided: String,

    // Location Details (12 fields)
    addressSite: String,
    localityName: String,
    landmark: String,
    distanceFromCity: String,
    latLong: String,
    addressInitiation: String,
    legalAddress: String,
    floorNo: String,
    propertyState: String,
    propertyCity: String,
    propertyPinCode: String,
    addressMatching: String,

    // Jurisdiction (1 field)
    jurisdiction: String,

    // Property Characteristics (8 fields)
    propertyType: String,
    marketability: String,
    occupancyStatus: String,
    typeOfProperty: String,
    occupancySchedule: String,
    northBoundary: String,
    eastBoundary: String,
    westBoundary: String,
    southBoundary: String,
    boundariesMatching: String,
    identifiedProperty: String,
    approachRoadSize: String,

    // Construction Specifications (18 fields)
    buildingNature: String,
    planAspectRatio: String,
    structureType: String,
    projectedParts: String,
    masonryType: String,
    expansionJoints: String,
    roofType: String,
    steelGrade: String,
    mortarType: String,
    concreteGrade: String,
    environmentExposure: String,
    footingType: String,
    seismicZone: String,
    soilLiquefiable: String,
    coastalRegulatoryZone: String,
    soilSlope: String,
    floodProneArea: String,
    groundSlope: String,
    fireExit: String,

    // Approval Details (7 fields)
    sanctionedPlan: String,
    layoutPlan: String,
    constructionPlan: String,
    sanctionDate: String,
    planValidity: String,
    approvingAuthority: String,
    approvedUsages: String,
    numberOfFloors: String,

    // Current Status (7 fields)
    constructionQuality: String,
    openPlot: String,
    liftAvailable: String,
    numberOfLifts: String,
    currentOccupant: String,
    independentAccess: String,
    accommodationDetails: String,

    // Measurement Data (6 fields)
    eastWestDocument: String,
    eastWestSite: String,
    northSouthDocument: String,
    northSouthSite: String,
    landAreaDocument: String,
    landAreaSite: String,

    // Basement Details (5 fields)
    basementRooms: String,
    basementKitchens: String,
    basementBathrooms: String,
    basementSanctioned: String,
    basementActual: String,

    // Ground Floor Details (5 fields)
    groundRooms: String,
    groundKitchens: String,
    groundBathrooms: String,
    groundSanctioned: String,
    groundActual: String,

    // Planning Parameters (6 fields)
    permissibleArea: String,
    landComponent: String,
    permissibleFSI: String,
    permissibleConstruction: String,
    carpetArea: String,
    proposedConstruction: String,

    // Risk Assessment (4 fields)
    riskOfDemolition: String,
    propertyStatus: String,
    percentCompleted: String,
    percentRecommended: String,

    // Age Details (2 fields)
    propertyAge: String,
    residualAge: String,

    // Valuation - Land (3 fields)
    landArea: String,
    landRate: String,
    landTotal: String,

    // Valuation - BUA (3 fields)
    buaArea: String,
    buaRate: String,
    buaTotal: String,

    // Valuation Summary (4 fields)
    realizableValue: String,
    governmentValue: String,
    distressedValue: String,
    previousValuation: String,

    // Legal Status (2 fields)
    inDemolitionList: String,
    negativeArea: String,
  },
  {
    timestamps: true,
  }
);

// const BajajSchema = new mongoose.Schema({
//   // Application Details
//   fileNo: String,
//   lanNo: String,
//   systemNo: String,
//   dateOfReport: String,
//   nameOfApplicant: String,
//   contactPersonName: String,
//   contactPersonNumber: String,
//   loanType: String,
//   personMetAtSite: String,
//   nameOfPropertyOwner: String,
//   documentsProvided: String,

//   // Location Details
//   addressOfProperty: String,
//   localityName: String,
//   landmarkNearBy: String,
//   distanceFromCityCentre: String,
//   latLong: String,
//   addressAsPerInitiation: String,
//   legalAddressOfProperty: String,
//   floorNoOfProperty: String,
//   propertyState: String,
//   propertyCity: String,
//   propertyPinCode: String,
//   addressMatching: String,
//   jurisdictionLocalMunicipalBody: String,
//   propertyHoldingType: String,
//   marketability: String,
//   propertyOccupiedBy: String,
//   typeOfProperty: String,
//   occupancyStatus: String,
//   scheduleOfProperty: {
//     north: String,
//     east: String,
//     west: String,
//     south: String,
//     boundariesMatching: String,
//     propertyIdentified: String,
//   },
//   approachRoadSize: String,

//   // NDMA Parameters
//   natureOfBuildingWing: String,
//   planAspectRatio: String,
//   structureType: String,
//   projectedPartsAvailable: String,
//   typeOfMasonry: String,
//   expansionJointsAvailable: String,
//   roofType: String,
//   steelGrade: String,
//   mortarType: String,
//   concreteGrade: String,
//   environmentExposureCondition: String,
//   footingType: String,
//   sesmicZone: String,
//   soilLiquefiable: String,
//   coastalRegulatoryZone: String,
//   soilSlopeVulnerableToLandslide: String,
//   floodProneArea: String,
//   groundSlopeMoreThan20: String,
//   fireExit: String,

//   // Technical Details
//   constructionQuality: String,
//   liftAvailable: String,
//   noOfLifts: String,
//   currentOccupantOfProperty: String,
//   independentAccess: String,
//   accommodationDetails: String,
//   plotAreaDetails: {
//     eastToWest: String,
//     northToSouth: String,
//     landArea: String,
//   },
//   bauAreaDetails: {
//     noOfRooms: String,
//     noOfKitchens: String,
//     noOfBathrooms: String,
//     sanctionedUsages: String,
//     actualUsage: String,
//   },
//   permissibleAreaDetails: {
//     permissibleAreaAsPerPlan: String,
//     landComponent: String,
//     permissibleFSI: String,
//     permissibleConstructionAsPerFSI: String,
//     carpetAreaAsPerDocument: String,
//     proposedConstructionSBUA: String,
//   },
//   riskOfDemolition: String,
//   statusOfProperty: String,
//   percentCompleted: String,
//   percentRecommended: String,
//   currentAgeOfProperty: String,
//   residualAge: String,

//   // Valuation Details
//   landValue: {
//     area: String,
//     ratePerSqFt: String,
//     totalValue: String,
//   },
//   buaValue: {
//     area: String,
//     ratePerSqFt: String,
//     totalValue: String,
//   },
//   depreciation: {
//     area: String,
//     ratePerSqFt: String,
//     totalValue: String,
//   },
//   carParkingCharges: {
//     area: String,
//     ratePerSqFt: String,
//     totalValue: String,
//   },
//   amenitiesOtherCharges: {
//     area: String,
//     ratePerSqFt: String,
//     totalValue: String,
//   },
//   realizableValueAsOnDate: String,
//   governmentValue: String,
//   distressedForceValue: String,
//   valuationDoneEarlier: String,
//   valuationMethodology: String,
//   inMunicipalDevelopmentAuthorityDemolitionList: String,
//   isPropertyInNegativeArea: String,

//   // Remarks
//   remarks: String,

//   // Additional Checks for Panchayat Properties
//   approachRoadToProperty: String,
//   developmentOfSurroundingAreas: String,
//   distanceFromCityCentreKms: String,
//   distanceFromCorporationLimitsKms: String,
//   electricity: String,
//   electricityDistributor: String,
//   waterSupply: String,
//   waterDistributor: String,
//   sewerProvision: String,
//   sewerLineConnectedToMainSewer: String,
//   anyDemolitionThreatInFutureDevelopment: String,

//   // Declaration
//   declaration: String,
//   signature: String,
//   date: String,
//   place: String,

//   // Property Photographs and Location Map
//   propertyPhotographs: String,
//   locationMap: String,
// });

const Bajaj = mongoose.model("Bajaj", BajajSchema);

module.exports = Bajaj;
