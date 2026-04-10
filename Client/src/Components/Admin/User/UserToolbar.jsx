import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

const UserToolbar = ({
  departments,
  onSearch,
  onSort,
  onFilter,
  onAdd,
}) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dept, setDept] = useState("");

  // Handlers
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSort(value);
    onSort(value);
  };

  const handleDept = (e) => {
    const value = e.target.value;
    setDept(value);
    onFilter(value);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* Left Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={handleSort}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Sort</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="date">Date Added</option>
        </select>

        {/* Filter by Department */}
        <select
          value={dept}
          onChange={handleDept}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Departments</option>
          {departments?.map((d) => (
            <option key={d._id} value={d._id}>
              {d.deptName}
            </option>
          ))}
        </select>

      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
      >
        <Plus size={16} />
        Add User
      </button>

    </div>
  );
};

export default UserToolbar;