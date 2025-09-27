// import { Home, List, LogOut } from "lucide-react";

// import { useLocation, useNavigate } from "react-router-dom";
// import { App } from "antd";
// import { MdAdminPanelSettings } from "react-icons/md";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutThunk } from "../../redux/features/auth/authThunks";

// const MenuItems = () => {
//   const iconSize = 20;
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   const adminMenu = [
//     {
//       name: "Dashboard",
//       path: "/",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/",
//     },
//     {
//       name: "Banks",
//       path: "/bank-logo",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/bank-logo",
//     },
//     {
//       name: "Invoice All",
//       path: "#",
//       icon: <List size={iconSize} />,
//       isActive: currentPath.includes("#"),
//     },
//     {
//       name: "Manage Employees",
//       path: "/admin/employees",
//       icon: <MdAdminPanelSettings size={iconSize} />,
//       isActive: currentPath.includes("/admin/employees"),
//     },
//     { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
//   ];

//   const fieldOfficerMenu = [
//     {
//       name: "Dashboard",
//       path: "/field/dashboard",
//       icon: <Home size={iconSize} />,
//       isActive: currentPath === "/field/dashboard",
//     },
//     { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
//   ];

//   const onLogout = () => {
//     navigate("/login");
//     dispatch(logoutThunk());
//     toast.success("Logged Out Successfully");
//   };

//   const user = useSelector((state) => state.auth.user);

//   const menus = user?.role === "Admin" ? adminMenu : fieldOfficerMenu;

//   return (
//     <div className='h-full w-full'>
//       {/* User Avatar Section */}
//       <div className='flex items-center gap-3 mb-6'>
//         <div className='h-12 w-12 uppercase bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md'>
//           {user?.name.slice(0, 1)}
//         </div>
//         <div>
//           <h1 className='text-gray-800 font-semibold text-md'>{user?.name}</h1>
//           {/* <p className='text-xs text-gray-500'>Administrator</p> */}
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className='flex flex-col gap-2'>
//         {menus.map((item) => (
//           <div
//             key={item.name}
//             onClick={() => {
//               if (item.name === "Logout") {
//                 onLogout();
//               } else {
//                 navigate(item.path);
//               }
//             }}
//             className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
//               item.isActive
//                 ? "bg-[#C40C0C] text-white shadow-md"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             {item.icon}
//             <span className='text-sm font-medium'>{item.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MenuItems;

// ! Abhishek code

import { Home, List, LogOut } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { App } from "antd";
import { MdAdminPanelSettings } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../redux/features/auth/authThunks";
import { useState } from "react";

const MenuItems = () => {
  // const [selectCity, setselectCity] = useState("")
  const [selectedCity, setSelectedCity] = useState("");

  const cities = ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Dehradun"];

  const iconSize = 20;
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/",
    },
    {
      name: "Banks",
      path: "/bank-logo",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/bank-logo",
    },
    {
      name: "Invoice All",
      path: "#",
      icon: <List size={iconSize} />,
      isActive: currentPath.includes("#"),
    },
    {
      name: "Manage Employees",
      path: "/admin/employees",
      icon: <MdAdminPanelSettings size={iconSize} />,
      isActive: currentPath.includes("/admin/employees"),
    },
    { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
  ];

  const fieldOfficerMenu = [
    {
      name: "Dashboard",
      path: "/field/dashboard",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/field/dashboard",
    },
    { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
  ];

  const onLogout = () => {
    navigate("/login");
    dispatch(logoutThunk());
    toast.success("Logged Out Successfully");
  };

  const user = useSelector((state) => state.auth.user);

  const menus = user?.role === "Admin" ? adminMenu : fieldOfficerMenu;

  return (
    <div className='h-full w-full'>
      {/* User Avatar Section */}
      <div className='flex-col items-center gap-3 mb-6'>
        <div className='flex gap-2 relative left-2  '>
          <div className='h-12 w-12 uppercase bg-gray-400 rounded-full flex items-center justify-center i text-white font-semibold text-lg shadow-md'>
            <p>{user?.name.slice(0, 1)}</p>
          </div>
          <div className='mt-2'>
            <h1 className='text-gray-800 font-semibold relative text-xl'>
              {user?.name}
            </h1>
          </div>
        </div>

        {/* <p className='text-xs text-gray-500'>Administrator</p> */}

        {user.role === "Admin" ? (
          <>
            <div className='w-full max-w-sm mx-auto p-2 '>
              <label
                htmlFor='city'
                className='block text-sm font-medium text-gray-200 mb-1'
              >
                {/* Select City */}
              </label>
              <select
                id='city'
                name='city'
                value={selectedCity}
                onChange={handleChange}
                className='w-52 px-3  p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-100'
              >
                <option value=''>--Select Zone--</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {/* Menu Items */}
      <div className='flex flex-col gap-2'>
        {menus.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              if (item.name === "Logout") {
                onLogout();
              } else {
                navigate(item.path);
              }
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
              item.isActive
                ? "bg-[#C40C0C] text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span className='text-sm font-medium'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItems;
