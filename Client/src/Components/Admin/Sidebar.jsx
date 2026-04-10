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
  Sparkles,
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
    <div className="fixed left-0 top-0 flex h-screen w-72 flex-col overflow-hidden border-r border-slate-800/60 bg-slate-950 text-slate-200">
      <div className="relative border-b border-white/10 px-5 py-5">
        <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-blue-500/20 blur-2xl" />
        <div className="absolute -right-10 -bottom-8 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />

        <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Attendex</p>
        <h2 className="relative mt-1 text-xl font-semibold text-white">Admin Workspace</h2>
        <div className="relative mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-100">
          <Sparkles size={12} />
          Pro SaaS UI
        </div>
      </div>

      <ul className="flex-1 space-y-1 px-3 py-4">
        {menu.map((item, index) => {
          const Icon = item.icon;

          return (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/80 to-cyan-500/80 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-slate-100 transition group-hover:bg-white/20">
                  <Icon size={16} />
                </span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-white/10 px-4 py-4 text-xs text-slate-400">
        <p className="font-medium text-slate-200">Admin Console</p>
        <p className="mt-1">© 2026 Attendex</p>
      </div>
    </div>
  );
};

export default Sidebar;
