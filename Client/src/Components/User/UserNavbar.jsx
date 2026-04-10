import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const UserNavabr = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/user/dashboard" },
    { name: "Attendance", path: "/user/attendance" },
    { name: "Leave", path: "/user/leave" },
    { name: "Calendar", path: "/user/calendar" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 px-10 py-3 flex justify-between items-center shadow-sm">
      
      {/* Brand */}
      <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Attendex Portal
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-2 bg-gray-100/70 backdrop-blur-md p-1 rounded-xl border border-gray-200">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/60"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <NavLink to="/user/profile">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-all">
            U
          </div>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default UserNavabr;