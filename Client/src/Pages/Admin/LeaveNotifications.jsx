import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { BellRing, CalendarDays, Clock3, Building2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const LeaveNotifications = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosClient = useMemo(() => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  const fetchPendingLeaves = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosClient.get("/api/admin/leave", {
        params: { leaveStatus: "PENDING" },
      });

      setPendingLeaves(Array.isArray(response.data?.leaves) ? response.data.leaves : []);
    } catch (error) {
      if (error?.response?.status === 404) {
        setPendingLeaves([]);
      } else {
        toast.error(error?.response?.data?.message || "Unable to fetch leave notifications.");
      }
    } finally {
      setLoading(false);
    }
  }, [axiosClient]);

  useEffect(() => {
    fetchPendingLeaves();

    const poller = setInterval(fetchPendingLeaves, 20000);

    return () => clearInterval(poller);
  }, [fetchPendingLeaves]);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Leave Request Notifications</h1>
              <p className="mt-1 text-sm text-slate-500">All employee leave requests requiring admin action.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <BellRing size={14} />
              {pendingLeaves.length} Pending
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Loading pending leave requests...</div>
        ) : pendingLeaves.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center text-emerald-700">
            Great! There are no pending leave requests at the moment.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pendingLeaves.map((leave) => (
              <div key={leave._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{leave.empId?.name || "Employee"}</p>
                    <p className="text-xs text-slate-500">{leave.empId?.email || "-"}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{leave.leaveType}</span>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="inline-flex items-center gap-2"><Building2 size={13} /> {leave.deptId?.name || "No department"}</p>
                  <p className="inline-flex items-center gap-2"><CalendarDays size={13} /> {formatDate(leave.startDate)} - {formatDate(leave.endDate)}</p>
                  <p className="inline-flex items-center gap-2"><Clock3 size={13} /> {leave.totalDays} day(s)</p>
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{leave.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveNotifications;
