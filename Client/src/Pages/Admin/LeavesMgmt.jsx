import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import LeaveFilters from "../../Components/Admin/Leave/LeaveFilters";
import LeaveTable from "../../Components/Admin/Leave/LeaveTable";
import SummaryCards from "../../Components/Admin/Leave/SummaryCards";

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

const buildLeaveQuery = (filters) => {
  const params = {};

  if (filters.deptId) params.deptId = filters.deptId;
  if (filters.leaveStatus) params.leaveStatus = filters.leaveStatus;
  if (filters.fromDate) params.fromDate = filters.fromDate;
  if (filters.toDate) params.toDate = filters.toDate;

  return params;
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
  const hasFetchedRef = useRef(false);

  const itemsPerPage = 8;

  const axiosClient = useMemo(() => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.get("/api/admin/leave", {
        params: buildLeaveQuery(filters),
      });

      const nextLeaves = Array.isArray(response.data?.leaves) ? response.data.leaves : [];
      setLeaves(nextLeaves);
      setPage(1);
    } catch (err) {
      if (err?.response?.status === 404) {
        setLeaves([]);
        setError("");
        return;
      }

      const message = err?.response?.data?.message || "Failed to fetch leaves.";
      setError(message);
      setLeaves([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [axiosClient, filters]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const response = await axiosClient.get("/api/admin/leave/summary", {
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
  }, [axiosClient, filters.deptId]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axiosClient.get("/api/admin/dept");
      setDepartments(response.data?.result?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load departments.");
    }
  }, [axiosClient]);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
  }, [fetchLeaves, fetchSummary]);

  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const paginatedLeaves = leaves.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleRefreshAfterAction = async () => {
    await Promise.all([fetchLeaves(), fetchSummary()]);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Leave Management</h1>
          <p className="mt-1 text-sm text-slate-500">Track, filter and process employee leave requests.</p>
        </div>

        <LeaveFilters
          filters={filters}
          setFilters={setFilters}
          departments={departments}
          onApply={() => setPage(1)}
        />

        <SummaryCards summary={summary} loading={summaryLoading} />

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <LeaveTable leaves={paginatedLeaves} loading={loading} refresh={handleRefreshAfterAction} />

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = page === pageNumber;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100"
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
