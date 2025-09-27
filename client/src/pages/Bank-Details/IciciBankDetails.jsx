import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaWrench,
  FaExclamationTriangle,
  FaBuilding,
  FaChartBar,
  FaRuler,
  FaCamera,
  FaCommentDots,
} from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import PropertyDetails from "./ICICI/ICICIPropertyDeatils";
import Amenities from "./ICICI/Amenities";
import CautionArea from "./ICICI/CautionArea";
import PropertyValuation from "./ICICI/ICICIPropertyVialtion";
import ConstructionProgress from "./ICICI/ConstructionProgress";
import DistanceRangeProperty from "./ICICI/DistanceRangeProperty";
import Remarks from "./ICICI/Remark";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getIciciBankById } from "../../redux/features/Banks/IciciBank/iciciBankThunk";

const IciciBankDetails = () => {
  const [activeTab, setActiveTab] = useState("property_details");

  const tabs = [
    {
      key: "property_details",
      label: "Property Details",
      icon: <FaHome />,
      component: <PropertyDetails />,
    },
    {
      key: "amenities",
      label: "Amenities",
      icon: <FaBuilding />,
      component: <Amenities />,
    },
    {
      key: "caution_area",
      label: "Caution Area",
      icon: <FaExclamationTriangle />,
      component: <CautionArea />,
    },
    {
      key: "fair_market",
      label: "Fair Market Valuation",
      icon: <MdOutlineAttachMoney />,
      component: <PropertyValuation />,
    },
    {
      key: "progress_details",
      label: "Construction Progress",
      icon: <FaChartBar />,
      component: <ConstructionProgress />,
    },
    {
      key: "distance_range",
      label: "Distance Range of The Project",
      icon: <FaRuler />,
      component: <DistanceRangeProperty />,
    },
    // {
    //   key: "site_photos",
    //   label: "Site Photographs",
    //   icon: <FaCamera />,
    //   component: <SitePhotographs />,
    // },
    {
      key: "remarks",
      label: "Remarks",
      icon: <FaCommentDots />,
      component: <Remarks />,
    },
  ];

  const { id } = useParams();
  const dispatch = useDispatch();

  const init = async (id) => {
    try {
      await dispatch(getIciciBankById(id));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id]);

  return (
    <div className='mt-3 p-4'>
      <div className='flex overflow-x-auto gap-2'>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`flex flex-col items-center justify-center p-2 border rounded-md min-w-[140px] min-h-[120px] cursor-pointer transition-colors ${
              activeTab === tab.key
                ? "bg-red-100 text-red-800 border-red-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className='text-3xl'>{tab.icon}</div>
            <div className='font-bold text-xs text-center mt-1'>
              {tab.label}
            </div>
          </div>
        ))}
      </div>
      <div className='mt-6 w-full'>
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </div>
      x
    </div>
  );
};
export default IciciBankDetails;
