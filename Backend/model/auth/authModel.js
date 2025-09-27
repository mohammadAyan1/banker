const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "Admin",
        "Coordinator",
        "FieldOfficer",
        "TechnicalManager", //TM
        "RegionalManager", //RTM
        "Accountant",
        // "HR",
      ],
      default: "FieldOfficer",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.statics.getFieldOfficers = function () {
  return this.find({ role: "FieldOfficer", isActive: true });
};

module.exports = mongoose.model("User", userSchema);
