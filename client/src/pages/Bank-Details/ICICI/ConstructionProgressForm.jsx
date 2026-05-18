// ConstructionProgressForm.jsx — iLens replica, scoped CSS, no Ant Design
import React, { useState, useEffect } from "react";

// ─── STRUCTURE TYPES (same as PropertyDetailsForm) ───────────────────────────
const STRUCTURE_TYPES = [
  { value: "rcc",            label: "RCC" },
  { value: "load_bearing",   label: "Load Bearing" },
  { value: "composite",      label: "Composite" },
  { value: "steel_structure",label: "Steel Structure" },
];

const DEFAULT_STAGE_ROWS = [
  { id: "plinth", label: "Plinth", planned: "1", actual: "", completionWeight: 10, recommendationWeight: 30 },
  { id: "rcc", label: "RCC (i.e. number of slabs)", planned: "1", actual: "", completionWeight: 23, recommendationWeight: 17 },
  { id: "lintel", label: "B/W up-to Lintel", planned: "1", actual: "", completionWeight: 10, recommendationWeight: 10 },
  { id: "slab", label: "B/W up-to Slab", planned: "1", actual: "", completionWeight: 3, recommendationWeight: 3 },
  { id: "plastering", label: "Plastering", planned: "1", actual: "", completionWeight: 7, recommendationWeight: 7 },
  { id: "flooring", label: "Flooring", planned: "1", actual: "", completionWeight: 7, recommendationWeight: 3 },
  { id: "electrification", label: "Electrification & Plumbing", planned: "1", actual: "", completionWeight: 3, recommendationWeight: 3 },
  { id: "woodwork", label: "Woodwork & Painting", planned: "1", actual: "", completionWeight: 3, recommendationWeight: 3 },
];

const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));
const formatPercentValue = (value) => String(Math.round(clampPercent(value)));

function calculateStageTotals(rows) {
  return (rows || []).reduce((acc, row) => {
    const planned = Number(row.planned) || 0;
    const actual = Number(row.actual) || 0;
    const componentCompletion = planned > 0 ? clampPercent((actual / planned) * 100) : 0;

    acc.componentTotal += componentCompletion;
    acc.completion += (componentCompletion * (Number(row.completionWeight) || 0)) / 100;
    acc.recommendation += (componentCompletion * (Number(row.recommendationWeight) || 0)) / 100;
    return acc;
  }, { componentTotal: 0, completion: 0, recommendation: 0 });
}

// ─── NUMBER WORDS (for Recommended Value display) ────────────────────────────
const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function numberToWords(n) {
  const num = parseInt(n, 10);
  if (!num || isNaN(num) || num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(-num);

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  }
  return convert(num);
}

// ─── SCOPED STYLES ───────────────────────────────────────────────────────────
const css = `
  .cp-wrap *, .cp-wrap *::before, .cp-wrap *::after {
    box-sizing: border-box;
  }
  .cp-wrap {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    color: #222;
    width: 100%;
    padding: 16px;
  }

  /* ── Page title ── */
  .cp-wrap .cp-page-title {
    color: #e8472b;
    font-weight: 700;
    font-size: 17px;
    margin-bottom: 18px;
  }

  /* ── Top 4-column fields row ── */
  .cp-wrap .cp-top-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px 24px;
    margin-bottom: 20px;
  }
  .cp-wrap .cp-field-label {
    font-size: 11.5px;
    color: #666;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .cp-wrap .cp-field-label .req { color: #e8472b; }
  .cp-wrap .cp-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 4px 2px 6px;
    transition: border-color 0.2s;
  }
  .cp-wrap .cp-input:focus { border-bottom-color: #1677ff; }
  .cp-wrap .cp-input:read-only {
    color: #111;
    cursor: default;
  }
  .cp-wrap .cp-input:disabled,
  .cp-wrap .cp-inline-input:disabled {
    color: #111;
    cursor: default;
    opacity: 1;
  }
  .cp-wrap .cp-select {
    width: 100%;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 4px 18px 6px 2px;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 4px center;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .cp-wrap .cp-select:focus { border-bottom-color: #1677ff; }

  /* ── Big gray summary card ── */
  .cp-wrap .cp-summary-card {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 20px 24px;
    margin-bottom: 22px;
  }

  /* ── Stage section inside card ── */
  .cp-wrap .cp-stage-title {
    color: #1b3a6b;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .cp-wrap .cp-stage-row {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 20px;
  }
  .cp-wrap .cp-stage-half {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .cp-wrap .cp-stage-key {
    font-weight: 700;
    font-size: 13px;
    color: #222;
    white-space: nowrap;
  }
  /* narrow inline underline input */
  .cp-wrap .cp-inline-input {
    width: 90px;
    border: none;
    border-bottom: 1px solid #aaa;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 2px 2px 4px;
    text-align: center;
    transition: border-color 0.2s;
  }
  .cp-wrap .cp-inline-input:focus { border-bottom-color: #1677ff; }
  .cp-wrap .cp-stage-unit {
    font-weight: 700;
    font-size: 13px;
    color: #222;
  }

  /* ── Separator between stages ── */
  .cp-wrap .cp-stage-divider {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 0 0 16px;
  }

  /* ── Recommended value row ── */
  .cp-wrap .cp-rec-value {
    font-weight: 700;
    font-size: 13px;
    color: #222;
    padding-top: 4px;
    border-top: 1px solid #e0e0e0;
    margin-top: 4px;
  }

  /* ── Comments section ── */
  .cp-wrap .cp-comments-title {
    color: #e8472b;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 8px;
  }
  .cp-wrap .cp-textarea {
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    outline: none;
    font-size: 13px;
    color: #222;
    padding: 10px 12px;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    min-height: 110px;
    background: #fff;
    transition: border-color 0.2s;
  }
  .cp-wrap .cp-textarea:focus { border-color: #1677ff; }
  .cp-wrap .cp-textarea::placeholder { color: #bbb; }
  .cp-wrap .cp-char-count {
    text-align: right;
    font-size: 11px;
    color: #aaa;
    margin-top: 4px;
    margin-bottom: 24px;
  }

  /* ── Action buttons ── */
  .cp-wrap .cp-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
  }
  .cp-wrap .cp-btn {
    padding: 7px 32px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    background: #fff;
    color: #333;
    transition: all 0.2s;
    font-weight: 500;
  }
  .cp-wrap .cp-btn:hover { border-color: #1677ff; color: #1677ff; }
  .cp-wrap .cp-btn.primary {
    background: #1b3a6b;
    color: #fff;
    border-color: #1b3a6b;
  }
  .cp-wrap .cp-btn.primary:hover { background: #152f58; }
  .cp-wrap .cp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .cp-wrap .cp-calculator-row {
    display: flex;
    justify-content: flex-end;
    margin: -6px 0 14px;
  }
  .cp-wrap .cp-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .cp-wrap .cp-modal {
    width: min(1180px, 96vw);
    max-height: 88vh;
    overflow: auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.25);
    padding: 18px;
    position: relative;
  }
  .cp-wrap .cp-modal-close {
    position: absolute;
    right: 10px;
    top: 8px;
    border: none;
    background: transparent;
    font-size: 22px;
    cursor: pointer;
    color: #666;
  }
  .cp-wrap .cp-stage-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 13px;
  }
  .cp-wrap .cp-stage-table th {
    background: #f1f0eb;
    text-align: left;
    padding: 12px 10px;
    font-weight: 700;
  }
  .cp-wrap .cp-stage-table td {
    padding: 10px;
    border-bottom: 1px solid #f1f1f1;
  }
  .cp-wrap .cp-stage-table tr:nth-child(even) td { background: #fafafa; }
  .cp-wrap .cp-table-input {
    width: 100%;
    max-width: 160px;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    padding: 4px 2px;
  }
  .cp-wrap .cp-stage-table tfoot td {
    font-weight: 700;
    background: #fff;
    border-bottom: none;
  }
  .cp-wrap .cp-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ConstructionProgressForm = ({ data, editData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    typeOfStructure:               "",
    structureConfiguration:        "",
    constructionStatus:            "",
    stageOfCompletionAmenities:    "",
    stageOfRecommendationAmenities:"",
    stageOfAmenityCompletion:      "",
    stageOfAmenityRecommendation:  "",
    stageOfStructureCompletion:    "",
    stageOfStructureRecommendation:"100",
    recommendedValue:              "0",
    commentsOnConstruction:        "",
  });
  const [showStageCalculator, setShowStageCalculator] = useState(false);
  const [stageRows, setStageRows] = useState(DEFAULT_STAGE_ROWS);

  useEffect(() => {
    const src = editData || data;
    if (!src) return;

    setForm((prev) => {
      const next = {
        ...prev,
        ...src,
        typeOfStructure: src.typeOfStructure ?? prev.typeOfStructure,
        structureConfiguration: src.structureConfiguration ?? prev.structureConfiguration,
        constructionStatus: src.constructionStatus ?? prev.constructionStatus,
      };

      if (src.constructionStatus === "completed") {
        return {
          ...next,
          stageOfCompletionAmenities: "100",
          stageOfRecommendationAmenities: "100",
          stageOfAmenityCompletion: "100",
          stageOfAmenityRecommendation: "100",
          stageOfStructureCompletion: "100",
          stageOfStructureRecommendation: "100",
        };
      }

      return next;
    });
    if (Array.isArray(src.stageCalculatorRows) && src.stageCalculatorRows.length) {
      setStageRows(src.stageCalculatorRows);
    }
  }, [editData, data]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityCompletionChange = (value) => {
    setForm((prev) => ({
      ...prev,
      stageOfCompletionAmenities: value,
      stageOfAmenityCompletion: value,
    }));
  };

  const handleAmenityRecommendationChange = (value) => {
    setForm((prev) => ({
      ...prev,
      stageOfRecommendationAmenities: value,
      stageOfAmenityRecommendation: value,
    }));
  };

  const isCompleted = form.constructionStatus === "completed";
  const isUnderConstruction = form.constructionStatus === "under_construction";
  const stageTotals = calculateStageTotals(stageRows);

  const handleStageRowChange = (rowId, field, value) => {
    setStageRows((prev) => prev.map((row) => row.id === rowId ? { ...row, [field]: value } : row));
  };

  const applyStageCalculator = () => {
    setForm((prev) => ({
      ...prev,
      stageOfStructureCompletion: formatPercentValue(stageTotals.completion),
      stageOfStructureRecommendation: formatPercentValue(stageTotals.recommendation),
    }));
    setShowStageCalculator(false);
  };

  const savePayload = { ...form, stageCalculatorRows: stageRows };

  // Build "Recommended Value" text
  const recNum  = parseInt(form.recommendedValue, 10) || 0;
  const recWords = numberToWords(recNum);

  return (
    <>
      <style>{css}</style>

      <div className="cp-wrap">

        {/* ══ PAGE TITLE ════════════════════════════════════════════════════ */}
        <div className="cp-page-title">Construction Progress Details</div>

        {/* ══ TOP 4-COLUMN ROW ══════════════════════════════════════════════ */}
        <div className="cp-top-row">
          {/* Type Of Structure */}
          <div>
            <div className="cp-field-label">
              Type Of Structure <span className="req">*</span>
            </div>
            <select
              className="cp-select"
              value={form.typeOfStructure}
              onChange={(e) => handleChange("typeOfStructure", e.target.value)}
            >
              <option value=""></option>
              {STRUCTURE_TYPES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Structure Configuration */}
          <div>
            <div className="cp-field-label">Structure Configuration</div>
            <input
              className="cp-input"
              value={form.structureConfiguration}
              placeholder=""
              readOnly
            />
          </div>

          {/* Stage Of Completion Amenities (%) */}
          <div>
            <div className="cp-field-label">Stage Of Completion Amenities (%)</div>
            <input
              className="cp-input"
              type="number"
              min="0" max="100"
              value={form.stageOfCompletionAmenities}
              onChange={(e) => handleAmenityCompletionChange(e.target.value)}
              placeholder=""
              disabled={isCompleted}
            />
          </div>

          {/* Stage Of Recommendation Amenities (%) */}
          <div>
            <div className="cp-field-label">Stage Of Recommendation Amenities (%)</div>
            <input
              className="cp-input"
              type="number"
              min="0" max="100"
              value={form.stageOfRecommendationAmenities}
              onChange={(e) => handleAmenityRecommendationChange(e.target.value)}
              placeholder=""
              disabled={isCompleted}
            />
          </div>
        </div>

        {isUnderConstruction && (
          <div className="cp-calculator-row">
            <button className="cp-btn" type="button" onClick={() => setShowStageCalculator(true)}>
              Stage Calculator
            </button>
          </div>
        )}

        {/* ══ GRAY SUMMARY CARD ═════════════════════════════════════════════ */}
        <div className="cp-summary-card">

          {/* ── Stage of Amenity ── */}
          <div className="cp-stage-title">Stage of Amenity</div>
          <div className="cp-stage-row">
            {/* % Completion */}
            <div className="cp-stage-half">
              <span className="cp-stage-key">% Completion:</span>
              <input
                className="cp-inline-input"
                type="number"
                min="0" max="100"
                value={form.stageOfAmenityCompletion}
                onChange={(e) => handleAmenityCompletionChange(e.target.value)}
                disabled={isCompleted}
              />
              <span className="cp-stage-unit">%</span>
            </div>
            {/* % Recommendation */}
            <div className="cp-stage-half">
              <span className="cp-stage-key">% Recommendation:</span>
              <input
                className="cp-inline-input"
                type="number"
                min="0" max="100"
                value={form.stageOfAmenityRecommendation}
                onChange={(e) => handleAmenityRecommendationChange(e.target.value)}
                disabled={isCompleted}
              />
              <span className="cp-stage-unit">%</span>
            </div>
          </div>

          <hr className="cp-stage-divider" />

          {/* ── Stage of Structure ── */}
          <div className="cp-stage-title">Stage of Structure</div>
          <div className="cp-stage-row">
            {/* % Completion */}
            <div className="cp-stage-half">
              <span className="cp-stage-key">% Completion:</span>
              <input
                className="cp-inline-input"
                type="number"
                min="0" max="100"
                value={form.stageOfStructureCompletion}
                onChange={(e) => handleChange("stageOfStructureCompletion", e.target.value)}
                disabled={isCompleted}
              />
              <span className="cp-stage-unit">%</span>
            </div>
            {/* % Recommendation */}
            <div className="cp-stage-half">
              <span className="cp-stage-key">% Recommendation:</span>
              <input
                className="cp-inline-input"
                type="number"
                min="0" max="100"
                value={form.stageOfStructureRecommendation}
                onChange={(e) => handleChange("stageOfStructureRecommendation", e.target.value)}
                disabled={isCompleted}
              />
              <span className="cp-stage-unit">%</span>
            </div>
          </div>

          {/* ── Recommended Value ── */}
          <div className="cp-rec-value">
            Recommended Value: ₹{recNum}&nbsp;&nbsp;
            ({'  '}{recWords} Rupees Only )
          </div>
        </div>

        {/* ══ COMMENTS ON CONSTRUCTION ══════════════════════════════════════ */}
        <div className="cp-comments-title">Comments on Construction</div>
        <textarea
          className="cp-textarea"
          value={form.commentsOnConstruction}
          onChange={(e) => {
            if (e.target.value.length <= 1000)
              handleChange("commentsOnConstruction", e.target.value);
          }}
          placeholder="Please enter your remarks here...."
          rows={5}
        />
        <div className="cp-char-count">
          {form.commentsOnConstruction.length} /1000
        </div>

        {/* ══ ACTION BUTTONS ════════════════════════════════════════════════ */}
        {showStageCalculator && (
          <div className="cp-modal-backdrop">
            <div className="cp-modal">
              <button className="cp-modal-close" type="button" onClick={() => setShowStageCalculator(false)}>x</button>
              <table className="cp-stage-table">
                <thead>
                  <tr>
                    <th>Component Description</th>
                    <th>Planned</th>
                    <th>Actual</th>
                    <th>Component Completion %</th>
                    <th>% Completion</th>
                    <th>% Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {stageRows.map((row) => {
                    const planned = Number(row.planned) || 0;
                    const actual = Number(row.actual) || 0;
                    const componentCompletion = planned > 0 ? clampPercent((actual / planned) * 100) : 0;
                    return (
                      <tr key={row.id}>
                        <td>{row.label}</td>
                        <td>
                          <input className="cp-table-input" type="number" min="0" value={row.planned}
                            onChange={(e) => handleStageRowChange(row.id, "planned", e.target.value)} />
                        </td>
                        <td>
                          <input className="cp-table-input" type="number" min="0" value={row.actual}
                            onChange={(e) => handleStageRowChange(row.id, "actual", e.target.value)} />
                        </td>
                        <td>{componentCompletion.toFixed(2)}</td>
                        <td>{row.completionWeight}</td>
                        <td>{row.recommendationWeight}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td />
                    <td />
                    <td>{stageTotals.componentTotal.toFixed(2)}</td>
                    <td>{formatPercentValue(stageTotals.completion)}</td>
                    <td>{formatPercentValue(stageTotals.recommendation)}</td>
                  </tr>
                </tfoot>
              </table>
              <div className="cp-modal-actions">
                <button className="cp-btn" type="button" onClick={() => setShowStageCalculator(false)}>Cancel</button>
                <button className="cp-btn primary" type="button" onClick={applyStageCalculator}>Update</button>
              </div>
            </div>
          </div>
        )}

        <div className="cp-actions">
          <button
            className="cp-btn"
            onClick={() => onSave?.("constructionProgress", savePayload)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className="cp-btn primary"
            onClick={() => onSaveAndNext?.("constructionProgress", savePayload)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConstructionProgressForm;
