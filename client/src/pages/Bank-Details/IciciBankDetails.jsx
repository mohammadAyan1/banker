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
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIciciBankById } from "../../redux/features/Banks/IciciBank/iciciBankThunk";
import { finalUpdate } from "../../redux/features/case/caseThunks";
import toast from "react-hot-toast";

const IciciBankDetails = () => {
  const [activeTab, setActiveTab] = useState("property_details");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const data = useSelector((state) => state.icici.selectedReport); // Verify path

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

  const handleFinalSubmit = async () => {
    try {
      setSaving(true);
      await dispatch(finalUpdate({ id, bankName: "icici", updateData: data })).unwrap();
      toast.success("Report Finalized ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Finalization failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='p-0 bg-gray-50 min-h-screen'>
      {/* Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2 flex items-center gap-2 print:hidden">
        <div className="flex-1 text-yellow-500 font-bold text-sm ml-4">
          ICICI Bank Valuation
        </div>

        {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
          <button
            onClick={handleFinalSubmit}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Finalizing..." : "🚀 Final Submit"}
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-sm font-medium"
        >
          📄 Download PDF
        </button>
      </div>

      <div className='pt-14 p-4'>
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
    </div>
  </div>
  );
};
export default IciciBankDetails;
