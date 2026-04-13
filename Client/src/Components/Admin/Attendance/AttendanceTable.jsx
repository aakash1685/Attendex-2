import React, { useMemo, useState } from "react";
import { Clock4, Search, Timer, Users } from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatHours,
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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return records;

    return records.filter((record) => {
      const name = record.empId?.name?.toLowerCase() || "";
      const department = record.deptId?.deptName?.toLowerCase() || "";
      const status = formatStatusLabel(record.attendanceStatus).toLowerCase();
      const date = formatDate(record.date).toLowerCase();

      return [name, department, status, date].some((field) => field.includes(normalized));
    });
  }, [records, searchTerm]);

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
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Attendance Records</h3>
          <p className="text-xs text-slate-500">Search by employee, department, date or status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Quick search..."
              className="w-52 rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {filteredRecords.length} rows
          </span>
        </div>
      </div>

      {!filteredRecords.length ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm text-slate-500">No records matched your search.</p>
        </div>
      ) : (
        <>
      <div className="block space-y-3 p-4 md:hidden">
        {filteredRecords.map((record) => (
          <article key={record._id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{record.empId?.name || "--"}</p>
                <p className="text-xs text-slate-500">{record.deptId?.deptName || "--"}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(record.attendanceStatus)}`}>
                {formatStatusLabel(record.attendanceStatus)}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <p>Date: {formatDate(record.date)}</p>
              <p>In: {formatDateTime(record.checkInTime)}</p>
              <p>Out: {formatDateTime(record.checkOutTime)}</p>
              <p className="inline-flex items-center gap-1"><Timer size={14} className="text-slate-400" /> {formatHours(record)}</p>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <AttendanceActions
                record={record}
                onEdit={onEdit}
                onQuickStatusUpdate={onQuickStatusUpdate}
                onSwitchToEmployee={onSwitchToEmployee}
                onSwitchToDepartment={onSwitchToDepartment}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="hidden min-w-full divide-y divide-slate-200 md:table">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Employee Name</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Check-in / Check-out</th>
              <th className="px-5 py-3">Hours</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (
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
                <td className="px-5 py-4 text-sm text-slate-700">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <Timer size={13} className="text-slate-500" />
                    {formatHours(record)}
                  </span>
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
      </>
      )}
    </div>
  );
};

export default AttendanceTable;
