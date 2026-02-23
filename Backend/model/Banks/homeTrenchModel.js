const mongoose = require("mongoose");

const homeTrenchSchema = new mongoose.Schema({
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
  AttachDocuments: {
    type: [String],
    default: [],
  },
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
  bankName: { type: String, default: "HomeFirstTrench" },

  approvalStatus: { type: String, default: "Pending" },
  isReportSubmitted: { type: Boolean, default: false },
  imageUrls: { type: [Object], default: [] },

  // Vendor Visit Details
  dateOfVisit: String,
  dateOfReport: String,
  propertyAddress: String,
  visitedPersonName: String,
  contactNumber: String,

  // Construction
  constructionStage: String,
  constructionPercentage: String,
  constructionAsPer: String,

  // Area
  totalBua: String,
  areaRemarks: String,
  latitude: String,
  longitude: String,
  overallStatus: String,
  negativeReason: String,

  // Certificate
  certificateText: String,

  // Billing
  charges: String,
  gstPercentage: String,
  totalAmount: String,

  // Declaration
  declaration: [String],

  // Site Pics
  sitePics: [
    {
      url: String,
      location: String,
      latitude: String,
      longitude: String,
      localTime: String,
      altitude: String,
      gmt: String,
      date: String,
    },
  ],
});

const HomeFirstTrench = mongoose.model("HomeTrenchReport", homeTrenchSchema);

module.exports = HomeFirstTrench;
