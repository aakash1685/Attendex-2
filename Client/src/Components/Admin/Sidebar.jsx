import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarDays,
  FileText,
  Clock,
} from "lucide-react";

const Sidebar = () => {
  const menu = [
    { name: "Home", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/user", icon: Users },
    { name: "Department", path: "/admin/department", icon: Building2 },
    { name: "Designation", path: "/admin/designation", icon: Briefcase },
    { name: "Calendar", path: "/admin/calendar", icon: CalendarDays },
    { name: "Leaves", path: "/admin/leaves", icon: FileText },
    { name: "Attendance", path: "/admin/attendance", icon: Clock },
  ];

  return (
<div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo / Title */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
          Admin Panel
        </h2>
      </div>

      {/* Menu */}
      <ul className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item, index) => {
          const Icon = item.icon;

          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Footer (Optional clean touch) */}
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
        © 2026 Admin
      </div>

    </div>
  );
};

export default Sidebar;