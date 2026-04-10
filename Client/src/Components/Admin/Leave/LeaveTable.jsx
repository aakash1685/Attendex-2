import React from "react";
import LeaveActions from "./LeaveActions";

const statusBadgeClasses = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const LeaveTable = ({ leaves, loading, refresh }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Employee Name</th>
              <th className="px-4 py-3 text-left">Leave Type</th>
              <th className="px-4 py-3 text-left">Dates</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                  Loading leaves...
                </td>
              </tr>
            ) : leaves.length ? (
              leaves.map((leave) => (
                <tr key={leave._id} className="border-t border-slate-100 transition hover:bg-indigo-50/40">
                  <td className="px-4 py-3 font-medium text-slate-700">{leave.empId?.name || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{leave.leaveType || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="block">{formatDate(leave.startDate)}</span>
                    <span className="block text-xs text-slate-400">to {formatDate(leave.endDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[leave.leaveStatus] || "bg-slate-100 text-slate-600"}`}
                    >
                      {leave.leaveStatus || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LeaveActions leave={leave} refresh={refresh} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-slate-400">
                  No Leaves Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
