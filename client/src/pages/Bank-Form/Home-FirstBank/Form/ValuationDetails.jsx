
import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { Select } from 'antd';

const { Option } = Select;

import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import RichTextEditor from "../../../../components/RichTextEditor"; // Assuming you have a RichTextEditor component

const ValuationDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();
  const [remarksCount, setRemarksCount] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  // useEffect(() => {
  //   if (isEdit) {
  //     const {
  //       landAreaForValuation = 0,
  //       landRate = 0,
  //       constructionAreaForValuation = 0,
  //       constructionRate = 0,
  //     } = isEdit;

  //     const totalLandValuation = landAreaForValuation * landRate;
  //     const totalConstructionValuation =
  //       constructionAreaForValuation * constructionRate;
  //     const fairMarketValue = totalLandValuation + totalConstructionValuation;
  //     const distressValue = (fairMarketValue * 0.8).toFixed(2);

  //     // Count valuation remarks if they exist
  //     if (isEdit.valuationRemarks) {
  //       const remarksArray = Array.isArray(isEdit.valuationRemarks)
  //         ? isEdit.valuationRemarks
  //         : [isEdit.valuationRemarks];
  //       setRemarksCount(remarksArray.length);
  //     }

  //     form.setFieldsValue({
  //       ...isEdit,
  //       totalLandValuation,
  //       totalConstructionValuation,
  //       fairMarketValue,
  //       distressValue,
  //     });
  //   }
  // }, [isEdit, form]);

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged) {
      form.setFieldsValue({
        document: merged.documentLandArea || "",
        landAreaPlan: merged.landAreaPlan || "",
        landAreaSite: merged.landAreaSite || "",
        landAreaGF: merged.landAreaGF || "",
        builtUpAreaFF: merged.builtUpAreaFF || "",
        builtUpAreaSF: merged.builtUpAreaSF || "",
        existingBuiltUpGF: merged.existingBuiltUpGF || "",
        existingBuiltUpFF: merged.existingBuiltUpFF || "",
        existingBuiltUpSF: merged.existingBuiltUpSF || "",
        landAreaForValuation: merged.landAreaForValuation || "",
        siteArea: merged.siteArea || "",
        planArea: merged.planArea || "",
        deedArea: merged.deedArea || "",
        landRate: merged.landRate || "",
        constructionAreaForValuation: merged.constructionAreaForValuation || "",
        constructionRate: merged.constructionRate || "",
        ValuationatPresentStage: merged.ValuationatPresentStage || "",
        ValuationasperGovtGuideline: merged.ValuationasperGovtGuideline || "",
        realizableValue: merged.realizableValue || "",
      });

      if (merged.valuationRemarks && Array.isArray(merged.valuationRemarks)) {
        setRemarksCount(merged.valuationRemarks.length);
        merged.valuationRemarks.forEach((remark, idx) => {
          form.setFieldValue(['valuationRemarks', idx], remark);
        });
      }
    }
  }, [isEdit, extractedData, form]);

  const handleValuesChange = (changedValues, allValues) => {
    const {
      landAreaForValuation = 0,
      landRate = 0,
      constructionAreaForValuation = 0,
      constructionRate = 0,
    } = allValues;

    const totalLandValuation = landAreaForValuation * landRate;
    const totalConstructionValuation =
      constructionAreaForValuation * constructionRate;
    const fairMarketValue = totalLandValuation + totalConstructionValuation;
    const distressValue = (fairMarketValue * 0.8).toFixed(2);

    form.setFieldsValue({
      totalLandValuation,
      totalConstructionValuation,
      fairMarketValue,
      distressValue,
    });
  };

  const handleSubmit = (values) => {
    // Convert valuationRemarks to array if it's not already
    const formattedValues = {
      ...values,
      valuationRemarks: Array.isArray(values.valuationRemarks)
        ? values.valuationRemarks
        : [values.valuationRemarks].filter(Boolean),
    };
    onNext(formattedValues);
  };

  const addRemarkField = () => {
    setRemarksCount((prev) => prev + 1);
  };

  const removeRemarkField = (index) => {
    setRemarksCount((prev) => prev - 1);
    const remarks = form.getFieldValue("valuationRemarks") || [];
    const newRemarks = [...remarks];
    newRemarks.splice(index, 1);
    form.setFieldsValue({ valuationRemarks: newRemarks });
  };

  return (
    <div className='max-w-5xl mx-auto p-4 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>Valuation Details</h2>

      <Form
        layout='vertical'
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        className='grid grid-cols-1 gap-4'
      >
        <p className='font-semibold mb-2'>Land area (Sq. ft)</p>
        <div className='flex max-w-4xl gap-4 justify-between'>
          <div className='flex-1'>
            <Form.Item label='Document' name='document'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className='flex-1'>
            <Form.Item label='Plan' name='landAreaPlan'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className='flex-1'>
            <Form.Item label='Site' name='landAreaSite'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>

        <p className='font-semibold mb-2'>Built Up Area (Proposed)</p>
        <div className='flex gap-4 max-w-4xl'>
          <div className='flex-1'>
            <Form.Item label='GF' name='landAreaGF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className='flex-1'>
            <Form.Item label='FF' name='builtUpAreaFF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div className='flex-1'>
            <Form.Item label='SF' name='builtUpAreaSF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>

        <p className='font-semibold mb-2'>Built Up Area (Existing)</p>
        <div className='flex gap-4 max-w-4xl'>
          {/* Ground Floor */}
          <div className='flex-1'>
            <Form.Item label='GF' name='existingBuiltUpGF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          {/* First Floor */}
          <div className='flex-1'>
            <Form.Item label='FF' name='existingBuiltUpFF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          {/* Second Floor */}
          <div className='flex-1'>
            <Form.Item label='SF' name='existingBuiltUpSF'>
              <Input type='text' style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>




        <Form.Item label="Land Area for Valuation" name="landAreaForValuation">
          <Select
            placeholder="Select land area type"
            onChange={(value) => setSelectedType(value)}
          >
            <Option value="site">Site</Option>
            <Option value="plan">Plan</Option>
            <Option value="both">Deed/ATS</Option>
          </Select>
        </Form.Item>

        {selectedType === 'site' && (
          <Form.Item label="Site Area (sq. ft)" name="siteArea">
            <Input placeholder="Enter Site area" />
          </Form.Item>
        )}

        {selectedType === 'plan' && (
          <Form.Item label="Plan Area (sq. ft)" name="planArea">
            <Input placeholder="Enter Plan area" />
          </Form.Item>
        )}

        {selectedType === 'both' && (
          <Form.Item label="Deed/ATS Area (sq. ft)" name="deedArea">
            <Input placeholder="Enter Deed/ATS area" />
          </Form.Item>
        )}

        <Form.Item label='Land Rate considered per sq. Ft.' name='landRate'>
          <Input type='text' />
        </Form.Item>

        <Form.Item label='Total Land Valuation' name='totalLandValuation'>
          <Input type='text' disabled />
        </Form.Item>

        <Form.Item
          label='Construction Area considered for Valuation'
          name='constructionAreaForValuation'
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item
          label='Construction Rate considered per sq. Ft'
          name='constructionRate'
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item
          label='Total Construction Valuation'
          name='totalConstructionValuation'
        >
          <Input type='text' disabled />
        </Form.Item>

        <Form.Item
          label='Fair Market Value/ Total Value of the unit after completion'
          name='fairMarketValue'
        >
          <Input type='text' disabled />
        </Form.Item>

        <Form.Item
          label='Valuation at Present Stage '
          name='ValuationatPresentStage'
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item
          label='Valuation as per Govt. Guideline '
          name='ValuationasperGovtGuideline'
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item label='Realizable Value' name='realizableValue'>
          <Input type='text' />
        </Form.Item>

        <Form.Item label='Distress Value (80%)' name='distressValue'>
          <Input type='text' disabled />
        </Form.Item>

        <div className='mb-4'>
          <label className='ant-form-item-label'>Valuation Remarks</label>
          {Array.from({ length: remarksCount }).map((_, index) => (
            <div key={index} className='flex items-center mb-2 gap-2'>
              <Form.Item name={["valuationRemarks", index]} noStyle>
                <Input.TextArea rows={2} style={{ width: "90%" }} />
              </Form.Item>
              {index > 0 && (
                <Button
                  type='text'
                  danger
                  icon={<MinusOutlined />}
                  onClick={() => removeRemarkField(index)}
                />
              )}
            </div>
          ))}
          <Button
            type='dashed'
            onClick={addRemarkField}
            icon={<PlusOutlined />}
            className='mt-2'
          >
            Add Remark
          </Button>
        </div>

        {/* <RichTextEditor /> */}

        <Form.Item className='text-right'>
          {onBack && (
            <Button
              type='default'
              onClick={onBack}
              className='mr-2 px-4 py-2 bg-gray-500 rounded'
            >
              Back
            </Button>
          )}
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ValuationDetails;
