import React, { useState } from "react";

const RealizableValueForm = ({ editData, onSave, onSaveAndNext, saving }) => {
  const [methodology, setMethodology] = useState(editData?.valuationMethodology || "");
  const [showBanner, setShowBanner] = useState(true);
  const [landRows, setLandRows] = useState([{ description: "Plot Area (Sqft)", area: "", rate: "" }]);
  const [amenityRows, setAmenityRows] = useState([{ description: "", qty: "", rate: "" }]);
  const [scArea, setScArea] = useState("0");
  const [scApproved, setScApproved] = useState("");
  const [iaArea, setIaArea] = useState("0");
  const [iaApproved, setIaApproved] = useState("");
  const [valuationOn, setValuationOn] = useState("");
  const [buildingUsage, setBuildingUsage] = useState("");
  const [govRows, setGovRows] = useState([
    { desc: "Land/BU/SBU", area: "", rate: "" },
    { desc: "Construction", area: "", rate: "" },
  ]);
  const [saleForm, setSaleForm] = useState({ propertyValue: "", comparableRate: "", remarks: "" });

  const calcAmount = (a, b) => (parseFloat(a) || 0) * (parseFloat(b) || 0);
  const scCostConst = calcAmount(scArea, scApproved);
  const iaCostConst = calcAmount(iaArea, iaApproved);
  const landTotal = landRows.reduce((s, r) => s + calcAmount(r.area, r.rate), 0);
  const amenTotal = amenityRows.reduce((s, r) => s + calcAmount(r.qty, r.rate), 0);
  const realizable = landTotal + scCostConst + amenTotal;

  const inputCls = "border-0 border-b border-gray-300 w-full text-sm py-1 outline-none focus:border-blue-900 bg-transparent";
  const labelCls = "block text-xs text-gray-500 mb-1";

  return (
    <div className="relative pb-20">
      {/* Error Banner */}
      {showBanner && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          <span className="text-red-600 text-sm flex items-center gap-2">⊗ Please complete the floor details under Property Details</span>
          <button onClick={() => setShowBanner(false)} className="text-red-500 text-lg leading-none">×</button>
        </div>
      )}

      {/* Valuation Methodology */}
      <div className="mb-6 max-w-xs">
        <label className={labelCls}>Valuation Methodology <span className="text-red-600">*</span></label>
        <div className="relative">
          <select
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="w-full border-0 border-b border-gray-300 py-2 text-sm outline-none appearance-none bg-transparent cursor-pointer"
          >
            <option value="">-- Select --</option>
            <option value="saleComparison">Sale Comparison</option>
            <option value="selfConstruction">Self Construction</option>
            <option value="incomeApproach">Income Approach</option>
          </select>
          <span className="absolute right-1 top-2 text-gray-400 pointer-events-none">▾</span>
        </div>
      </div>

      {/* ---- SALE COMPARISON ---- */}
      {methodology === "saleComparison" && (
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div><label className={labelCls}>Property Value (₹) <span className="text-red-600">*</span></label>
            <input className={inputCls} type="number" value={saleForm.propertyValue} onChange={e => setSaleForm(p => ({...p, propertyValue: e.target.value}))} /></div>
          <div><label className={labelCls}>Comparable Sale Rate (per sq.ft.) <span className="text-red-600">*</span></label>
            <input className={inputCls} type="number" value={saleForm.comparableRate} onChange={e => setSaleForm(p => ({...p, comparableRate: e.target.value}))} /></div>
          <div><label className={labelCls}>Remarks</label>
            <input className={inputCls} type="text" value={saleForm.remarks} onChange={e => setSaleForm(p => ({...p, remarks: e.target.value}))} /></div>
          <div className="col-span-2 bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold">Realizable value: ₹ 0</div>
          <div className="col-span-2 bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold">Round Off Total: ₹ 0.00 ( Zero Rupees Only )</div>
        </div>
      )}

      {/* ---- SELF CONSTRUCTION ---- */}
      {methodology === "selfConstruction" && (
        <>
          <p className="text-red-600 font-semibold text-sm mb-3 mt-2">Land/Existing Structure Value <span className="text-red-600">*</span></p>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100"><tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)","Amount (₹)","Actions"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {landRows.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{i === 0 ? "Plot Area (Sqft)" : <input className={inputCls} value={row.description} onChange={e=>{const r=[...landRows];r[i].description=e.target.value;setLandRows(r);}} />}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...landRows];r[i].area=e.target.value;setLandRows(r);}} /></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...landRows];r[i].rate=e.target.value;setLandRows(r);}} /></td>
                  <td className="px-3 py-2 text-sm">{calcAmount(row.area, row.rate).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2">{i>0&&<button onClick={()=>setLandRows(landRows.filter((_,j)=>j!==i))} className="text-red-500 text-base">✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mb-4">
            <button onClick={()=>setLandRows([...landRows,{description:"",area:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div><label className={labelCls}>Construction Area (sq.ft.) <span className="text-red-600">*</span></label>
              <input className={inputCls} type="number" value={scArea} onChange={e=>setScArea(e.target.value)} /></div>
            <div><label className={labelCls}>Approved Cost(per. Sq.ft.) <span className="text-red-600">*</span></label>
              <input className={inputCls} type="number" value={scApproved} onChange={e=>setScApproved(e.target.value)} /></div>
            <div><label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label>
              <input className={inputCls} type="number" value={scCostConst} readOnly /></div>
          </div>

          <p className="text-red-600 font-semibold text-sm mb-3">Amenities Value</p>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100"><tr>{["Description","Quantity","Rate (₹)","Amount (₹)","Actions"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {amenityRows.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2"><input className={inputCls} value={row.description} onChange={e=>{const r=[...amenityRows];r[i].description=e.target.value;setAmenityRows(r);}} /></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.qty} onChange={e=>{const r=[...amenityRows];r[i].qty=e.target.value;setAmenityRows(r);}} /></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...amenityRows];r[i].rate=e.target.value;setAmenityRows(r);}} /></td>
                  <td className="px-3 py-2 text-sm">{calcAmount(row.qty, row.rate).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2"><button onClick={()=>setAmenityRows(amenityRows.filter((_,j)=>j!==i))} className="text-red-500 text-base">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mb-3">
            <button onClick={()=>setAmenityRows([...amenityRows,{description:"",qty:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold mb-2">Amenities Cost: ₹ {amenTotal.toLocaleString('en-IN')}</div>
          <div className="bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold mb-2">Realizable value: ₹ {realizable.toLocaleString('en-IN')}</div>
          <div className="bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold mb-6">Round Off Total: ₹ {Math.round(realizable).toLocaleString('en-IN')}.00</div>

          <p className="text-red-600 font-semibold text-sm mb-3">Valuation As Per Government Rates</p>
          <p className="text-xs text-gray-500 mb-2">Building Usage</p>
          <div className="flex gap-6 mb-4">
            {["commercial","residential"].map(v=><label key={v} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="bu" value={v} checked={buildingUsage===v} onChange={()=>setBuildingUsage(v)} className="accent-blue-900"/> {v.charAt(0).toUpperCase()+v.slice(1)}</label>)}
          </div>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-3">
            <thead className="bg-gray-100"><tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {govRows.map((row,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{row.desc}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...govRows];r[i].area=e.target.value;setGovRows(r);}} /></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...govRows];r[i].rate=e.target.value;setGovRows(r);}} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-100 border border-gray-200 rounded p-3 text-sm font-semibold">Total Value ( Gross Value ): ₹ 0 ( Zero Rupees Only )</div>
        </>
      )}

      {/* ---- INCOME APPROACH ---- */}
      {methodology === "incomeApproach" && (
        <>
          <div className="mt-4 mb-5">
            <p className="text-xs text-gray-500 mb-2">Valuation On <span className="text-red-600">*</span></p>
            <div className="flex gap-6">
              {[["entireBuilding","Entire Building"],["unitNumber","Unit Number"]].map(([v,l])=>(
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="valOn" value={v} checked={valuationOn===v} onChange={()=>setValuationOn(v)} className="accent-blue-900"/> {l}</label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div><label className={labelCls}>Construction Area (sq.ft.) <span className="text-red-600">*</span></label>
              <input className={inputCls} type="number" value={iaArea} onChange={e=>setIaArea(e.target.value)} /></div>
            <div><label className={labelCls}>Approved Cost(per. Sq.ft.)</label>
              <input className={inputCls} type="number" value={iaApproved} onChange={e=>setIaApproved(e.target.value)} /></div>
            <div><label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label>
              <input className={inputCls} type="number" value={iaCostConst} readOnly /></div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button onClick={() => onSave?.("realizableValue", { methodology })} className="border-2 border-blue-900 text-blue-900 px-8 py-3 rounded font-semibold">Save</button>
        <button onClick={() => onSaveAndNext?.("realizableValue", { methodology })} disabled={saving} className="bg-blue-900 text-white px-8 py-3 rounded font-semibold disabled:opacity-60">Save &amp; Next</button>
      </div>
    </div>
  );
};

export default RealizableValueForm;