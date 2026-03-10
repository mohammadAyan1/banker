


import React, { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";   // adjust path as needed
import PhotoPreview from "../components/PhotoPreview";       // adjust path as needed
import { Alert, Spin, message, Button } from "antd";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: safely read a nested path from an object
// ─────────────────────────────────────────────────────────────────────────────
const get = (obj, path, defaultValue = "") =>
    path
        .split(".")
        .reduce(
            (acc, part) =>
                acc && acc[part] !== undefined ? acc[part] : defaultValue,
            obj
        );

// ─────────────────────────────────────────────────────────────────────────────
// Parse a Hindi / English mixed string to extract a plain English value.
// After Hinglish AI change, most values will already be Roman script.
// Still kept as fallback for older responses.
// ─────────────────────────────────────────────────────────────────────────────
const extractEnglish = (str = "") => {
    if (!str) return "";
    const m = str.match(/\(([^)]+)\)/);
    return m ? m[1].trim() : str.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// Build a properly formatted address string from the address object.
//
// Format:
//   Plot No. [plot_number], Khasra No. [khasra/survey], Patwari Halka No. [patwari_halka_number],
//   Ward No. [ward_number], [village_name], [colony_area], [tehsil], [district], [state], [pincode]
//
// Only includes a part if its value is present.
// ─────────────────────────────────────────────────────────────────────────────
const buildAddressString = (addr = {}) => {
    if (!addr || Object.keys(addr).length === 0) return "";

    const parts = [];

    // Plot No.
    if (addr.plot_number) {
        parts.push(`Plot No. ${addr.plot_number}`);
    }

    // Khasra No. — use khasra_number first, fallback to survey_number
    const khasra = addr.khasra_number || addr.survey_number;
    if (khasra) {
        parts.push(`Khasra No. ${khasra}`);
    }

    // Patwari Halka No.
    if (addr.patwari_halka_number) {
        parts.push(`Patwari Halka No. ${addr.patwari_halka_number}`);
    }

    // Ward No.
    if (addr.ward_number) {
        parts.push(`Ward No. ${addr.ward_number}`);
    }

    // Village Name
    if (addr.village_name) {
        parts.push(addr.village_name);
    }

    // Colony / Area
    if (addr.colony_area) {
        parts.push(addr.colony_area);
    }

    // Tehsil
    if (addr.tehsil) {
        parts.push(addr.tehsil);
    }

    // District (only if different from tehsil to avoid repetition)
    if (addr.district && addr.district !== addr.tehsil) {
        parts.push(addr.district);
    }

    // State
    if (addr.state) {
        parts.push(addr.state);
    }

    // Pincode
    if (addr.pincode) {
        parts.push(addr.pincode);
    }

    return parts.join(", ");
};

// ─────────────────────────────────────────────────────────────────────────────
// Map the raw API document object → flat field names expected by all 6 steps.
// We ALSO keep the original nested arrays (seller / buyer / property) so that
// ValuationDetails can build its remarks and analysis cards.
// ─────────────────────────────────────────────────────────────────────────────
const mapDocumentToFormData = (doc) => {
    if (!doc || typeof doc !== "object") return {};

    const data = {};

    // ── Keep raw nested data for ValuationDetails ──────────────────────────
    data.seller = doc.seller || [];
    data.buyer = doc.buyer || [];
    data.property = doc.property || {};
    data.document_type = doc.document_type || "";
    data.registration_number = doc.registration_number || "";
    data.registration_date = doc.registration_date || "";

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 1 — LNTAssignmentDetails (General Details)
    // ══════════════════════════════════════════════════════════════════════════

    // customerName ← buyer[0].name (Hinglish, already Roman script)
    const buyerRaw = get(doc, "buyer.0.name");
    if (buyerRaw) data.customerName = buyerRaw;

    // propertyOwnerName ← seller[0].name (Hinglish)
    const sellerRaw = get(doc, "seller.0.name");
    if (sellerRaw) data.propertyOwnerName = sellerRaw;

    // ── Address object ────────────────────────────────────────────────────────
    const addr = doc.property?.address || {};

    // Build full formatted address for Legal and Site address fields
    const formattedAddress = buildAddressString(addr);

    if (formattedAddress) {
        data.addressLegal = formattedAddress;
        data.addressSite = formattedAddress;
    }

    // city — prefer district, fallback to tehsil
    if (addr.district) {
        data.city = addr.district;
    } else if (addr.tehsil) {
        data.city = addr.tehsil;
    }

    // Pin code
    if (addr.pincode) {
        data.projectPinCode = addr.pincode;
    }

    // State
    data.projectState = addr.state || "Madhya Pradesh";

    // propertyName — shorter readable version for the property name field
    const propertyNameParts = [
        addr.plot_number && `Plot No. ${addr.plot_number}`,
        addr.colony_area,
        addr.village_name,
        addr.tehsil,
        addr.district,
    ].filter(Boolean);

    if (propertyNameParts.length > 0) {
        data.propertyName = propertyNameParts.join(", ");
    }

    // dateOfReport ← registration_date
    if (doc.registration_date) data.dateOfReport = doc.registration_date;

    // refNo ← registration_number
    if (doc.registration_number) data.refNo = doc.registration_number;

    // ── unitType ← property_type ─────────────────────────────────────────────
    const propTypeRaw = get(doc, "property.property_type", "");
    const propTypeLower = propTypeRaw.toLowerCase();

    if (
        propTypeLower.includes("house") ||
        propTypeLower.includes("makan") ||
        propTypeLower.includes("awas") ||
        propTypeLower.includes("makaan")
    ) {
        data.unitType = "Individual House";
    } else if (
        propTypeLower.includes("flat") ||
        propTypeLower.includes("apartment") ||
        propTypeLower.includes("aparment")
    ) {
        data.unitType = "Flat";
    } else if (
        propTypeLower.includes("plot") ||
        propTypeLower.includes("bhukhanda") ||
        propTypeLower.includes("bhukhand") ||
        propTypeLower.includes("bhu khand") ||
        propTypeLower.includes("open plot") ||
        propTypeLower.includes("bhu khanda") ||
        propTypeLower.includes("plot land")
    ) {
        data.unitType = "OPEN PLOT";
    } else if (
        propTypeLower.includes("shop") ||
        propTypeLower.includes("dukan") ||
        propTypeLower.includes("dukaan")
    ) {
        data.unitType = "Shop";
    } else if (propTypeLower.includes("row house")) {
        data.unitType = "Row House";
    } else if (propTypeLower.includes("office")) {
        data.unitType = "Office";
    } else if (propTypeLower.includes("industrial")) {
        data.unitType = "Industrial";
    } else if (propTypeRaw) {
        data.unitType = propTypeRaw; // fallback: raw value
    }

    // documentsAvailable ← document_type
    if (doc.document_type) data.documentsAvailable = doc.document_type;

    // typeOfStructure (Step 4)
    if (propTypeRaw) data.typeOfStructure = propTypeRaw;

    // ── Zone / Usage ─────────────────────────────────────────────────────────
    const propUseRaw = get(doc, "property.property_use", "");
    if (propUseRaw) {
        const propUseLower = propUseRaw.toLowerCase();
        if (
            propUseLower.includes("residential") ||
            propUseLower.includes("aawasiya") ||
            propUseLower.includes("awasiya") ||
            propUseLower.includes("awas") ||
            propUseLower.includes("rehayshi")
        ) {
            data.zone = "Residential";
            data.usageOfProperty = "Residential";
        } else if (
            propUseLower.includes("commercial") ||
            propUseLower.includes("vanijyik") ||
            propUseLower.includes("vyavsayik") ||
            propUseLower.includes("dukan")
        ) {
            data.zone = "Commercial";
            data.usageOfProperty = "Commercial";
        } else if (
            propUseLower.includes("agricultural") ||
            propUseLower.includes("krishi") ||
            propUseLower.includes("khet") ||
            propUseLower.includes("fasal")
        ) {
            data.zone = "Agricultural";
            data.usageOfProperty = "Agricultural";
        } else {
            data.zone = propUseRaw;
            data.usageOfProperty = propUseRaw;
        }
    } else {
        // Default for open plot
        if (data.unitType === "OPEN PLOT") {
            data.zone = "Residential";
            data.usageOfProperty = "Residential";
        }
    }

    // ownershipType — sensible default
    data.ownershipType = "Freehold";

    // numberAndDate
    if (doc.registration_number && doc.registration_date) {
        data.numberAndDate = `${doc.registration_number} / ${doc.registration_date}`;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STEP 4 — PropertyDetails (Boundaries, Dimensions, Structural Details)
    // ══════════════════════════════════════════════════════════════════════════
    const bounds = doc.property?.boundaries || {};

    ["north", "south", "east", "west"].forEach((dir) => {
        const value = bounds[dir];
        if (value) {
            data[`${dir}Document`] = value;
            data[`${dir}Actual`] = value;
            data[`${dir}Plan`] = value;
        }
    });

    if (bounds.north || bounds.south || bounds.east || bounds.west) {
        data.boundariesMatching = "Yes";
    }

    // Plot area
    const plotAreaRaw = doc.property?.plot_area || "";
    if (plotAreaRaw) {
        const numericArea = parseFloat(plotAreaRaw.replace(/[^\d.]/g, "")) || "";
        data.plotArea = numericArea || plotAreaRaw;
        data.landArea = numericArea || plotAreaRaw;
        // Valuation step area fields
        data.landSiteArea = numericArea || plotAreaRaw;
        data.landDocumentArea = numericArea || plotAreaRaw;
        data.landPlanArea = numericArea || plotAreaRaw;
    }

    // Plot dimensions
    const plotDimensions = doc.property?.plot_dimensions || "";
    if (plotDimensions) {
        data.Dimension = plotDimensions;
        data.linearDimension = plotDimensions;
    }

    return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const AutoFillForm = ({ setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState({});
    const [fileName, setFileName] = useState("");

    const handleUpload = async (files) => {
        if (!files || files.length === 0) {
            message.warning("Please select files to upload.");
            return;
        }

        setLoading(true);
        const form = new FormData();
        files.forEach((file) => form.append("file", file));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf`, {
                method: "POST",
                body: form,
                credentials: "include",
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Upload failed:", errorText);
                message.error("Document processing failed. Please try again.");
                return;
            }

            const response = await res.json();
            console.log("API response:", response);

            if (response.success && response.data) {
                const mapped = mapDocumentToFormData(response.data);
                console.log("Mapped form data:", mapped);
                setFormData(mapped);
                message.success(
                    "Data extract ho gaya! Form fields Hinglish mein auto-fill ho gaye."
                );
            } else {
                message.warning("Response mein valid data nahi mila.");
            }

            if (response.photos) setPhotos(response.photos);

            setFileName(files.map((f) => f.name).join(", "));
        } catch (error) {
            console.error("API call error:", error);
            message.error("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const clearData = () => {
        setFormData({});
        setPhotos({});
        setFileName("");
        message.info("Auto-fill clear ho gaya");
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <Alert
                message="Auto-fill from Documents"
                description="Property documents upload karein (PDF, images, etc.). AI key information extract karke sabhi form fields mein Hinglish mein auto-fill kar dega."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <DocumentUpload onUpload={handleUpload} disabled={loading} />

            {loading && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                    <Spin tip="Documents process ho rahe hain, data extract ho raha hai..." />
                </div>
            )}

            {fileName && !loading && (
                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ color: "green" }}>✅ Uploaded: {fileName}</span>
                    <Button type="link" onClick={clearData}>
                        Clear Auto-fill
                    </Button>
                </div>
            )}

            {Object.keys(photos).length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <h3 className="text-lg font-semibold mb-2">Extracted Photos</h3>
                    <PhotoPreview photos={photos} />
                </div>
            )}
        </div>
    );
};

export default AutoFillForm;
