// import React from "react";
// import { Form, Input, Button, Row, Col, Select } from "antd";

// const LocalityDetails = ({ isEdit, onNext, onBack }) => {
//   const [form] = Form.useForm();

//   React.useEffect(() => {
//     if (isEdit) {
//       form.setFieldsValue(isEdit);
//     }
//   }, [isEdit, form]);

// //   const handleSubmit = (values) => {
// //     onNext(values);
// //   };
//   const handleSubmit = (values) => {
//     const fullData = { ...values };
//     onNext(fullData);
//     // toast.success("Saved Successfully");
//   };

//   return (
//     <div className='max-w-5xl mx-auto p-4 bg-white rounded shadow'>
//       <h2 className='text-2xl font-bold mb-6'>LOCALITY DETAILS</h2>

//       <Form
//         layout='vertical'
//         form={form}
//         onFinish={handleSubmit}
//         className='grid grid-cols-1 md:grid-cols-2 gap-4'
//       >
//         {/* First Column */}
//         <div>
//           <Form.Item 
//             label="Locality Development" 
//             name="localityDevelopment"
//             initialValue="Under Developed"
//           >
//             <Select>
//               <Select.Option value="Under Developed">Under Developed</Select.Option>
//               <Select.Option value="Developed">Developed</Select.Option>
//               <Select.Option value="Semi Developed">Semi Developed</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Type of Approach Road" 
//             name="approachRoadType"
//             initialValue="RCC"
//           >
//             <Select>
//               <Select.Option value="RCC">RCC</Select.Option>
//               <Select.Option value="Kutcha">Kutcha</Select.Option>
//               <Select.Option value="Pucca">Pucca</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Approach Road Width (In Feet)" 
//             name="approachRoadWidth"
//             initialValue="15 FT"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Distance from city centre (in KM)" 
//             name="distanceFromCityCentre"
//             initialValue="9 KM"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Distance from Railway Station (in KM)" 
//             name="distanceFromRailwayStation"
//             initialValue="9 KM"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Distance from Bus Stand (in KM)" 
//             name="distanceFromBusStand"
//             initialValue="4 KM"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Distance from Hospital (in KM)" 
//             name="distanceFromHospital"
//             initialValue="4 KM"
//           >
//             <Input />
//           </Form.Item>
//         </div>

//         {/* Second Column */}
//         <div>
//           <Form.Item 
//             label="Occupancy of Project/Area (%)" 
//             name="occupancyPercentage"
//             initialValue="30%"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Habitation in surrounding Area" 
//             name="habitationPercentage"
//             initialValue="40%"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Proposed Road Widening" 
//             name="proposedRoadWidening"
//             initialValue="No"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Name of City Centre Considered" 
//             name="cityCentreName"
//             initialValue="GWALIOR"
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item 
//             label="Drainage Line connection" 
//             name="drainageConnection"
//             initialValue="Yes"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Water & Electricity Supply Connection" 
//             name="waterElectricityConnection"
//             initialValue="Yes"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Nallah, River, High tension line if any" 
//             name="nallahRiverHighTension"
//             initialValue="NA"
//           >
//             <Input />
//           </Form.Item>
//         </div>

//         {/* Form Actions */}
//         <div className="md:col-span-2">
//           <Form.Item className='text-right'>
//             {onBack && (
//               <Button
//                 type='default'
//                 onClick={onBack}
//                 className='mr-2 px-4 py-2 bg-gray-500 rounded'
//               >
//                 Back
//               </Button>
//             )}
//             <Button type='primary' htmlType='submit'>
//               Next
//             </Button>
//           </Form.Item>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default ;


import React from "react";
import { Form, Input, Button, Select, Divider } from "antd";

const LocalityDetails = ({ isEdit, onNext, onBack }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(isEdit);
    }
  }, [isEdit, form]);

  const handleSubmit = (values) => {
    const fullData = { ...values };
    onNext(fullData);
  };

  return (
    <div className='max-w-5xl mx-auto p-4 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>LOCALITY AND NDMA DETAILS</h2>

      <Form
        layout='vertical'
        form={form}
        onFinish={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
      >
        {/* Locality Details Section */}
        <Divider orientation="left" className="md:col-span-2">LOCALITY DETAILS</Divider>
        
        {/* First Column - Locality */}
        <div>
          <Form.Item 
            label="Locality Development" 
            name="localityDevelopment"
            initialValue="Under Developed"
          >
            <Select>
              <Select.Option value="Under Developed">Under Developed</Select.Option>
              <Select.Option value="Developed">Developed</Select.Option>
              <Select.Option value="Semi Developed">Semi Developed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Type of Approach Road" 
            name="approachRoadType"
            initialValue="RCC"
          >
            <Select>
              <Select.Option value="RCC">RCC</Select.Option>
              <Select.Option value="Kutcha">Kutcha</Select.Option>
              <Select.Option value="Pucca">Pucca</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Approach Road Width (In Feet)" 
            name="approachRoadWidth"
            initialValue="15 FT"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Distance from city centre (in KM)" 
            name="distanceFromCityCentre"
            initialValue="9 KM"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Distance from Railway Station (in KM)" 
            name="distanceFromRailwayStation"
            initialValue="9 KM"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Distance from Bus Stand (in KM)" 
            name="distanceFromBusStand"
            initialValue="4 KM"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Distance from Hospital (in KM)" 
            name="distanceFromHospital"
            initialValue="4 KM"
          >
            <Input />
          </Form.Item>
        </div>

        {/* Second Column - Locality */}
        <div>
          <Form.Item 
            label="Occupancy of Project/Area (%)" 
            name="occupancyPercentage"
            initialValue="30%"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Habitation in surrounding Area" 
            name="habitationPercentage"
            initialValue="40%"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Proposed Road Widening" 
            name="proposedRoadWidening"
            initialValue="No"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Name of City Centre Considered" 
            name="cityCentreName"
            initialValue="GWALIOR"
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Drainage Line connection" 
            name="drainageConnection"
            initialValue="Yes"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Water & Electricity Supply Connection" 
            name="waterElectricityConnection"
            initialValue="Yes"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Nallah, River, High tension line if any" 
            name="nallahRiverHighTension"
            initialValue="NA"
          >
            <Input />
          </Form.Item>
        </div>

        {/* NDMA Guidelines Section */}
        <Divider orientation="left" className="md:col-span-2">NDMA GUIDELINES</Divider>
        
        {/* First Column - NDMA */}
        <div>
          <Form.Item 
            label="Property Falls under Seismic Zone" 
            name="seismicZone"
            initialValue="III"
          >
            <Select>
              <Select.Option value="I">Zone I</Select.Option>
              <Select.Option value="II">Zone II</Select.Option>
              <Select.Option value="III">Zone III</Select.Option>
              <Select.Option value="IV">Zone IV</Select.Option>
              <Select.Option value="V">Zone V</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Property Falls under Cyclone Zone" 
            name="cycloneZone"
            initialValue="No"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Property falls under Landslide Prone Zone" 
            name="landslideProneZone"
            initialValue="No"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Degree of Risk Associated" 
            name="degreeOfRisk"
            initialValue="Medium"
          >
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Second Column - NDMA */}
        <div>
          <Form.Item 
            label="Property Falls under Flood Zone" 
            name="floodZone"
            initialValue="NO"
          >
            <Select>
              <Select.Option value="YES">YES</Select.Option>
              <Select.Option value="NO">NO</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Property Falls in CR Zone" 
            name="crZone"
            initialValue="NO"
          >
            <Select>
              <Select.Option value="YES">YES</Select.Option>
              <Select.Option value="NO">NO</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Follows NDMA Guidelines" 
            name="followsNDMAGuidelines"
            initialValue="Yes"
          >
            <Select>
              <Select.Option value="Yes">Yes</Select.Option>
              <Select.Option value="No">No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Any Demolition Risk with Details Propety falls in" 
            name="demolitionRisk"
            initialValue="None"
          >
            <Select>
              <Select.Option value="None">None</Select.Option>
              <Select.Option value="Demolition List">Demolition List</Select.Option>
              <Select.Option value="Forest Land">Forest Land</Select.Option>
              <Select.Option value="Govt Land">Govt Land</Select.Option>
              <Select.Option value="Govt Notification">Govt Notification</Select.Option>
              <Select.Option value="Road Widening">Road Widening</Select.Option>
              <Select.Option value="NII">NII</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2">
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
        </div>
      </Form>
    </div>
  );
};

export default LocalityDetails;