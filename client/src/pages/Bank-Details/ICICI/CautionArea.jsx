import React, { useEffect, useState } from "react";
import axios from "axios";



const CautionArea = () => {
  const [formData, setFormData] = useState({});

  // const datas = useSelector((state) => state.formData);
  // const dispatch = useDispatch();

// const data = 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // fetchData();
  }, []);

  const defaultData = {
    chemicalHazard: true,
    nearCrematorium: true,
    roadExtension: false,
    statutoryNotices: true,
    communityDominated: false,
    garbageDump: true,
    accessIssues: false,
    highTensionLine: true,
    floodProne: true,
    nearNalla: false,
    landLocked: true,
    landReservation: false,
    railTrack: true,
    slumArea: true,
  };

  const finalData = { ...defaultData, ...formData };

  const fieldLabels = {
    chemicalHazard: "Any Chemical Hazard",
    nearCrematorium: "Near Crematorium",
    roadExtension: "Probable Road Extension",
    statutoryNotices: "Statutory Notices On Property",
    communityDominated: "Community Dominated",
    garbageDump: "Near Garbage Dump",
    accessIssues: "Property Access Issues",
    highTensionLine: "Under High Tension Line",
    floodProne: "Flood Prone",
    nearNalla: "Near Nalla",
    landLocked: "Property Is Land Locked",
    landReservation: "Land Reservation",
    railTrack: "Near To Rail Track",
    slumArea: "Slum Area",
  };

  const activeFields = Object.keys(finalData).filter((key) => finalData[key]);

  return (
    <div className='mb-4 w-full border border-gray-300 p-6 rounded-lg bg-gray-50'>
      <h4 className='text-xl font-semibold text-red-700 mb-4'>Caution Area</h4>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {activeFields?.map((key, index) => (
          <div key={index}>
            <p className='text-gray-700'>{fieldLabels[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CautionArea;
