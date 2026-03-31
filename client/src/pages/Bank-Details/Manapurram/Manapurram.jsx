

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createManappuramReport,
    fetchManappuramById,
    updateManappuramDetails,
} from "../../../redux/features/Banks/ManappuramBank/Manappuramthunk";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../config/axios";
import JSZip from "jszip";
import AutoFillForm from "../../AutoFillForm";
import { MANAPPURAM_MAPPING } from "../../../config/Bankfieldmappings";
import {
    applyMappedFields,
    createAutoFillAdapter,
} from "../../../utils/Autofilladapter";

const getCoordinateSnapshot = (coordinates = "") => {
    const [latitude = "--", longitude = "--"] = String(coordinates)
        .split(",")
        .map((value) => value.trim());

    return {
        lat: latitude || "--",
        lng: longitude || "--",
    };
};

const normalizeRemarkText = (remark = "") =>
    String(remark)
        .replace(/<\/div>\s*<div>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim();

const normalizeRemarks = (remarks = []) => {
    const nextRemarks = Array.isArray(remarks) ? remarks : [];
    return nextRemarks.length > 0
        ? nextRemarks.map((remark) => normalizeRemarkText(remark))
        : [""];
};

/* ─── PRINT STYLES ─────────────────────────────────────────────────────────── */
// Injected once so window.print() picks it up
if (!document.getElementById("mnfl-print-style")) {
    const s = document.createElement("style");
    s.id = "mnfl-print-style";
    s.textContent = `
    @media print {
      body * { visibility: hidden !important; }
      #mnfl-print-area, #mnfl-print-area * { visibility: visible !important; }
      #mnfl-print-area {
        position: absolute !important;
        top: 0 !important; left: 0 !important;
        width: 100% !important;
        background: white !important;
      }
      .no-print { display: none !important; }
      @page { margin: 6mm; size: A4; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
    }
    @media screen {
      #mnfl-print-area {
        position: fixed !important;
        left: -200vw !important;
        top: 0 !important;
        width: 794px !important;
        max-height: 1px !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    }
  `;
    document.head.appendChild(s);
}

/* ─── INITIAL STATE ─────────────────────────────────────────────────────────── */
const INIT = {
    header: {
        valueName: "",
        caseRefNo: "",
        dateOfVisit: "",
        dateOfReport: "",
        contactedPerson: "",
    },
    propertyInfo: {
        applicantName: "",
        ownerName: "",
        documentProduced: "SALEDEED",
        typeOfProperty: "RESIDENTIAL",
        currentUsage: "OPEN PLOT",
        holdingType: "Free Hold",
        propertyUsage: "OPEN PLOT",
        usageAuthorized: "",
        usageRestriction: "No",
        occupancyStatus: "VACANT",
        measurementOfProperty: "",
        distanceFromBranch: "",
        addressAtSite: "",
        addressAsPerDocument: "",
        landmark: "",
        locationOfProperty: "RURAL",
    },
    siteBoundaries: {
        eastDoc: "",
        westDoc: "",
        northDoc: "",
        southDoc: "",
        eastActual: "",
        westActual: "",
        northActual: "",
        southActual: "",
        boundariesTallied: "NO",
    },
    accessibility: {
        connectivity: "Average",
        siteAccess: "UNDER DEV",
        proximityToAmenities: "",
        typeWidthOfRoad: "",
        commentsOnProperty: "",
        withinMunicipalLimits: "GP",
        adverseFactors: "No",
    },
    municipalDetails: {
        sanctionPlanProvided: "Not produced",
        dateOfSanction: "Not produced",
        sanctionedArea: "Not produced",
        municipalCompliance: "Not produced",
        currentAgeProperty: "0",
        estimatedResidualAge: "60",
    },
    technicalDetails: {
        constructionType: "",
        noOfFloors: "GF",
        totalLandArea: "",
        totalBuiltUpArea: "0",
        totalFloorArea: "0",
        independentAccess: "Independent Access",
        percentCompletion: "0",
        currentAge: "0",
        estimatedResidualAge: "60",
    },
    valuationGLR: { landArea: "", landRate: "0", landValue: "0" },
    valuationPMR: {
        landArea: "0",
        landRate: "0",
        landValue: "0",
        constructionArea: "0",
        constructionRate: "0",
        constructionValue: "0",
        totalValue: "0",
    },
    // Excel uses *0.85 (15% deduction) for distress value
    distressValue: "0",
    remarks: [
        "GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF APPLICANT.",
        "DURING PROPERTY VISIT CUSTOMER MET AT THE PROPERTY.",
        "RATE HAS BEEN CONFIRM FROM MARKET ENQUIRY.",
        "PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESIDENTIAL ZONING.",
    ],
    summary: {
        propertyAddress: "",
        propertyType: "RESIDENTIAL",
        applicantName: "",
        presentMarketValue: "0",
        forcedSaleValue: "0",
        coordinates: "",
    },
    imageUrls: [],
    AttachDocuments: [],
};

/* ─── PHOTO GRID — uploads to backend (like AdityaBirla) ────────────────────── */
function PhotoGrid({ label, photos, onAdd, onDelete, reportId, onCaptureLocation }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (e) => {
        // Capture GPS first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    onCaptureLocation &&
                    onCaptureLocation(
                        pos.coords.latitude.toFixed(6),
                        pos.coords.longitude.toFixed(6)
                    ),
                () => { },
                { enableHighAccuracy: true }
            );
        }

        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                if (reportId) formData.append("reportId", reportId);

                const res = await axiosInstance.post(
                    "/manappuram/upload-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data?.success) {
                    onAdd({ url: res.data.url, fileId: res.data.fileId });
                } else {
                    toast.error("Image upload failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <table className="w-full border-collapse border border-black mb-1">
                <tbody>
                    <tr>
                        <th className="bg-amber-50 border border-black p-1 text-xs font-medium">
                            {label}
                        </th>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-1">
                {photos.map((img, i) => {
                    const src = typeof img === "string" ? img : img?.url;
                    return (
                        <div
                            key={i}
                            className="relative border border-black min-h-[180px]"
                        >
                            <img
                                src={src}
                                alt=""
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-1 left-1 no-print">
                                <button
                                    onClick={() => window.open(src, "_blank")}
                                    className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    title="View"
                                >
                                    👁️
                                </button>
                            </div>
                            <button
                                onClick={() => onDelete(i, img.fileId)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm no-print"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

                {/* Upload cell */}
                <div
                    className="no-print relative border border-black min-h-[180px] cursor-pointer"
                    onClick={() => !uploading && ref.current.click()}
                    style={{ cursor: uploading ? "wait" : "pointer" }}
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 text-xs text-center px-2">
                        {uploading ? "⏳ Uploading..." : "📷 Click to Upload\n(GPS auto-captured)"}
                    </div>
                </div>
            </div>

            <input
                ref={ref}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
            />
        </div>
    );
}

/* ─── DOCUMENT GRID — uploads to backend ────────────────────────────────────── */
function FileDocument({ label, documents, onAdd, onDelete, reportId }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                if (reportId) formData.append("reportId", reportId);

                const res = await axiosInstance.post(
                    "/manappuram/upload-document",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data?.success) {
                    onAdd({
                        url: res.data.url,
                        fileId: res.data.fileId,
                        name: res.data.name,
                    });
                } else {
                    toast.error("Document upload failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Document upload error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <table className="w-full border-collapse border border-black mb-1">
                <tbody>
                    <tr>
                        <th className="bg-amber-50 border border-black p-1 text-xs font-medium">
                            {label}
                        </th>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-1">
                {documents.map((doc, i) => (
                    <div
                        key={i}
                        className="relative border border-black p-2 flex items-center justify-between"
                    >
                        <div className="truncate text-xs flex-1">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {doc.name || "Document"}
                            </a>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => window.open(doc.url, "_blank")}
                                className="bg-blue-500 text-white rounded px-2 py-1 text-xs no-print"
                                title="View"
                            >
                                📄
                            </button>
                            <button
                                onClick={() => onDelete(i, doc.fileId)}
                                className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm no-print"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}

                {/* Upload cell */}
                <div
                    className="relative border border-black min-h-[80px] cursor-pointer flex items-center justify-center"
                    onClick={() => !uploading && ref.current.click()}
                    style={{ cursor: uploading ? "wait" : "pointer" }}
                >
                    <div className="text-center text-gray-600 text-xs">
                        {uploading ? "⏳ Uploading..." : "📄 Click to Upload Document"}
                    </div>
                </div>
            </div>

            <input
                ref={ref}
                type="file"
                multiple
                className="hidden"
                onChange={handleFiles}
            />
        </div>
    );
}

/* ─── PRINT AREA ────────────────────────────────────────────────────────────── */
function PrintArea({ form }) {
    const mapLocation = getCoordinateSnapshot(form?.summary?.coordinates);
    const hasMapLocation =
        mapLocation.lat !== "--" && mapLocation.lng !== "--";
    const staticMapUrl = hasMapLocation
        ? `https://staticmap.openstreetmap.de/staticmap.php?center=${mapLocation.lat},${mapLocation.lng}&zoom=15&size=865x320&markers=${mapLocation.lat},${mapLocation.lng},red-pushpin`
        : "";

    const H = form.header,
        PI = form.propertyInfo,
        SB = form.siteBoundaries,
        AC = form.accessibility;
    const MD = form.municipalDetails,
        TD = form.technicalDetails,
        GLR = form.valuationGLR,
        PMR = form.valuationPMR,
        SUM = form.summary;

    const ps = {
        fontFamily: "Arial, sans-serif",
        fontSize: "8.5pt",
        borderCollapse: "collapse",
        width: "100%",
    };
    const td = {
        border: "1px solid black",
        padding: "3px 5px",
        fontSize: "8.5pt",
        verticalAlign: "top",
    };
    const num = {
        ...td,
        textAlign: "center",
        fontWeight: "bold",
        width: "4%",
        verticalAlign: "middle",
    };
    const lbl = { ...td, width: "35%" };
    const val = { ...td };
    const th = {
        border: "1px solid black",
        padding: "3px 5px",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "8.5pt",
        background: "#f2f2f2",
    };

    return (
        <div
            id="mnfl-print-area"
            style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "8.5pt",
                padding: "4mm",
                background: "white",
                color: "black",
            }}
        >
            {/* LETTERHEAD */}
            <table style={{ ...ps, marginBottom: 6, border: "2px solid black" }}>
                <tbody>
                    <tr>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "4px 8px",
                                width: "14%",
                                verticalAlign: "middle",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    border: "2px solid black",
                                    display: "inline-block",
                                    padding: "4px 8px",
                                }}
                            >
                                <div
                                    style={{
                                        fontStyle: "italic",
                                        fontSize: "13pt",
                                        fontWeight: "bold",
                                        fontFamily: "Times New Roman, serif",
                                    }}
                                >
                                    Unique
                                </div>
                            </div>
                            <div style={{ fontSize: "6.5pt", marginTop: 2, lineHeight: 1.3 }}>
                                Engineering
                                <br />
                                &amp; Associate
                            </div>
                        </td>
                        <td
                            style={{
                                border: "none",
                                padding: "4px 10px",
                                verticalAlign: "top",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "15pt",
                                    fontWeight: "900",
                                    letterSpacing: 2,
                                    marginBottom: 3,
                                }}
                            >
                                UNIQUE ENGINEERING AND ASSOCIATE
                            </div>
                            <div
                                style={{ fontSize: "8pt", fontWeight: "bold", marginBottom: 3 }}
                            >
                                CHARTED ENGINEER AND APPROVED VALUER
                            </div>
                            <div style={{ fontSize: "7pt" }}>
                                Reg. AMIE-AM167147-5, IMC-82-16, IIOV-CAT-I/A-4537,
                            </div>
                            <div style={{ fontSize: "7pt" }}>
                                www.ueaa.co.in &nbsp;&nbsp; bhopal@ueaa.co.in
                            </div>
                            <div style={{ fontSize: "7pt" }}>
                                Office no. 301, Sahara Homes, HIG-34 Shivaji Nagar Bhopal
                                Madhya Pradesh
                            </div>
                        </td>
                        <td
                            style={{
                                border: "none",
                                padding: "4px 6px",
                                verticalAlign: "top",
                                width: "26%",
                                fontSize: "7pt",
                                lineHeight: 1.5,
                            }}
                        >
                            <div style={{ fontWeight: "bold", fontSize: "7pt" }}>
                                CONSULTING ENGINEER VALUERS,
                                <br />
                                ARCHITECTS AND DESIGNER WORK,
                                <br />
                                REGISTERED ENGINEER WITH IMC AND T&amp;CP
                            </div>
                            <div style={{ marginTop: 4 }}>
                                Contact person. <b>Lokesh Sharma</b>
                            </div>
                            <div>8602649524</div>
                            <div>0731-4967443</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* HEADER TABLE */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <tbody>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold", width: "22%" }}>
                            Valuer Name
                        </td>
                        <td style={{ ...td, width: "2%", textAlign: "center" }}>:</td>
                        <td style={{ ...td, width: "38%" }}>
                            {H.valueName || "Unique Engineering & Associate"}
                        </td>
                        <td style={{ ...td, fontWeight: "bold", width: "18%" }}>
                            Date of Visit :
                        </td>
                        <td style={td}>{H.dateOfVisit}</td>
                    </tr>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold" }}>Case Ref. No</td>
                        <td style={td}></td>
                        <td style={td}>{H.caseRefNo || "NA"}</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Date of Report</td>
                        <td style={td}>{H.dateOfReport}</td>
                    </tr>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Contacted Person for property
                        </td>
                        <td style={td}></td>
                        <td colSpan={3} style={td}>
                            {H.contactedPerson}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* MAIN DATA TABLE */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <colgroup>
                    <col style={{ width: "4%" }} />
                    <col style={{ width: "29%" }} />
                    <col style={{ width: "34%" }} />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td style={num}>01</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Applicant/s Name/s</td>
                        <td colSpan={2} style={val}>
                            {PI.applicantName}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}></td>
                        <td style={{ ...td, fontWeight: "bold" }}>Owner</td>
                        <td colSpan={2} style={val}>
                            {PI.ownerName}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>02</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Document Produced</td>
                        <td colSpan={2} style={val}>
                            {PI.documentProduced}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>03</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Type of property</td>
                        <td style={val}>{PI.typeOfProperty}</td>
                        <td style={val}>
                            <b>Current Usage</b>&nbsp;&nbsp;{PI.currentUsage}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>04</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Holding Type</td>
                        <td colSpan={2} style={val}>
                            {PI.holdingType}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>05</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Property Usage</td>
                        <td colSpan={2} style={val}>
                            {PI.propertyUsage}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>06</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Usage Authorized</td>
                        <td colSpan={2} style={val}>
                            {PI.usageAuthorized || "NA"}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>07</td>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Any Usage Restricton of Land ?
                        </td>
                        <td colSpan={2} style={val}>
                            {PI.usageRestriction}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>08</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Occupancy Status</td>
                        <td colSpan={2} style={val}>
                            {PI.occupancyStatus}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>09</td>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Measurement of the Property
                        </td>
                        <td colSpan={2} style={val}>
                            {PI.measurementOfProperty}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>10</td>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Distance of the Property from the Financing Branch
                        </td>
                        <td colSpan={2} style={val}>
                            {PI.distanceFromBranch}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>11</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Address at site</td>
                        <td colSpan={2} style={{ ...val, fontWeight: "bold" }}>
                            {PI.addressAtSite}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}></td>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Address as per document
                        </td>
                        <td colSpan={2} style={val}>
                            {PI.addressAsPerDocument}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>12</td>
                        <td style={{ ...td, fontWeight: "bold" }}>Land mark</td>
                        <td colSpan={2} style={val}>
                            {PI.landmark}
                        </td>
                    </tr>
                    <tr>
                        <td style={num}>13</td>
                        <td style={{ ...td, fontWeight: "bold" }}>
                            Location of the Property
                        </td>
                        <td colSpan={2} style={val}>
                            {PI.locationOfProperty}
                        </td>
                    </tr>

                    {/* 14 SITE BOUNDARIES */}
                    <tr>
                        <td
                            rowSpan={6}
                            style={{ ...num, verticalAlign: "top", paddingTop: 4 }}
                        >
                            14
                        </td>
                        <td
                            rowSpan={6}
                            style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 4 }}
                        >
                            Site Boundaries
                        </td>
                        <td style={th}>As per Title Document</td>
                        <td style={th}>Actual as Verified at time of site visit</td>
                    </tr>
                    <tr>
                        <td style={val}>
                            <b>East</b>&nbsp;&nbsp;{SB.eastDoc}
                        </td>
                        <td style={val}>
                            <b>East</b>&nbsp;&nbsp;{SB.eastActual}
                        </td>
                    </tr>
                    <tr>
                        <td style={val}>
                            <b>West</b>&nbsp;&nbsp;{SB.westDoc}
                        </td>
                        <td style={val}>
                            <b>West</b>&nbsp;&nbsp;{SB.westActual}
                        </td>
                    </tr>
                    <tr>
                        <td style={val}>
                            <b>North</b>&nbsp;&nbsp;{SB.northDoc}
                        </td>
                        <td style={val}>
                            <b>North</b>&nbsp;&nbsp;{SB.northActual}
                        </td>
                    </tr>
                    <tr>
                        <td style={val}>
                            <b>South</b>&nbsp;&nbsp;{SB.southDoc}
                        </td>
                        <td style={val}>
                            <b>South</b>&nbsp;&nbsp;{SB.southActual}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={val}>
                            Site Boundaries tallied with Boundaries in Title Deed provided by
                            Bank&nbsp;&nbsp;&nbsp;<b>{SB.boundariesTallied}</b>
                        </td>
                    </tr>

                    {/* 15 ACCESSIBILITY */}
                    <tr>
                        <td
                            rowSpan={7}
                            style={{ ...num, verticalAlign: "top", paddingTop: 4 }}
                        >
                            15
                        </td>
                        <td
                            rowSpan={7}
                            style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 4 }}
                        >
                            Accessibility
                        </td>
                        <td style={lbl}>Connectivity</td>
                        <td style={val}>{AC.connectivity}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Site Access</td>
                        <td style={val}>{AC.siteAccess}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Proximity to Amenities</td>
                        <td style={val}>{AC.proximityToAmenities}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Type &amp; Width of road available at Present</td>
                        <td style={val}>{AC.typeWidthOfRoad}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Comments on the Property</td>
                        <td style={val}>{AC.commentsOnProperty}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Within Municipal Limits</td>
                        <td style={val}>{AC.withinMunicipalLimits}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Any other Factor which adversely affect the Marketability</td>
                        <td style={val}>{AC.adverseFactors}</td>
                    </tr>

                    {/* 16 MUNICIPAL DETAILS */}
                    <tr>
                        <td
                            rowSpan={6}
                            style={{ ...num, verticalAlign: "top", paddingTop: 4 }}
                        >
                            16
                        </td>
                        <td
                            rowSpan={6}
                            style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 4 }}
                        >
                            Municipal Details
                        </td>
                        <td style={lbl}>Sanction Plan Provided</td>
                        <td style={val}>{MD.sanctionPlanProvided}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Date of Sanction</td>
                        <td style={val}>{MD.dateOfSanction}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Sanctioned Area</td>
                        <td style={val}>{MD.sanctionedArea}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Municipal compliance</td>
                        <td style={val}>{MD.municipalCompliance}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Current age of the property</td>
                        <td style={val}>{MD.currentAgeProperty}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Estimated Residual Age</td>
                        <td style={val}>{MD.estimatedResidualAge}</td>
                    </tr>

                    {/* 17 TECHNICAL DETAILS */}
                    <tr>
                        <td
                            rowSpan={9}
                            style={{ ...num, verticalAlign: "top", paddingTop: 4 }}
                        >
                            17
                        </td>
                        <td
                            rowSpan={9}
                            style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 4 }}
                        >
                            Technical details
                        </td>
                        <td style={lbl}>Construction Type</td>
                        <td style={val}>{TD.constructionType}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>No of floors</td>
                        <td style={val}>{TD.noOfFloors}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Total Land Area in sft</td>
                        <td style={val}>
                            <span style={{ display: "inline-block", width: 60, textAlign: "right" }}>
                                {TD.totalLandArea}
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>SQFT</b>
                        </td>
                    </tr>
                    <tr>
                        <td style={lbl}>Total Built up Area in sft (Actual)</td>
                        <td style={val}>
                            <span style={{ display: "inline-block", width: 60, textAlign: "right" }}>
                                {TD.totalBuiltUpArea}
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>SQFT</b>
                        </td>
                    </tr>
                    <tr>
                        <td style={lbl}>Total Floor Area in sft</td>
                        <td style={val}>{TD.totalFloorArea}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>
                            Is the Property an Independent units &amp; has Independent Access
                        </td>
                        <td style={val}>{TD.independentAccess}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>If under Construction, % Completion</td>
                        <td style={val}>{TD.percentCompletion}%</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Current Age of the Property</td>
                        <td style={val}>{TD.currentAge}</td>
                    </tr>
                    <tr>
                        <td style={lbl}>Estimated Residual Age</td>
                        <td style={val}>{TD.estimatedResidualAge}</td>
                    </tr>
                </tbody>
            </table>

            {/* GLR VALUATION */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <tbody>
                    <tr>
                        <td colSpan={4} style={{ ...td, fontWeight: "bold" }}>
                            VALUATION BY ADOPTING GLR (GUIDELINE RATE)
                        </td>
                    </tr>
                    <tr>
                        <td style={th}></td>
                        <td style={th}>Area in Areas (sqft)</td>
                        <td style={th}>Rate (sqft)</td>
                        <td style={th}>Value</td>
                    </tr>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold" }}>Land Component</td>
                        <td style={{ ...td, textAlign: "center" }}>{GLR.landArea || "0"}</td>
                        <td style={{ ...td, textAlign: "center" }}>{GLR.landRate || "0"}</td>
                        <td style={{ ...td, textAlign: "center" }}>
                            {(parseFloat(GLR.landValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* PMR VALUATION */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <tbody>
                    <tr>
                        <td colSpan={4} style={{ ...td, fontWeight: "bold" }}>
                            VALUATION BY ADOPTING PMR (PREVAILING MARKET RATE)
                        </td>
                    </tr>
                    <tr>
                        <td style={th}></td>
                        <td style={th}>Area in Areas</td>
                        <td style={th}>Rate</td>
                        <td style={th}>Value</td>
                    </tr>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold" }}>Land Component</td>
                        <td style={{ ...td, textAlign: "center" }}>{PMR.landArea || "0"}</td>
                        <td style={{ ...td, textAlign: "center" }}>{PMR.landRate || "0"}</td>
                        <td style={{ ...td, textAlign: "center" }}>
                            {(parseFloat(PMR.landValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...td, fontWeight: "bold" }}>Construction Component</td>
                        <td style={{ ...td, textAlign: "center" }}>
                            {PMR.constructionArea || "0"}
                        </td>
                        <td style={{ ...td, textAlign: "center" }}>
                            {PMR.constructionRate || "0"}
                        </td>
                        <td style={{ ...td, textAlign: "center" }}>
                            {(parseFloat(PMR.constructionValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ ...td, fontWeight: "bold" }}>
                            Total Value
                        </td>
                        <td style={{ ...td, fontWeight: "bold" }}>Rs.</td>
                        <td style={{ ...td, fontWeight: "bold", textAlign: "center" }}>
                            <b>{(parseFloat(PMR.totalValue) || 0).toLocaleString("en-IN")}</b>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* DISTRESS VALUE */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <tbody>
                    <tr>
                        <td colSpan={2} style={{ ...td, fontWeight: "bold" }}>
                            DISTRESS SALE VALUE OF THE PROPERTY
                        </td>
                    </tr>
                    <tr>
                        <td style={td}>
                            VALUE ON SALE IN A FORCIBLE/DISTRESSED CONDITION USUALLY FACE
                            SIZABLE BARGAIN &amp; CONSIDERED TO BE NEARLY 15% LESS THAN THE
                            MARKET VALUE ON FAIR APPROXIMATION, WHICH CAN BE TREATED AS THE
                            REALISABLE VALUE OF THE PROPERTY AT ANY POINT OF TIME.
                        </td>
                        <td
                            style={{
                                ...td,
                                fontWeight: "bold",
                                textAlign: "center",
                                width: "15%",
                            }}
                        >
                            {(parseFloat(form.distressValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* REMARKS */}
            <table style={{ ...ps, marginBottom: 3 }}>
                <tbody>
                    <tr>
                        <td style={{ ...td, lineHeight: 1.65 }}>
                            {form.remarks.map((remark, i) => (
                                <div key={i}>
                                    <span style={{ fontWeight: "bold" }}>{i + 1}. </span>
                                    <span style={{ whiteSpace: "pre-wrap" }}>
                                        {normalizeRemarkText(remark)}
                                    </span>
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* MANAPPURAM FINANCE SUMMARY */}
            <table style={{ ...ps, border: "2px solid black", marginTop: 8 }}>
                <tbody>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                padding: "5px",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <b style={{ fontSize: "10pt", letterSpacing: 1 }}>
                                MANAPPURAM FINANCE
                            </b>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                padding: "22px 10px",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "900",
                                    fontSize: "18pt",
                                    lineHeight: 1.2,
                                    letterSpacing: 1,
                                }}
                            >
                                VALUATION OF
                                <br />
                                PROPERTIES
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                padding: "5px",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    background: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    padding: "3px 40px",
                                    fontSize: "9pt",
                                    letterSpacing: 1,
                                }}
                            >
                                {SUM.propertyType || "RESIDENTIAL"}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                fontWeight: "bold",
                                padding: "10px",
                                fontSize: "9pt",
                                borderBottom: "1px solid black",
                            }}
                        >
                            {SUM.propertyAddress}
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                padding: "5px",
                                borderBottom: "1px solid black",
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-block",
                                    background: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    padding: "3px 20px",
                                    fontSize: "8.5pt",
                                    letterSpacing: 1,
                                }}
                            >
                                NAME OF APPLICANT
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={2}
                            style={{
                                ...td,
                                textAlign: "center",
                                fontWeight: "bold",
                                padding: "6px",
                                fontSize: "10pt",
                                borderBottom: "1px solid black",
                            }}
                        >
                            {SUM.applicantName}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                ...td,
                                fontWeight: "bold",
                                letterSpacing: 3,
                                padding: "12px 10px",
                                borderBottom: "1px solid black",
                                fontSize: "8.5pt",
                                width: "72%",
                            }}
                        >
                            P R E S E N T &nbsp;&nbsp; M A R K E T &nbsp;&nbsp; V A L U E
                        </td>
                        <td
                            style={{
                                ...td,
                                fontWeight: "bold",
                                textAlign: "right",
                                padding: "12px 10px",
                                borderBottom: "1px solid black",
                                fontSize: "10pt",
                            }}
                        >
                            {(parseFloat(SUM.presentMarketValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                ...td,
                                fontWeight: "bold",
                                letterSpacing: 3,
                                padding: "12px 10px",
                                fontSize: "8.5pt",
                            }}
                        >
                            F O R C E D &nbsp;&nbsp; S A L E &nbsp;&nbsp; V A L U E
                        </td>
                        <td
                            style={{
                                ...td,
                                fontWeight: "bold",
                                textAlign: "right",
                                padding: "12px 10px",
                                fontSize: "10pt",
                            }}
                        >
                            {(parseFloat(SUM.forcedSaleValue) || 0).toLocaleString("en-IN")}
                        </td>
                    </tr>
                </tbody>
            </table>


            {/* Images Section */}
            {form.imageUrls?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 5 }}>
                        Property Images
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {form.imageUrls.map((img, i) => {
                            const src = typeof img === "string" ? img : img?.url;
                            return (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    loading="eager"
                                    style={{
                                        width: "32%",
                                        height: "120px",
                                        objectFit: "cover",
                                        border: "1px solid black",
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Coordinates */}
            {/* {SUM.coordinates && (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 5,
                        fontSize: "8pt",
                        fontWeight: "bold",
                    }}
                >
                    Coordinate:- {SUM.coordinates}
                </div>
            )} */}
            {/* Map Section */}
            {hasMapLocation && (
                <div style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 5 }}>
                        Location Map
                    </div>

                    <img
                        src={staticMapUrl}
                        alt="map"
                        loading="eager"
                        style={{
                            width: "100%",
                            height: "220px",
                            border: "1px solid black"
                        }}
                    />
                </div>
            )}
        </div>
    );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */
export default function ManappuramForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(INIT);
    const [liveLocation, setLiveLocation] = useState({ lat: "--", lng: "--" });
    const [saving, setSaving] = useState(false);
    const [autoFilledFields, setAutoFilledFields] = useState([]);

    const handleAutoFill = createAutoFillAdapter(
        MANAPPURAM_MAPPING,
        (mappedData) => {
            setAutoFilledFields(Object.keys(mappedData));
            setForm((prev) => applyMappedFields(prev, mappedData));

            const coordinates = mappedData["summary.coordinates"];
            if (coordinates) {
                setLiveLocation(getCoordinateSnapshot(coordinates));
            }
        }
    );

    useEffect(() => {
        if (id || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                setLiveLocation({ lat, lng });
                setForm((prev) => ({
                    ...prev,
                    summary: { ...prev.summary, coordinates: `${lat}, ${lng}` },
                }));
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }, [id]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchManappuramById(id))
            .unwrap()
            .then((data) => {
                const nextForm = {
                    ...INIT,
                    ...data,
                    AttachDocuments: data.AttachDocuments || [],
                    imageUrls: data.imageUrls || [],
                    remarks: normalizeRemarks(data.remarks),
                };

                setForm(nextForm);
                setLiveLocation(getCoordinateSnapshot(nextForm.summary?.coordinates));
            });
    }, [dispatch, id]);

    // Generic setter
    const set = (sec, field, val) =>
        setForm((prev) => ({ ...prev, [sec]: { ...prev[sec], [field]: val } }));

    // ── GLR calc ────────────────────────────────────────────────────────────────
    const calcGLR = (field, val) =>
        setForm((prev) => {
            const g = { ...prev.valuationGLR, [field]: val };
            g.landValue = String(
                Math.round(
                    (parseFloat(g.landArea) || 0) * (parseFloat(g.landRate) || 0)
                )
            );
            return { ...prev, valuationGLR: g };
        });

    // ── PMR calc (distress = 85% of total, matching Excel *0.85) ────────────────
    const calcPMR = (field, val) =>
        setForm((prev) => {
            const p = { ...prev.valuationPMR, [field]: val };
            const lv =
                (parseFloat(p.landArea) || 0) * (parseFloat(p.landRate) || 0);
            const cv =
                (parseFloat(p.constructionArea) || 0) *
                (parseFloat(p.constructionRate) || 0);
            p.landValue = String(Math.round(lv));
            p.constructionValue = String(Math.round(cv));
            p.totalValue = String(Math.round(lv + cv));
            const distress = Math.round((lv + cv) * 0.85); // Excel: K56*0.85
            return { ...prev, valuationPMR: p, distressValue: String(distress) };
        });

    // ── Remarks ─────────────────────────────────────────────────────────────────
    const addRemark = () =>
        setForm((prev) => ({ ...prev, remarks: [...prev.remarks, ""] }));
    const updateRemark = (i, v) => {
        const r = [...form.remarks];
        r[i] = v;
        setForm((prev) => ({ ...prev, remarks: r }));
    };
    const deleteRemark = (i) =>
        setForm((prev) => ({
            ...prev,
            remarks: prev.remarks.filter((_, idx) => idx !== i),
        }));

    // ── Images ──────────────────────────────────────────────────────────────────
    const addImage = (imgObj) =>
        setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, imgObj] }));

    const deleteImage = async (index, fileId) => {
        try {
            const img = form.imageUrls[index];
            if (img?.fileId && id) {
                await axiosInstance.delete(`/manappuram/delete-file/${id}`, {
                    data: { fileId: img.fileId, type: "image", url: img.url },
                });
            }
            setForm((prev) => ({
                ...prev,
                imageUrls: prev.imageUrls.filter((_, i) => i !== index),
            }));
            toast.success("Image deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete image");
        }
    };

    // ── Documents ───────────────────────────────────────────────────────────────
    const addDocument = (docObj) =>
        setForm((prev) => ({
            ...prev,
            AttachDocuments: [...prev.AttachDocuments, docObj],
        }));

    const deleteDocument = async (index, fileId) => {
        try {
            const doc = form.AttachDocuments[index];
            if (doc?.fileId && id) {
                await axiosInstance.delete(`/manappuram/delete-file/${id}`, {
                    data: { fileId: doc.fileId, type: "document", url: doc.url },
                });
            }
            setForm((prev) => ({
                ...prev,
                AttachDocuments: prev.AttachDocuments.filter((_, i) => i !== index),
            }));
            toast.success("Document deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete document");
        }
    };

    // ── Bulk download ────────────────────────────────────────────────────────────
    const downloadAllImages = async () => {
        const zip = new JSZip();
        for (let i = 0; i < form.imageUrls.length; i++) {
            try {
                const blob = await (await fetch(form.imageUrls[i].url)).blob();
                zip.file(`image_${i + 1}.${blob.type.split("/")[1] || "jpg"}`, blob);
            } catch { }
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
        link.download = "manappuram_images.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const downloadAllDocuments = async () => {
        const zip = new JSZip();
        for (let i = 0; i < form.AttachDocuments.length; i++) {
            const doc = form.AttachDocuments[i];
            try {
                const blob = await (await fetch(doc.url)).blob();
                const ext = doc.name ? doc.name.split(".").pop() : "pdf";
                zip.file(`document_${i + 1}.${ext}`, blob);
            } catch { }
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
        link.download = "manappuram_documents.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // ── Submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        try {
            setSaving(true);
            const payload = {
                ...form,
                remarks: normalizeRemarks(form.remarks),
                imageUrls: form.imageUrls
                    .map((img) => (typeof img === "string" ? { url: img } : img))
                    .filter((img) => img?.url?.startsWith("http")),
                AttachDocuments: form.AttachDocuments.filter((doc) =>
                    doc?.url?.startsWith("http")
                ),
            };

            if (id) {
                await dispatch(updateManappuramDetails({ id, ...payload })).unwrap();
                toast.success("Updated ✅");
                if (user?.role === "FieldOfficer") {
                    navigate("/field/dashboard");
                }
            } else {
                const res = await dispatch(createManappuramReport(payload)).unwrap();
                toast.success("Created ✅");
                navigate(`/bank/manappuram/${res._id}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error ❌");
        } finally {
            setSaving(false);
        }
    };

    // Destructure for convenience
    const H = form.header,
        PI = form.propertyInfo,
        SB = form.siteBoundaries;
    const AC = form.accessibility,
        MD = form.municipalDetails,
        TD = form.technicalDetails;
    const GLR = form.valuationGLR,
        PMR = form.valuationPMR,
        SUM = form.summary;

    /* ── Shared inline styles ── */
    const inp =
        "w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 bg-white outline-none focus:border-blue-400";
    const sel =
        "w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 bg-white outline-none";

    const SectionHeader = ({ title }) => (
        <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">
            {title}
        </div>
    );

    return (
        <div
            id="print-section"
            className="max-w-4xl mx-auto my-14 bg-white shadow-lg"
        >
            {/* Print Area */}
            <PrintArea form={form} />

            {/* ── TOP ACTION BAR (no-print) ── */}
            <div className="no-print fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2 flex items-center gap-2 flex-wrap">
                <div className="flex-1 text-yellow-500 font-bold text-sm">
                    Manappuram Finance — Valuation Report
                </div>
                <button
                    onClick={downloadAllImages}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📷 Download Images
                </button>
                <button
                    onClick={downloadAllDocuments}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📄 Download Docs
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                >
                    {saving ? "Saving..." : "💾 Save Report"}
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📄 Download PDF
                </button>
            </div>

            {/* ── FORM CONTENT ── */}
            <div className="p-4">
                <div className="no-print mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        AI Auto-fill
                    </div>
                    <AutoFillForm setFormData={handleAutoFill} />
                    {autoFilledFields.length > 0 && (
                        <div className="mt-3 text-xs text-slate-600">
                            {autoFilledFields.length} fields auto-filled from uploaded documents.
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="border-2 border-black flex items-start p-2">
                    <div className="w-full text-center py-2">
                        <div className="text-lg font-black tracking-widest">
                            UNIQUE ENGINEERING AND ASSOCIATE
                        </div>
                        <div className="text-xs font-bold">
                            CHARTED ENGINEER AND APPROVED VALUER
                        </div>
                        <div className="text-xs">
                            Reg. AMIE-AM167147-5, IMC-82-16, IIOV-CAT-I/A-4537
                        </div>
                    </div>
                </div>

                {/* ── HEADER SECTION ── */}
                <SectionHeader title="Valuation Report Header" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Valuer Name
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.valueName}
                                    onChange={(e) =>
                                        set("header", "valueName", e.target.value)
                                    }
                                    placeholder="Unique Engineering & Associate"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Case Ref. No
                            </td>
                            <td className="border border-black p-1 w-1/3">
                                <input
                                    className={inp}
                                    value={H.caseRefNo}
                                    onChange={(e) =>
                                        set("header", "caseRefNo", e.target.value)
                                    }
                                    placeholder="MNFL-2021-00123"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Date of Visit
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.dateOfVisit}
                                    onChange={(e) =>
                                        set("header", "dateOfVisit", e.target.value)
                                    }
                                    placeholder="06.03.2021"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Date of Report
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.dateOfReport}
                                    onChange={(e) =>
                                        set("header", "dateOfReport", e.target.value)
                                    }
                                    placeholder="12.02.2026"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Contacted Person for Property
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.contactedPerson}
                                    onChange={(e) =>
                                        set("header", "contactedPerson", e.target.value)
                                    }
                                    placeholder="NAVEEN PRATAP SINGH / 7806052286"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── PROPERTY INFO ── */}
                <SectionHeader title="Property Information (01 – 13)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                01 · Applicant/s Name/s
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.applicantName}
                                    onChange={(e) =>
                                        set("propertyInfo", "applicantName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Owner
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.ownerName}
                                    onChange={(e) =>
                                        set("propertyInfo", "ownerName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH S/O MR. MANISH SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                02 · Document Produced
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.documentProduced}
                                    onChange={(e) =>
                                        set("propertyInfo", "documentProduced", e.target.value)
                                    }
                                >
                                    {[
                                        "SALEDEED",
                                        "AGREEMENT TO SALE",
                                        "MUTATION",
                                        "TAX RECEIPT",
                                        "ALLOTMENT LETTER",
                                        "OTHER",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                03 · Type of Property
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.typeOfProperty}
                                    onChange={(e) =>
                                        set("propertyInfo", "typeOfProperty", e.target.value)
                                    }
                                >
                                    {[
                                        "RESIDENTIAL",
                                        "COMMERCIAL",
                                        "INDUSTRIAL",
                                        "AGRICULTURAL",
                                        "INSTITUTIONAL",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Current Usage
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.currentUsage}
                                    onChange={(e) =>
                                        set("propertyInfo", "currentUsage", e.target.value)
                                    }
                                    placeholder="OPEN PLOT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                04 · Holding Type
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.holdingType}
                                    onChange={(e) =>
                                        set("propertyInfo", "holdingType", e.target.value)
                                    }
                                >
                                    {[
                                        "Free Hold",
                                        "Lease Hold",
                                        "Government Allotted",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                05 · Property Usage
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.propertyUsage}
                                    onChange={(e) =>
                                        set("propertyInfo", "propertyUsage", e.target.value)
                                    }
                                    placeholder="OPEN PLOT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                06 · Usage Authorized
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.usageAuthorized}
                                    onChange={(e) =>
                                        set("propertyInfo", "usageAuthorized", e.target.value)
                                    }
                                    placeholder="NA"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                07 · Any Usage Restriction of Land?
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.usageRestriction}
                                    onChange={(e) =>
                                        set("propertyInfo", "usageRestriction", e.target.value)
                                    }
                                >
                                    {["No", "Yes"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                08 · Occupancy Status
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.occupancyStatus}
                                    onChange={(e) =>
                                        set("propertyInfo", "occupancyStatus", e.target.value)
                                    }
                                >
                                    {[
                                        "VACANT",
                                        "OCCUPIED (SELF)",
                                        "OCCUPIED (TENANT)",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                09 · Measurement of the Property
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.measurementOfProperty}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "measurementOfProperty",
                                            e.target.value
                                        )
                                    }
                                    placeholder="45*40=1800 SQFT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                10 · Distance from Financing Branch
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.distanceFromBranch}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "distanceFromBranch",
                                            e.target.value
                                        )
                                    }
                                    placeholder="5.8 KM"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                11 · Address at Site
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={PI.addressAtSite}
                                    onChange={(e) =>
                                        set("propertyInfo", "addressAtSite", e.target.value)
                                    }
                                    placeholder="PROPERTY SITUATED AT OPEN PLOT, PART OF KHASRA NO..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Address as per Document
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={PI.addressAsPerDocument}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "addressAsPerDocument",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Same as above or as per deed..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                12 · Landmark
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.landmark}
                                    onChange={(e) =>
                                        set("propertyInfo", "landmark", e.target.value)
                                    }
                                    placeholder="KANAK MARRIAGE HALL"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                13 · Location of Property
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.locationOfProperty}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "locationOfProperty",
                                            e.target.value
                                        )
                                    }
                                >
                                    {["RURAL", "URBAN", "SEMI-URBAN"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── SITE BOUNDARIES ── */}
                <SectionHeader title="14 · Site Boundaries" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Direction</th>
                            <th className="border border-black p-1 bg-amber-50">
                                As per Title Document
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Actual (Site Visit)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["East", "eastDoc", "eastActual"],
                            ["West", "westDoc", "westActual"],
                            ["North", "northDoc", "northActual"],
                            ["South", "southDoc", "southActual"],
                        ].map(([dir, dk, ak]) => (
                            <tr key={dir}>
                                <td className="border border-black p-1 font-bold bg-gray-50">
                                    {dir}
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={SB[dk]}
                                        onChange={(e) =>
                                            set("siteBoundaries", dk, e.target.value)
                                        }
                                        placeholder={`${dir} boundary as per deed`}
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={SB[ak]}
                                        onChange={(e) =>
                                            set("siteBoundaries", ak, e.target.value)
                                        }
                                        placeholder={`Actual ${dir.toLowerCase()} boundary`}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td
                                colSpan={2}
                                className="border border-black p-1 bg-gray-50 font-medium"
                            >
                                Site Boundaries Tallied with Title Deed
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={SB.boundariesTallied}
                                    onChange={(e) =>
                                        set("siteBoundaries", "boundariesTallied", e.target.value)
                                    }
                                >
                                    {["NO", "YES", "PARTIAL"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── ACCESSIBILITY ── */}
                <SectionHeader title="15 · Accessibility" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        {[
                            [
                                "Connectivity",
                                "connectivity",
                                "select",
                                ["Average", "Good", "Excellent", "Poor"],
                            ],
                            [
                                "Site Access",
                                "siteAccess",
                                "select",
                                ["UNDER DEV", "DEVELOPED", "GOOD", "POOR"],
                            ],
                            [
                                "Proximity to Amenities",
                                "proximityToAmenities",
                                "input",
                                "02 kms to 03 kms",
                            ],
                            [
                                "Type & Width of Road at Present",
                                "typeWidthOfRoad",
                                "input",
                                "Approx. 23 Feet road physically existing",
                            ],
                            [
                                "Comments on the Property",
                                "commentsOnProperty",
                                "input",
                                "Marketability of the property is AVERAGE",
                            ],
                            [
                                "Within Municipal Limits",
                                "withinMunicipalLimits",
                                "select",
                                [
                                    "GP",
                                    "Municipal Corporation",
                                    "Municipality",
                                    "Town Planning Authority",
                                    "Development Authority",
                                ],
                            ],
                            [
                                "Any other Factor which adversely affect Marketability",
                                "adverseFactors",
                                "select",
                                ["No", "Yes"],
                            ],
                        ].map(([label, key, type, opts]) => (
                            <tr key={key}>
                                <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                    {label}
                                </td>
                                <td colSpan={3} className="border border-black p-1">
                                    {type === "select" ? (
                                        <select
                                            className={sel}
                                            value={AC[key]}
                                            onChange={(e) =>
                                                set("accessibility", key, e.target.value)
                                            }
                                        >
                                            {opts.map((o) => (
                                                <option key={o}>{o}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className={inp}
                                            value={AC[key]}
                                            onChange={(e) =>
                                                set("accessibility", key, e.target.value)
                                            }
                                            placeholder={opts}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── MUNICIPAL DETAILS ── */}
                <SectionHeader title="16 · Municipal Details" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        {[
                            ["Sanction Plan Provided", "sanctionPlanProvided", "Not produced"],
                            ["Date of Sanction", "dateOfSanction", "Not produced"],
                            ["Sanctioned Area", "sanctionedArea", "Not produced"],
                            ["Municipal Compliance", "municipalCompliance", "Not produced"],
                            ["Current Age of the Property", "currentAgeProperty", "0"],
                            ["Estimated Residual Age", "estimatedResidualAge", "60"],
                        ].map(([label, key, ph]) => (
                            <tr key={key}>
                                <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                    {label}
                                </td>
                                <td colSpan={3} className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={MD[key]}
                                        onChange={(e) =>
                                            set("municipalDetails", key, e.target.value)
                                        }
                                        placeholder={ph}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── TECHNICAL DETAILS ── */}
                <SectionHeader title="17 · Technical Details" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Construction Type
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.constructionType}
                                    onChange={(e) =>
                                        set("technicalDetails", "constructionType", e.target.value)
                                    }
                                    placeholder="RCC / Load Bearing / Tin Shed"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                No of Floors
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.noOfFloors}
                                    onChange={(e) =>
                                        set("technicalDetails", "noOfFloors", e.target.value)
                                    }
                                    placeholder="GF"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Land Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalLandArea}
                                    onChange={(e) =>
                                        set("technicalDetails", "totalLandArea", e.target.value)
                                    }
                                    placeholder="2800"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Built-Up Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalBuiltUpArea}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "totalBuiltUpArea",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Floor Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalFloorArea}
                                    onChange={(e) =>
                                        set("technicalDetails", "totalFloorArea", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Is the Property an Independent Units & has Independent Access
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={TD.independentAccess}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "independentAccess",
                                            e.target.value
                                        )
                                    }
                                >
                                    {[
                                        "Independent Access",
                                        "Shared Access",
                                        "No Access",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                If under Construction, % Completion
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.percentCompletion}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "percentCompletion",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Current Age of Property
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.currentAge}
                                    onChange={(e) =>
                                        set("technicalDetails", "currentAge", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Estimated Residual Age
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.estimatedResidualAge}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "estimatedResidualAge",
                                            e.target.value
                                        )
                                    }
                                    placeholder="60"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── GLR VALUATION ── */}
                <SectionHeader title="Valuation by GLR (Guideline Rate)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Component</th>
                            <th className="border border-black p-1 bg-amber-50">
                                Area (Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Rate (₹/Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 font-medium">
                                Land Component
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={GLR.landArea}
                                    onChange={(e) => calcGLR("landArea", e.target.value)}
                                    placeholder="1800"
                                />
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={GLR.landRate}
                                    onChange={(e) => calcGLR("landRate", e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 text-right font-semibold">
                                ₹{(parseFloat(GLR.landValue) || 0).toLocaleString("en-IN")}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── PMR VALUATION ── */}
                <SectionHeader title="Valuation by PMR (Prevailing Market Rate)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Component</th>
                            <th className="border border-black p-1 bg-amber-50">
                                Area (Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Rate (₹/Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["Land Component", "landArea", "landRate", PMR.landValue],
                            [
                                "Construction Component",
                                "constructionArea",
                                "constructionRate",
                                PMR.constructionValue,
                            ],
                        ].map(([label, aKey, rKey, v]) => (
                            <tr key={label}>
                                <td className="border border-black p-1 font-medium">
                                    {label}
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={PMR[aKey]}
                                        onChange={(e) => calcPMR(aKey, e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={PMR[rKey]}
                                        onChange={(e) => calcPMR(rKey, e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="border border-black p-1 text-right font-semibold">
                                    ₹{(parseFloat(v) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-amber-50">
                            <td colSpan={3} className="border border-black p-1 font-bold">
                                Total Value (₹)
                            </td>
                            <td className="border border-black p-1 text-right font-bold">
                                ₹
                                {(parseFloat(PMR.totalValue) || 0).toLocaleString("en-IN")}
                            </td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td colSpan={3} className="border border-black p-1 font-bold">
                                Distress Sale Value (85%) (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold`}
                                    value={form.distressValue}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            distressValue: e.target.value,
                                        }))
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── REMARKS ── */}
                <SectionHeader title="Remarks / Observations" />
                <div className="border border-black p-2">
                    <div className="no-print mb-2">
                        <button
                            onClick={addRemark}
                            className="bg-gray-800 text-white px-3 py-1 rounded text-xs"
                        >
                            ➕ Add Remark
                        </button>
                    </div>
                    {form.remarks.map((remark, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <span className="font-bold text-xs mt-2">{i + 1}.</span>
                            <div className="flex-1">
                                <textarea
                                    value={remark}
                                    onChange={(e) => updateRemark(i, e.target.value)}
                                    className="min-h-[90px] w-full resize-y rounded border border-gray-300 bg-white p-2 text-xs outline-none"
                                />
                            </div>
                            <button
                                onClick={() => deleteRemark(i)}
                                className="no-print bg-red-600 text-white rounded px-2 py-1 text-xs h-fit mt-8"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>

                {/* ── SUMMARY ── */}
                <SectionHeader title="Summary / Declaration" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Property Address
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={SUM.propertyAddress}
                                    onChange={(e) =>
                                        set("summary", "propertyAddress", e.target.value)
                                    }
                                    placeholder="Full property address..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Property Type
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={SUM.propertyType}
                                    onChange={(e) =>
                                        set("summary", "propertyType", e.target.value)
                                    }
                                >
                                    {[
                                        "RESIDENTIAL",
                                        "COMMERCIAL",
                                        "INDUSTRIAL",
                                        "AGRICULTURAL",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Applicant Name
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={SUM.applicantName}
                                    onChange={(e) =>
                                        set("summary", "applicantName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Present Market Value (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold text-green-800`}
                                    value={SUM.presentMarketValue}
                                    onChange={(e) =>
                                        set("summary", "presentMarketValue", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Forced Sale Value (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold text-red-800`}
                                    value={SUM.forcedSaleValue}
                                    onChange={(e) =>
                                        set("summary", "forcedSaleValue", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Coordinates (Lat, Lng)
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={SUM.coordinates}
                                    onChange={(e) =>
                                        set("summary", "coordinates", e.target.value)
                                    }
                                    placeholder="24.603531, 80.869926"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── PHOTOGRAPHS (no-print) ── */}
                <div className="">
                    <SectionHeader title="PHOTOGRAPHS OF PROPERTY" />
                    <div className="border border-black p-1">
                        <PhotoGrid
                            label="Subject Property"
                            photos={form.imageUrls}
                            reportId={id}
                            onAdd={addImage}
                            onDelete={deleteImage}
                            onCaptureLocation={(lat, lng) => {
                                setLiveLocation({ lat, lng });
                                set("summary", "coordinates", `${lat}, ${lng}`);
                            }}
                        />
                    </div>
                </div>

                {/* ── DOCUMENTS (no-print) ── */}
                <div className="no-print">
                    <SectionHeader title="ATTACHED DOCUMENTS" />
                    <div className="border border-black p-1">
                        <FileDocument
                            label="Attached Documents"
                            documents={form.AttachDocuments}
                            reportId={id}
                            onAdd={addDocument}
                            onDelete={deleteDocument}
                        />
                    </div>
                </div>

                {/* ── LIVE LOCATION (no-print) ── */}
                <div className="no-print">
                    <SectionHeader title="Live Location (Auto Capture)" />
                    <div className="border border-black p-2 text-center">
                        <div className="mb-2 text-xs">
                            📍 Latitude: <b>{liveLocation.lat}</b> &nbsp;|&nbsp; Longitude:{" "}
                            <b>{liveLocation.lng}</b>
                        </div>
                        {liveLocation.lat !== "--" && (
                            <iframe
                                title="map"
                                src={`https://maps.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}&z=15&output=embed`}
                                width="100%"
                                height="220"
                                className="border border-black mt-1"
                            />
                        )}
                    </div>
                </div>

                {/* Bottom save/print */}
                <div className="no-print flex gap-3 justify-center mt-4 mb-6">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-green-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "💾 Save Report"}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-700 text-white px-6 py-2 rounded font-bold"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
