import React, { useState } from "react";
import { CalendarDays, Clock3, Save, UserRound, X } from "lucide-react";
import {
  STATUS_OPTIONS,
  getEmployeeDepartmentId,
  getEmployeeDepartmentName,
} from "./attendanceHelpers";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const toDatetimeInputValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const getInitialFormState = (mode, record) => ({
  empId: mode === "edit" ? record?.empId?._id || record?.empId || "" : "",
  deptId:
    mode === "edit"
      ? record?.deptId?._id || record?.deptId || getEmployeeDepartmentId(record?.empId)
      : "",
  date: mode === "edit" && record?.date ? record.date.slice(0, 10) : "",
  attendanceStatus: mode === "edit" ? record?.attendanceStatus || "PRESENT" : "PRESENT",
  checkInTime: mode === "edit" ? toDatetimeInputValue(record?.checkInTime) : "",
  checkOutTime: mode === "edit" ? toDatetimeInputValue(record?.checkOutTime) : "",
});

const AttendanceFormModal = ({
  isOpen,
  mode = "manual",
  record,
  employees = [],
  departments = [],
  onClose,
  onSubmit,
  submitting = false,
}) => {
  const [formState, setFormState] = useState(() => getInitialFormState(mode, record));
  const [error, setError] = useState("");

  const selectedEmployee = employees.find((employee) => employee._id === formState.empId);

  if (!isOpen) return null;

  const modalTitle = mode === "edit" ? "Edit Attendance" : "Add Manual Attendance";

  const validate = () => {
    if (!formState.empId) return "Select an employee.";
    if (!formState.deptId) return "Select a department.";
    if (!formState.date) return "Select a date.";

    if (formState.checkInTime && formState.checkOutTime) {
      const start = new Date(formState.checkInTime);
      const end = new Date(formState.checkOutTime);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "Use a valid check-in/check-out time.";
      }

      if (end <= start) {
        return "Check-out time must be after check-in time.";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    await onSubmit({
      empId: formState.empId,
      deptId: formState.deptId,
      date: formState.date,
      attendanceStatus: formState.attendanceStatus,
      checkInTime: formState.checkInTime || null,
      checkOutTime: formState.checkOutTime || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_35px_90px_-35px_rgba(15,23,42,0.5)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Admin Actions
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{modalTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <UserRound size={13} /> Employee
              </label>
              <select
                value={formState.empId}
                onChange={(event) => {
                  const nextEmpId = event.target.value;
                  const employee = employees.find((item) => item._id === nextEmpId);
                  const derivedDeptId = getEmployeeDepartmentId(employee);

                  setFormState((current) => ({
                    ...current,
                    empId: nextEmpId,
                    deptId: derivedDeptId || current.deptId,
                  }));
                }}
                disabled={mode === "edit"}
                className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Department
              </label>
              <select
                value={formState.deptId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, deptId: event.target.value }))
                }
                className={inputClassName}
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.deptName}
                  </option>
                ))}
              </select>
              {selectedEmployee && (
                <p className="mt-2 text-xs text-slate-500">
                  Employee department: {getEmployeeDepartmentName(selectedEmployee)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <CalendarDays size={13} /> Date
              </label>
              <input
                type="date"
                value={formState.date}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, date: event.target.value }))
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </label>
              <select
                value={formState.attendanceStatus}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    attendanceStatus: event.target.value,
                  }))
                }
                className={inputClassName}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Clock3 size={13} /> Check-in
              </label>
              <input
                type="datetime-local"
                value={formState.checkInTime}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    checkInTime: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Check-out
              </label>
              <input
                type="datetime-local"
                value={formState.checkOutTime}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    checkOutTime: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={15} />
              {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceFormModal;
