import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, Divider } from "antd";

const FLoorWise = ({ isEdit, onNext, onBack, extractedData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        const merged = { ...extractedData, ...isEdit };

        if (merged) {
            form.setFieldsValue({
                gfPlan: merged.gfPlan || "",
                gfSite: merged.gfSite || "",
                gfRemark: merged.gfRemark || "NA",

                ffPlan: merged.ffPlan || "",
                ffSite: merged.ffSite || "",
                ffRemark: merged.ffRemark || "NA",

                sfPlan: merged.sfPlan || "",
                sfSite: merged.sfSite || "",
                sfRemark: merged.sfRemark || "NA",

                tfPlan: merged.tfPlan || "",
                tfSite: merged.tfSite || "",
                tfRemark: merged.tfRemark || "NA",

                fifthPlan: merged.fifthPlan || "",
                fifthSite: merged.fifthSite || "",
                fifthRemark: merged.fifthRemark || "NA",

                totalPlan: merged.totalPlan || "",
                totalSite: merged.totalSite || "",
                totalRemark: merged.totalRemark || "NA",
            });
        }
    }, [isEdit, extractedData, form]);

    const handleSubmit = (values) => {
        onNext(values);
    };

    const RowInput = ({ label, plan, site, remark }) => (
        <Row gutter={16} className="mb-2">
            <Col span={6}>
                <Input value={label} disabled />
            </Col>

            <Col span={6}>
                <Form.Item name={plan}>
                    <Input placeholder="As per plan" />
                </Form.Item>
            </Col>

            <Col span={6}>
                <Form.Item name={site}>
                    <Input placeholder="As per site" />
                </Form.Item>
            </Col>

            <Col span={6}>
                <Form.Item name={remark}>
                    <Input placeholder="Remarks" />
                </Form.Item>
            </Col>
        </Row>
    );

    return (
        <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-red-600">
                Floor wise built-up area
            </h2>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>

                <Divider orientation="left">Area Details</Divider>

                {/* Header */}
                <Row gutter={16} className="font-bold mb-2">
                    <Col span={6}>Floor</Col>
                    <Col span={6}>As per Plan</Col>
                    <Col span={6}>As per Site</Col>
                    <Col span={6}>Remarks</Col>
                </Row>

                <RowInput label="GF" plan="gfPlan" site="gfSite" remark="gfRemark" />
                <RowInput label="FF" plan="ffPlan" site="ffSite" remark="ffRemark" />
                <RowInput label="SF" plan="sfPlan" site="sfSite" remark="sfRemark" />
                <RowInput label="TF" plan="tfPlan" site="tfSite" remark="tfRemark" />
                <RowInput label="FF" plan="fifthPlan" site="fifthSite" remark="fifthRemark" />

                <Divider />

                <RowInput label="Total BUA" plan="totalPlan" site="totalSite" remark="totalRemark" />

                {/* Buttons */}
                <Form.Item className="text-end mt-4">
                    {onBack && (
                        <Button
                            onClick={onBack}
                            className="mr-2 px-4 py-2 bg-gray-500 text-white"
                        >
                            Back
                        </Button>
                    )}

                    <Button type="primary" htmlType="submit">
                        Next
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
};

export default FLoorWise;