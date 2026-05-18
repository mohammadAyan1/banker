import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIciciBankById, updateIciciBank, submitIciciBank } from "../../redux/features/Banks/IciciBank/iciciBankThunk";
import { finalUpdate } from "../../redux/features/case/caseThunks";
import toast from "react-hot-toast";

// ─── Field Display Helper ────────────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div className="py-2 border-b border-gray-100">
    <span className="text-xs text-gray-500 block">{label}</span>
    <span className="text-sm font-medium text-gray-800">
      {value !== undefined && value !== null && value !== "" ? String(value) : <em className="text-gray-300">—</em>}
    </span>
  </div>
);

const SectionCard = ({ title, children, onEdit }) => (
  <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
    <div className="flex items-center justify-between bg-[#f8f9fa] px-5 py-3 border-b border-gray-200">
      <h3 className="font-semibold text-[#061b3a] text-[15px]">{title}</h3>
      <button
        onClick={onEdit}
        className="text-[13px] text-[#1d4ed8] hover:underline font-medium"
      >
        ✏️ Edit
      </button>
    </div>
    <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-3 gap-x-6">
      {children}
    </div>
  </div>
);

// ─── Inline Edit Form ─────────────────────────────────────────────────────────
const InlineEditField = ({ label, fieldKey, value, onChange }) => (
  <div className="py-2 border-b border-gray-100">
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#1d4ed8]"
    />
  </div>
);

// ─── Print Styles ─────────────────────────────────────────────────────────────
const PrintStyle = () => (
  <style>{`
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        height: auto !important;
        overflow: visible !important;
      }

      body * {
        visibility: hidden !important;
      }

      #icici-print-area,
      #icici-print-area * {
        visibility: visible !important;
      }

      #icici-print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: #ffffff !important;
        padding: 15px !important;
      }

      .no-print {
        display: none !important;
        visibility: hidden !important;
      }

      .bg-white {
        background: #ffffff !important;
      }

      .shadow,
      .shadow-md,
      .shadow-lg,
      .shadow-2xl {
        box-shadow: none !important;
      }

      button {
        display: none !important;
      }

      @page {
        size: A4;
        margin: 10mm;
      }
    }
  `}</style>
);

// ─── Main Invoice Component ───────────────────────────────────────────────────
const IciciBankDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editSection, setEditSection] = useState(null); // which section is being edited
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (id) loadData();
    // eslint-disable-next-line
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getIciciBankById(id)).unwrap();
      setData(res);
    } catch (err) {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (section, fields) => {
    setEditSection(section);
    const picked = {};
    fields.forEach((f) => { picked[f] = data?.[f] ?? ""; });
    setEditForm(picked);
  };

  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        // Sanitize populated objects → sirf _id bhejo
        createdBy: editForm?.createdBy?._id || editForm?.createdBy,
        assignedTo: editForm?.assignedTo?._id || editForm?.assignedTo,
      };
      await dispatch(updateIciciBank({ id, formData: payload })).unwrap();
      toast.success("Section updated!");
      await loadData();
      setEditSection(null);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => setEditSection(null);

  // ─── Final Submit (Admin only) ──────────────────────────────────────────────
  const handleFinalSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        // Sanitize populated objects → sirf _id bhejo
        createdBy: data?.createdBy?._id || data?.createdBy,
        assignedTo: data?.assignedTo?._id || data?.assignedTo,
      };
      const updated = await dispatch(finalUpdate({ id, bankName: "Icici", updateData: {
        ...payload,
        status: "FinalSubmitted",
        approvalStatus: "FinalSubmitted",
        isReportSubmitted: true,
      } })).unwrap();
      toast.success("🎉 Case finally submitted!");
      setData(updated || { ...data, status: "FinalSubmitted", approvalStatus: "FinalSubmitted", isReportSubmitted: true });
      await loadData();
    } catch (err) {
      toast.error("Final submit failed");
    } finally {
      setSaving(false);
    }
  };

  // ─── Re-Submit (update & keep submitted flag) ───────────────────────────────
  const handleReSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        // Sanitize populated objects → sirf _id bhejo
        createdBy: data?.createdBy?._id || data?.createdBy,
        assignedTo: data?.assignedTo?._id || data?.assignedTo,
      };
      const res = await dispatch(submitIciciBank({ id, formData: {
        ...payload,
        status: "Submitted",
        approvalStatus: "Submitted",
        isReportSubmitted: true,
      } })).unwrap();
      toast.success("Report saved successfully!");
      if (res?.data) setData(res.data);
      await loadData();
    } catch (err) {
      toast.error("Re-submit failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-[#cf0000] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Report not found.
      </div>
    );
  }

  const isAdmin = user?.role === "Admin" || user?.role === "SuperAdmin";
  const isFinalSubmitted = data.status === "FinalSubmitted";

  // ─── Inline Edit Overlay ────────────────────────────────────────────────────
  const EditOverlay = ({ title, fields, fieldLabels }) => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="font-bold text-[#9b0000] text-[18px]">Edit — {title}</h3>
          <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {fields.map((f) => (
            <InlineEditField
              key={f}
              label={fieldLabels[f] || f}
              fieldKey={f}
              value={editForm[f]}
              onChange={handleEditChange}
            />
          ))}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={cancelEdit}
            className="px-5 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-[15px]"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            disabled={saving}
            className="px-6 py-2 bg-[#003b70] text-white rounded font-semibold text-[15px] hover:bg-[#002a55] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6fa] print-container">
      <PrintStyle />

      {/* ─── TOP ACTION BAR ──────────────────────────────────────────────── */}
     

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div id="icici-print-area" className="pt-6 max-w-5xl mx-auto px-4 py-8">

        {/* Invoice Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-[26px] font-bold text-[#9b0000]">ICICI Bank</h1>
            <p className="text-[15px] text-gray-600 mt-1">Property Valuation Report</p>
            <p className="text-[13px] text-gray-400 mt-1 font-mono">ID: {id}</p>
          </div>
          <div className="text-right text-[13px] text-gray-600 space-y-1">
            <p><strong>Bank Name:</strong> {data.bankName || "ICICI Bank"}</p>
            <p><strong>Status:</strong> {data.status || "Pending"}</p>
            <p><strong>Submitted:</strong> {data.isReportSubmitted ? "Yes ✅" : "No"}</p>
            {data.createdAt && (
              <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleDateString("en-IN")}</p>
            )}
          </div>
        </div>

        {/* ─── 1. PROPERTY DETAILS ──────────────────────────────────────── */}
        {editSection === "propertyDetails" ? (
          <EditOverlay
            title="Property Details"
            fields={["pincode", "state", "city", "district", "locality", "landmark", "plotNo",
              "propertyType", "unitType", "sanctionUsage", "actualUsage",
              "propertyJurisdiction", "sanctionAuthorityName", "constructionStatus",
              "propertyEntranceFacing", "floorNumber", "countOfProperties"]}
            fieldLabels={{
              pincode: "Pincode", state: "State", city: "City", district: "District",
              locality: "Locality", landmark: "Landmark", plotNo: "Plot No.",
              propertyType: "Property Type", unitType: "Unit Type",
              sanctionUsage: "Sanction Usage", actualUsage: "Actual Usage",
              propertyJurisdiction: "Property Jurisdiction",
              sanctionAuthorityName: "Sanction Authority Name",
              constructionStatus: "Construction Status",
              propertyEntranceFacing: "Entrance Facing",
              floorNumber: "Floor Number", countOfProperties: "Count of Properties"
            }}
          />
        ) : (
          <SectionCard title="1. Property Details" onEdit={() => startEdit("propertyDetails",
            ["pincode", "state", "city", "district", "locality", "landmark", "plotNo",
              "propertyType", "unitType", "sanctionUsage", "actualUsage",
              "propertyJurisdiction", "sanctionAuthorityName", "constructionStatus",
              "propertyEntranceFacing", "floorNumber", "countOfProperties"])}>
            <Field label="Pincode" value={data.pincode} />
            <Field label="State" value={data.state} />
            <Field label="City" value={data.city} />
            <Field label="District" value={data.district} />
            <Field label="Locality" value={data.locality} />
            <Field label="Landmark" value={data.landmark} />
            <Field label="Plot No." value={data.plotNo} />
            <Field label="Property Type" value={data.propertyType} />
            <Field label="Unit Type" value={data.unitType} />
            <Field label="Sanction Usage" value={data.sanctionUsage} />
            <Field label="Actual Usage" value={data.actualUsage} />
            <Field label="Property Jurisdiction" value={data.propertyJurisdiction} />
            <Field label="Sanction Authority" value={data.sanctionAuthorityName} />
            <Field label="Construction Status" value={data.constructionStatus} />
            <Field label="Entrance Facing" value={data.propertyEntranceFacing} />
            <Field label="Floor Number" value={data.floorNumber} />
            <Field label="Count of Properties" value={data.countOfProperties} />
          </SectionCard>
        )}

        {/* ─── 2. MAINTENANCE & BOUNDARIES ─────────────────────────────── */}
        {editSection === "maintenance" ? (
          <EditOverlay
            title="Maintenance & Boundaries"
            fields={["propertyAge", "residualAge", "internalMaintenance", "externalMaintenance",
              "eastDocument", "eastSiteVisit", "eastDimensions",
              "westDocument", "westSiteVisit", "westDimensions",
              "northDocument", "northSiteVisit", "northDimensions",
              "southDocument", "southSiteVisit", "southDimensions"]}
            fieldLabels={{
              propertyAge: "Property Age (yrs)", residualAge: "Residual Age (yrs)",
              internalMaintenance: "Internal Maintenance", externalMaintenance: "External Maintenance",
              eastDocument: "East (Document)", eastSiteVisit: "East (Site Visit)", eastDimensions: "East (Dimensions)",
              westDocument: "West (Document)", westSiteVisit: "West (Site Visit)", westDimensions: "West (Dimensions)",
              northDocument: "North (Document)", northSiteVisit: "North (Site Visit)", northDimensions: "North (Dimensions)",
              southDocument: "South (Document)", southSiteVisit: "South (Site Visit)", southDimensions: "South (Dimensions)",
            }}
          />
        ) : (
          <SectionCard title="2. Maintenance & Boundaries" onEdit={() => startEdit("maintenance",
            ["propertyAge", "residualAge", "internalMaintenance", "externalMaintenance",
              "eastDocument", "eastSiteVisit", "eastDimensions",
              "westDocument", "westSiteVisit", "westDimensions",
              "northDocument", "northSiteVisit", "northDimensions",
              "southDocument", "southSiteVisit", "southDimensions"])}>
            <Field label="Property Age (yrs)" value={data.propertyAge} />
            <Field label="Residual Age (yrs)" value={data.residualAge} />
            <Field label="Internal Maintenance" value={data.internalMaintenance} />
            <Field label="External Maintenance" value={data.externalMaintenance} />
            <Field label="East (Document)" value={data.eastDocument} />
            <Field label="East (Site Visit)" value={data.eastSiteVisit} />
            <Field label="East (Dimensions)" value={data.eastDimensions} />
            <Field label="West (Document)" value={data.westDocument} />
            <Field label="West (Site Visit)" value={data.westSiteVisit} />
            <Field label="West (Dimensions)" value={data.westDimensions} />
            <Field label="North (Document)" value={data.northDocument} />
            <Field label="North (Site Visit)" value={data.northSiteVisit} />
            <Field label="North (Dimensions)" value={data.northDimensions} />
            <Field label="South (Document)" value={data.southDocument} />
            <Field label="South (Site Visit)" value={data.southSiteVisit} />
            <Field label="South (Dimensions)" value={data.southDimensions} />
          </SectionCard>
        )}

        {/* ─── 3. AMENITIES ────────────────────────────────────────────── */}
        <SectionCard title="3. Amenities" onEdit={() => startEdit("amenities",
          ["airport", "busStop", "metroStation", "railwayStation", "college",
            "school", "hospital", "superMarket", "mall", "placeOfWorship", "rickshawStop"])}>
          {editSection === "amenities" ? null : (
            <>
              <Field label="Airport" value={data.airport ? "Yes" : data.airport === false ? "No" : ""} />
              <Field label="Bus Stop" value={data.busStop ? "Yes" : data.busStop === false ? "No" : ""} />
              <Field label="Metro Station" value={data.metroStation ? "Yes" : data.metroStation === false ? "No" : ""} />
              <Field label="Railway Station" value={data.railwayStation ? "Yes" : data.railwayStation === false ? "No" : ""} />
              <Field label="College" value={data.college ? "Yes" : data.college === false ? "No" : ""} />
              <Field label="School" value={data.school ? "Yes" : data.school === false ? "No" : ""} />
              <Field label="Hospital" value={data.hospital ? "Yes" : data.hospital === false ? "No" : ""} />
              <Field label="Super Market" value={data.superMarket ? "Yes" : data.superMarket === false ? "No" : ""} />
              <Field label="Mall" value={data.mall ? "Yes" : data.mall === false ? "No" : ""} />
              <Field label="Place of Worship" value={data.placeOfWorship ? "Yes" : data.placeOfWorship === false ? "No" : ""} />
              <Field label="Rickshaw Stop" value={data.rickshawStop ? "Yes" : data.rickshawStop === false ? "No" : ""} />
            </>
          )}
        </SectionCard>
        {editSection === "amenities" && (
          <EditOverlay
            title="Amenities"
            fields={["airport", "busStop", "metroStation", "railwayStation",
              "college", "school", "hospital", "superMarket", "mall", "placeOfWorship", "rickshawStop"]}
            fieldLabels={{
              airport: "Airport", busStop: "Bus Stop", metroStation: "Metro Station",
              railwayStation: "Railway Station", college: "College", school: "School",
              hospital: "Hospital", superMarket: "Super Market", mall: "Mall",
              placeOfWorship: "Place of Worship", rickshawStop: "Rickshaw Stop"
            }}
          />
        )}

        {/* ─── 4. CAUTION AREA ─────────────────────────────────────────── */}
        {editSection === "cautionArea" ? (
          <EditOverlay
            title="Caution Area"
            fields={["anyChemicalHazard", "nearCrematorium", "probableRoadExtension",
              "statutoryNoticesOnProperty", "communityDominated", "nearGarbageDump",
              "propertyAccessIssues", "underHighTensionLine", "floodProne",
              "nearNalla", "propertyIsLandLocked", "landReservation",
              "nearToRailTrack", "slumArea"]}
            fieldLabels={{
              anyChemicalHazard: "Any Chemical Hazard", nearCrematorium: "Near Crematorium",
              probableRoadExtension: "Probable Road Extension", statutoryNoticesOnProperty: "Statutory Notices",
              communityDominated: "Community Dominated", nearGarbageDump: "Near Garbage Dump",
              propertyAccessIssues: "Property Access Issues", underHighTensionLine: "Under High Tension Line",
              floodProne: "Flood Prone", nearNalla: "Near Nalla",
              propertyIsLandLocked: "Land Locked", landReservation: "Land Reservation",
              nearToRailTrack: "Near Rail Track", slumArea: "Slum Area"
            }}
          />
        ) : (
          <SectionCard title="4. Caution Area" onEdit={() => startEdit("cautionArea",
            ["anyChemicalHazard", "nearCrematorium", "probableRoadExtension",
              "statutoryNoticesOnProperty", "communityDominated", "nearGarbageDump",
              "propertyAccessIssues", "underHighTensionLine", "floodProne",
              "nearNalla", "propertyIsLandLocked", "landReservation",
              "nearToRailTrack", "slumArea"])}>
            <Field label="Chemical Hazard" value={data.anyChemicalHazard ? "Yes" : data.anyChemicalHazard === false ? "No" : ""} />
            <Field label="Near Crematorium" value={data.nearCrematorium ? "Yes" : data.nearCrematorium === false ? "No" : ""} />
            <Field label="Road Extension" value={data.probableRoadExtension ? "Yes" : data.probableRoadExtension === false ? "No" : ""} />
            <Field label="Statutory Notices" value={data.statutoryNoticesOnProperty ? "Yes" : data.statutoryNoticesOnProperty === false ? "No" : ""} />
            <Field label="Community Dominated" value={data.communityDominated ? "Yes" : data.communityDominated === false ? "No" : ""} />
            <Field label="Near Garbage Dump" value={data.nearGarbageDump ? "Yes" : data.nearGarbageDump === false ? "No" : ""} />
            <Field label="Access Issues" value={data.propertyAccessIssues ? "Yes" : data.propertyAccessIssues === false ? "No" : ""} />
            <Field label="High Tension Line" value={data.underHighTensionLine ? "Yes" : data.underHighTensionLine === false ? "No" : ""} />
            <Field label="Flood Prone" value={data.floodProne ? "Yes" : data.floodProne === false ? "No" : ""} />
            <Field label="Near Nalla" value={data.nearNalla ? "Yes" : data.nearNalla === false ? "No" : ""} />
            <Field label="Land Locked" value={data.propertyIsLandLocked ? "Yes" : data.propertyIsLandLocked === false ? "No" : ""} />
            <Field label="Land Reservation" value={data.landReservation ? "Yes" : data.landReservation === false ? "No" : ""} />
            <Field label="Near Rail Track" value={data.nearToRailTrack ? "Yes" : data.nearToRailTrack === false ? "No" : ""} />
            <Field label="Slum Area" value={data.slumArea ? "Yes" : data.slumArea === false ? "No" : ""} />
          </SectionCard>
        )}

        {/* ─── 5. REALIZABLE VALUE ─────────────────────────────────────── */}
        {editSection === "realizableValue" ? (
          <EditOverlay
            title="Realizable Value"
            fields={["landDataArea", "landDataRatePerSqFt", "landDataAmount",
              "totalAppraisedValue", "roundOffTotal", "govtLandRate", "govtLandArea",
              "govtLandAmount", "govtConstructionRate", "govtConstructionArea",
              "govtConstructionAmount", "constructionAreaSqFt", "approvedCoverageSqFt", "costOfConstruction"]}
            fieldLabels={{
              landDataArea: "Land Area", landDataRatePerSqFt: "Rate/SqFt", landDataAmount: "Land Amount",
              totalAppraisedValue: "Total Appraised Value", roundOffTotal: "Round Off Total",
              govtLandRate: "Govt Land Rate", govtLandArea: "Govt Land Area", govtLandAmount: "Govt Land Amount",
              govtConstructionRate: "Govt Construction Rate", govtConstructionArea: "Govt Construction Area",
              govtConstructionAmount: "Govt Construction Amount",
              constructionAreaSqFt: "Construction Area (SqFt)", approvedCoverageSqFt: "Approved Coverage (SqFt)",
              costOfConstruction: "Cost of Construction"
            }}
          />
        ) : (
          <SectionCard title="5. Realizable Value" onEdit={() => startEdit("realizableValue",
            ["landDataArea", "landDataRatePerSqFt", "landDataAmount",
              "totalAppraisedValue", "roundOffTotal", "govtLandRate", "govtLandArea",
              "govtLandAmount", "govtConstructionRate", "govtConstructionArea",
              "govtConstructionAmount", "constructionAreaSqFt", "approvedCoverageSqFt", "costOfConstruction"])}>
            <Field label="Land Area" value={data.landDataArea} />
            <Field label="Rate/SqFt" value={data.landDataRatePerSqFt} />
            <Field label="Land Amount" value={data.landDataAmount} />
            <Field label="Total Appraised Value" value={data.totalAppraisedValue} />
            <Field label="Round Off Total" value={data.roundOffTotal} />
            <Field label="Govt Land Rate" value={data.govtLandRate} />
            <Field label="Govt Land Area" value={data.govtLandArea} />
            <Field label="Govt Land Amount" value={data.govtLandAmount} />
            <Field label="Govt Construction Rate" value={data.govtConstructionRate} />
            <Field label="Govt Construction Area" value={data.govtConstructionArea} />
            <Field label="Govt Construction Amount" value={data.govtConstructionAmount} />
            <Field label="Construction Area (SqFt)" value={data.constructionAreaSqFt} />
            <Field label="Approved Coverage (SqFt)" value={data.approvedCoverageSqFt} />
            <Field label="Cost of Construction" value={data.costOfConstruction} />
          </SectionCard>
        )}

        {/* ─── 6. CONSTRUCTION PROGRESS ────────────────────────────────── */}
        {editSection === "construction" ? (
          <EditOverlay
            title="Construction Progress"
            fields={["typeOfStructure", "structureConfiguration", "structureCompletion",
              "structureRecommendation", "amenityCompletion", "amenityRecommendation",
              "resolutionAmenities", "recommendationAmenities", "recommendedValue", "comments"]}
            fieldLabels={{
              typeOfStructure: "Type of Structure", structureConfiguration: "Structure Configuration",
              structureCompletion: "Structure Completion (%)", structureRecommendation: "Structure Recommendation (%)",
              amenityCompletion: "Amenity Completion (%)", amenityRecommendation: "Amenity Recommendation (%)",
              resolutionAmenities: "Resolution Amenities", recommendationAmenities: "Recommendation Amenities",
              recommendedValue: "Recommended Value", comments: "Comments"
            }}
          />
        ) : (
          <SectionCard title="6. Construction Progress" onEdit={() => startEdit("construction",
            ["typeOfStructure", "structureConfiguration", "structureCompletion",
              "structureRecommendation", "amenityCompletion", "amenityRecommendation",
              "resolutionAmenities", "recommendationAmenities", "recommendedValue", "comments"])}>
            <Field label="Type of Structure" value={data.typeOfStructure} />
            <Field label="Structure Configuration" value={data.structureConfiguration} />
            <Field label="Structure Completion (%)" value={data.structureCompletion} />
            <Field label="Structure Recommendation (%)" value={data.structureRecommendation} />
            <Field label="Amenity Completion (%)" value={data.amenityCompletion} />
            <Field label="Amenity Recommendation (%)" value={data.amenityRecommendation} />
            <Field label="Resolution Amenities" value={data.resolutionAmenities} />
            <Field label="Recommendation Amenities" value={data.recommendationAmenities} />
            <Field label="Recommended Value" value={data.recommendedValue} />
            <Field label="Comments" value={data.comments} />
          </SectionCard>
        )}

        {/* ─── 7. DISTANCE RANGE ───────────────────────────────────────── */}
        {editSection === "distance" ? (
          <EditOverlay
            title="Distance Range"
            fields={["distanceFromCPC", "distanceFromCityCenter", "distanceFromICICIBank",
              "oneWayDistance", "latitude", "longitude"]}
            fieldLabels={{
              distanceFromCPC: "Distance from CPC (km)", distanceFromCityCenter: "Distance from City Center (km)",
              distanceFromICICIBank: "Distance from ICICI Bank (km)", oneWayDistance: "One Way Distance (km)",
              latitude: "Latitude", longitude: "Longitude"
            }}
          />
        ) : (
          <SectionCard title="7. Distance Range" onEdit={() => startEdit("distance",
            ["distanceFromCPC", "distanceFromCityCenter", "distanceFromICICIBank",
              "oneWayDistance", "latitude", "longitude"])}>
            <Field label="Distance from CPC (km)" value={data.distanceFromCPC} />
            <Field label="Distance from City Center (km)" value={data.distanceFromCityCenter} />
            <Field label="Distance from ICICI Bank (km)" value={data.distanceFromICICIBank} />
            <Field label="One Way Distance (km)" value={data.oneWayDistance} />
            <Field label="Latitude" value={data.latitude} />
            <Field label="Longitude" value={data.longitude} />
          </SectionCard>
        )}

        {/* ─── 8. REMARKS ──────────────────────────────────────────────── */}
        {editSection === "remarks" ? (
          <EditOverlay
            title="Remarks"
            fields={["nfsaCheckRequired", "generalObservations", "raleReferences",
              "personName", "personContact", "evaluationMode", "rejectionReason",
              "verifiedBy", "visitDate", "siteVisits"]}
            fieldLabels={{
              nfsaCheckRequired: "NFA/Adherence Checks", generalObservations: "General Observations",
              raleReferences: "Rate Reference", personName: "Person Met at Site",
              personContact: "Mobile No.", evaluationMode: "Evaluation Mode",
              rejectionReason: "Rejection Reason", verifiedBy: "Visited By",
              visitDate: "Date of Site Visit", siteVisits: "No. of Site Visits"
            }}
          />
        ) : (
          <SectionCard title="8. Remarks" onEdit={() => startEdit("remarks",
            ["nfsaCheckRequired", "generalObservations", "raleReferences",
              "personName", "personContact", "evaluationMode", "rejectionReason",
              "verifiedBy", "visitDate", "siteVisits"])}>
            <div className="col-span-3">
              <Field label="NFA/Adherence Checks" value={data.nfsaCheckRequired?.replace(/<[^>]*>/g, "") || ""} />
            </div>
            <div className="col-span-3">
              <Field label="General Observations" value={data.generalObservations?.replace(/<[^>]*>/g, "") || ""} />
            </div>
            <div className="col-span-3">
              <Field label="Rate Reference" value={data.raleReferences?.replace(/<[^>]*>/g, "") || ""} />
            </div>
            <Field label="Person Met at Site" value={data.personName} />
            <Field label="Mobile No." value={data.personContact} />
            <Field label="Evaluation Mode" value={data.evaluationMode} />
            <Field label="Rejection Reason" value={data.rejectionReason} />
            <Field label="Visited By" value={data.verifiedBy} />
            <Field label="Date of Site Visit" value={data.visitDate} />
            <Field label="No. of Site Visits" value={data.siteVisits} />
          </SectionCard>
        )}

        {/* ─── BOTTOM ACTION BUTTONS ───────────────────────────────────── */}
        <div className="no-print bg-white rounded-lg border border-gray-200 p-5 mt-6">
  
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">

    {/* LEFT */}
    <button
      onClick={() => navigate(`/bank/icici/edit/${id}`)}
      className="px-6 py-2 border-2 border-[#003b70] text-[#003b70] rounded font-semibold text-[15px] hover:bg-[#f0f4ff]"
    >
      ✏️ Edit Full Form
    </button>

    {/* RIGHT BUTTONS */}
    <div className="flex flex-wrap justify-end gap-3 w-full md:w-auto">

      {!isFinalSubmitted && (
        <button
          onClick={handleReSubmit}
          disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded font-semibold text-[15px] hover:bg-green-700 disabled:opacity-50"
        >
          💾 Save Report
        </button>
      )}

      {isAdmin && !isFinalSubmitted && (
        <button
          onClick={handleFinalSubmit}
          disabled={saving}
          className="px-6 py-2 bg-red-600 text-white rounded font-semibold text-[15px] hover:bg-red-700 disabled:opacity-50"
        >
          🚀 Final Submit
        </button>
      )}

     <button
  onClick={() => {
    setTimeout(() => {
      window.print();
    }, 300);
  }}
  className="px-6 py-2 bg-[#1d4ed8] text-white rounded font-semibold text-[15px] hover:bg-[#1e40af]"
>
  📄 Print / PDF
</button>

    </div>
  </div>
</div>
        

      </div>
    </div>
  );
};

export default IciciBankDetails;