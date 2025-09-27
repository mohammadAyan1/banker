import React, { useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, Divider } from "antd";

const ViolationObserved = ({ isEdit, onNext, onBack, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit || initialValues) {
      const values = isEdit || initialValues;
      form.setFieldsValue({
        deviationToPlan: values.deviationToPlan || "No",
        deviationDetails: values.deviationDetails || "NA",
        demolitionRisk: values.demolitionRisk || "No",
        demolitionDetails: values.demolitionDetails || "NA",
        encroachment: values.encroachment || "No",
        encroachmentDetails: values.encroachmentDetails || "NA"
      });
    }
  }, [isEdit, initialValues, form]);

  const handleSubmit = (values) => {
    onNext(values);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleConditionalFields = (changedValues) => {
    if ('deviationToPlan' in changedValues && changedValues.deviationToPlan === "No") {
      form.setFieldsValue({ deviationDetails: "NA" });
    }
    if ('demolitionRisk' in changedValues && changedValues.demolitionRisk === "No") {
      form.setFieldsValue({ demolitionDetails: "NA" });
    }
    if ('encroachment' in changedValues && changedValues.encroachment === "No") {
      form.setFieldsValue({ encroachmentDetails: "NA" });
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-4 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>VIOLATION OBSERVED, IF ANY</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleConditionalFields}
        initialValues={{
          deviationToPlan: "No",
          deviationDetails: "NA",
          demolitionRisk: "No",
          demolitionDetails: "NA",
          encroachment: "No",
          encroachmentDetails: "NA"
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            {/* Deviation to Plan */}
            <Divider orientation="left">Deviation to Plan</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="deviationToPlan"
                  label="Deviation to Plan"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="deviationDetails"
                  label="If yes"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue('deviationToPlan') === 'Yes',
                      message: 'Please provide deviation details'
                    })
                  ]}
                >
                  <Input disabled={form.getFieldValue('deviationToPlan') === 'No'} />
                </Form.Item>
              </Col>
            </Row>

            {/* Demolition Risk */}
            <Divider orientation="left">Demolition Risk</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="demolitionRisk"
                  label="Demolition Risk"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="demolitionDetails"
                  label="If yes"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue('demolitionRisk') === 'Yes',
                      message: 'Please provide demolition details'
                    })
                  ]}
                >
                  <Input disabled={form.getFieldValue('demolitionRisk') === 'No'} />
                </Form.Item>
              </Col>
            </Row>

            {/* Encroachment */}
            <Divider orientation="left">Encroachment</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="encroachment"
                  label="Encroachment"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="encroachmentDetails"
                  label="If yes"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue('encroachment') === 'Yes',
                      message: 'Please provide encroachment details'
                    })
                  ]}
                >
                  <Input disabled={form.getFieldValue('encroachment') === 'No'} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Form Actions */}
        <Form.Item className="text-right">
          {onBack && (
            <Button
              type="default"
              onClick={onBack}
              className="mr-2"
            >
              Back
            </Button>
          )}
          <Button type="primary" htmlType="submit">
            Submit
            {/* {isEdit ?  "Submit"} */}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ViolationObserved;