// AmenitiesForm.jsx
import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox, Radio, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AmenitiesForm = ({ data, editData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    // Unit Amenities
    flooring: "",
    plumbing: "",
    cornerPlot: "",
    paintQuality: "",
    viewsAndFacing: "",
    anyOtherUnit: "",

    // Project Amenities
    amphitheatre: false,
    fireExit: false,
    lift: false,
    cctvCameras: false,
    garden: false,
    pipeGasConnection: false,
    clubHouse: false,
    gymnasium: false,
    playArea: false,
    communityHall: false,
    joggingTrack: false,
    swimmingPool: false,
    ceilingHeight: "",
    anyOtherProject: "",

    // Surrounding Amenities - Public Transport
    airport: false,
    rickshawStop: false,
    busStop: false,
    metroStation: false,
    railwayStation: false,

    // Surrounding Amenities - Other
    college: false,
    hospital: false,
    mall: false,
    placeOfWorship: false,
    school: false,
    superMarket: false,

    // Infra Surroundings
    infraSurroundings: "",

    // Width of Access Road
    widthOfAccessRoad: "",

    // Any Other Surrounding
    anyOtherSurrounding: "",

    // Amenities Images
    amenitiesImage: null,
  });

  useEffect(() => {
    if (editData) {
      setForm((prev) => ({ ...prev, ...editData }));
    }
  }, [editData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    if (onSave) onSave("amenities", form);
  };

  const handleSaveAndNext = () => {
    if (onSaveAndNext) onSaveAndNext("amenities", form);
  };

  return (
    <div className="space-y-5">
      {/* ===== Unit Amenities ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-red-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-red-600 font-semibold text-base">Unit Amenities</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Flooring</label>
                <Input
                  value={form.flooring}
                  onChange={(e) => handleChange("flooring", e.target.value)}
                  placeholder="Flooring"
                  size="large"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Plumbing</label>
                <Input
                  value={form.plumbing}
                  onChange={(e) => handleChange("plumbing", e.target.value)}
                  placeholder="Plumbing"
                  size="large"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Corner Plot</label>
                <Input
                  value={form.cornerPlot}
                  onChange={(e) => handleChange("cornerPlot", e.target.value)}
                  placeholder="Corner Plot"
                  size="large"
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Paint Quality</label>
                <Input
                  value={form.paintQuality}
                  onChange={(e) => handleChange("paintQuality", e.target.value)}
                  placeholder="Paint Quality"
                  size="large"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Views & Facing</label>
                <Input
                  value={form.viewsAndFacing}
                  onChange={(e) => handleChange("viewsAndFacing", e.target.value)}
                  placeholder="Views & Facing"
                  size="large"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Any Other?</label>
                <Input
                  value={form.anyOtherUnit}
                  onChange={(e) => handleChange("anyOtherUnit", e.target.value)}
                  placeholder="Any Other?"
                  size="large"
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Project Amenities ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-red-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-red-600 font-semibold text-base">Project Amenities</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <Checkbox
              checked={form.amphitheatre}
              onChange={() => handleCheckbox("amphitheatre")}
              className="text-gray-700"
            >
              Amphitheatre
            </Checkbox>
            <Checkbox
              checked={form.fireExit}
              onChange={() => handleCheckbox("fireExit")}
              className="text-gray-700"
            >
              Fire Exit
            </Checkbox>
            <Checkbox
              checked={form.lift}
              onChange={() => handleCheckbox("lift")}
              className="text-gray-700"
            >
              Lift
            </Checkbox>
            <Checkbox
              checked={form.cctvCameras}
              onChange={() => handleCheckbox("cctvCameras")}
              className="text-gray-700"
            >
              CCTV Cameras
            </Checkbox>
            <Checkbox
              checked={form.garden}
              onChange={() => handleCheckbox("garden")}
              className="text-gray-700"
            >
              Garden
            </Checkbox>
            <Checkbox
              checked={form.pipeGasConnection}
              onChange={() => handleCheckbox("pipeGasConnection")}
              className="text-gray-700"
            >
              Pipe Gas Connection
            </Checkbox>
            <Checkbox
              checked={form.clubHouse}
              onChange={() => handleCheckbox("clubHouse")}
              className="text-gray-700"
            >
              Club House
            </Checkbox>
            <Checkbox
              checked={form.gymnasium}
              onChange={() => handleCheckbox("gymnasium")}
              className="text-gray-700"
            >
              Gymnasium
            </Checkbox>
            <Checkbox
              checked={form.playArea}
              onChange={() => handleCheckbox("playArea")}
              className="text-gray-700"
            >
              Play Area
            </Checkbox>
            <Checkbox
              checked={form.communityHall}
              onChange={() => handleCheckbox("communityHall")}
              className="text-gray-700"
            >
              Community Hall
            </Checkbox>
            <Checkbox
              checked={form.joggingTrack}
              onChange={() => handleCheckbox("joggingTrack")}
              className="text-gray-700"
            >
              Jogging Track
            </Checkbox>
            <Checkbox
              checked={form.swimmingPool}
              onChange={() => handleCheckbox("swimmingPool")}
              className="text-gray-700"
            >
              Swimming Pool
            </Checkbox>
          </div>

          {/* Ceiling Height */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Ceiling Height (Ft)</label>
              <Input
                value={form.ceilingHeight}
                onChange={(e) => handleChange("ceilingHeight", e.target.value)}
                placeholder="Ceiling Height in ft"
                size="large"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Any Other?</label>
              <Input
                value={form.anyOtherProject}
                onChange={(e) => handleChange("anyOtherProject", e.target.value)}
                placeholder="Loading Platform Available"
                size="large"
                className="border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Surrounding Amenities ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-red-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-red-600 font-semibold text-base">Surrounding Amenities</h4>
        </div>
        <div className="p-4 space-y-4">
          {/* Public Transport */}
          <div>
            <h5 className="text-gray-700 font-semibold text-sm mb-2">
              Public Transport In 1 Km Vicinity
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <Checkbox
                checked={form.airport}
                onChange={() => handleCheckbox("airport")}
                className="text-gray-700"
              >
                Airport
              </Checkbox>
              <Checkbox
                checked={form.rickshawStop}
                onChange={() => handleCheckbox("rickshawStop")}
                className="text-gray-700"
              >
                Rickshaw Stop
              </Checkbox>
              <Checkbox
                checked={form.busStop}
                onChange={() => handleCheckbox("busStop")}
                className="text-gray-700"
              >
                Bus Stop
              </Checkbox>
              <Checkbox
                checked={form.metroStation}
                onChange={() => handleCheckbox("metroStation")}
                className="text-gray-700"
              >
                Metro Station
              </Checkbox>
              <Checkbox
                checked={form.railwayStation}
                onChange={() => handleCheckbox("railwayStation")}
                className="text-gray-700"
              >
                Railway Station
              </Checkbox>
            </div>
          </div>

          {/* Other Amenities */}
          <div className="border-t border-gray-100 pt-4">
            <h5 className="text-gray-700 font-semibold text-sm mb-2">
              Other Amenities In 1 Km Vicinity
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <Checkbox
                checked={form.college}
                onChange={() => handleCheckbox("college")}
                className="text-gray-700"
              >
                College
              </Checkbox>
              <Checkbox
                checked={form.hospital}
                onChange={() => handleCheckbox("hospital")}
                className="text-gray-700"
              >
                Hospital
              </Checkbox>
              <Checkbox
                checked={form.mall}
                onChange={() => handleCheckbox("mall")}
                className="text-gray-700"
              >
                Mall
              </Checkbox>
              <Checkbox
                checked={form.placeOfWorship}
                onChange={() => handleCheckbox("placeOfWorship")}
                className="text-gray-700"
              >
                Place Of Worship
              </Checkbox>
              <Checkbox
                checked={form.school}
                onChange={() => handleCheckbox("school")}
                className="text-gray-700"
              >
                School
              </Checkbox>
              <Checkbox
                checked={form.superMarket}
                onChange={() => handleCheckbox("superMarket")}
                className="text-gray-700"
              >
                Super Market
              </Checkbox>
            </div>
          </div>

          {/* Infra Surroundings */}
          <div className="border-t border-gray-100 pt-4">
            <h5 className="text-gray-700 font-semibold text-sm mb-2">Infra Surroundings</h5>
            <Radio.Group
              value={form.infraSurroundings}
              onChange={(e) => handleChange("infraSurroundings", e.target.value)}
            >
              <div className="grid grid-cols-3 gap-3">
                <Radio value="developed" className="text-gray-700">Developed</Radio>
                <Radio value="developing" className="text-gray-700">Developing</Radio>
                <Radio value="underDeveloped" className="text-gray-700">Under Developed</Radio>
              </div>
            </Radio.Group>
          </div>

          {/* Width Of Access Road */}
          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Width Of Access Road (ft)</label>
                <Input
                  value={form.widthOfAccessRoad}
                  onChange={(e) => handleChange("widthOfAccessRoad", e.target.value)}
                  placeholder="Width in ft"
                  size="large"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Any Other?</label>
                <Input
                  value={form.anyOtherSurrounding}
                  onChange={(e) => handleChange("anyOtherSurrounding", e.target.value)}
                  placeholder="Any Other?"
                  size="large"
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Amenities Images ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-red-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-red-600 font-semibold text-base">Amenities Images</h4>
        </div>
        <div className="p-4">
          <label className="block text-gray-600 text-sm mb-1">
            Drag & Drop/ Upload Photo <span className="text-red-500">*</span>
          </label>
          <Upload
            accept=".jpg,.jpeg,.png"
            maxCount={1}
            beforeUpload={() => false}
            className="w-full"
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
              className="w-full text-left border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              Drag & Drop/ Upload Photo
            </Button>
          </Upload>
          <p className="text-xs text-gray-400 mt-1">
            * Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)
          </p>
        </div>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="primary"
          size="large"
          onClick={handleSaveAndNext}
          loading={saving}
          className="px-8 bg-blue-600 hover:bg-blue-700"
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default AmenitiesForm;