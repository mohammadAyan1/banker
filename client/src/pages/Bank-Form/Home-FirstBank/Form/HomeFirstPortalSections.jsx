import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber } from "antd";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ImageUploader from "../../../../components/ImageUploader";
import DocumentUploader from "../../../../components/DocumentUploader";

const { TextArea } = Input;

const HomeFirstPortalSections = ({
  mode,
  isEdit = {},
  sectionId,
  registerSectionSubmitter,
  fetchData,
}) => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [docUrls, setDocUrls] = useState([]);

  useEffect(() => {
    if (mode === "observations") {
      const remarks = Array.isArray(isEdit.valuationRemarks)
        ? isEdit.valuationRemarks.join("\n")
        : isEdit.valuationRemarks || "";
      form.setFieldsValue({ observations: remarks });
    }

    if (mode === "billing") {
      form.setFieldsValue({
        charges: isEdit.charges ?? "",
        baseRate: isEdit.baseRate ?? "",
        totalAmount: isEdit.totalAmount ?? "",
      });
    }

    if (mode === "photos") {
      const savedImages = Array.isArray(isEdit.imageUrls) ? isEdit.imageUrls : [];
      setUploadedImages(savedImages);
      setUploadedUrls(savedImages);
    }

    if (mode === "documents") {
      setDocUrls(Array.isArray(isEdit.AttachDocuments) ? isEdit.AttachDocuments : []);
    }
  }, [form, isEdit, mode]);

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      if (mode === "photos") {
        if (user?.role === "FieldOfficer" && uploadedUrls.length === 0) {
          toast.error("Please upload at least one site photograph");
          throw new Error("site photograph required");
        }
        return { imageUrls: uploadedUrls };
      }

      if (mode === "documents") {
        return { AttachDocuments: docUrls };
      }

      const values = await form.validateFields();
      if (mode === "observations") {
        return {
          valuationRemarks: String(values.observations || "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
        };
      }

      return values;
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [
    docUrls,
    form,
    mode,
    registerSectionSubmitter,
    sectionId,
    uploadedUrls,
    user?.role,
  ]);

  if (mode === "photos") {
    return (
      <div className="home-first-reference-section">
        <ImageUploader
          deleteId={isEdit?._id}
          images={images}
          setImages={setImages}
          setUploadedUrls={setUploadedUrls}
          uploadedImages={uploadedImages}
          uploadedUrls={uploadedUrls}
          fetchData={fetchData}
          url="first-bank"
        />
      </div>
    );
  }

  if (mode === "documents") {
    return (
      <div className="home-first-reference-section">
        <DocumentUploader
          caseId={isEdit?._id}
          bankName="first-bank"
          docUrls={docUrls}
          setDocUrls={setDocUrls}
          fetchData={fetchData}
        />
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" className="home-first-reference-section">
      {mode === "observations" && (
        <Form.Item label="Observations" name="observations">
          <TextArea
            autoSize={{ minRows: 5, maxRows: 16 }}
            placeholder="Enter complete observations"
          />
        </Form.Item>
      )}

      {mode === "billing" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item label="Charges" name="charges">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Base Rate" name="baseRate">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Total" name="totalAmount" className="md:col-span-2">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>
      )}
    </Form>
  );
};

export default HomeFirstPortalSections;
