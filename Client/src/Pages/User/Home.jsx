import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiCheckCircle,
  FiClock,
  FiCoffee,
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiArrowRight,
} from "react-icons/fi";
import { getScopedToken } from "../../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const quickActions = [
  "Mark attendance before 10:00 AM",
  "Review leave history and remaining balance",
  "Check this week’s company holidays/events",
];

const Home = () => {
  const firstName = localStorage.getItem("userName")?.split(" ")?.[0] || "Employee";
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      const token = getScopedToken("user");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/auth/dashboard-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSummary(response.data?.data || null);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  const statCards = useMemo(() => {
    const attendance = summary?.attendance || {};
    const leave = summary?.leave || {};
    const averageCheckInMinutes = attendance.averageCheckInMinutes;

    const averageCheckIn = Number.isFinite(averageCheckInMinutes)
      ? `${String(Math.floor(averageCheckInMinutes / 60)).padStart(2, "0")}:${String(averageCheckInMinutes % 60).padStart(2, "0")}`
      : "--:--";

    return [
      {
        title: "Attendance This Month",
        value: `${attendance.PRESENT || 0} / ${attendance.total || 0} days`,
        note: `${attendance.consistency || 0}% consistency`,
        icon: FiCheckCircle,
        iconBg: "bg-emerald-100 text-emerald-600",
      },
      {
        title: "Average Check-in",
        value: averageCheckIn,
        note: Number.isFinite(averageCheckInMinutes) ? "Based on current month check-ins" : "No check-ins found this month",
        icon: FiClock,
        iconBg: "bg-indigo-100 text-indigo-600",
      },
      {
        title: "Approved Leave Days",
        value: `${leave.approvedDaysThisMonth || 0} day(s)`,
        note: "Approved leave days in current month",
        icon: FiCoffee,
        iconBg: "bg-amber-100 text-amber-600",
      },
      {
        title: "Pending Leave Requests",
        value: `${leave.pending || 0} request(s)`,
        note: "Waiting for admin review",
        icon: FiCalendar,
        iconBg: "bg-rose-100 text-rose-600",
      },
    ];
  }, [summary]);

  const highlights = useMemo(() => {
    const attendance = summary?.attendance || {};
    const leave = summary?.leave || {};
    const productivity = summary?.highlights?.productivityScore || 0;

    return [
      {
        title: "Monthly Productivity",
        value: `${productivity}%`,
        description: "Calculated from present and half-day attendance in this month.",
        icon: FiTrendingUp,
      },
      {
        title: "Leave Snapshot",
        value: `${leave.approved || 0} / ${leave.total || 0}`,
        description: "Approved leaves out of your total leave requests.",
        icon: FiTarget,
      },
      {
        title: "Presence Record",
        value: `${attendance.PRESENT || 0} day(s)`,
        description: "Total days marked present in the current month.",
        icon: FiCheckCircle,
      },
    ];
  }, [summary]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg md:p-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">Welcome Back</p>
        <h1 className="text-2xl font-bold md:text-4xl">Hi {firstName}, here’s your Attendex home page</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 md:text-base">
          Track attendance, monitor productivity, and stay updated with your leave activity — all from one clean
          dashboard.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{loading ? "..." : card.value}</h2>
                </div>
                <div className={`rounded-xl p-2 ${card.iconBg}`}>
                  <Icon className="text-lg" />
                </div>
              </div>
              <p className="text-sm text-slate-600">{loading ? "Loading..." : card.note}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">Performance Highlights</h3>
          <p className="mt-1 text-sm text-slate-500">A quick overview of your recent attendance performance.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-600">{item.title}</p>
                    <Icon className="text-slate-500" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-500">Small tasks to keep your day on track.</p>

          <ul className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <li key={action} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <FiArrowRight className="mt-0.5 shrink-0 text-indigo-600" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
