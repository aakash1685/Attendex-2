import React from "react";
import { ArrowRight, Clock4, PencilLine, Users } from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatHours,
  formatStatusLabel,
  getStatusClasses,
} from "./attendanceHelpers";

const AttendanceTable = ({
  records,
  loading,
  emptyMessage,
  onEdit,
  onSwitchToEmployee,
  onSwitchToDepartment,
}) => {
  if (loading) {
    return (
      <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)]">
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/85 px-6 py-16 text-center shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Users size={24} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">
          No attendance records
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Attendance Register</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review daily logs, edit check-in windows, or jump into employee and
            department histories.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {records.length} entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/90">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4">Hours</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record._id} className="align-top transition hover:bg-slate-50/70">
                <td className="px-6 py-5">
                  <p className="font-medium text-slate-900">
                    {record.empId?.name || "--"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {record.empId?.email || "--"}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="font-medium text-slate-700">
                    {record.deptId?.deptName || record.deptId?.name || "--"}
                  </p>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-700">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock4 size={14} className="text-slate-400" />
                      <span>In: {formatDateTime(record.checkInTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock4 size={14} className="text-slate-400" />
                      <span>Out: {formatDateTime(record.checkOutTime)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-700">
                  {formatHours(record)}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(record.attendanceStatus)}`}
                  >
                    {formatStatusLabel(record.attendanceStatus)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(record)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      <PencilLine size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchToEmployee(record.empId?._id)}
                      className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      Employee history
                      <ArrowRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchToDepartment(record.deptId?._id)}
                      className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-slate-700"
                    >
                      Department records
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
