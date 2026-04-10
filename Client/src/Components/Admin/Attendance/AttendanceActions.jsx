import React from "react";
import { ArrowRight, Check, PencilLine, X } from "lucide-react";

const AttendanceActions = ({
  record,
  onEdit,
  onSwitchToEmployee,
  onSwitchToDepartment,
  onQuickStatusUpdate,
}) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(record)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
      >
        <PencilLine size={14} /> Edit
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQuickStatusUpdate(record, "PRESENT")}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          <Check size={12} /> Present
        </button>
        <button
          type="button"
          onClick={() => onQuickStatusUpdate(record, "ABSENT")}
          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          <X size={12} /> Absent
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSwitchToEmployee(record.empId?._id)}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
      >
        Employee <ArrowRight size={12} />
      </button>
      <button
        type="button"
        onClick={() => onSwitchToDepartment(record.deptId?._id)}
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-700"
      >
        Department <ArrowRight size={12} />
      </button>
    </div>
  );
};

export default AttendanceActions;
