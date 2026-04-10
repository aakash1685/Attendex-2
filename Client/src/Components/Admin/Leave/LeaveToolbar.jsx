import React, { useState } from "react";

const LeaveToolbar = ({ setFilters }) => {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
<div className="flex gap-3 items-center bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl px-4 py-3 flex-wrap">
      <select
        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-400"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-400"
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
       className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-400"
      />

      <button
        onClick={() =>
          setFilters({
            leaveStatus: status,
            fromDate,
            toDate,
          })
        }
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Apply
      </button>
    </div>
  );
};

export default LeaveToolbar;