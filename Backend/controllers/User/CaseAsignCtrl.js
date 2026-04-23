const Case = require("../../model/Banks/BajajModel");
const modelMap = require("../../controllers/modelMap");
const { deleteImage } = require("../../config/imageUploader"); // 👈 storage delete logic

const dictionaryFix = {
  homefirsttrench: "Homefirsttrench",
};

const WORK_IN_PROGRESS_STATUS = "Work in Progress";
const NBSP_WORK_IN_PROGRESS_STATUS = "Work in Progress";
const LEGACY_WORK_IN_PROGRESS_STATUS = "WorkÂ inÂ Progress";
const WORK_IN_PROGRESS_STATUSES = [
  WORK_IN_PROGRESS_STATUS,
  NBSP_WORK_IN_PROGRESS_STATUS,
  LEGACY_WORK_IN_PROGRESS_STATUS,
];

const bankRegistry = modelMap.bankRegistry || [];

const defaultBankSlug = (modelKey) =>
  modelKey.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");

const getBankMeta = (modelKey) => {
  const registryEntry = bankRegistry.find((entry) => entry.key === modelKey);

  return {
    displayName:
      registryEntry?.displayName ||
      modelKey.replace(/([A-Z])/g, " $1").trim(),
    route: registryEntry?.route || defaultBankSlug(modelKey),
  };
};

const enrichCasesWithBankMeta = (cases, modelKey) => {
  const { displayName, route } = getBankMeta(modelKey);

  return cases.map((caseItem) => ({
    ...caseItem.toObject(),
    bankName: displayName,
    bankSlug: route,
  }));
};

function toPascalCase(str) {
  return str
    .replace(/\s+/g, "-")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toPascalCaseSmart(str) {
  const normalizedInput = String(str)
    .replace(/\bbank\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const key = normalizedInput.toLowerCase().replace(/[-_\s]/g, ""); // normalize input
  if (dictionaryFix[key]) return dictionaryFix[key];

  const pascal = toPascalCase(normalizedInput);
  return pascal.charAt(0) + pascal.slice(1).toLowerCase(); // only first letter capital
}

// function toPascalCaseSmart(str) {
//   if (dictionaryFix[str.toLowerCase()]) return dictionaryFix[str.toLowerCase()];
//   return toPascalCase(str);
// }

exports.assignCase = async (req, res) => {
  const { caseId, fieldOfficerId, route } = req.body;

  console.log(caseId, "ZXCVBNM")
  console.log(fieldOfficerId, "QWERTYUIOP")
  console.log(route, "LKJHGFDSA")

  try {
    const bankName = route.split("/")[2]; // e.g., "home-first"

    console.log(bankName, "this is the bank model name")
    // const modelKey = toPascalCase(bankName); // "HomeFirst"
    const modelKey = toPascalCaseSmart(bankName); // "HomeFirst"
    console.log(modelKey, "POPPPP");
    let Model = modelMap[modelKey];

    if (!Model) {
      return res
        .status(400)
        .json({ error: `Invalid route/model: ${modelKey}` });
    }

    let updated = await Model.findByIdAndUpdate(
      caseId,
      {
        assignedTo: fieldOfficerId,
        status: WORK_IN_PROGRESS_STATUS,
        route: route,
        // $push: {
        timeline: {
          // status: "Assigned",
          status: WORK_IN_PROGRESS_STATUS,
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note: `Assigned to user ${fieldOfficerId}`,
        },
        // },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.unassignCase = async (req, res) => {
  const { caseId } = req.params;

  try {
    // 🔍 Loop through all models to find the one that contains the caseId
    let foundModel = null;
    let foundDoc = null;

    for (const key in modelMap) {
      const Model = modelMap[key];
      const doc = await Model.findById(caseId);
      if (doc) {
        foundModel = Model;
        foundDoc = doc;
        break;
      }
    }

    if (!foundModel || !foundDoc) {
      return res.status(404).json({ error: "Case not found in any model" });
    }

    const updated = await foundModel.findByIdAndUpdate(
      caseId,
      {
        $unset: { assignedTo: "" },
        status: "Pending",
        // $push: {
        timeline: {
          status: "Pending",
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note: `Unassigned by admin`,
        },
        // },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error unassigning case:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// exports.getCasesByRole = async (req, res, next) => {
//   try {
//     const user = req.user;
//     let cases;
//     if (user.role === "Coordinator") {
//       cases = await Case.find({ createdBy: user._id }).populate("assignedTo");
//     } else if (user.role === "FieldOfficer") {
//       cases = await Case.find({ assignedTo: user._id });
//     } else {
//       cases = await Case.find({});
//     }
//     res.json(cases);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.acceptCase = async (req, res) => {
//   try {
//     const caseId = req.params.id;

//     const updatedCase = await Case.findByIdAndUpdate(
//       caseId,
//       { approvalStatus: "Accepted", acceptedAt: new Date() },
//       { new: true }
//     );

//     res.status(200).json(updatedCase);
//   } catch (err) {
//     res.status(500).json({ message: "Error accepting case" });
//   }
// };

exports.updateCaseStatus = async (req, res) => {
  const { caseId, status, note } = req.body;
  const updated = await Case.findByIdAndUpdate(
    caseId,
    {
      status,
      $push: {
        timeline: {
          status,
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note,
        },
      },
    },
    { new: true }
  );
  res.json(updated);
};

// exports.getAllAssignedCases = async (req, res) => {
//   try {
//     const cases = await Case.find({ assignedTo: { $ne: null } }).populate(
//       "assignedTo",
//       "name email"
//     );

//     res.json(cases);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch assigned cases" });
//   }
// };

exports.getCasesByRole = async (req, res) => {
  const user = req.user;
  let allCases = [];

  try {
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    const results = await Promise.all(
      bankRegistry.map(async (bankConfig) => {
        const { key: modelKey, model: Model } = bankConfig;
        let query = {};

        // Role-based ownership filtering
        if (user.role === "Coordinator" || user.role === "Admin") {
          // Show cases created BY them OR assigned TO them
          query.$or = [
            { createdBy: user._id },
            { assignedTo: user._id }
          ];
        } else if (user.role === "FieldOfficer") {
          query.assignedTo = user._id;
        }

        const cases = await Model.find(query).populate("assignedTo");
        return enrichCasesWithBankMeta(cases, modelKey);
      })
    );

    allCases = results.flat();
    res.json(allCases);
  } catch (err) {
    console.error("Error in getCasesByRole:", err);
    res.status(500).json({ error: "Something went wrong fetching cases." });
  }
};

// ---

exports.acceptCase = async (req, res) => {
  const { id } = req.params;
  const { bankName } = req.body;
  if (!bankName) {
    return res.status(400).json({ error: "Bank name is required." });
  }

  const modelKey = toPascalCaseSmart(bankName);
  const Model = modelMap[modelKey];

  if (!Model) {
    return res.status(400).json({ error: `Invalid route/model: ${modelKey}` });
  }

  try {
    const updatedCase = await Model.findByIdAndUpdate(
      id,
      { approvalStatus: "Accepted" },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting case" });
  }
};

// ---

exports.updateCaseStatus = async (req, res) => {
  const { caseId, status, note, bankName } = req.body; // Assuming bankName is sent in the body

  if (!bankName) {
    return res.status(400).json({ error: "Bank name is required." });
  }

  const modelKey = toPascalCaseSmart(bankName);
  const Model = modelMap[modelKey];

  if (!Model) {
    return res.status(400).json({ error: `Invalid route/model: ${modelKey}` });
  }

  try {
    const updated = await Model.findByIdAndUpdate(
      caseId,
      {
        status,
        $push: {
          timeline: {
            status,
            updatedAt: new Date(),
            updatedBy: req.user._id,
            note,
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong updating status." });
  }
};

// ---

exports.getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    // Iterate through all models in bankRegistry
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;

      const caseData = await Model.findById(id).populate(
        "assignedTo createdBy"
      );

      if (caseData) {
        // Optional: Attach bank info for frontend use
        const bankSlug = modelKey
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "");
        const bankName = modelKey.replace(/([A-Z])/g, " $1").trim();

        return res.json({
          ...caseData.toObject(),
          bankName,
          bankSlug,
        });
      }
    }

    // If no case found in any model
    return res
      .status(404)
      .json({ message: "Case not found in any bank model." });
  } catch (err) {
    console.error("Error fetching case by ID:", err);
    res
      .status(500)
      .json({ error: "Something went wrong fetching case by ID." });
  }
};

// ---
exports.getAllAssignedCases = async (req, res) => {
  const user = req.user;
  try {
    const allCases = [];
    let query = {
      assignedTo: { $ne: null },
      status: { $in: WORK_IN_PROGRESS_STATUSES },
    };

    // Role-based filtering
    if (user.role === "Coordinator" || user.role === "Admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    } else if (user.role === "FieldOfficer") {
      query.assignedTo = user._id;
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;
      const cases = await Model.find(query).populate("assignedTo", "name email");

      allCases.push(...enrichCasesWithBankMeta(cases, modelKey));
    }

    res.json(allCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assigned cases." });
  }
};

exports.getPendingCases = async (req, res) => {
  const user = req.user;
  try {
    const allPendingCases = [];
    let query = { status: "Pending" };

    // Role-based filtering
    if (user.role === "Coordinator" || user.role === "Admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    } else if (user.role === "FieldOfficer") {
      query.assignedTo = user._id;
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;
      const pendingCases = await Model.find(query).populate(
        "assignedTo createdBy"
      );

      if (pendingCases.length > 0) {
        allPendingCases.push(...enrichCasesWithBankMeta(pendingCases, modelKey));
      }
    }

    res.json(allPendingCases);
  } catch (err) {
    console.error("Error in getPendingCases:", err);
    res.status(500).json({ error: "Failed to fetch pending cases." });
  }
};

exports.deleteCase = async (req, res) => {
  const { id } = req.params;

  try {
    let updatedCase = null;
    let matchedModel = null;

    for (const key in modelMap) {
      const Model = modelMap[key];

      // Try to find the case by ID in this model
      const found = await Model.findById(id);
      if (found) {
        // Update the status to "cancelled" instead of deleting
        updatedCase = await Model.findByIdAndUpdate(
          id,
          { status: "cancelled" },
          { new: true } // returns the updated document
        );
        matchedModel = key;
        break;
      }
    }

    if (!updatedCase) {
      return res
        .status(404)
        .json({ error: "Case not found in any bank model." });
    }

    res.json({
      message: `Case status updated to 'cancelled' in ${matchedModel} model.`,
      updatedCase,
    });
  } catch (err) {
    console.error("Error cancelling case:", err);
    res
      .status(500)
      .json({ error: "Something went wrong while cancelling the case." });
  }
};

//! Final update
exports.finalUpdate = async (req, res) => {
  const { bankName, updateData } = req.body;
  const { id } = req.params;
  if (!bankName || !id || !updateData) {
    return res.status(400).json({
      error: "bankName, caseId, and updateData are required.",
    });
  }


  console.log(bankName, "zero")

  const modelKey = toPascalCaseSmart(bankName);
  
  // Case-insensitive lookup in modelMap
  let Model = null;
  const modelMapKey = Object.keys(modelMap).find(
    (k) => k.toLowerCase() === modelKey.toLowerCase() || k.toLowerCase() === bankName.toLowerCase()
  );
  if (modelMapKey) Model = modelMap[modelMapKey];

  if (!Model) {
    // Try to find in bankRegistry for all 20+ banks
    const registry = modelMap.bankRegistry || [];
    const entry = registry.find(
      (b) => b.key.toLowerCase() === bankName.toLowerCase() || b.key.toLowerCase() === modelKey.toLowerCase()
    );
    if (entry) Model = entry.model;
  }

  if (!Model) {
    return res.status(400).json({
      error: `Model not found for bank: ${bankName}`,
    });
  }

  // Prevent timeline conflict
  const { timeline, ...sanitizedUpdateData } = updateData;

  console.log('====================================');
  console.log(updateData);
  console.log('====================================');

  try {
    const updatedCase = await Model.findByIdAndUpdate(
      id,
      {
        ...sanitizedUpdateData,
        isReportSubmitted: true,
        status: "FinalSubmitted", // lock status
        $push: {
          timeline: {
            status: "FinalSubmitted",
            updatedAt: new Date(),
            updatedBy: req.user._id, // requires auth middleware
            note: "Case marked as final by admin.",
          },
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    res.json(updatedCase);
  } catch (err) {
    console.error("Final update error:", err.message);
    res.status(500).json({ error: "Final update failed." });
  }
};

// ! total cases fetch
exports.getFinalSubmittedCases = async (req, res) => {
  const user = req.user;
  try {
    const finalCases = [];
    let query = { status: "FinalSubmitted" };

    // Role-based filtering
    if (user.role === "Coordinator" || user.role === "Admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    } else if (user.role === "FieldOfficer") {
      query.assignedTo = user._id;
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;
      const cases = await Model.find(query).populate(
        "assignedTo",
        "name email"
      );

      finalCases.push(...enrichCasesWithBankMeta(cases, modelKey));
    }

    res.status(200).json(finalCases);
  } catch (err) {
    console.error("Error fetching final submitted cases:", err);
    res.status(500).json({ message: "Failed to fetch final submitted cases." });
  }
};

// ! cancel cases fetch

exports.getCancelledCases = async (req, res) => {
  const user = req.user;
  try {
    let cancelledCases = [];
    let totalCancelledCount = 0;
    let query = { status: "cancelled" };

    // Role-based filtering
    if (user.role === "Coordinator" || user.role === "Admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    } else if (user.role === "FieldOfficer") {
      query.assignedTo = user._id;
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (const bankConfig of bankRegistry) {
      const { key, model: Model } = bankConfig;
      const cases = await Model.find(query);

      totalCancelledCount += cases.length;

      if (cases.length > 0) {
        const { displayName, route } = getBankMeta(key);
        cancelledCases.push({
          model: key,
          bankName: displayName,
          bankSlug: route,
          count: cases.length,
          cases: enrichCasesWithBankMeta(cases, key),
        });
      }
    }

    res.json({
      message: "Cancelled cases fetched successfully.",
      totalCancelledCount,
      cancelledCases,
    });
  } catch (err) {
    console.error("Error fetching cancelled cases:", err);
    res.status(500).json({
      error: "Something went wrong while fetching cancelled cases.",
    });
  }
};

// !  out of tat case
exports.getOutOfTATCases = async (req, res) => {
  const user = req.user;
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const result = [];

  try {
    let query = {
      createdAt: { $lte: twentyFourHoursAgo },
      $expr: { $eq: ["$createdAt", "$updatedAt"] },
      status: {
        $nin: [
          "cancelled",
          "completed",
          ...WORK_IN_PROGRESS_STATUSES,
          "FinalSubmitted",
        ],
      },
    };

    // Role-based filtering
    if (user.role === "Coordinator" || user.role === "Admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    } else if (user.role === "FieldOfficer") {
      query.assignedTo = user._id;
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    for (let bankConfig of bankRegistry) {
      const { key: modelKey, model: Model } = bankConfig;
      if (!Model) continue;

      const reports = await Model.find(query);

      if (reports.length > 0) {
        const { displayName, route } = getBankMeta(modelKey);
        result.push(
          ...reports.map((r) => ({
            ...r.toObject(),
            bank: modelKey,
            bankName: displayName,
            bankSlug: route,
          }))
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Out of TAT reports",
      data: result,
    });
  } catch (error) {
    console.error("OutOfTAT error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


exports.getSummaryData = async (req, res) => {
  try {
    const pending = [];
    const working = [];
    const totalSubmissions = [];
    const queryRaised = [];

    const { city } = req.query;
    const user = req.user;

    const bankRegistry =
      modelMap.bankRegistry ||
      Object.entries(modelMap).map(([key, model]) => ({
        key,
        displayName: key.replace(/([A-Z])/g, " $1").trim(),
        model,
      }));

    for (const bankConfig of bankRegistry) {
      const { key: modelKey, displayName, model: Model } = bankConfig;

      // Base query for role-based ownership
      let baseQuery = {};
      if (user.role === "Coordinator" || user.role === "Admin") {
        // Show cases created BY them OR assigned TO them
        baseQuery.$or = [
          { createdBy: user._id },
          { assignedTo: user._id }
        ];
      } else if (user.role === "FieldOfficer") {
        baseQuery.assignedTo = user._id;
      }

      const [pendingCases, workingCases, totalCases, queryCases] =
        await Promise.all([
          Model.find({ ...baseQuery, status: "Pending" }),
          Model.find({ ...baseQuery, status: { $in: WORK_IN_PROGRESS_STATUSES } }),
          Model.find(baseQuery),
          Model.find({ ...baseQuery, status: "Query Raised" }),
        ]);

      const bankName = displayName;
      const bankSlug = modelKey
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-/, "");

      const enrich = (cases) =>
        cases.map((c) => ({
          ...c.toObject(),
          bankName,
          bankSlug,
        }));

      pending.push(...enrich(pendingCases));
      working.push(...enrich(workingCases));
      totalSubmissions.push(...enrich(totalCases));
      queryRaised.push(...enrich(queryCases));
    }

    res.json({
      pending,
      working,
      totalSubmissions,
      queryRaised,
    });
  } catch (err) {
    console.error("Error fetching summary data:", err);
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
};


exports.deleteImageFromCase = async (req, res) => {
  try {
    const { id } = req.params; // Document ID
    const { imageUrl, route } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    if (!route) {
      return res.status(400).json({ message: "route is required" });
    }

    // 🧠 Dynamic model from route
    const bankName = route.split("/")[2]; // e.g., "home-first"
    const modelKey = toPascalCaseSmart(bankName); // e.g., "HomeFirst"
    const Model = modelMap[modelKey];

    if (!Model) {
      return res
        .status(400)
        .json({ message: `Invalid model for route: ${modelKey}` });
    }

    // ✅ Step 1: Delete image from storage
    try {
      await deleteImage(imageUrl);
    } catch (err) {
      console.warn("Storage image delete failed (non-blocking):", err.message);
      // You can choose to stop here if storage delete is critical
    }

    // ✅ Step 2: Remove image URL from DB
    const updatedDoc = await Model.findByIdAndUpdate(
      id,
      { $pull: { imageUrls: imageUrl } },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // ✅ Step 3: Done
    res.status(200).json({
      message: "Image deleted from storage and DB",
      updatedDoc,
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      message: "Error while deleting image",
      error: error.message,
    });
  }
};


exports.changeAssign = async (req, res) => {
  try {
    const { caseId, officerId, bankName } = req.body

    console.log(bankName, "WERTYUIOP")

    // const bankName = route.split("/")[2]; // e.g., "home-first"
    const modelKey = toPascalCaseSmart(bankName); // e.g., "HomeFirst"
    // HomeFirstTrench
    console.log(modelKey, "DFGHJ")
    const Model = modelMap[modelKey];

    if (!Model) {
      return res
        .status(400)
        .json({ message: `Invalid model for route: ${modelKey}` });
    }

    const updatedDoc = await Model.findByIdAndUpdate(
      caseId,
      { $set: { assignedTo: officerId } },
      { new: true }
    );

    res.status(200).json({
      message: "Field officer change",
      success: true
    });

  } catch (error) {
    console.error(" error while Update field officer:", error);
    res.status(500).json({
      message: "Error while deleting image",
      error: error.message,
    });
  }
}
