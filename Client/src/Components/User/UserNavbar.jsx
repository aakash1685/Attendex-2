import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiClock, FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { clearSessionForRole, getScopedToken } from "../../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getInitials = (name = "User") => {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

const UserNavbar = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [userMeta, setUserMeta] = useState(() => ({
    name: localStorage.getItem("userName") || "User",
    profilePic: localStorage.getItem("userProfilePic") || "",
  }));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getScopedToken("user");
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data?.profile;
        if (!profile) return;

        const nextMeta = {
          name: profile.name || "User",
          profilePic: profile.profilePic || "",
        };

        localStorage.setItem("userName", nextMeta.name);
        localStorage.setItem("userProfilePic", nextMeta.profilePic);
        setUserMeta(nextMeta);
      } catch {
        // silently keep cached data
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    clearSessionForRole("user");
    navigate("/");
  };

  const userInitials = useMemo(() => getInitials(userMeta.name), [userMeta.name]);

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
            {userMeta.profilePic ? (
              <img
                src={userMeta.profilePic}
                alt={userMeta.name || "User"}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-semibold text-white shadow">
                {userInitials}
              </span>
            )}
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
