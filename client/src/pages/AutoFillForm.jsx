// import React, { useState } from "react";
// import DocumentUpload from "../components/DocumentUpload";
// import PhotoPreview from "../components/PhotoPreview";

// const AutoFillForm = ({ setFormData }) => {



//     // const [formData, setFormData] = useState({});
//     const [photos, setPhotos] = useState({});

//     // const handleUpload = async (files) => {
//     //     const form = new FormData();

//     //     files.forEach(file => {
//     //         form.append("files", file);
//     //     });

//     //     const res = await fetch("http://localhost:5000/api/pdf", {
//     //         method: "POST",
//     //         body: form,
//     //         credentials: "include",   // ✅ correct for cookies/session
//     //     });

//     //     if (!res.ok) {
//     //         console.error(await res.text());
//     //         return;
//     //     }


//     //     const data = await res.json();

//     //     console.log(data)

//     //     setFormData(data.formData);
//     //     setPhotos(data.photos);
//     // };



//     const handleUpload = async (files) => {
//         const form = new FormData();

//         files.forEach(file => {
//             form.append("file", file);   // ✅ must match backend
//         });

//         const res = await fetch("http://localhost:5000/api/pdf", {
//             method: "POST",
//             body: form,
//             credentials: "include",
//         });

//         if (!res.ok) {
//             console.error(await res.text());
//             return;
//         }

//         const data = await res.json();

//         console.log(data);

//         setFormData(data.formData);
//         setPhotos(data.photos);
//     };

//     // const handleChange = (e) => {
//     //     setFormData({
//     //         ...formData,
//     //         [e.target.name]: e.target.value,
//     //     });
//     // };

//     // useEffect(() => {
//     //     console.log("AI Data:", formData);
//     // }, [formData]);


//     return (
//         <div className="max-w-4xl mx-auto p-6">

//             <h1 className="text-2xl font-bold mb-4">
//                 AI Auto Fill Property Form
//             </h1>

//             <DocumentUpload onUpload={handleUpload} />

//             {/* FORM */}
//             {/* <div className="grid grid-cols-2 gap-4 mt-6">

//                 <input
//                     name="customerName"
//                     placeholder="Customer Name"
//                     value={formData.customerName || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="sellerName"
//                     placeholder="Seller Name"
//                     value={formData.sellerName || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="buyerName"
//                     placeholder="Buyer Name"
//                     value={formData.buyerName || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="propertyAddress"
//                     placeholder="Property Address"
//                     value={formData.propertyAddress || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="plotSize"
//                     placeholder="Plot Size"
//                     value={formData.plotSize || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="saleAmount"
//                     placeholder="Sale Amount"
//                     value={formData.saleAmount || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//                 <input
//                     name="agreementDate"
//                     placeholder="Agreement Date"
//                     value={formData.agreementDate || ""}
//                     onChange={handleChange}
//                     className="border p-2 rounded"
//                 />

//             </div> */}

//             {/* PHOTO PREVIEW */}
//             <PhotoPreview photos={photos} />

//         </div>
//     );
// };

// export default AutoFillForm;

import React, { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";   // adjust path as needed
import PhotoPreview from "../components/PhotoPreview";       // adjust path as needed
import { Alert, Spin, message, Button } from "antd";

// Mapping function: converts the API response (the document JSON inside data.data)
// into the flat field structure expected by all six steps.
const mapDocumentToFormData = (doc) => {
    const data = {};

    // Helper to safely get nested values
    const get = (obj, path, defaultValue = "") => {
        return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
    };

    // ---------- Step 1: LNTAssignmentDetails ----------
    // customerName → from buyer[0].name
    const buyerName = get(doc, 'buyer.0.name');
    if (buyerName) data.customerName = buyerName;

    // propertyName → combine address parts or use plot area
    const plotNumber = get(doc, 'property.address.plot_number');
    const colonyArea = get(doc, 'property.address.colony_area');
    const district = get(doc, 'property.address.district');
    if (plotNumber || colonyArea || district) {
        data.propertyName = [plotNumber, colonyArea, district].filter(Boolean).join(', ');
    }

    // dateOfReport → registration_date
    if (doc.registration_date) data.dateOfReport = doc.registration_date; // format "23/05/2018" works with moment

    // refNo → registration_number
    if (doc.registration_number) data.refNo = doc.registration_number;

    // unitType → from property_type
    const propType = get(doc, 'property.property_type', '').toLowerCase();
    if (propType.includes('house') || propType.includes('मकान')) {
        data.unitType = 'Individual House';
    } else if (propType.includes('flat') || propType.includes('अपार्टमेंट')) {
        data.unitType = 'Flat';
    } else {
        data.unitType = get(doc, 'property.property_type');
    }

    // documentsAvailable → document_type
    if (doc.document_type) data.documentsAvailable = doc.document_type;

    // ---------- Step 2: GeneralDetails ----------
    // addressLegal & addressSite → full address from property.address
    const addr = doc.property?.address;
    if (addr) {
        const fullAddress = [
            addr.plot_number,
            addr.survey_number,
            addr.colony_area,
            addr.ward_number,
            addr.tehsil,
            addr.district,
            addr.state,
        ].filter(Boolean).join(', ');
        data.addressLegal = fullAddress;
        data.addressSite = fullAddress; // same for site initially
        data.city = addr.district || addr.tehsil || '';
        data.projectPinCode = addr.pincode || '';
        data.projectState = addr.state || 'Madhya Pradesh';
    }

    // zone & usageOfProperty → from property_use
    const propUse = get(doc, 'property.property_use', '').toUpperCase();
    if (propUse.includes('RESIDENTIAL') || propUse.includes('आवासीय')) {
        data.zone = 'RESIDENTIAL';
    } else if (propUse.includes('COMMERCIAL') || propUse.includes('वाणिज्यिक')) {
        data.zone = 'COMMERCIAL';
    } else {
        data.zone = propUse;
    }
    data.usageOfProperty = get(doc, 'property.property_use');

    // ownershipType – default, not in document
    data.ownershipType = 'Freehold';

    // numberAndDate → combine registration_number and date
    if (doc.registration_number && doc.registration_date) {
        data.numberAndDate = `${doc.registration_number} / ${doc.registration_date}`;
    }

    // ---------- Step 3: LocalityDetails ----------
    // No direct mapping; leave empty (user can fill manually)

    // ---------- Step 4: PropertyDetails ----------
    // boundaries
    const bounds = doc.property?.boundaries;
    if (bounds) {
        ['north', 'south', 'east', 'west'].forEach(dir => {
            const value = bounds[dir];
            if (value) {
                data[`${dir}Document`] = value;
                data[`${dir}Actual`] = value;
                data[`${dir}Plan`] = value;
            }
        });
        if (bounds.north || bounds.south || bounds.east || bounds.west) {
            data.boundariesMatching = 'Yes';
        }
    }

    // plotArea
    if (doc.property?.plot_area) data.plotArea = doc.property.plot_area;

    // Dimension (plot dimensions)
    if (doc.property?.plot_dimensions) data.Dimension = doc.property.plot_dimensions;

    // typeOfStructure
    if (doc.property?.property_type) data.typeOfStructure = doc.property.property_type;

    // ---------- Step 5: ValuationDetails ----------
    if (doc.property?.plot_area) {
        data.document = doc.property.plot_area;            // "Document" field under Land area
        data.landAreaForValuation = 'site';                // assume site area
        data.siteArea = doc.property.plot_area;
    }

    // ---------- Step 6: ViolationObserved ----------
    // No data; left empty.

    return data;
};

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
        files.forEach((file) => {
            form.append("file", file);   // backend expects "file" field
        });

        try {
            const res = await fetch("http://localhost:5000/api/pdf", {
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

            // Check if the API returned success and has data
            if (response.success && response.data) {
                const mapped = mapDocumentToFormData(response.data);
                console.log("Mapped form data:", mapped);
                setFormData(mapped);
                message.success("Data extracted from documents successfully.");
            } else {
                message.warning("No valid data found in response.");
            }

            // If the API returns photos, set them
            if (response.photos) {
                setPhotos(response.photos);
            }

            // Store file name(s) for display
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
        message.info("Auto-fill cleared");
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <Alert
                message="Auto-fill from documents"
                description="Upload property documents (PDF, images, etc.). Our AI will extract key information and pre-fill the form."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <DocumentUpload onUpload={handleUpload} disabled={loading} />

            {loading && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                    <Spin tip="Processing documents..." />
                </div>
            )}

            {fileName && !loading && (
                <div style={{ marginTop: 16 }}>
                    <span style={{ color: "green" }}>Uploaded: {fileName}</span>
                    <Button
                        type="link"
                        onClick={clearData}
                        style={{ marginLeft: 16 }}
                    >
                        Clear
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