import React, { useState } from "react";
import LeaveActions from "./LeaveAction";
import LeaveModal from "./LeaveModel";

const LeaveRow = ({ leave, refresh }) => {
  const [open, setOpen] = useState(false);

  const badge = {
    APPROVED: "bg-emerald-100 text-emerald-600",
    PENDING: "bg-amber-100 text-amber-600",
    REJECTED: "bg-rose-100 text-rose-600",
  };

  return (
    <>
      <tr
className="border-t hover:bg-indigo-50/60 cursor-pointer transition duration-200"        onClick={() => setOpen(true)}
      >
        <td className="p-4 font-medium">{leave.empId?.name}</td>
        <td>{leave.deptId?.name}</td>
        <td>{leave.leaveType}</td>
        <td>{leave.totalDays}</td>
        <td>
          <span className={`px-3 py-1 rounded-full text-xs ${badge[leave.leaveStatus]}`}>
            {leave.leaveStatus}
          </span>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <LeaveActions leave={leave} refresh={refresh} />
        </td>
      </tr>

      {open && (
        <LeaveModal leave={leave} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default LeaveRow;