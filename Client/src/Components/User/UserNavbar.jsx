import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiHome, FiLogOut, FiUser } from "react-icons/fi";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItems = useMemo(
    () => [
      { name: "Home", path: "/user/home", icon: FiHome },
      { name: "Attendance", path: "/user/attendance", icon: FiClock },
      { name: "Leave", path: "/user/leave", icon: FiCalendar },
      { name: "Calendar", path: "/user/calendar", icon: FiCalendar },
    ],
    [],
  );

  return (
    <nav className="w-full bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-10 py-3 flex justify-between items-center backdrop-blur-md">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl shadow-md"></div>
        <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
          Attendex Portal
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
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
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow cursor-pointer hover:scale-105 transition">
            U
          </div>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
