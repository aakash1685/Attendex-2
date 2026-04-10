import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaveSummary from "../../Components/Admin/Leave/LeaveSummary";
import LeaveToolbar from "../../Components/Admin/Leave/LeaveToolbar";
import LeaveTable from "../../Components/Admin/Leave/LeaveTable";

const LeavesMgmt = () => {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({});
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  // 🔥 Dummy fallback (NO EXTRA FILE)
  const dummyLeaves = [
    {
      _id: "1",
      empId: { name: "Aakash Patel" },
      deptId: { name: "IT" },
      leaveType: "CL",
      totalDays: 2,
      leaveStatus: "PENDING",
      reason: "Personal work",
      leaveDates: ["2026-04-10", "2026-04-11"],
    },
    {
      _id: "2",
      empId: { name: "Rahul Shah" },
      deptId: { name: "HR" },
      leaveType: "SL",
      totalDays: 3,
      leaveStatus: "APPROVED",
      reason: "Medical leave",
      leaveDates: ["2026-04-05"],
    },
  ];

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("/api/admin/leaves", {
        params: filters,
      });

      const data = res.data.leaves || [];
      setLeaves(data.length ? data : dummyLeaves); // fallback
    } catch (err) {
      console.error(err);
      setLeaves(dummyLeaves); // fallback if API fails
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("/api/admin/leaves/summary");
      setSummary(res.data.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
  }, [filters]);

  // 🔥 Pagination Logic
  const paginatedLeaves = leaves.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] p-6 space-y-6">

      <h1 className="text-3xl font-bold text-gray-800">
        Leave Management
      </h1>

      <LeaveSummary summary={summary} />

      <LeaveToolbar setFilters={setFilters} />

      <LeaveTable
        leaves={paginatedLeaves}
        refresh={fetchLeaves}
      />

      {/* 🔥 Pagination */}
      <div className="flex justify-center gap-2">
        {[...Array(Math.ceil(leaves.length / itemsPerPage))].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg ${
              page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default LeavesMgmt;