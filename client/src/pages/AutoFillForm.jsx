import React, { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import PhotoPreview from "../components/PhotoPreview";

const AutoFillForm = ({ setFormData }) => {

    return

    // const [formData, setFormData] = useState({});
    const [photos, setPhotos] = useState({});

    const handleUpload = async (files) => {
        const form = new FormData();

        files.forEach(file => {
            form.append("files", file);
        });

        const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: form,
            credentials: "include",   // ✅ correct for cookies/session
        });

        if (!res.ok) {
            console.error(await res.text());
            return;
        }


        const data = await res.json();

        console.log(data)

        setFormData(data.formData);
        setPhotos(data.photos);
    };

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    // useEffect(() => {
    //     console.log("AI Data:", formData);
    // }, [formData]);


    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-4">
                AI Auto Fill Property Form
            </h1>

            <DocumentUpload onUpload={handleUpload} />

            {/* FORM */}
            {/* <div className="grid grid-cols-2 gap-4 mt-6">

                <input
                    name="customerName"
                    placeholder="Customer Name"
                    value={formData.customerName || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="sellerName"
                    placeholder="Seller Name"
                    value={formData.sellerName || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="buyerName"
                    placeholder="Buyer Name"
                    value={formData.buyerName || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="propertyAddress"
                    placeholder="Property Address"
                    value={formData.propertyAddress || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="plotSize"
                    placeholder="Plot Size"
                    value={formData.plotSize || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="saleAmount"
                    placeholder="Sale Amount"
                    value={formData.saleAmount || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="agreementDate"
                    placeholder="Agreement Date"
                    value={formData.agreementDate || ""}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

            </div> */}

            {/* PHOTO PREVIEW */}
            <PhotoPreview photos={photos} />

        </div>
    );
};

export default AutoFillForm;
