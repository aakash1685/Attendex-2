import React from "react";
import { CalendarRange, Filter, RefreshCcw, Search } from "lucide-react";
import { STATUS_OPTIONS, VIEW_OPTIONS, getEmployeeDepartmentId } from "./attendanceHelpers";

const controlClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const AttendanceFilters = ({
  viewMode,
  setViewMode,
  filters,
  setFilters,
  summaryMonth,
  setSummaryMonth,
  employees,
  departments,
  onRefresh,
  loading,
}) => {
  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setFilters((current) => ({
      ...current,
      ...(mode !== "employee" ? { empId: "" } : {}),
      ...(mode !== "department" ? { deptId: "" } : {}),
    }));
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter size={16} /> Filters
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw size={15} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">View</label>
          <select value={viewMode} onChange={(e) => handleViewModeChange(e.target.value)} className={controlClass}>
            {VIEW_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Employee</label>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={filters.empId}
              onChange={(e) => {
                const employee = employees.find((item) => item._id === e.target.value);
                const deptId = getEmployeeDepartmentId(employee);
                setFilters((current) => ({
                  ...current,
                  empId: e.target.value,
                  ...(viewMode === "employee" ? { deptId } : {}),
                }));
              }}
              disabled={viewMode === "department"}
              className={`${controlClass} pl-9 disabled:cursor-not-allowed disabled:bg-slate-100`}
            >
              <option value="">All</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Department</label>
          <select
            value={filters.deptId}
            onChange={(e) => updateFilter("deptId", e.target.value)}
            disabled={viewMode === "employee"}
            className={`${controlClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
          >
            <option value="">All</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.deptName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Status</label>
          <select
            value={filters.attendanceStatus}
            onChange={(e) => updateFilter("attendanceStatus", e.target.value)}
            className={controlClass}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Date</label>
          <input type="date" value={filters.date} onChange={(e) => updateFilter("date", e.target.value)} className={controlClass} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">From</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => updateFilter("fromDate", e.target.value)}
            disabled={Boolean(filters.date)}
            className={`${controlClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">To</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => updateFilter("toDate", e.target.value)}
            disabled={Boolean(filters.date)}
            className={`${controlClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Summary Month</label>
          <div className="relative">
            <CalendarRange size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="month"
              value={summaryMonth}
              onChange={(e) => setSummaryMonth(e.target.value)}
              className={`${controlClass} pl-9`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttendanceFilters;
