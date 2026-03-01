



// import React, { useEffect } from "react";
// import { Form, Input, Button, Select, Row, Col } from "antd";


// const { Option } = Select;

// const PropertyDetails = ({ isEdit, onNext, onBack, extractedData }) => {
//   const [form] = Form.useForm();

//   const initialValues = {
//     directions: {
//       North: { document: "", actual: "", plan: "" },
//       South: { document: "", actual: "", plan: "" },
//       East: { document: "", actual: "", plan: "" },
//       West: { document: "", actual: "", plan: "" },
//     },
//     boundariesMatching: "",
//     plotArea: "",
//     isPropertyWithinLimit: "",
//     marketability: "",
//     typeOfStructure: "N/A",
//     qualityOfConstruction: "",
//     IfNoDetailRemak: "",
//     propertyIsDemarcated: "",
//     propertyEasilyIdentifiable: "",
//     Dimension: "",
//     ifQualityPoor: "",
//     unitFlatConfiguration: "",
//     noOfFloorsPermissible: "",
//     noOfUnitFlatOnEachFloor: "",
//     internalComposition: "",
//     noOfFloorsActual: "",
//     approxAgeOfProperty: "",
//     constructionAsPerPlan: "",
//     residualAge: "",
//     constructionStatus: "",
//     liftAvailable: "",
//     buildingHeight: "",
//     constructionStage: "",
//     openPlot: "",
//   };

//   // useEffect(() => {
//   //   if (isEdit) {
//   //     form.setFieldsValue({
//   //       directions: {
//   //         North: isEdit?.directions?.North || {},
//   //         South: isEdit?.directions?.South || {},
//   //         East: isEdit?.directions?.East || {},
//   //         West: isEdit?.directions?.West || {},
//   //       },
//   //       boundariesMatching: isEdit.boundariesMatching || "",
//   //       plotArea: isEdit.plotArea || "",
//   //       isPropertyWithinLimit: isEdit.isPropertyWithinLimit || "",
//   //       marketability: isEdit.marketability || "",
//   //       typeOfStructure: isEdit.typeOfStructure || "N/A",
//   //       qualityOfConstruction: isEdit.qualityOfConstruction || "AVG",
//   //       ifQualityPoor: isEdit.ifQualityPoor || "N/A",
//   //       unitFlatConfiguration: isEdit.unitFlatConfiguration || "",
//   //       noOfFloorsPermissible: isEdit.noOfFloorsPermissible || "N/A",
//   //       noOfUnitFlatOnEachFloor: isEdit.noOfUnitFlatOnEachFloor || "N/A",
//   //       internalComposition: isEdit.internalComposition || "N/A",
//   //       noOfFloorsActual: isEdit.noOfFloorsActual || "N/A",
//   //       approxAgeOfProperty: isEdit.approxAgeOfProperty || "0",
//   //       constructionAsPerPlan: isEdit.constructionAsPerPlan || "no", //!select
//   //       residualAge: isEdit.residualAge || "50",
//   //       constructionStatus: isEdit.constructionStatus || "0%",
//   //       liftAvailable: isEdit.liftAvailable || "NO", //SELECT
//   //       buildingHeight: isEdit.buildingHeight || "0",
//   //       constructionStage: isEdit.constructionStage || "OPEN PLOT", // MORE SELECT OPTIONS
//   //       openPlot: isEdit.openPlot || "N/A",
//   //        IfNoDetailRemak: isEdit.IfNoDetailRemak || "",
//   //       propertyIsDemarcated: isEdit.propertyIsDemarcated || "",
//   //       propertyEasilyIdentifiable: isEdit.propertyEasilyIdentifiable || "",
//   //       Dimension: isEdit.Dimension || "",
//   //     });
//   //   }
//   // }, [isEdit, form]);

//   useEffect(() => {
//     const merged = { ...extractedData, ...isEdit };
//     if (merged) {
//       form.setFieldsValue({
//         directions: {
//           North: {
//             document: merged.northDocument || "",
//             actual: merged.northActual || "",
//             plan: merged.northPlan || "",
//           },
//           South: {
//             document: merged.southDocument || "",
//             actual: merged.southActual || "",
//             plan: merged.southPlan || "",
//           },
//           East: {
//             document: merged.eastDocument || "",
//             actual: merged.eastActual || "",
//             plan: merged.eastPlan || "",
//           },
//           West: {
//             document: merged.westDocument || "",
//             actual: merged.westActual || "",
//             plan: merged.westPlan || "",
//           },
//         },
//         boundariesMatching: merged.boundariesMatching || "",
//         plotArea: merged.plotArea || "",
//         isPropertyWithinLimit: merged.isPropertyWithinLimit || "",
//         marketability: merged.marketability || "",
//         typeOfStructure: merged.typeOfStructure || "",
//         qualityOfConstruction: merged.qualityOfConstruction || "",
//         ifQualityPoor: merged.ifQualityPoor || "",
//         unitFlatConfiguration: merged.unitFlatConfiguration || "",
//         noOfFloorsPermissible: merged.noOfFloorsPermissible || "",
//         noOfUnitFlatOnEachFloor: merged.noOfUnitFlatOnEachFloor || "",
//         internalComposition: merged.internalComposition || "",
//         noOfFloorsActual: merged.noOfFloorsActual || "",
//         approxAgeOfProperty: merged.approxAgeOfProperty || "",
//         constructionAsPerPlan: merged.constructionAsPerPlan || "",
//         residualAge: merged.residualAge || "",
//         constructionStatus: merged.constructionStatus || "",
//         liftAvailable: merged.liftAvailable || "",
//         buildingHeight: merged.buildingHeight || "",
//         constructionStage: merged.constructionStage || "",
//         IfNoDetailRemak: merged.IfNoDetailRemak || "",
//         propertyIsDemarcated: merged.propertyIsDemarcated || "",
//         propertyEasilyIdentifiable: merged.propertyEasilyIdentifiable || "",
//         Dimension: merged.Dimension || "",
//       });
//     }
//   }, [isEdit, extractedData, form]);

//   const handleFinish = (values) => {
//     onNext(values);
//   };

//   const handleFieldChange = (e) => {
//     const { name, value, type } = e.target;
//     const parsedValue = type === "number" ? parseFloat(value) || 0 : value;
//     form.setFieldsValue({ [name]: parsedValue });
//   };

//   return (
//     <div className='max-w-5xl mx-auto p-6 bg-white rounded shadow'>
//       <h2 className='text-2xl font-bold mb-6'>Property Details</h2>

//       <Form
//         layout='vertical'
//         form={form}
//         initialValues={initialValues}
//         onFinish={handleFinish}
//         className='grid grid-cols-1 lg:grid-cols-2 gap-4'
//       >
//         {/* Directions Section */}
//         {["North", "South", "East", "West"].map((dir) => (
//           <div key={dir} className='lg:col-span-2 rounded-md bg-gray-50'>
//             <h3 className='text-lg font-semibold mb-3 text-blue-800'>{dir}</h3>
//             <Row gutter={16}>
//               <Col xs={24} md={8}>
//                 <Form.Item
//                   label='As per Document/ATS'
//                   name={["directions", dir, "document"]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={8}>
//                 <Form.Item
//                   label='Actual at site'
//                   name={["directions", dir, "actual"]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={8}>
//                 <Form.Item
//                   label='As per plan'
//                   name={["directions", dir, "plan"]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </div>
//         ))}


//         <Form.Item label='Boundaries Matching' name='boundariesMatching'>
//           <Select onChange={handleFieldChange}>
//             <Option value='Yes'>Yes</Option>
//             <Option value='No'>No</Option>
//             <Option value='NA'>NA</Option>
//           </Select>
//         </Form.Item>

//         {/* Plot Area */}
//         <Form.Item label='Plot Area (Sq. ft)' name='plotArea'>
//           <Input type='number' onChange={handleFieldChange} />
//         </Form.Item>

//         {/* Property Location */}
//         <Form.Item
//           label='Is the property within which limit'
//           name='isPropertyWithinLimit'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         {/* Marketability */}
//         <Form.Item label='Marketability' name='marketability'>
//           <Select onChange={handleFieldChange}>
//             <Option value='Yes'>Good</Option>
//             <Option value='No'>Average</Option>
//             <Option value='NA'>Poor</Option>
//           </Select>
//         </Form.Item>



//         {/*  */}

//         <Form.Item
//           label='If No - Detail Remak'
//           name='IfNoDetailRemak'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Property is Demarcated'
//           name='propertyIsDemarcated'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Property Easily Identifiable'
//           name='propertyEasilyIdentifiable'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>



//         <Form.Item
//           label='Dimension:'
//           name='Dimension'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>








//         <h2 className='text-2xl font-bold mb-6'>Structural Details</h2> <br />

//         {/* Structure Info */}
//         <Form.Item label='Type of Structure' name='typeOfStructure'>
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item label='Quality of Construction' name='qualityOfConstruction'>
//           <Select onChange={handleFieldChange}>
//             <Option value='Good'>Good</Option>
//             <Option value='Average'>Average</Option>
//             <Option value='Poor'>Poor</Option>
//             <Option value='NA'>NA</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label='If quality of construction is poor'
//           name='ifQualityPoor'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Unit / Flat Configuration'
//           name='unitFlatConfiguration'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='No. of Floors Permissible'
//           name='noOfFloorsPermissible'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='No. of Unit / Flat on Each Floor'
//           name='noOfUnitFlatOnEachFloor'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Internal composition of the property'
//           name='internalComposition'
//         >
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item label='No. of Floors Actual' name='noOfFloorsActual'>
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Approx. Age of Property (Years)'
//           name='approxAgeOfProperty'
//         >
//           <Input type='number' onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item
//           label='Whether construction is as per plan /permission/ building'
//           name='constructionAsPerPlan'
//         >
//           <Select onChange={handleFieldChange}>
//             <Option value='Yes'>Yes</Option>
//             <Option value='No'>No</Option>
//             <Option value='NA'>NA</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label='Residual Age (Years)' name='residualAge'>
//           <Input type='number' onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item label='Currnet Construction Status' name='constructionStatus'>
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item label='Whether Lift Available' name='liftAvailable'>
//           <Select onChange={handleFieldChange}>
//             <Option value='Yes'>Yes</Option>
//             <Option value='No'>No</Option>
//             <Option value='NA'>NA</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label='Height of the building (Approx in Meters)'
//           name='buildingHeight'
//         >
//           <Input type='number' onChange={handleFieldChange} />
//         </Form.Item>

//         <Form.Item label='Construction Stage' name='constructionStage'>
//           <Input onChange={handleFieldChange} />
//         </Form.Item>

//         {/* <Form.Item label='Open Plot' name='openPlot'>
//           <Input onChange={handleFieldChange} />
//         </Form.Item> */}

//         {/* Buttons */}
//         <Form.Item className='lg:col-span-2 text-end'>
//           {onBack && (
//             <Button
//               type='default'
//               onClick={onBack}
//               className='mr-2 px-4 py-2 bg-gray-500 text-white rounded'
//             >
//               Back
//             </Button>
//           )}
//           <Button type='primary' htmlType='submit'>
//             Next
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default PropertyDetails;

import React, { useEffect } from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";

const { Option } = Select;

const PropertyDetails = ({ isEdit, onNext, onBack, extractedData }) => {
  const [form] = Form.useForm();

  const initialValues = {
    directions: {
      North: { document: "", actual: "", plan: "" },
      South: { document: "", actual: "", plan: "" },
      East: { document: "", actual: "", plan: "" },
      West: { document: "", actual: "", plan: "" },
    },
    boundariesMatching: "",
    propertyDemarcated: "",
    boundaryRemarks: "",
    plotArea: "",
    linearDimension: "",
    marketability: "",
    // Structural
    typeOfStructure: "",
    typeOfRoof: "",
    noOfFloorsPermissible: "",
    noOfFloorsActual: "",
    noOfUnitFlatOnEachFloor: "",
    qualityOfConstruction: "",
    approxAgeOfProperty: "",
    residualAge: "",
    landArea: "",
  };

  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged) {
      form.setFieldsValue({
        directions: {
          North: {
            document: merged?.directions?.North?.document || merged.northDocument || "",
            actual: merged?.directions?.North?.actual || merged.northActual || "",
            plan: merged?.directions?.North?.plan || merged.northPlan || "",
          },
          South: {
            document: merged?.directions?.South?.document || merged.southDocument || "",
            actual: merged?.directions?.South?.actual || merged.southActual || "",
            plan: merged?.directions?.South?.plan || merged.southPlan || "",
          },
          East: {
            document: merged?.directions?.East?.document || merged.eastDocument || "",
            actual: merged?.directions?.East?.actual || merged.eastActual || "",
            plan: merged?.directions?.East?.plan || merged.eastPlan || "",
          },
          West: {
            document: merged?.directions?.West?.document || merged.westDocument || "",
            actual: merged?.directions?.West?.actual || merged.westActual || "",
            plan: merged?.directions?.West?.plan || merged.westPlan || "",
          },
        },
        boundariesMatching: merged.boundariesMatching || "",
        propertyDemarcated: merged.propertyDemarcated || "",
        boundaryRemarks: merged.boundaryRemarks || "",
        plotArea: merged.plotArea || "",
        linearDimension: merged.linearDimension || "",
        marketability: merged.marketability || "",
        typeOfStructure: merged.typeOfStructure || "",
        typeOfRoof: merged.typeOfRoof || "",
        noOfFloorsPermissible: merged.noOfFloorsPermissible || "",
        noOfFloorsActual: merged.noOfFloorsActual || "",
        noOfUnitFlatOnEachFloor: merged.noOfUnitFlatOnEachFloor || "",
        qualityOfConstruction: merged.qualityOfConstruction || "",
        approxAgeOfProperty: merged.approxAgeOfProperty || "",
        residualAge: merged.residualAge || "",
        landArea: merged.landArea || "",
      });
    }
  }, [isEdit, extractedData, form]);

  const handleFinish = (values) => {
    onNext(values);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Boundaries, Dimensions & Structural Details</h2>

      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* ── Section 7: Boundaries ── */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">
            7. Boundaries and Dimensions
          </h3>
        </div>

        {["North", "South", "East", "West"].map((dir) => (
          <div key={dir} className="lg:col-span-2 rounded-md bg-gray-50 p-3">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">{dir}</h3>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="As per Document / ATS" name={["directions", dir, "document"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="As per Site" name={["directions", dir, "actual"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="As per Plan" name={["directions", dir, "plan"]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ))}

        <Form.Item label="Boundaries Matching?" name="boundariesMatching">
          <Select allowClear>
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
            <Option value="NA">NA</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Property Demarcated?" name="propertyDemarcated">
          <Select allowClear>
            <Option value="YES">Yes</Option>
            <Option value="NO">No</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Boundary Remarks in Detail" name="boundaryRemarks" className="lg:col-span-2">
          <Input />
        </Form.Item>

        <Form.Item label="Marketability (Good / Average / Poor)" name="marketability">
          <Select allowClear>
            <Option value="Good">Good</Option>
            <Option value="Average">Average</Option>
            <Option value="Poor">Poor</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Land Area (Sq. ft)" name="landArea">
          <Input />
        </Form.Item>

        <Form.Item label="Linear Dimension" name="linearDimension">
          <Input placeholder="e.g. 30*66" />
        </Form.Item>

        <Form.Item label="Plot Area (Sq. ft)" name="plotArea">
          <Input type="number" />
        </Form.Item>

        {/* ── Section 8: Structural Details ── */}
        <div className="lg:col-span-2 mt-4">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">
            8. Structural Details
          </h3>
        </div>

        <Form.Item label="Type of Structure (RCC / Load Bearing / Open Plot)" name="typeOfStructure">
          <Select allowClear>
            <Option value="RCC">RCC</Option>
            <Option value="Load Bearing">Load Bearing</Option>
            <Option value="Open Plot">Open Plot</Option>
            <Option value="RCC + Load Bearing">RCC + Load Bearing</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Type of Roof (ACC Sheet / Stone Patti / Tin Sheet / Terracotta Tiles / Thatch)"
          name="typeOfRoof"
        >
          <Select allowClear>
            <Option value="ACC Sheet">ACC Sheet</Option>
            <Option value="Stone Patti">Stone Patti</Option>
            <Option value="Tin Sheet">Tin Sheet</Option>
            <Option value="Terracotta Tiles">Terracotta Tiles</Option>
            <Option value="Thatch Roof">Thatch Roof</Option>
            <Option value="RCC Slab">RCC Slab</Option>
            <Option value="G.F PROPOSED">G.F Proposed</Option>
          </Select>
        </Form.Item>

        <Form.Item label="No. of Floors Permissible" name="noOfFloorsPermissible">
          <Input />
        </Form.Item>

        <Form.Item label="No. of Floors – Actual" name="noOfFloorsActual">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="No. of Units / Flats on Each Floor" name="noOfUnitFlatOnEachFloor">
          <Input />
        </Form.Item>

        <Form.Item label="Quality of Construction (Good / Avg. / Poor)" name="qualityOfConstruction">
          <Select allowClear>
            <Option value="Good">Good</Option>
            <Option value="Average">Average</Option>
            <Option value="Poor">Poor</Option>
            <Option value="NA">NA</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Age of Property (Years)" name="approxAgeOfProperty">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Residual Age (Years)" name="residualAge">
          <Input type="number" />
        </Form.Item>

        {/* Actions */}
        <Form.Item className="lg:col-span-2 text-end">
          {onBack && (
            <Button
              type="default"
              onClick={onBack}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back
            </Button>
          )}
          <Button type="primary" htmlType="submit">Next</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PropertyDetails;
