import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, message, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const { TextArea } = Input;

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = [
  {
    key: "gpsFiles",
    title: "📍 GPS / Map Screenshots",
    helper: "Google Maps screenshot, GPS app screenshot jisme lat-long dikhe",
  },
  {
    key: "atsFiles",
    title: "📄 ATS / Sale Deed / Legal Docs",
    helper: "Sale deed, gift deed, registry, allotment letter, patta — koi bhi Indian legal document",
  },
  {
    key: "emailFiles",
    title: "📧 Email / MIS Screenshot",
    helper: "Bank email jisme file no, LAN no, BRQ no, applicant name, branch ho",
  },
  {
    key: "fieldFormFiles",
    title: "📋 Field Visit Form",
    helper: "HF valuation format, handwritten site visit form",
  },
  {
    key: "additionalFiles",
    title: "🗂️ Additional Photos / Docs",
    helper: "MPSSL / Seemank Khasra app screenshot, extra site proof, supporting documents",
  },
];

const EMPTY_FILES = {
  gpsFiles: [],
  atsFiles: [],
  emailFiles: [],
  fieldFormFiles: [],
  additionalFiles: [],
};

const BANK_OPTIONS = [
  { value: "",                   label: "🏦 Select Bank" },
  { value: "ICICI",              label: "ICICI Bank (iLens)" },
  { value: "Bajaj",              label: "Bajaj Housing Finance / Ameriya" },
  { value: "Home First",         label: "Home First Finance" },
  { value: "Home First Tranche", label: "Home First Tranche" },
  { value: "Aditya Birla",       label: "Aditya Birla Capital (ABCL)" },
  { value: "Manappuram",         label: "Manappuram Finance" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "",                   label: "Auto Detect" },
  { value: "Open Plot",          label: "Open Plot" },
  { value: "Individual House",   label: "Individual House" },
  { value: "Flat / Apartment",   label: "Flat / Apartment" },
  { value: "Under Construction", label: "Under Construction" },
  { value: "Shop / Office",      label: "Shop / Office" },
];

// ─── File chip ────────────────────────────────────────────────────────────────
const FileChip = ({ file, onRemove }) => (
  <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs">
    <span className="truncate text-slate-700">{file.name}</span>
    <button
      type="button"
      onClick={onRemove}
      className="shrink-0 rounded border border-red-200 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50"
    >
      Remove
    </button>
  </div>
);

// ─── Upload card ──────────────────────────────────────────────────────────────
const UploadCard = ({ title, helper, files, onAddFiles, onRemoveFile, accent = "blue" }) => {
  const borderColor = accent === "green" ? "border-emerald-300" : "border-slate-200";
  const bgCard      = accent === "green" ? "bg-emerald-50/60" : "bg-white";
  const hoverBorder = accent === "green"
    ? "hover:border-emerald-500 hover:bg-emerald-50"
    : "hover:border-blue-400 hover:bg-blue-50";
  const dashedBorder = accent === "green" ? "border-emerald-300" : "border-slate-300";
  const btnColor    = accent === "green" ? "bg-emerald-600" : "bg-blue-600";

  return (
    <div className={`rounded-xl border ${borderColor} ${bgCard} p-4 shadow-sm`}>
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{helper}</div>
      </div>
      <label
        className={`flex cursor-pointer items-center justify-between rounded-lg border border-dashed ${dashedBorder} bg-slate-50 px-3 py-3 text-sm text-slate-600 ${hoverBorder}`}
      >
        <span>Select files</span>
        <span className={`rounded ${btnColor} px-3 py-1 text-xs font-semibold text-white`}>
          Browse
        </span>
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => {
            onAddFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <FileChip
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              onRemove={() => onRemoveFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────
const AdvancedAutoFillForm = ({ 
  setFormData, 
  bankName: propBankName = "", 
  atsDocuments: propAtsDocuments = [],
  imageUrls: propImageUrls = [],
  fetchData
}) => {
  const { user } = useSelector((state) => state.auth);
  const isFieldOfficer = user?.role === "FieldOfficer";
  const { id: caseId } = useParams();
  const [atsDocsList, setAtsDocsList] = useState([]);
  const [uploadingAts, setUploadingAts] = useState(false);
  const [filesByCategory, setFilesByCategory]     = useState(EMPTY_FILES);
  const [siteVisitPhotos, setSiteVisitPhotos]     = useState([]);
  const [loading, setLoading]                     = useState(false);
  const [propertyTypeHint, setPropertyTypeHint]   = useState("");
  const [additionalNotes, setAdditionalNotes]     = useState("");
  const [selectedBank, setSelectedBank]           = useState(propBankName || "");
  const [auditNotes, setAuditNotes]               = useState([]);
  const [sourceSummary, setSourceSummary]         = useState(null);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([]);

  useEffect(() => {
    if (propAtsDocuments && propAtsDocuments.length > 0) {
      setAtsDocsList(propAtsDocuments);
    }
  }, [propAtsDocuments]);

  useEffect(() => {
    if (propImageUrls && propImageUrls.length > 0) {
      setUploadedPhotoUrls(propImageUrls);
    }
  }, [propImageUrls]);

  // Fetch as fallback if caseId exists but no documents in prop
  useEffect(() => {
    if (caseId && (!propAtsDocuments || propAtsDocuments.length === 0)) {
      fetch(`${import.meta.env.VITE_API_URL}/api/case/${caseId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData && Array.isArray(resData.atsDocuments)) {
            setAtsDocsList(resData.atsDocuments);
          }
        })
        .catch((err) => console.error("Error fetching case details:", err));
    }
  }, [caseId, propAtsDocuments]);

  const handleAtsUpload = async (incomingFiles) => {
    const files = Array.from(incomingFiles || []);
    if (!files.length) return;

    setUploadingAts(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.urls?.length) {
        throw new Error(uploadData.message || "Failed to upload files");
      }

      const newDocs = uploadData.urls.map((item) => ({
        url: item.url,
        fileId: item.fileId,
        name: item.name,
      }));

      const updatedList = [...atsDocsList, ...newDocs];
      setAtsDocsList(updatedList);

      if (caseId) {
        for (const doc of newDocs) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/upload-ats-document`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caseId, document: doc }),
          });
        }
        // Notify parent case component of direct update
        setFormData((prev) => ({
          ...(prev || {}),
          atsDocuments: updatedList,
        }));
        message.success("Property paper uploaded and saved successfully!");
      } else {
        setFormData((prev) => ({
          ...(prev || {}),
          atsDocuments: updatedList,
        }));
        message.success("Property paper added!");
      }

      setFilesByCategory((prev) => ({
        ...prev,
        atsFiles: [...prev.atsFiles, ...files],
      }));
    } catch (err) {
      console.error("ATS upload error:", err);
      message.error(err.message || "Failed to upload property documents.");
    } finally {
      setUploadingAts(false);
    }
  };

  const handleAtsDelete = async (docToDelete) => {
    try {
      if (caseId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/remove-ats-document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, document: docToDelete }),
        });
        const resData = await res.json();
        if (!resData.success) {
          throw new Error(resData.error || "Failed to remove document");
        }
        message.success("Property paper removed successfully!");
      } else {
        if (docToDelete.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: docToDelete.fileId }),
          });
        }
        message.success("Property paper removed.");
      }

      const updatedList = atsDocsList.filter((doc) => doc.fileId !== docToDelete.fileId);
      setAtsDocsList(updatedList);

      setFormData((prev) => ({
        ...(prev || {}),
        atsDocuments: updatedList,
      }));

      setFilesByCategory((prev) => ({
        ...prev,
        atsFiles: prev.atsFiles.filter((f) => f.name !== docToDelete.name),
      }));
    } catch (err) {
      console.error("ATS delete error:", err);
      message.error(err.message || "Failed to remove property document.");
    }
  };

  const handlePhotoDelete = async (photoToDelete) => {
    try {
      if (caseId) {
        const normBank = selectedBank.toLowerCase();
        let bankUrlPart = "first-bank";
        if (normBank.includes("icici")) {
          bankUrlPart = "icici-bank";
        } else if (normBank.includes("tranche")) {
          bankUrlPart = "home-trench-reports";
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${bankUrlPart}/remove-image/${caseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: photoToDelete }),
        });
        const resData = await res.json();
        if (!resData.success && !res.ok) {
          throw new Error(resData.message || "Failed to remove photo from server");
        }

        if (fetchData) {
          await fetchData();
        }

        message.success("Site photo removed successfully!");
      } else {
        if (photoToDelete.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: photoToDelete.fileId }),
          });
        }
        message.success("Site photo removed.");
      }

      const updatedList = uploadedPhotoUrls.filter(
        (photo) => photo.fileId !== photoToDelete.fileId && photo.url !== photoToDelete.url
      );
      setUploadedPhotoUrls(updatedList);

      const normBank = selectedBank.toLowerCase();
      let fieldName = "imageUrls";
      if (normBank.includes("icici")) {
        fieldName = "sitePhotographs";
      } else if (normBank.includes("bajaj")) {
        fieldName = "otherImages";
      }

      if (typeof setFormData === "function") {
        setFormData({ [fieldName]: updatedList });
      }
    } catch (err) {
      console.error("Photo delete error:", err);
      message.error(err.message || "Failed to remove site photo.");
    }
  };

  const totalDocFiles = useMemo(
    () => Object.values(filesByCategory).reduce((sum, files) => sum + files.length, 0),
    [filesByCategory]
  );
  const totalFiles = totalDocFiles + siteVisitPhotos.length;

  const handleAddFiles = (categoryKey, incomingFileList) => {
    const nextFiles = Array.from(incomingFileList || []);
    if (!nextFiles.length) return;
    setFilesByCategory((prev) => ({
      ...prev,
      [categoryKey]: [...prev[categoryKey], ...nextFiles],
    }));
  };

  const handleRemoveFile = (categoryKey, indexToRemove) => {
    setFilesByCategory((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddSiteVisitPhotos = (incomingFileList) => {
    const nextFiles = Array.from(incomingFileList || []);
    if (!nextFiles.length) return;
    setSiteVisitPhotos((prev) => [...prev, ...nextFiles]);
  };

  const handleRemoveSiteVisitPhoto = (indexToRemove) => {
    setSiteVisitPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearAll = () => {
    setFilesByCategory(EMPTY_FILES);
    setSiteVisitPhotos([]);
    setPropertyTypeHint("");
    setAdditionalNotes("");
    setAuditNotes([]);
    setSourceSummary(null);
    setUploadedPhotoUrls([]);
    setAtsDocsList([]);
    setFormData((prev) => ({
      ...(prev || {}),
      atsDocuments: [],
    }));
    message.info("Advanced AI uploads cleared.");
  };

  const handleGenerate = async () => {
    if (!totalFiles) {
      message.warning("Please upload at least one file.");
      return;
    }
    if (!selectedBank) {
      message.warning("Please select the target bank first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bankName",         selectedBank);
      formData.append("propertyTypeHint", propertyTypeHint);
      formData.append("additionalNotes",  additionalNotes);

      // Append document files by category
      Object.entries(filesByCategory).forEach(([categoryKey, files]) => {
        files.forEach((file) => formData.append(categoryKey, file));
      });

      // Append site visit photos separately — these go to ImageKit
      siteVisitPhotos.forEach((file) => formData.append("siteVisitPhotos", file));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/advanced-autofill`,
        {
          method:      "POST",
          body:        formData,
          credentials: "include",
        }
      );

      const payload = await response.json();

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || "Advanced autofill failed.");
      }

      // Fill form data (text fields & photos)
      const photoUrls = payload.siteVisitPhotoUrls || [];
      const photoAnalysis = payload.photoAnalysis || [];
      const finalData = { ...payload.data };

      if (photoUrls.length > 0) {
        const categorized = {};

        photoUrls.forEach((photo) => {
          const match = photoAnalysis.find(
            (a) => a.file_name === photo.name || photo.name?.includes(a.file_name) || a.file_name?.includes(photo.name)
          );

          let fields = match && Array.isArray(match.supports_fields)
            ? match.supports_fields.filter(Boolean)
            : [];

          if (fields.length === 0) {
            const normBank = selectedBank.toLowerCase();
            if (normBank.includes("icici")) {
              fields = ["sitePhotographs"];
            } else if (normBank.includes("bajaj")) {
              fields = ["otherImages"];
            } else {
              fields = ["imageUrls"];
            }
          }

          fields.forEach((field) => {
            if (!categorized[field]) {
              categorized[field] = [];
            }
            if (field === "sitePhotographs") {
              categorized[field].push({
                name: photo.name,
                url: photo.url,
                fileId: photo.fileId,
                status: "done",
                uid: photo.fileId || `rc-upload-${Date.now()}-${Math.random()}`,
                thumbUrl: photo.url,
              });
            } else {
              categorized[field].push({
                url: photo.url,
                fileId: photo.fileId,
                name: photo.name,
              });
            }
          });
        });

        Object.entries(categorized).forEach(([field, photos]) => {
          finalData[field] = photos;
        });

        finalData.siteVisitPhotoUrls = photoUrls;
        finalData.photoAnalysis = photoAnalysis;
      }

      const atsUrls = payload.atsDocumentUrls || [];
      if (atsUrls.length > 0) {
        finalData.atsDocuments = atsUrls;
      }

      setFormData(finalData);
      setUploadedPhotoUrls(photoUrls);

      setAuditNotes(Array.isArray(payload.auditNotes) ? payload.auditNotes.filter(Boolean) : []);
      setSourceSummary(payload.sourceSummary || null);

      const photoMsg = photoUrls.length > 0
        ? ` ${photoUrls.length} site photos ImageKit pe upload ho gaye — form ke photo fields mein fill honge.`
        : "";
      const docMsg = atsUrls.length > 0
        ? ` ${atsUrls.length} property papers successfully upload ho gaye.`
        : "";

      message.success(`✅ Advanced AI ne form fill kar diya.${photoMsg}${docMsg}`);

      // Notify extension to inject photos via postMessage
      if (photoUrls.length > 0) {
        window.postMessage(
          {
            type: "EXTENSION_INJECT_PHOTOS",
            photoUrls: photoUrls.map((p) => p.url),
          },
          "*"
        );
      }
    } catch (error) {
      console.error("Advanced autofill error:", error);
      message.error(error.message || "Advanced AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">
          🤖 Advanced Multi-Document AI Extractor
        </div>
        <div className="mt-1 text-xs text-slate-600">
          Sale deed, GPS photos, email screenshot, field form, MPSSL Khasra app screenshot — sab ek saath upload karo.
          AI automatically data extract karke form fill karega aur site photos form ke photo fields mein fill honge.
        </div>
      </div>

      {/* Bank + Property Type + Notes row */}
      {!isFieldOfficer && (
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs font-semibold text-red-600">🏦 Target Bank *</div>
            <Select
              value={selectedBank}
              onChange={setSelectedBank}
              options={BANK_OPTIONS}
              className="w-full"
              size="large"
              placeholder="Select bank"
              status={!selectedBank ? "error" : ""}
            />
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-slate-700">Property Type Hint</div>
            <Select
              value={propertyTypeHint}
              onChange={setPropertyTypeHint}
              options={PROPERTY_TYPE_OPTIONS}
              className="w-full"
              size="large"
            />
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-slate-700">Additional Notes</div>
            <TextArea
              rows={2}
              value={additionalNotes}
              onChange={(event) => setAdditionalNotes(event.target.value)}
              placeholder="Optional: koi extra context ya instruction"
            />
          </div>
        </div>
      )}

      {/* Document category upload cards */}
      <div className="grid gap-4 xl:grid-cols-2">
        {CATEGORY_CONFIG.map((category) => {
          if (isFieldOfficer && category.key !== "gpsFiles" && category.key !== "fieldFormFiles") {
            return null;
          }
          if (category.key === "atsFiles") {
            return (
              <div key={category.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <div className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                    <span>{category.title}</span>
                    {uploadingAts && <Spin size="small" />}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{category.helper}</div>
                </div>

                <label
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                >
                  <span>Select property documents</span>
                  <span className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Browse
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    disabled={uploadingAts}
                    onChange={(event) => {
                      handleAtsUpload(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>

                {atsDocsList.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-medium text-slate-500">Uploaded Property Papers:</div>
                    {atsDocsList.map((doc, index) => (
                      <div key={doc.fileId || index} className="flex items-center justify-between gap-2 rounded-md border border-amber-100 bg-amber-50/50 px-3 py-2 text-xs">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-blue-600 hover:underline font-medium"
                        >
                          {doc.name || `document_${index + 1}`}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleAtsDelete(doc)}
                          className="shrink-0 rounded border border-red-200 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <UploadCard
              key={category.key}
              title={category.title}
              helper={category.helper}
              files={filesByCategory[category.key]}
              onAddFiles={(incomingFileList) => handleAddFiles(category.key, incomingFileList)}
              onRemoveFile={(index) => handleRemoveFile(category.key, index)}
            />
          );
        })}
      </div>

      {/* Site Visit Photos — green accent card */}
      <div className="mt-4">
        <UploadCard
          title="📸 Site Visit Photos — Form Ke Photo Fields Me Fill Honge"
          helper="Engineer ke GPS-tagged photos. Ye ImageKit pe upload hokar automatically form ke photo input fields mein fill honge."
          files={siteVisitPhotos}
          onAddFiles={handleAddSiteVisitPhotos}
          onRemoveFile={handleRemoveSiteVisitPhoto}
          accent="green"
        />
      </div>

      {/* Footer action bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white px-4 py-3">
        <div className="text-xs text-slate-600">
          <span className="font-medium">{totalDocFiles}</span> document{totalDocFiles !== 1 ? "s" : ""} +{" "}
          <span className="font-medium text-emerald-700">{siteVisitPhotos.length}</span> site photo{siteVisitPhotos.length !== 1 ? "s" : ""} ready
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleClearAll} disabled={loading}>
            Clear All
          </Button>
          <Button type="primary" loading={loading} onClick={handleGenerate}>
            🚀 Process With Advanced AI
          </Button>
        </div>
      </div>

      {/* Results panel */}
      {(sourceSummary || auditNotes.length > 0 || uploadedPhotoUrls.length > 0) && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          {/* Source summary */}
          {sourceSummary && (
            <div className="text-xs text-slate-600 flex flex-wrap gap-2">
              <span className="font-semibold text-slate-800">Processed:</span>
              <span>GPS {sourceSummary.gpsFiles || 0}</span>
              <span>|</span>
              <span>ATS {sourceSummary.atsFiles || 0}</span>
              <span>|</span>
              <span>Email {sourceSummary.emailFiles || 0}</span>
              <span>|</span>
              <span>Form {sourceSummary.fieldFormFiles || 0}</span>
              <span>|</span>
              <span>Extra {sourceSummary.additionalFiles || 0}</span>
              <span>|</span>
              <span className="font-semibold text-emerald-700">
                📸 Site Photos {sourceSummary.siteVisitUploaded || 0}/{sourceSummary.siteVisitPhotos || 0} uploaded
              </span>
            </div>
          )}

          {/* Uploaded ImageKit photo URLs */}
          {uploadedPhotoUrls.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold text-emerald-800">
                📸 Site Photos — ImageKit URLs ({uploadedPhotoUrls.length} photos)
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {uploadedPhotoUrls.map((photo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="h-8 w-8 shrink-0 rounded object-cover border border-emerald-200"
                      />
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-blue-600 hover:underline font-medium"
                      >
                        {photo.name}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo)}
                      className="shrink-0 rounded border border-red-200 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Audit notes */}
          {auditNotes.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold text-slate-800">⚠️ AI Audit Notes</div>
              <div className="space-y-2">
                {auditNotes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-slate-700"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAutoFillForm;
