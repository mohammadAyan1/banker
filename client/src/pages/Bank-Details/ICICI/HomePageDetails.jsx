

import React, { useState } from "react";
import {
  FaHome,
  FaCommentDots

} from "react-icons/fa";
// import { MdOutlineAttachMoney } from "react-icons/md";

import PropertyDetails from "./ICICIPropertyDeatils";
import Remarks from "./Remark";


const ICICIBannkDetails = () => {
  const [activeTab, setActiveTab] = useState("remarks");

  const tabs = [
    { key: "property_details", label: "Property Details", icon: <FaHome />, component: <PropertyDetails /> },
    { key: "remarks", label: "Remarks", icon: <FaCommentDots />, component: <Remarks /> },

    
  ];

  return (
    <div className="mt-3 p-4">
      <div className="flex overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`flex flex-col items-center justify-center p-2 border rounded-md min-w-[110px] min-h-[90px] cursor-pointer transition-colors ${
              activeTab === tab.key
                ? "bg-red-100 text-red-800 border-red-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="text-3xl">{tab.icon}</div>
            <div className="font-bold text-xs text-center mt-1">{tab.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full">
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </div>
    </div>
  );
};

export default ICICIBannkDetails;
