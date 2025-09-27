// // src/layouts/ProtectedLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import Header from "../components/Navbar";
// import SideBar from "../layouts/sidebar/SideBar";

// const ProtectedLayout = () => {
//   return (
//     <ProtectedRoute>
//       <Header />
//       <div className='h-screen flex overflow-hidden'>
//         <div className='   md:w-64 h-full bg-gray-100'>
//           <SideBar />
//         </div>
//         <div className='flex-1 overflow-y-auto h-full'>
//           <Outlet /> {/* Nested page render hoga yahan */}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ProtectedLayout;

// ! abhishek code
import { useState } from "react";
// import { ProtectedRoute, Header, SideBar, Outlet } from './your-components';
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Navbar";
import SideBar from "../layouts/sidebar/SideBar";

const ProtectedLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <Header />
      <div className='h-screen flex overflow-hidden'>
        {/* Sidebar - using your existing component */}
        <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main content area */}
        <div
          className={`flex-1 overflow-y-auto h-full transition-all duration-300 ${
            isCollapsed ? "ml-[20px]" : "ml-6"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
