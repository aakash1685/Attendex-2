import React from "react";
import LeaveRow from "./LeaveRow";

const LeaveTable = ({ leaves, loading, refresh, onLeaveUpdate, onLeaveDelete }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Days</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  Loading leaves...
                </td>
              </tr>
            ) : leaves.length ? (
              leaves.map((leave) => (
                <LeaveRow
                  key={leave._id}
                  leave={leave}
                  refresh={refresh}
                  onLeaveUpdate={onLeaveUpdate}
                  onLeaveDelete={onLeaveDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                  No leaves found for current filters.
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
