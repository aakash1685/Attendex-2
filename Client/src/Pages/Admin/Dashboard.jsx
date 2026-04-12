import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  Briefcase,
  RefreshCcw,
  UserPlus,
  ListChecks,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/overview`, {
        headers: authHeaders,
      });
      setDashboard(response.data?.data || null);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load dashboard overview.");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        icon: <Users size={18} />,
        title: "Total Users",
        value: dashboard.organization.totalUsers,
        subtitle: `${dashboard.organization.activeUsers} active`,
      },
      {
        icon: <Building2 size={18} />,
        title: "Departments",
        value: dashboard.organization.totalDepartments,
        subtitle: `${dashboard.organization.activeDepartments} active`,
      },
      {
        icon: <Briefcase size={18} />,
        title: "Designations",
        value: dashboard.organization.totalDesignations,
        subtitle: "Role catalog",
      },
      {
        icon: <CalendarCheck size={18} />,
        title: "Today Present Rate",
        value: `${dashboard.attendanceToday.presentRate}%`,
        subtitle: `${dashboard.attendanceToday.PRESENT} present / ${dashboard.organization.totalUsers || 0} users`,
      },
      {
        icon: <ClipboardList size={18} />,
        title: "Pending Leaves",
        value: dashboard.leavesThisMonth.PENDING,
        subtitle: `${dashboard.leavesThisMonth.pendingRate}% of this month requests`,
      },
    ];
  }, [dashboard]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Live SaaS-style overview for organization health and activity.</p>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <RefreshCcw size={16} />
            Refresh data
          </button>
        </div>
      </section>

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading dashboard insights...
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-2 text-blue-600">{card.icon}</div>
                <p className="text-xs text-slate-500">{card.title}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{card.value}</h2>
                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800">Attendance Snapshot (Today)</h3>
              <div className="mt-4 space-y-3">
                <Progress label="Present" value={dashboard.attendanceToday.PRESENT} total={dashboard.organization.totalUsers} />
                <Progress label="Absent" value={dashboard.attendanceToday.ABSENT} total={dashboard.organization.totalUsers} color="bg-rose-500" />
                <Progress label="Half Day" value={dashboard.attendanceToday.HALF_DAY} total={dashboard.organization.totalUsers} color="bg-amber-500" />
                <Progress label="On Leave" value={dashboard.attendanceToday.LEAVE} total={dashboard.organization.totalUsers} color="bg-violet-500" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
              <div className="mt-4 flex flex-col gap-2">
                <ActionBtn icon={<UserPlus size={15} />} label="Add User" onClick={() => navigate("/admin/user")} />
                <ActionBtn icon={<Building2 size={15} />} label="Manage Department" onClick={() => navigate("/admin/department")} />
                <ActionBtn icon={<ListChecks size={15} />} label="Approve Leaves" onClick={() => navigate("/admin/leaves")} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Recent Leave Requests</h3>
              <div className="mt-3 space-y-2 text-sm">
                {dashboard.recentActivity.leaves.length === 0 ? (
                  <p className="text-slate-500">No leave requests yet.</p>
                ) : (
                  dashboard.recentActivity.leaves.map((leave) => (
                    <div key={leave._id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="font-medium text-slate-800">{leave.employeeName} • {leave.leaveType}</p>
                      <p className="text-xs text-slate-500">
                        {leave.leaveStatus} • {leave.totalDays} day(s)
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Recently Added Users</h3>
              <div className="mt-3 space-y-2 text-sm">
                {dashboard.recentActivity.users.length === 0 ? (
                  <p className="text-slate-500">No recent user onboarding yet.</p>
                ) : (
                  dashboard.recentActivity.users.map((user) => (
                    <div key={user._id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const Progress = ({ label, value, total, color = "bg-blue-600" }) => {
  const safeTotal = total > 0 ? total : 1;
  const percentage = Math.min(100, Math.round((value / safeTotal) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const ActionBtn = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-200"
  >
    {icon}
    {label}
  </button>
);

export default Dashboard;
