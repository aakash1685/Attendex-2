import React from "react";
import { FiCalendar, FiFileText, FiTag, FiUserX, FiX } from "react-icons/fi";

const STATUS_BADGE = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

const LeaveModal = ({ leave, onClose }) => {
  if (!leave) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Leave details</h2>
            <p className="text-sm text-slate-500">Application summary and dates.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </header>

        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <FiTag className="text-indigo-500" />
            <span className="font-medium">Type:</span>
            <span>{leave.leaveType}</span>
            <span
              className={`ml-3 rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[leave.leaveStatus] || "bg-slate-100 text-slate-700"}`}
            >
              {leave.leaveStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <p>
              <span className="font-medium text-slate-900">Total Days:</span> {leave.totalDays ?? 0}
            </p>
            <p>
              <span className="font-medium text-slate-900">Start Date:</span> {formatDate(leave.startDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">End Date:</span> {formatDate(leave.endDate)}
            </p>
            <p>
              <span className="font-medium text-slate-900">ID:</span> {leave._id}
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 font-medium text-slate-900">
              <FiFileText className="text-indigo-500" /> Reason
            </div>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-600">{leave.reason}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 font-medium text-slate-900">
              <FiCalendar className="text-indigo-500" /> Leave dates
            </div>
            <div className="flex flex-wrap gap-2">
              {(leave.leaveDates || []).map((date, index) => (
                <span key={`${date}-${index}`} className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700">
                  {formatDate(date)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FiUserX size={16} /> Close
          </button>
        </footer>
      </section>
    </div>
  );
};

export default LeaveModal;
