import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Bell, Clock3, CalendarDays, Building2, UserRound, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeAgo = (date) => {
  if (!date) return "";

  const createdAt = new Date(date).getTime();
  const diff = Math.max(Date.now() - createdAt, 0);

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

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

  const axiosClient = useMemo(() => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  const fetchLeaveNotifications = async () => {
    setNotificationsLoading(true);

    try {
      const response = await axiosClient.get("/api/admin/leave/notifications", {
        params: { limit: 8 },
      });

      const data = response.data?.data || {};
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setPendingCount(Number(data.pendingCount || 0));
    } catch {
      setNotifications([]);
      setPendingCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveNotifications();

    const poller = setInterval(fetchLeaveNotifications, 20000);

    return () => clearInterval(poller);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);

    return () => document.removeEventListener("mousedown", onClickOutside);
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
      case "/admin/leave-notifications":
        return "Leave Notifications";
      case "/admin/attendance":
        return "Attendance Management";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className="fixed top-0 left-72 right-0 z-40 flex h-16 items-center justify-between overflow-visible border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative rounded-lg p-2 transition hover:bg-gray-100"
          >
            <Bell size={18} className="text-gray-600" />
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-sm">
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Leave Notifications</p>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {pendingCount} pending
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Every new leave request appears here instantly.</p>
              </div>

              <div className="max-h-[360px] overflow-y-auto px-3 py-2">
                {notificationsLoading ? (
                  <p className="py-8 text-center text-sm text-slate-500">Loading requests...</p>
                ) : notifications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No pending leave requests right now.</p>
                ) : (
                  notifications.map((leave) => (
                    <button
                      key={leave._id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/admin/leaves");
                      }}
                      className="mb-2 w-full rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{leave.empId?.name || "Employee"}</p>
                        <span className="text-[11px] text-slate-500">{formatTimeAgo(leave.createdAt)}</span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <p className="inline-flex items-center gap-1"><UserRound size={12} /> {leave.empId?.email || "-"}</p>
                        <p className="inline-flex items-center gap-1"><Building2 size={12} /> {leave.deptId?.name || "-"}</p>
                        <p className="inline-flex items-center gap-1"><CalendarDays size={12} /> {formatDate(leave.startDate)} - {formatDate(leave.endDate)}</p>
                        <p className="inline-flex items-center gap-1"><Clock3 size={12} /> {leave.totalDays} day(s) • {leave.leaveType}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/admin/leaves");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View all leave requests <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
            {adminProfile.name.charAt(0)}
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-gray-700">{adminProfile.name}</p>
            <p className="text-gray-400">{adminProfile.email}</p>
          </div>
        </div>

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
