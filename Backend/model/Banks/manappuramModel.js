// models/ManapuramFormOne.js

const mongoose = require("mongoose");

const ManapuramSchema = new mongoose.Schema(
  {
    // ------------------------------Mananppuram Form One---------------------------------
    valuerName: { type: String },
    caseRefNo: { type: String },
    dateOfVisit: { type: Date },
    dateOfReport: { type: Date },

    contactPersonName: { type: String },
    contactPersonMobile: { type: String },

    applicantsName: {
      type: String,
    },
    owner: {
      type: String,
    },
    documentProduced: { type: String },

    propertyType: { type: String },
    holdingType: { type: String },
    propertyUsage: { type: String },

    usageAuthorized: { type: String },
    usageRestriction: { type: String },
    occupancyStatus: { type: String },

    measurement: {
      type: String,
    },

    distanceFromBranch: {
      type: String,
    },

    addressAsPerDocument: {
      type: String,
    },

    landMark: { type: String },
    location: { type: String },

    eastBoundary: { type: String },
    westBoundary: { type: String },
    northBoundary: { type: String },
    southBoundary: { type: String },

    connectivity: { type: String },
    siteAccess: { type: String },
    proximityToAmenities: { type: String },
    distanceFromCityCentre: { type: String },
    roadTypeWidth: { type: String },
    commentsOnProperty: { type: String },

    //   ----------------------------------------------Manappuram Form Two----------------------------
    // GLR (Guideline Rate)
    landComponentArea: {
      type: String,
    },
    landComponentRate: {
      type: String,
    },
    landComponentValue: {
      type: String,
    },

    // PMR (Prevailing Market Rate)
    landComponentPMARea: {
      type: String,
    },
    landComponentPMRRate: {
      type: String,
    },
    landComponentPMRValue: {
      type: String,
    },

    // Construction Component
    constructionComponentArea: {
      type: String,
    },
    constructionComponentRate: {
      type: String,
    },
    constructionComponentValue: {
      type: String,
    },

    // Total Value
    totalValue: {
      type: String,
    },

    // Distress Sale
    distressSaleValue: {
      type: String,
    },

    // Observations (Textarea)
    observations: {
      type: String,
    },

    // Property Description (Textarea)
    propertyDescription: {
      type: String,
    },

    // Valuation Details
    nameOfApplicant: {
      type: String,
    },
    presentMarketValue: {
      type: String,
    },
    forcedSaleValue: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Manapuram", ManapuramSchema);
