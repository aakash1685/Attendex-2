import React from "react";
import { Plus, RefreshCw, Calendar } from "lucide-react";

const CalendarToolbar = ({
  dept,
  setDept,
  year,
  setYear,
  onCreate,
  departments = [],
  onRefresh
}) => {

  const years = Array.from({ length: 6 }, (_, i) => 2025 + i);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* LEFT SECTION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">

        {/* Dept Dropdown */}
        <div className="relative w-full md:w-60">
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.deptName}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="relative w-full md:w-40">
          <Calendar size={14} className="absolute left-3 top-3 text-gray-400" />
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200 appearance-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-end gap-2">

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 
          hover:bg-gray-100 transition-all duration-200"
        >
          <RefreshCw size={16} />
        </button>

        {/* Create Button */}
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl 
          bg-gradient-to-r from-blue-600 to-blue-500 text-white 
          hover:from-blue-700 hover:to-blue-600 
          shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus size={16} />
          Create Calendar
        </button>

      </div>

    </div>
  );
};

export default CalendarToolbar;