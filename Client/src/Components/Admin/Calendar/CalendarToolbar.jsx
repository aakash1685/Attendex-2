import React from "react";
import { CalendarPlus, Filter, Search } from "lucide-react";

const CalendarToolbar = ({
  search,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedYear,
  onYearChange,
  departments,
  onCreate,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by department"
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <div className="relative lg:col-span-3">
          <Filter size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(event) => onDeptChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <input
            type="number"
            value={selectedYear}
            onChange={(event) => onYearChange(event.target.value)}
            placeholder="Year"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="lg:col-span-3 lg:text-right">
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 lg:w-auto"
          >
            <CalendarPlus size={16} />
            Create New Calendar
          </button>
        </div>
      </div>
    </section>
  );
};

export default CalendarToolbar;
