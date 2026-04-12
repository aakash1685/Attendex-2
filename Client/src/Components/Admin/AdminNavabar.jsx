import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();

  const adminProfile = useMemo(() => {
    const fallbackProfile = {
      name: "Admin",
      email: "admin@attendex.com",
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) return fallbackProfile;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const adminEmail = payload?.email || fallbackProfile.email;
      const adminName = adminEmail.split("@")[0] || fallbackProfile.name;

      return {
        name: adminName.charAt(0).toUpperCase() + adminName.slice(1),
        email: adminEmail,
      };
    } catch {
      return fallbackProfile;
    }
  }, []);

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
      case "/admin/leaves":
        return "Leave Management";
      case "/admin/attendance":
        return "Attendance Management";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className="fixed top-0 left-72 right-0 z-20 flex h-16 items-center justify-between overflow-hidden border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">

        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          {getTitle()}
        </h1>
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
            {adminProfile.name.charAt(0)}
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-gray-700">{adminProfile.name}</p>
            <p className="text-gray-400">{adminProfile.email}</p>
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
