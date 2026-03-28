


import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Option } = Select;

// ═══════════════════════════════════════════════════════════════════════════
// Word Doc ke 14 default remarks
// RED placeholders:
//   Remark 1  → seller name, buyer name
//   Remark 2  → person met, contact no
//   Remark 6  → land area + dimensions
//   Remark 14 → land rate
// ═══════════════════════════════════════════════════════════════════════════
const buildDefaultRemarks = (extracted = {}, formData = {}) => {
  const pick = (...keys) => {
    for (const k of keys) {
      const v = extracted?.[k] ?? formData?.[k];
      if (v !== undefined && v !== null && v !== "") return String(v);
    }
    return null;
  };

  // Remark 1 — seller / buyer
  const sellerNames =
    Array.isArray(extracted?.seller) && extracted.seller.length > 0
      ? extracted.seller.map((s) => s.name).join(", ")
      : pick("propertyOwnerName") || "..........";

  const buyerNames =
    Array.isArray(extracted?.buyer) && extracted.buyer.length > 0
      ? extracted.buyer.map((b) => b.name).join(", ")
      : pick("customerName") || "..........";

  // Remark 2 — person met + contact
  const personMet = pick("personMetDuringVisit") || "..........";
  const contactNo = pick("customerNo") || "..........";

  // Remark 6 — land area + dimensions
  const plotArea =
    extracted?.property?.plot_area || pick("landArea") || "......";
  const dimensions =
    extracted?.property?.plot_dimensions || pick("linearDimension") || "";
  const areaStr = dimensions ? `${plotArea} (${dimensions})` : plotArea;

  // Remark 14 — land rate
  const landRate = pick("landSiteRate", "marketRatePerSqft") || "......";

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

// ═══════════════════════════════════════════════════════════════════════════
// Analysis data builder — Word doc questions ke answers extracted data se
// ═══════════════════════════════════════════════════════════════════════════
const buildAnalysis = (extracted = {}, formData = {}) => {
  if (!extracted || Object.keys(extracted).length === 0) return null;

  const prop = extracted?.property || {};
  const addr = prop?.address || {};
  const bnds = prop?.boundaries || {};

  return {
    docType: extracted?.document_type || "—",
    regNo: extracted?.registration_number || "—",
    regDate: extracted?.registration_date || "—",
    sellers: Array.isArray(extracted?.seller)
      ? extracted.seller.map((s) => `${s.name} (${s.relation})`).join(", ")
      : "—",
    buyers: Array.isArray(extracted?.buyer)
      ? extracted.buyer.map((b) => `${b.name} (${b.relation})`).join(", ")
      : "—",
    plotArea: prop?.plot_area || "—",
    plotDim: prop?.plot_dimensions || "—",
    propUse: prop?.property_use || formData?.usageOfProperty || "—",
    propType: prop?.property_type || formData?.unitType || "—",
    address: [
      addr.plot_number && `Plot No. ${addr.plot_number}`,
      addr.colony_area,
      addr.ward_number && `Ward ${addr.ward_number}`,
      addr.tehsil && `Tehsil: ${addr.tehsil}`,
      addr.district && `Dist: ${addr.district}`,
      addr.state,
      addr.pincode,
    ].filter(Boolean).join(", "),
    boundaries: Object.entries(bnds)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join(" | "),
    raw: extracted,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
const ValuationDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();
  const [remarksCount, setRemarksCount] = useState(14);

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };

    // ── valuation fields ──
    form.setFieldsValue({
      landDocumentArea: merged.landDocumentArea || "",
      landDocumentRate: merged.landDocumentRate || "",
      landDocumentValuation: merged.landDocumentValuation || "",
      landPlanArea: merged.landPlanArea || "",
      landPlanRate: merged.landPlanRate || "",
      landPlanValuation: merged.landPlanValuation || "",
      landSiteArea: merged.landSiteArea || merged.landAreaSite || "",
      landSiteRate: merged.landSiteRate || merged.landRate || "",
      landSiteValuation: merged.landSiteValuation || "",
      constructionDocumentArea: merged.constructionDocumentArea || "",
      constructionDocumentRate: merged.constructionDocumentRate || "",
      constructionDocumentValuation: merged.constructionDocumentValuation || "",
      constructionPlanArea: merged.constructionPlanArea || "",
      constructionPlanRate: merged.constructionPlanRate || "",
      constructionPlanValuation: merged.constructionPlanValuation || "",
      constructionSiteArea: merged.constructionSiteArea || merged.constructionAreaForValuation || "",
      constructionSiteRate: merged.constructionSiteRate || merged.constructionRate || "",
      constructionSiteValuation: merged.constructionSiteValuation || "",
      amenitiesDetails: merged.amenitiesDetails || "NA",
      amenitiesValue: merged.amenitiesValue || "",
      liftAvailable: merged.liftAvailable || "",
      buildingHeight: merged.buildingHeight || "",
      realizableValue: merged.realizableValue || "",
      constructionStage: merged.constructionStage || "",
      constructionStatus: merged.constructionStatus || "",
      ValuationatPresentStage: merged.ValuationatPresentStage || "",
      ValuationasperGovtGuideline: merged.ValuationasperGovtGuideline || "",
      constructionEstimateByCustomer: merged.constructionEstimateByCustomer || "",
      estimateRecommendedByValuer: merged.estimateRecommendedByValuer || "",
      marketRatePerSqft: merged.marketRatePerSqft || "",
      constructionAsPerPlan: merged.constructionAsPerPlan || "",
    });

    // ── remarks: saved DB wale ya fresh defaults ──
    const savedRemarks =
      merged.valuationRemarks &&
        Array.isArray(merged.valuationRemarks) &&
        merged.valuationRemarks.length > 0
        ? merged.valuationRemarks
        : buildDefaultRemarks(extractedData, isEdit);

    setRemarksCount(savedRemarks.length);
    savedRemarks.forEach((r, i) => {
      form.setFieldValue(["valuationRemarks", i], r);
    });
  }, [isEdit, extractedData, form]);

  // ── auto-calc ──
  const handleValuesChange = (_, all) => {
    const n = (k) => parseFloat(all[k]) || 0;
    const lSite = n("landSiteArea") * n("landSiteRate");
    const cSite = n("constructionSiteArea") * n("constructionSiteRate");
    form.setFieldsValue({
      landDocumentValuation: n("landDocumentArea") * n("landDocumentRate") || "",
      landPlanValuation: n("landPlanArea") * n("landPlanRate") || "",
      landSiteValuation: lSite || "",
      constructionDocumentValuation: n("constructionDocumentArea") * n("constructionDocumentRate") || "",
      constructionPlanValuation: n("constructionPlanArea") * n("constructionPlanRate") || "",
      constructionSiteValuation: cSite || "",
      realizableValue: lSite + cSite + (n("amenitiesValue")) || "",
    });
  };

  const handleSubmit = (values) => {
    onNext({
      ...values,
      valuationRemarks: Array.isArray(values.valuationRemarks)
        ? values.valuationRemarks
        : [values.valuationRemarks].filter(Boolean),
    });
  };

  const addRemarkField = () => setRemarksCount((p) => p + 1);
  const removeRemarkField = (index) => {
    const remarks = form.getFieldValue("valuationRemarks") || [];
    const updated = [...remarks];
    updated.splice(index, 1);
    form.setFieldsValue({ valuationRemarks: updated });
    setRemarksCount((p) => p - 1);
  };

  const AreaRateRow = ({ prefix, labelPrefix }) => (
    <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded">
      <Form.Item label={`${labelPrefix} Area (sq.ft)`} name={`${prefix}Area`} className="mb-0">
        <Input type="number" placeholder="0" />
      </Form.Item>
      <Form.Item label="Rate per sq.ft" name={`${prefix}Rate`} className="mb-0">
        <Input type="number" placeholder="0" />
      </Form.Item>
      <Form.Item label="Valuation (auto)" name={`${prefix}Valuation`} className="mb-0">
        <Input type="number" disabled />
      </Form.Item>
    </div>
  );

  const analysis = buildAnalysis(extractedData, isEdit);
  const hasExtracted = !!analysis;

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Valuation Details</h2>

      <Form layout="vertical" form={form} onFinish={handleSubmit} onValuesChange={handleValuesChange}>

        {/* ── Land ── */}
        <Divider orientation="left">Land</Divider>
        <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
        <AreaRateRow prefix="landDocument" labelPrefix="Document" />
        <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
        <AreaRateRow prefix="landPlan" labelPrefix="Plan" />
        <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
        <AreaRateRow prefix="landSite" labelPrefix="Site" />

        {/* ── Construction ── */}
        <Divider orientation="left">Construction</Divider>
        <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
        <AreaRateRow prefix="constructionDocument" labelPrefix="Document" />
        <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
        <AreaRateRow prefix="constructionPlan" labelPrefix="Plan" />
        <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
        <AreaRateRow prefix="constructionSite" labelPrefix="Site" />

        {/* ── Summary ── */}
        <Divider orientation="left">Summary</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Amenities (Mention Details)" name="amenitiesDetails"><Input /></Form.Item>
          <Form.Item label="Value of Amenities (A)" name="amenitiesValue"><Input type="number" /></Form.Item>
          <Form.Item label="Lift Available? (Yes / No)" name="liftAvailable">
            <Select allowClear>
              <Option value="YES">Yes</Option>
              <Option value="NO">No</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Height of the Building (in Meters)" name="buildingHeight"><Input type="number" /></Form.Item>
          <Form.Item label="Realizable Value after Completion (L3 + C3 + A)" name="realizableValue" className="md:col-span-2">
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item label="Construction Stage" name="constructionStage" className="md:col-span-2">
            <Select allowClear>
              {["Foundation", "Plinth", "Brick Work", "RCC", "Plaster", "Tiling", "Internal Finishing", "Completed", "G.F PROPOSED", "OPEN PLOT"].map(v => (
                <Option key={v} value={v}>{v}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Construction %" name="constructionStatus"><Input placeholder="e.g. 0%" /></Form.Item>
          <Form.Item label="Valuation at Current Stage" name="ValuationatPresentStage"><Input type="number" /></Form.Item>
          <Form.Item label="Valuation as per Govt. Guideline" name="ValuationasperGovtGuideline"><Input type="number" /></Form.Item>
          <Form.Item label="Construction Estimate Shared by Customer" name="constructionEstimateByCustomer"><Input type="number" /></Form.Item>
          <Form.Item label="Estimate Recommended (by Valuer)" name="estimateRecommendedByValuer"><Input type="number" /></Form.Item>
          <Form.Item label="Market Rate for Similar Properties (Rs/sq.ft)" name="marketRatePerSqft"><Input placeholder="e.g. 1600-1700" /></Form.Item>
          <Form.Item label="Whether Construction is as per Plan / Permission / By-Laws" name="constructionAsPerPlan">
            <Select allowClear>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION 11 — OBSERVATIONS / REMARKS
            14 default remarks from Word doc, red parts auto-filled
        ══════════════════════════════════════════════════════════ */}
        <Divider orientation="left">
          <span className="font-bold">Observations / Remarks — Section 11</span>
        </Divider>

        {hasExtracted && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-blue-800 flex gap-2">
            <span className="text-lg">✅</span>
            <span>
              <b>Document se auto-fill ho gaya:</b> Seller/buyer names, person met, contact no., land area aur rate remarks mein inject ho gaye hain.
            </span>
          </div>
        )}

        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          {Array.from({ length: remarksCount }).map((_, index) => (
            <div key={index} className="flex items-start mb-3 gap-2">
              <span className="mt-2 min-w-[26px] text-gray-600 font-bold text-sm">{index + 1}.</span>
              <Form.Item name={["valuationRemarks", index]} noStyle>
                <Input.TextArea
                  rows={2}
                  style={{ width: "calc(100% - 70px)" }}
                  placeholder={`Remark ${index + 1}`}
                />
              </Form.Item>
              {index >= 1 && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => removeRemarkField(index)}
                  className="mt-1"
                />
              )}
            </div>
          ))}
          <Button type="dashed" onClick={addRemarkField} icon={<PlusOutlined />} className="mt-1">
            Add Remark
          </Button>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ANALYSIS SECTION — extracted document ka poora data
        ══════════════════════════════════════════════════════════ */}
        {analysis && (
          <>
            <Divider orientation="left">
              <span className="font-bold text-orange-600">Analysis — Extracted Document Data</span>
            </Divider>

            <div className="border border-orange-200 rounded-lg overflow-hidden mb-6">
              {/* Header bar */}
              <div className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold flex flex-wrap gap-4">
                <span>📄 {analysis.docType}</span>
                <span>| Reg No: {analysis.regNo}</span>
                <span>| Date: {analysis.regDate}</span>
              </div>

              <div className="p-4 space-y-2">
                {/* Word doc analysis questions answered */}
                {[
                  { q: "As per doc plot area", a: `${analysis.plotArea}${analysis.plotDim !== "—" ? ` (${analysis.plotDim})` : ""}` },
                  { q: "What is land uses of property", a: analysis.propUse },
                  { q: "The property is Leasehold or Freehold", a: analysis.docType === "Conveyance" ? "Freehold (Conveyance deed)" : "Check document" },
                  { q: "What is the issue in this property", a: "To be filled by valuer after inspection" },
                  { q: "What is uses of this property", a: `${analysis.propType} — ${analysis.propUse}` },
                  { q: "Which kind of documents I received", a: `${analysis.docType} (Reg: ${analysis.regNo}, Date: ${analysis.regDate})` },
                ].map(({ q, a }, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-orange-50 rounded">
                    <span className="text-orange-500 font-bold min-w-[20px] mt-0.5">→</span>
                    <div className="text-sm">
                      <b className="text-orange-700">{q}:</b>
                      <span className="ml-2 text-gray-800">{a}</span>
                    </div>
                  </div>
                ))}

                {/* Detailed info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-orange-200">
                  <InfoCard label="SELLER" value={analysis.sellers} />
                  <InfoCard label="BUYER" value={analysis.buyers} />
                  {analysis.address && <InfoCard label="ADDRESS" value={analysis.address} className="md:col-span-2" />}
                  {analysis.boundaries && <InfoCard label="BOUNDARIES" value={analysis.boundaries} className="md:col-span-2" />}
                </div>

                {/* Raw JSON collapsible */}
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-orange-600 font-semibold hover:underline">
                    View full extracted JSON ▼
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-64 text-gray-600 leading-relaxed">
                    {JSON.stringify(analysis.raw, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </>
        )}

        <Form.Item className="text-right">
          {onBack && (
            <Button type="default" onClick={onBack} className="mr-2">Back</Button>
          )}
          <Button type="primary" htmlType="submit">Next</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

// Small helper component
const InfoCard = ({ label, value, className = "" }) => (
  <div className={`bg-white border rounded p-2 text-sm ${className}`}>
    <b className="text-gray-400 text-xs block mb-0.5">{label}</b>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default ValuationDetails;



// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Select, Divider } from "antd";
// import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const ValuationDetails = ({ isEdit, onNext, onBack, extractedData }) => {
//   const [form] = Form.useForm();
//   const [remarksCount, setRemarksCount] = useState(1);

//   useEffect(() => {
//     const merged = { ...extractedData, ...isEdit };
//     if (merged) {
//       form.setFieldsValue({
//         // Land area rows (Document L1, Plan L2, Site L3)
//         landDocumentArea: merged.landDocumentArea || "",
//         landDocumentRate: merged.landDocumentRate || "",
//         landDocumentValuation: merged.landDocumentValuation || "",

//         landPlanArea: merged.landPlanArea || "",
//         landPlanRate: merged.landPlanRate || "",
//         landPlanValuation: merged.landPlanValuation || "",

//         landSiteArea: merged.landSiteArea || merged.landAreaSite || "",
//         landSiteRate: merged.landSiteRate || merged.landRate || "",
//         landSiteValuation: merged.landSiteValuation || "",

//         // Construction rows
//         constructionDocumentArea: merged.constructionDocumentArea || "",
//         constructionDocumentRate: merged.constructionDocumentRate || "",
//         constructionDocumentValuation: merged.constructionDocumentValuation || "",

//         constructionPlanArea: merged.constructionPlanArea || "",
//         constructionPlanRate: merged.constructionPlanRate || "",
//         constructionPlanValuation: merged.constructionPlanValuation || "",

//         constructionSiteArea: merged.constructionSiteArea || merged.constructionAreaForValuation || "",
//         constructionSiteRate: merged.constructionSiteRate || merged.constructionRate || "",
//         constructionSiteValuation: merged.constructionSiteValuation || "",

//         // Summary
//         amenitiesDetails: merged.amenitiesDetails || "NA",
//         amenitiesValue: merged.amenitiesValue || "",
//         liftAvailable: merged.liftAvailable || "",
//         buildingHeight: merged.buildingHeight || "",
//         realizableValue: merged.realizableValue || "",
//         constructionStage: merged.constructionStage || "",
//         constructionStatus: merged.constructionStatus || "",
//         ValuationatPresentStage: merged.ValuationatPresentStage || merged.valuation_at_current_stage || "",
//         ValuationasperGovtGuideline: merged.ValuationasperGovtGuideline || "",
//         constructionEstimateByCustomer: merged.constructionEstimateByCustomer || "",
//         estimateRecommendedByValuer: merged.estimateRecommendedByValuer || "",
//         marketRatePerSqft: merged.marketRatePerSqft || "",
//         constructionAsPerPlan: merged.constructionAsPerPlan || "",
//       });

//       if (merged.valuationRemarks && Array.isArray(merged.valuationRemarks)) {
//         setRemarksCount(merged.valuationRemarks.length || 1);
//         merged.valuationRemarks.forEach((remark, idx) => {
//           form.setFieldValue(["valuationRemarks", idx], remark);
//         });
//       }
//     }
//   }, [isEdit, extractedData, form]);

//   // Auto-calculate valuations on change
//   const handleValuesChange = (_, allValues) => {
//     const landSiteArea = parseFloat(allValues.landSiteArea) || 0;
//     const landSiteRate = parseFloat(allValues.landSiteRate) || 0;
//     const landSiteVal = landSiteArea * landSiteRate;

//     const landPlanArea = parseFloat(allValues.landPlanArea) || 0;
//     const landPlanRate = parseFloat(allValues.landPlanRate) || 0;
//     const landPlanVal = landPlanArea * landPlanRate;

//     const landDocArea = parseFloat(allValues.landDocumentArea) || 0;
//     const landDocRate = parseFloat(allValues.landDocumentRate) || 0;
//     const landDocVal = landDocArea * landDocRate;

//     const constDocArea = parseFloat(allValues.constructionDocumentArea) || 0;
//     const constDocRate = parseFloat(allValues.constructionDocumentRate) || 0;
//     const constDocVal = constDocArea * constDocRate;

//     const constPlanArea = parseFloat(allValues.constructionPlanArea) || 0;
//     const constPlanRate = parseFloat(allValues.constructionPlanRate) || 0;
//     const constPlanVal = constPlanArea * constPlanRate;

//     const constSiteArea = parseFloat(allValues.constructionSiteArea) || 0;
//     const constSiteRate = parseFloat(allValues.constructionSiteRate) || 0;
//     const constSiteVal = constSiteArea * constSiteRate;

//     const amenities = parseFloat(allValues.amenitiesValue) || 0;
//     const realizable = landSiteVal + constSiteVal + amenities;

//     form.setFieldsValue({
//       landDocumentValuation: landDocVal || "",
//       landPlanValuation: landPlanVal || "",
//       landSiteValuation: landSiteVal || "",
//       constructionDocumentValuation: constDocVal || "",
//       constructionPlanValuation: constPlanVal || "",
//       constructionSiteValuation: constSiteVal || "",
//       realizableValue: realizable || "",
//     });
//   };

//   const handleSubmit = (values) => {
//     const formattedValues = {
//       ...values,
//       valuationRemarks: Array.isArray(values.valuationRemarks)
//         ? values.valuationRemarks
//         : [values.valuationRemarks].filter(Boolean),
//     };
//     onNext(formattedValues);
//   };

//   const addRemarkField = () => setRemarksCount((prev) => prev + 1);
//   const removeRemarkField = (index) => {
//     setRemarksCount((prev) => prev - 1);
//     const remarks = form.getFieldValue("valuationRemarks") || [];
//     const newRemarks = [...remarks];
//     newRemarks.splice(index, 1);
//     form.setFieldsValue({ valuationRemarks: newRemarks });
//   };

//   // Reusable row component
//   const AreaRateRow = ({ prefix, labelPrefix }) => (
//     <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded">
//       <Form.Item label={`${labelPrefix} Area (sq.ft)`} name={`${prefix}Area`} className="mb-0">
//         <Input type="number" placeholder="0" />
//       </Form.Item>
//       <Form.Item label="Rate per sq.ft" name={`${prefix}Rate`} className="mb-0">
//         <Input type="number" placeholder="0" />
//       </Form.Item>
//       <Form.Item label="Valuation (auto)" name={`${prefix}Valuation`} className="mb-0">
//         <Input type="number" disabled />
//       </Form.Item>
//     </div>
//   );

//   return (
//     <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-6">Valuation Details</h2>

//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         onValuesChange={handleValuesChange}
//         className="grid grid-cols-1 gap-4"
//       >
//         {/* ── Land ── */}
//         <Divider orientation="left">Land</Divider>

//         <div>
//           <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
//           <AreaRateRow prefix="landDocument" labelPrefix="Document" />

//           <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
//           <AreaRateRow prefix="landPlan" labelPrefix="Plan" />

//           <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
//           <AreaRateRow prefix="landSite" labelPrefix="Site" />
//         </div>

//         {/* ── Construction ── */}
//         <Divider orientation="left">Construction</Divider>

//         <div>
//           <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
//           <AreaRateRow prefix="constructionDocument" labelPrefix="Document" />

//           <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
//           <AreaRateRow prefix="constructionPlan" labelPrefix="Plan" />

//           <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
//           <AreaRateRow prefix="constructionSite" labelPrefix="Site" />
//         </div>

//         {/* ── Amenities & Summary ── */}
//         <Divider orientation="left">Summary</Divider>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Form.Item label="Amenities (Mention Details)" name="amenitiesDetails">
//             <Input />
//           </Form.Item>

//           <Form.Item label="Value of Amenities (A)" name="amenitiesValue">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Lift Available? (Yes / No)" name="liftAvailable">
//             <Select allowClear>
//               <Option value="YES">Yes</Option>
//               <Option value="NO">No</Option>
//               <Option value="NA">NA</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Height of the Building (in Meters)" name="buildingHeight">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item
//             label="Realizable Value after Completion (L3 + C3 + A)"
//             name="realizableValue"
//             className="md:col-span-2"
//           >
//             <Input type="number" disabled />
//           </Form.Item>

//           <Form.Item
//             label="Construction Stage (Foundation / Plinth / Brick Work / RCC / Plaster / Tiling / Internal Finishing / Completed)"
//             name="constructionStage"
//             className="md:col-span-2"
//           >
//             <Select allowClear>
//               <Option value="Foundation">Foundation</Option>
//               <Option value="Plinth">Plinth</Option>
//               <Option value="Brick Work">Brick Work</Option>
//               <Option value="RCC">RCC</Option>
//               <Option value="Plaster">Plaster</Option>
//               <Option value="Tiling">Tiling</Option>
//               <Option value="Internal Finishing">Internal Finishing</Option>
//               <Option value="Completed">Completed</Option>
//               <Option value="G.F PROPOSED">G.F Proposed</Option>
//               <Option value="OPEN PLOT">Open Plot</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label="Construction %" name="constructionStatus">
//             <Input placeholder="e.g. 0%" />
//           </Form.Item>

//           <Form.Item label="Valuation at Current Stage" name="ValuationatPresentStage">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Valuation as per Govt. Guideline (L3+C3+A)" name="ValuationasperGovtGuideline">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Construction Estimate Shared by Customer (L3+C3+A)" name="constructionEstimateByCustomer">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Estimate Recommended (by Valuer)" name="estimateRecommendedByValuer">
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Market Rate for Similar Properties in Locality (Rs/sq.ft)" name="marketRatePerSqft">
//             <Input placeholder="e.g. 1600-1700" />
//           </Form.Item>

//           <Form.Item
//             label="Whether Construction is as per Plan / Permission / Building By-Laws"
//             name="constructionAsPerPlan"
//           >
//             <Select allowClear>
//               <Option value="Yes">Yes</Option>
//               <Option value="No">No</Option>
//               <Option value="NA">NA</Option>
//             </Select>
//           </Form.Item>
//         </div>

//         {/* ── Observation Remarks (Section 11) ── */}
//         <Divider orientation="left">Observations / Remarks (Section 11)</Divider>

//         <div className="mb-4">
//           {Array.from({ length: remarksCount }).map((_, index) => (
//             <div key={index} className="flex items-center mb-2 gap-2">
//               <Form.Item name={["valuationRemarks", index]} noStyle>
//                 <Input.TextArea rows={2} style={{ width: "90%" }} placeholder={`Remark ${index + 1}`} />
//               </Form.Item>
//               {index > 0 && (
//                 <Button
//                   type="text"
//                   danger
//                   icon={<MinusOutlined />}
//                   onClick={() => removeRemarkField(index)}
//                 />
//               )}
//             </div>
//           ))}
//           <Button
//             type="dashed"
//             onClick={addRemarkField}
//             icon={<PlusOutlined />}
//             className="mt-2"
//           >
//             Add Remark
//           </Button>
//         </div>

//         <Form.Item className="text-right">
//           {onBack && (
//             <Button type="default" onClick={onBack} className="mr-2 px-4 py-2 bg-gray-500 rounded">
//               Back
//             </Button>
//           )}
//           <Button type="primary" htmlType="submit">Next</Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default ValuationDetails;
