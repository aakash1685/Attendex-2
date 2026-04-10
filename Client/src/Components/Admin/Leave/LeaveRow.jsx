import React, { useState } from "react";
import LeaveActions from "./LeaveAction";
import LeaveModal from "./LeaveModel";

const statusBadgeClasses = {
  APPROVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

const LeaveRow = ({ leave, refresh, onLeaveUpdate, onLeaveDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-t border-slate-100 transition hover:bg-indigo-50/50"
        onClick={() => setOpen(true)}
      >
        <td className="px-4 py-3 font-medium text-slate-700">{leave.empId?.name || "-"}</td>
        <td className="px-4 py-3 text-slate-600">{leave.deptId?.name || "-"}</td>
        <td className="px-4 py-3 text-slate-600">{leave.leaveType || "-"}</td>
        <td className="px-4 py-3 text-slate-600">{leave.totalDays || 0}</td>
        <td className="px-4 py-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[leave.leaveStatus] || "bg-slate-100 text-slate-600"}`}
          >
            {leave.leaveStatus || "UNKNOWN"}
          </span>
        </td>
        <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
          <LeaveActions
            leave={leave}
            refresh={refresh}
            onLeaveUpdate={onLeaveUpdate}
            onLeaveDelete={onLeaveDelete}
          />
        </td>
      </tr>

      {open ? <LeaveModal leave={leave} onClose={() => setOpen(false)} /> : null}
    </>
  );
};

export default LeaveRow;
