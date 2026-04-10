import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiGrid, FiHome, FiLogOut, FiUser } from "react-icons/fi";

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
      { name: "Dashboard", path: "/user/dashboard", icon: FiGrid },
      { name: "Home", path: "/user/home", icon: FiHome },
      { name: "Attendance", path: "/user/attendance", icon: FiClock },
      { name: "Leave", path: "/user/leave", icon: FiCalendar },
      { name: "Calendar", path: "/user/calendar", icon: FiCalendar },
    ],
    [],
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-md">
              AX
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-wide text-slate-900">Attendex Portal</h1>
              <p className="text-xs text-slate-500">Smart Employee Workspace</p>
            </div>
          </div>

          <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right md:block lg:hidden xl:block">
            <p className="text-xs text-slate-500">Live Time</p>
            <p className="text-sm font-semibold text-slate-800">{time.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm lg:w-auto lg:justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                  }`
                }
              >
                <Icon className="text-base" /> {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right md:hidden">
            <p className="text-xs text-slate-500">Live Time</p>
            <p className="text-sm font-semibold text-slate-800">{time.toLocaleTimeString()}</p>
          </div>

          <NavLink
            to="/user/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-semibold text-white shadow">
              U
            </span>
            <span className="hidden sm:block">Profile</span>
            <FiUser className="sm:hidden" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;