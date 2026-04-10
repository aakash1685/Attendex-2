import React from "react";
import {
  CalendarRange,
  CirclePlus,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";
import {
  STATUS_OPTIONS,
  VIEW_OPTIONS,
  getEmployeeDepartmentId,
} from "./attendanceHelpers";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const selectClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const AttendanceToolbar = ({
  viewMode,
  setViewMode,
  filters,
  setFilters,
  summaryMonth,
  setSummaryMonth,
  employees,
  departments,
  onRefresh,
  onOpenManual,
  loading,
}) => {
  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleViewModeChange = (nextMode) => {
    setViewMode(nextMode);
    setFilters((current) => ({
      ...current,
      ...(nextMode !== "employee" ? { empId: "" } : {}),
      ...(nextMode !== "department" ? { deptId: "" } : {}),
    }));
  };

  const handleEmployeeChange = (empId) => {
    const selectedEmployee = employees.find((employee) => employee._id === empId);
    const employeeDeptId = getEmployeeDepartmentId(selectedEmployee);

    setFilters((current) => ({
      ...current,
      empId,
      ...(viewMode === "employee" && employeeDeptId ? { deptId: employeeDeptId } : {}),
    }));
  };

  const resetFilters = () => {
    setFilters({
      empId: "",
      deptId: "",
      attendanceStatus: "",
      date: "",
      fromDate: "",
      toDate: "",
    });
    setViewMode("all");
  };

  return (
    <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <Filter size={14} />
            Attendance Controls
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Filter live records and drill into employee or department history
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Use the route-specific views below to load all attendance, a single
            employee timeline, or department-wide attendance records.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={onOpenManual}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
          >
            <CirclePlus size={16} />
            Add Manual Attendance
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            View Mode
          </label>
          <select
            value={viewMode}
            onChange={(event) => handleViewModeChange(event.target.value)}
            className={selectClassName}
          >
            {VIEW_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Employee
          </label>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={filters.empId}
              onChange={(event) => handleEmployeeChange(event.target.value)}
              disabled={viewMode === "department"}
              className={`${selectClassName} pl-11 disabled:cursor-not-allowed disabled:bg-slate-100`}
            >
              <option value="">All employees</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Department
          </label>
          <select
            value={filters.deptId}
            onChange={(event) => handleFilterChange("deptId", event.target.value)}
            disabled={viewMode === "employee"}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.deptName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Status
          </label>
          <select
            value={filters.attendanceStatus}
            onChange={(event) =>
              handleFilterChange("attendanceStatus", event.target.value)
            }
            className={selectClassName}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Single Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(event) => handleFilterChange("date", event.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => handleFilterChange("fromDate", event.target.value)}
            disabled={Boolean(filters.date)}
            className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => handleFilterChange("toDate", event.target.value)}
            disabled={Boolean(filters.date)}
            className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100`}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Summary Month
          </label>
          <div className="relative">
            <CalendarRange
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="month"
              value={summaryMonth}
              onChange={(event) => setSummaryMonth(event.target.value)}
              className={`${inputClassName} pl-11`}
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceToolbar;
