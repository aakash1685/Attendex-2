import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Building2, Sparkles, UserRound } from "lucide-react";
import AttendanceSummaryCards from "../../Components/Admin/Attendance/AttendanceSummaryCards";
import AttendanceTable from "../../Components/Admin/Attendance/AttendanceTable";
import AttendanceToolbar from "../../Components/Admin/Attendance/AttendanceToolbar";
import AttendanceFormModal from "../../Components/Admin/Attendance/AttendanceFormModal";
import {
  buildAttendanceQuery,
  getEmployeeDepartmentId,
  getMonthInputValue,
  getSummaryParams,
} from "../../Components/Admin/Attendance/attendanceHelpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialFilters = {
  empId: "",
  deptId: "",
  attendanceStatus: "",
  date: "",
  fromDate: "",
  toDate: "",
};

const initialSummary = {
  total: 0,
  PRESENT: 0,
  ABSENT: 0,
  HALF_DAY: 0,
  LEAVE: 0,
};

const AttendanceMgmt = () => {
  const [viewMode, setViewMode] = useState("all");
  const [filters, setFilters] = useState(initialFilters);
  const [summaryMonth, setSummaryMonth] = useState(getMonthInputValue());
  const [summary, setSummary] = useState(initialSummary);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [records, setRecords] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(
    "Apply a filter or create a manual attendance record to get started.",
  );

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchReferenceData = useCallback(async () => {
    try {
      const [departmentRes, employeesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/dept/`, {
          headers: authHeaders,
        }),
        axios.get(`${API_BASE_URL}/api/admin/user/`, {
          headers: authHeaders,
        }),
      ]);

      setDepartments(departmentRes.data?.result?.data || []);
      setEmployees(employeesRes.data?.employees || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load attendance filters.",
      );
    }
  }, [authHeaders]);

  const fetchSummary = useCallback(async (activeDeptId) => {
    setSummaryLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/attendance/summary`, {
        headers: authHeaders,
        params: getSummaryParams(summaryMonth, activeDeptId),
      });

      setSummary({
        ...initialSummary,
        ...(res.data?.data || {}),
      });
    } catch (error) {
      setSummary(initialSummary);
      toast.error(
        error?.response?.data?.message || "Failed to load attendance summary.",
      );
    } finally {
      setSummaryLoading(false);
    }
  }, [authHeaders, summaryMonth]);

  const fetchAttendance = useCallback(async () => {
    const query = buildAttendanceQuery(viewMode, filters);

    if (viewMode === "employee" && !filters.empId) {
      setRecords([]);
      setTableLoading(false);
      setEmptyMessage("Choose an employee to load their attendance history.");
      return;
    }

    if (viewMode === "department" && !filters.deptId) {
      setRecords([]);
      setTableLoading(false);
      setEmptyMessage("Choose a department to review its attendance records.");
      return;
    }

    setTableLoading(true);

    try {
      let url = `${API_BASE_URL}/api/admin/attendance/`;

      if (viewMode === "employee") {
        url = `${API_BASE_URL}/api/admin/attendance/emp/${filters.empId}`;
      }

      if (viewMode === "department") {
        url = `${API_BASE_URL}/api/admin/attendance/dept/${filters.deptId}`;
      }

      const res = await axios.get(url, {
        headers: authHeaders,
        params: query,
      });

      const nextRecords = res.data?.data || res.data?.attendance || [];
      setRecords(nextRecords);
      setEmptyMessage("No attendance records matched the selected filters.");
    } catch (error) {
      if (error?.response?.status === 404) {
        setRecords([]);
        setEmptyMessage(
          error?.response?.data?.message ||
            "No attendance records matched the selected filters.",
        );
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to load attendance records.",
        );
      }
    } finally {
      setTableLoading(false);
    }
  }, [authHeaders, filters, viewMode]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  useEffect(() => {
    fetchAttendance();
    fetchSummary(filters.deptId);
  }, [fetchAttendance, fetchSummary, filters.deptId]);

  const handleManualSubmit = async (payload) => {
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/attendance/mannual`, payload, {
        headers: authHeaders,
      });

      toast.success("Manual attendance added successfully.");
      setManualOpen(false);
      fetchAttendance();
      fetchSummary(filters.deptId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create attendance record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!editRecord?._id) return;

    setSubmitting(true);

    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/attendance/edit/${editRecord._id}`,
        payload,
        {
          headers: authHeaders,
        },
      );

      toast.success("Attendance updated successfully.");
      setEditRecord(null);
      fetchAttendance();
      fetchSummary(filters.deptId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update attendance record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEmployee = employees.find((employee) => employee._id === filters.empId);
  const selectedDepartment = departments.find(
    (department) => department._id === filters.deptId,
  );
  const presentRate = summary.total
    ? `${Math.round((summary.PRESENT / summary.total) * 100)}%`
    : "0%";

  const handleSwitchToEmployee = (empId) => {
    const employee = employees.find((item) => item._id === empId);

    setViewMode("employee");
    setFilters((current) => ({
      ...current,
      empId: empId || "",
      deptId: getEmployeeDepartmentId(employee),
    }));
  };

  const handleSwitchToDepartment = (deptId) => {
    setViewMode("department");
    setFilters((current) => ({
      ...current,
      deptId: deptId || "",
      empId: "",
    }));
  };

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_22%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)] p-6">
      <Toaster position="top-right" />

      <div className="space-y-6">
        <section className="overflow-hidden rounded-[36px] border border-slate-200/70 bg-slate-950 px-6 py-7 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.7)]">
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                <Sparkles size={14} />
                Admin Attendance Services
              </div>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Attendance command center for clean monitoring, fast edits, and
                manual recovery
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Track attendance across the organization, switch between employee
                and department routes, and keep records consistent with quick
                summary insights and direct admin actions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Focused employee</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {selectedEmployee?.name || "All employees"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-400/15 p-3 text-sky-300">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Department focus</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {selectedDepartment?.deptName || "Organization-wide"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                      Present rate {presentRate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AttendanceSummaryCards summary={summary} loading={summaryLoading} />

        <AttendanceToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          filters={filters}
          setFilters={setFilters}
          summaryMonth={summaryMonth}
          setSummaryMonth={setSummaryMonth}
          employees={employees}
          departments={departments}
          onRefresh={() => {
            fetchAttendance();
            fetchSummary(filters.deptId);
          }}
          onOpenManual={() => setManualOpen(true)}
          loading={tableLoading || summaryLoading}
        />

        <AttendanceTable
          records={records}
          loading={tableLoading}
          emptyMessage={emptyMessage}
          onEdit={setEditRecord}
          onSwitchToEmployee={handleSwitchToEmployee}
          onSwitchToDepartment={handleSwitchToDepartment}
        />
      </div>

      <AttendanceFormModal
        key={`manual-${manualOpen ? "open" : "closed"}`}
        isOpen={manualOpen}
        mode="manual"
        employees={employees}
        departments={departments}
        onClose={() => setManualOpen(false)}
        onSubmit={handleManualSubmit}
        submitting={submitting}
      />

      <AttendanceFormModal
        key={editRecord?._id || "edit-closed"}
        isOpen={Boolean(editRecord)}
        mode="edit"
        record={editRecord}
        employees={employees}
        departments={departments}
        onClose={() => setEditRecord(null)}
        onSubmit={handleEditSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default AttendanceMgmt;
