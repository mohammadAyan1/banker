
import React, { useEffect } from "react";
import { Form, Input, Button, Select, Divider } from "antd";

const LocalityDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged) {
      form.setFieldsValue({
        // Section 4 – Locality
        localityDevelopment: merged.localityDevelopment || "",
        approachRoadType: merged.approachRoadType || "",
        approachRoadWidth: merged.approachRoadWidth || "",
        distanceFromCityCentre: merged.distanceFromCityCentre || "",
        distanceFromRailwayStation: merged.distanceFromRailwayStation || "",
        distanceFromBusStand: merged.distanceFromBusStand || "",
        distanceFromHospital: merged.distanceFromHospital || "",
        occupancyPercentage: merged.occupancyPercentage || "",
        habitationPercentage: merged.habitationPercentage || "",
        nallahRiverHighTension: merged.nallahRiverHighTension || "",
        // Section 6 – NDMA
        seismicZone: merged.seismicZone || "",
        cycloneZone: merged.cycloneZone || "",
        landslideProneZone: merged.landslideProneZone || "",
        floodZone: merged.floodZone || "",
        crZone: merged.crZone || "",
        demolitionRisk: merged.localityDemolitionRisk || merged.demolitionRisk || "",
        demolitionRiskDetails: merged.demolitionRiskDetails || "",
        followsNDMAGuidelines: merged.followsNDMAGuidelines || "",
      });
    }
  }, [isEdit, extractedData, form]);

  const handleSubmit = (values) => {
    onNext({ ...values });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">LOCALITY & NDMA DETAILS</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* ── Section 4: Locality ── */}
        <Divider orientation="left" className="md:col-span-2">LOCALITY DETAILS</Divider>

        <Form.Item label="Locality Development" name="localityDevelopment" initialValue="Under Developed">
          <Select allowClear>
            <Select.Option value="Under Developed">Under Developed</Select.Option>
            <Select.Option value="Developed">Developed</Select.Option>
            <Select.Option value="Semi Developed">Semi Developed</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Approach Road Width (In Feet)" name="approachRoadWidth" initialValue="20 ft">
          <Input />
        </Form.Item>

        <Form.Item label="Approach Road Type" name="approachRoadType" initialValue="Mud Road">
          <Select allowClear>
            <Select.Option value="RCC">RCC</Select.Option>
            <Select.Option value="Kutcha">Kutcha</Select.Option>
            <Select.Option value="Pucca">Pucca</Select.Option>
            <Select.Option value="Mud Road">Mud Road</Select.Option>
            <Select.Option value="Tar Road">Tar Road</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Distance from City Centre (in KM)" name="distanceFromCityCentre" initialValue="11 Km">
          <Input />
        </Form.Item>

        <Form.Item label="Distance from Railway Station (in KM)" name="distanceFromRailwayStation" initialValue="9 Km">
          <Input />
        </Form.Item>

        <Form.Item label="Distance from Bus Stand (in KM)" name="distanceFromBusStand" initialValue="10 Km">
          <Input />
        </Form.Item>

        <Form.Item label="Distance from Hospital (in KM)" name="distanceFromHospital" initialValue="9 Km">
          <Input />
        </Form.Item>

        <Form.Item label="Occupancy of Project / Area (%)" name="occupancyPercentage" initialValue="50%">
          <Input />
        </Form.Item>

        <Form.Item label="Habitation in Surrounding Area" name="habitationPercentage" initialValue="Medium">
          <Input />
        </Form.Item>

        <Form.Item
          label="Negative Markers If Any (HT Wire, Nallah, River, Lake, Road Widening)"
          name="nallahRiverHighTension"
          initialValue="NA"
          className="md:col-span-2"
        >
          <Input />
        </Form.Item>

        {/* ── Section 6: NDMA Guidelines ── */}
        <Divider orientation="left" className="md:col-span-2">NDMA GUIDELINES</Divider>

        <Form.Item label="Property Falls under Seismic Zone" name="seismicZone" initialValue="II">
          <Select allowClear>
            <Select.Option value="I">Zone I</Select.Option>
            <Select.Option value="II">Zone II</Select.Option>
            <Select.Option value="III">Zone III</Select.Option>
            <Select.Option value="IV">Zone IV</Select.Option>
            <Select.Option value="V">Zone V</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Falls under Flood Zone" name="floodZone" initialValue="NO">
          <Select allowClear>
            <Select.Option value="YES">YES</Select.Option>
            <Select.Option value="NO">NO</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Falls under Cyclone Zone" name="cycloneZone" initialValue="NO">
          <Select allowClear>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Falls under Landslide Prone Zone" name="landslideProneZone" initialValue="NO">
          <Select allowClear>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Falls in CR Zone" name="crZone" initialValue="NO">
          <Select allowClear>
            <Select.Option value="YES">YES</Select.Option>
            <Select.Option value="NO">NO</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Falls under Demolition Risk" name="demolitionRisk" initialValue="LOW">
          <Select allowClear>
            <Select.Option value="LOW">Low</Select.Option>
            <Select.Option value="MEDIUM">Medium</Select.Option>
            <Select.Option value="HIGH">High</Select.Option>
            <Select.Option value="NO">No</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Demolition Risk Details"
          name="demolitionRiskDetails"
          initialValue="NA"
          className="md:col-span-2"
        >
          <Input />
        </Form.Item>

        <Form.Item label="Property Follows NDMA Guidelines" name="followsNDMAGuidelines" initialValue="YES">
          <Select allowClear>
            <Select.Option value="YES">Yes</Select.Option>
            <Select.Option value="NO">No</Select.Option>
          </Select>
        </Form.Item>

        {/* Actions */}
        <div className="md:col-span-2">
          <Form.Item className="text-right">
            {onBack && (
              <Button type="default" onClick={onBack} className="mr-2 px-4 py-2 bg-gray-500 rounded">
                Back
              </Button>
            )}
            <Button type="primary" htmlType="submit">Next</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default LocalityDetails;
