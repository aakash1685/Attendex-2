import React from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Bell, Search } from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // Dynamic Title
  const getTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "Home";
      case "/admin/user":
        return "User Management";
      case "/admin/department":
        return "Department Management";
      case "/admin/designation":
        return "Designation Management";
      case "/admin/calendar":
        return "Calendar Management";
      case "/admin/leaves":
        return "Leave Management";
      case "/admin/attendance":
        return "Attendance Management";
      default:
        return "Admin Panel";
    }
  };

  return (
<div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between fixed top-0 left-64 right-0 z-20 overflow-hidden">      <div className="flex items-center gap-4">

        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          {getTitle()}
        </h1>

        {/* Optional Search (global feel) */}
        <div className="hidden md:flex items-center relative">
          <Search size={14} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={18} className="text-gray-600" />
        </button>

        {/* Profile */}
        <div className="hidden sm:flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
            A
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-gray-700">Admin</p>
            <p className="text-gray-400">admin@gmail.com</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg 
          text-red-600 bg-red-50 hover:bg-red-100 transition"
        >
          <LogOut size={14} />
          Logout
        </button>

      </div>
    </div>
  );
};

export default AdminNavbar;