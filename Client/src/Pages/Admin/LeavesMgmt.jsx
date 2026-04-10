import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import LeaveSummary from "../../Components/Admin/Leave/LeaveSummary";
import LeaveToolbar from "../../Components/Admin/Leave/LeaveToolbar";
import LeaveTable from "../../Components/Admin/Leave/LeaveTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialSummary = {
  total: 0,
  APPROVED: 0,
  PENDING: 0,
  REJECTED: 0,
};

const initialFilters = {
  deptId: "",
  leaveStatus: "",
  fromDate: "",
  toDate: "",
};

const LeavesMgmt = () => {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 8;

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/leaves/`, {
        headers: authHeaders,
        params: filters,
      });

      setLeaves(response.data?.leaves || []);
      setPage(1);
    } catch (err) {
      if (err?.response?.status === 404) {
        setLeaves([]);
        setError("");
      } else {
        setError(err?.response?.data?.message || "Failed to fetch leaves.");
        toast.error(err?.response?.data?.message || "Failed to fetch leaves.");
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, authHeaders, filters]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/leaves/summary`, {
        headers: authHeaders,
        params: filters.deptId ? { deptId: filters.deptId } : {},
      });

      setSummary({
        ...initialSummary,
        ...(response.data?.data || {}),
      });
    } catch (err) {
      setSummary(initialSummary);
      toast.error(err?.response?.data?.message || "Failed to fetch leave summary.");
    } finally {
      setSummaryLoading(false);
    }
  }, [API_BASE_URL, authHeaders, filters.deptId]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dept/`, {
        headers: authHeaders,
      });

      setDepartments(response.data?.result?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load departments.");
    }
  }, [API_BASE_URL, authHeaders]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
  }, [fetchLeaves, fetchSummary]);

  const totalPages = Math.ceil(leaves.length / itemsPerPage);

  const paginatedLeaves = leaves.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleLeaveUpdate = (leaveId, updates) => {
    setLeaves((currentLeaves) =>
      currentLeaves.map((leave) =>
        leave._id === leaveId ? { ...leave, ...updates } : leave,
      ),
    );
  };

  const handleLeaveDelete = (leaveId) => {
    setLeaves((currentLeaves) => currentLeaves.filter((leave) => leave._id !== leaveId));
  };

  const handleRefreshAfterAction = async () => {
    await Promise.all([fetchLeaves(), fetchSummary()]);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Leave Management</h1>

        <LeaveSummary summary={summary} loading={summaryLoading} />

        <LeaveToolbar
          filters={filters}
          setFilters={setFilters}
          departments={departments}
          onApply={() => setPage(1)}
        />

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <LeaveTable
          leaves={paginatedLeaves}
          loading={loading}
          refresh={handleRefreshAfterAction}
          onLeaveUpdate={handleLeaveUpdate}
          onLeaveDelete={handleLeaveDelete}
        />

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = page === pageNumber;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesMgmt;
