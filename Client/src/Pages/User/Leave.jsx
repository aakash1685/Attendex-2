import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFilter,
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import LeaveModal from "../../Components/User/Leave/LeaveModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LEAVE_TYPES = ["CL", "SL", "PL", "LOP"];
const STATUS_OPTIONS = ["", "PENDING", "APPROVED", "REJECTED"];

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const toISODate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

const Leave = () => {
  const [form, setForm] = useState({ reason: "", leaveType: "CL", selectedDate: "", leaveDates: [] });
  const [filters, setFilters] = useState({ status: "", fromDate: "", toDate: "", month: "", year: "" });
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [applying, setApplying] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const pendingLeaveDates = useMemo(() => {
    const blocked = new Set();
    leaves.forEach((leave) => {
      if (leave.leaveStatus !== "REJECTED") {
        (leave.leaveDates || []).forEach((d) => {
          const normalized = toISODate(d);
          if (normalized) blocked.add(normalized);
        });
      }
    });
    return blocked;
  }, [leaves]);

  const summary = useMemo(() => {
    return leaves.reduce(
      (acc, leave) => {
        acc.total += 1;
        if (leave.leaveStatus === "PENDING") acc.pending += 1;
        if (leave.leaveStatus === "APPROVED") acc.approved += 1;
        if (leave.leaveStatus === "REJECTED") acc.rejected += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );
  }, [leaves]);

  const validateFilters = () => {
    const { fromDate, toDate, month, year } = filters;

    if ((fromDate || toDate) && (month || year)) {
      return "Use either date range filters OR month/year filters.";
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return "From Date cannot be later than To Date.";
    }

    return "";
  };

  const fetchLeaves = useCallback(async () => {
    const filterError = validateFilters();
    if (filterError) {
      toast.error(filterError);
      return;
    }

    setLoadingLeaves(true);

    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""));
      const response = await axios.get(`${API_BASE_URL}/api/user/leave`, {
        headers: authHeaders,
        params,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to fetch leaves");
      }

      setLeaves(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to fetch leaves");
    } finally {
      setLoadingLeaves(false);
    }
  }, [authHeaders, filters]);

  const addDate = () => {
    if (!form.selectedDate) {
      toast.error("Please select a date first.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(form.selectedDate);
    selected.setHours(0, 0, 0, 0);

    const isoDate = selected.toISOString().split("T")[0];

    if (selected <= today) {
      toast.error("Only future dates are allowed.");
      return;
    }

    if (pendingLeaveDates.has(isoDate)) {
      toast.error("You already have a leave on this date.");
      return;
    }

    if (form.leaveDates.includes(isoDate)) {
      toast.error("Date already selected.");
      return;
    }

    const updated = [...form.leaveDates, isoDate].sort((a, b) => new Date(a) - new Date(b));
    setForm((prev) => ({ ...prev, leaveDates: updated, selectedDate: "" }));
  };

  const validateLeaveForm = () => {
    if (!form.reason.trim()) return "Reason is required.";
    if (form.reason.trim().length < 3) return "Reason must be at least 3 characters.";
    if (!LEAVE_TYPES.includes(form.leaveType)) return "Invalid leave type.";
    if (form.leaveDates.length === 0) return "Select at least one leave date.";
    return "";
  };

  const applyLeave = async (event) => {
    event.preventDefault();

    const validationError = validateLeaveForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setApplying(true);

    try {
      const payload = {
        reason: form.reason.trim(),
        leaveType: form.leaveType,
        leaveDates: form.leaveDates,
      };

      const response = await axios.post(`${API_BASE_URL}/api/user/leave/apply`, payload, {
        headers: authHeaders,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to apply leave");
      }

      toast.success("Leave applied successfully.");
      setForm({ reason: "", leaveType: "CL", selectedDate: "", leaveDates: [] });
      fetchLeaves();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to apply leave.");
    } finally {
      setApplying(false);
    }
  };


  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const cancelLeave = async (leaveId) => {
    setCancelLoadingId(leaveId);

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/user/leave/${leaveId}`, {
        headers: authHeaders,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to cancel leave");
      }

      toast.success("Leave cancelled successfully.");
      fetchLeaves();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to cancel leave.");
    } finally {
      setCancelLoadingId("");
    }
  };

  return (
    <div className="space-y-6 p-1">
      <Toaster position="top-right" />

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-indigo-50 p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Leave Management</h1>
            <p className="text-sm text-slate-600">Apply for leave, track statuses, and manage requests in one place.</p>
          </div>
          <button
            type="button"
            onClick={fetchLeaves}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Total", value: summary.total, icon: FiCalendar }, { label: "Pending", value: summary.pending, icon: FiClock }, { label: "Approved", value: summary.approved, icon: FiCheckCircle }, { label: "Rejected", value: summary.rejected, icon: FiXCircle }].map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <Icon className="text-indigo-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Apply leave</h2>

          <form className="space-y-4" onSubmit={applyLeave}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Leave type</label>
              <select
                value={form.leaveType}
                onChange={(event) => setForm((prev) => ({ ...prev, leaveType: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
              >
                {LEAVE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Reason</label>
              <textarea
                rows={4}
                placeholder="Write a clear reason for your leave request"
                value={form.reason}
                onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Select date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={form.selectedDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, selectedDate: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
                />
                <button
                  type="button"
                  onClick={addDate}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>

            {form.leaveDates.length > 0 && (
              <div className="flex flex-wrap gap-2 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                {form.leaveDates.map((date) => (
                  <button
                    type="button"
                    key={date}
                    onClick={() => setForm((prev) => ({ ...prev, leaveDates: prev.leaveDates.filter((d) => d !== date) }))}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-indigo-700"
                    title="Remove date"
                  >
                    {date} <FiXCircle size={13} />
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={applying}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {applying ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
              {applying ? "Submitting..." : "Apply Leave"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">My leave requests</h2>
            <button
              type="button"
              onClick={fetchLeaves}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <FiFilter /> Apply filters
            </button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All status</option>
              {STATUS_OPTIONS.filter(Boolean).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="1"
              max="12"
              placeholder="Month"
              value={filters.month}
              onChange={(event) => setFilters((prev) => ({ ...prev, month: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="2000"
              placeholder="Year"
              value={filters.year}
              onChange={(event) => setFilters((prev) => ({ ...prev, year: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Dates</th>
                  <th className="px-3 py-2 font-medium">Days</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!loadingLeaves && leaves.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      No leave requests found. Apply a new leave to get started.
                    </td>
                  </tr>
                )}

                {loadingLeaves && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      Loading leaves...
                    </td>
                  </tr>
                )}

                {!loadingLeaves &&
                  leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50/70">
                      <td className="px-3 py-3 font-medium text-slate-800">{leave.leaveType}</td>
                      <td className="px-3 py-3 text-slate-600">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 text-slate-600">{leave.totalDays}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[leave.leaveStatus] || "bg-slate-100 text-slate-700"}`}>
                          {leave.leaveStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedLeave(leave)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            <FiEye /> View
                          </button>

                          {leave.leaveStatus === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => cancelLeave(leave._id)}
                              disabled={cancelLoadingId === leave._id}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-70"
                            >
                              {cancelLoadingId === leave._id ? <FiLoader className="animate-spin" /> : <FiTrash2 />} Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedLeave && <LeaveModal leave={selectedLeave} onClose={() => setSelectedLeave(null)} />}
    </div>
  );
};

export default Leave;
