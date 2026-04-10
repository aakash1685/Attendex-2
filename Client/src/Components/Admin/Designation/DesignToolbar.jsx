import React, { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";

const DesignToolbar = ({ departments, onSearch, onFilter, onAdd }) => {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleDeptChange = (e) => {
    const value = e.target.value;
    setDept(value);
    onFilter(value);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* Left Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search designations..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-3 text-gray-400" />
          <select
            value={dept}
            onChange={handleDeptChange}
            className="pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
            focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200 appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.deptName}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl 
          bg-gradient-to-r from-indigo-600 to-indigo-500 text-white 
          hover:from-indigo-700 hover:to-indigo-600 
          shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus size={16} />
          Add Designation
        </button>
      </div>

    </div>
  );
};

export default DesignToolbar;