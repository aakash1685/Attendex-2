import React, { useEffect, useState } from "react";

const resetValue = {
  deptId: "",
  leaveStatus: "",
  fromDate: "",
  toDate: "",
};

const LeaveFilters = ({ filters, setFilters, departments, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onApply?.();
  };

  const clearFilters = () => {
    setLocalFilters(resetValue);
    setFilters(resetValue);
    onApply?.();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={localFilters.deptId}
          onChange={(event) => handleChange("deptId", event.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={localFilters.leaveStatus}
          onChange={(event) => handleChange("leaveStatus", event.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="date"
          value={localFilters.fromDate}
          onChange={(event) => handleChange("fromDate", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <input
          type="date"
          value={localFilters.toDate}
          onChange={(event) => handleChange("toDate", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveFilters;
