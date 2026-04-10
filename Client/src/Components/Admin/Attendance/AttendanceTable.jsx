import React from "react";
import { Clock4, Users } from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatStatusLabel,
  getStatusClasses,
} from "./attendanceHelpers";
import AttendanceActions from "./AttendanceActions";

const AttendanceTable = ({
  records,
  loading,
  emptyMessage,
  onEdit,
  onQuickStatusUpdate,
  onSwitchToEmployee,
  onSwitchToDepartment,
}) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Users size={24} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">No Attendance Found</h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Attendance Records</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {records.length} rows
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Employee Name</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Check-in / Check-out</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record._id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{record.empId?.name || "--"}</p>
                  <p className="text-xs text-slate-500">{record.deptId?.deptName || "--"}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{formatDate(record.date)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(record.attendanceStatus)}`}>
                    {formatStatusLabel(record.attendanceStatus)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock4 size={14} className="text-slate-400" />
                      In: {formatDateTime(record.checkInTime)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock4 size={14} className="text-slate-400" />
                      Out: {formatDateTime(record.checkOutTime)}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <AttendanceActions
                    record={record}
                    onEdit={onEdit}
                    onQuickStatusUpdate={onQuickStatusUpdate}
                    onSwitchToEmployee={onSwitchToEmployee}
                    onSwitchToDepartment={onSwitchToDepartment}
                  />
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
