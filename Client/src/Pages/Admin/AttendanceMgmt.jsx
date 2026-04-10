import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Plus } from "lucide-react";
import AttendanceTable from "../../Components/Admin/Attendance/AttendanceTable";
import AttendanceFilters from "../../Components/Admin/Attendance/AttendanceFilters";
import AttendanceSummary from "../../Components/Admin/Attendance/AttendanceSummary";
import AttendanceForm from "../../Components/Admin/Attendance/AttendanceForm";
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

const getAttendanceData = (payload) => payload?.data || payload?.attendance || [];

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
  const [emptyMessage, setEmptyMessage] = useState("No Attendance Found");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchReferenceData = useCallback(async () => {
    try {
      const [departmentRes, employeesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/dept/`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/api/admin/user/`, { headers: authHeaders }),
      ]);

      setDepartments(departmentRes.data?.result?.data || []);
      setEmployees(employeesRes.data?.employees || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load employee and department data.",
      );
    }
  }, [authHeaders]);

  const fetchSummary = useCallback(
    async (activeDeptId) => {
      setSummaryLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/attendance/summary`, {
          headers: authHeaders,
          params: getSummaryParams(summaryMonth, activeDeptId),
        });

        setSummary({ ...initialSummary, ...(res.data?.data || {}) });
      } catch (error) {
        setSummary(initialSummary);
        toast.error(error?.response?.data?.message || "Failed to fetch attendance summary.");
      } finally {
        setSummaryLoading(false);
      }
    },
    [authHeaders, summaryMonth],
  );

  const fetchAttendance = useCallback(async () => {
    if (viewMode === "employee" && !filters.empId) {
      setRecords([]);
      setTableLoading(false);
      setEmptyMessage("Select an employee to load attendance history.");
      return;
    }

    if (viewMode === "department" && !filters.deptId) {
      setRecords([]);
      setTableLoading(false);
      setEmptyMessage("Select a department to load attendance history.");
      return;
    }

    setTableLoading(true);
    try {
      const query = buildAttendanceQuery(viewMode, filters);
      let url = `${API_BASE_URL}/api/admin/attendance/`;

      if (viewMode === "employee") {
        url = `${API_BASE_URL}/api/admin/attendance/emp/${filters.empId}`;
      } else if (viewMode === "department") {
        url = `${API_BASE_URL}/api/admin/attendance/dept/${filters.deptId}`;
      }

      const res = await axios.get(url, {
        headers: authHeaders,
        params: query,
      });

      setRecords(getAttendanceData(res.data));
      setEmptyMessage("No Attendance Found");
    } catch (error) {
      if (error?.response?.status === 404) {
        setRecords([]);
        setEmptyMessage(error?.response?.data?.message || "No Attendance Found");
      } else {
        toast.error(error?.response?.data?.message || "Failed to fetch attendance records.");
      }
    } finally {
      setTableLoading(false);
    }
  }, [authHeaders, filters, viewMode]);

  const refreshAllData = useCallback(() => {
    fetchAttendance();
    fetchSummary(filters.deptId);
  }, [fetchAttendance, fetchSummary, filters.deptId]);

  useEffect(() => {
    fetchReferenceData();
  }, [fetchReferenceData]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const handleManualSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/attendance/mannual`, payload, {
        headers: authHeaders,
      });

      if (response.data?.data) {
        setRecords((current) => [response.data.data, ...current]);
      }

      toast.success("Attendance marked successfully.");
      setManualOpen(false);
      refreshAllData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to mark attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    if (!editRecord?._id) return;

    const oldRecord = records.find((item) => item._id === editRecord._id);

    setSubmitting(true);
    setRecords((current) =>
      current.map((record) =>
        record._id === editRecord._id
          ? {
              ...record,
              ...payload,
            }
          : record,
      ),
    );

    try {
      await axios.patch(`${API_BASE_URL}/api/admin/attendance/edit/${editRecord._id}`, payload, {
        headers: authHeaders,
      });

      toast.success("Attendance updated successfully.");
      setEditRecord(null);
      refreshAllData();
    } catch (error) {
      if (oldRecord) {
        setRecords((current) =>
          current.map((record) => (record._id === editRecord._id ? oldRecord : record)),
        );
      }
      toast.error(error?.response?.data?.message || "Unable to update attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatusUpdate = async (record, attendanceStatus) => {
    const previousStatus = record.attendanceStatus;

    setRecords((current) =>
      current.map((item) =>
        item._id === record._id
          ? {
              ...item,
              attendanceStatus,
            }
          : item,
      ),
    );

    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/attendance/edit/${record._id}`,
        { attendanceStatus },
        { headers: authHeaders },
      );
      toast.success(`Marked ${record.empId?.name || "employee"} as ${attendanceStatus}.`);
      fetchSummary(filters.deptId);
    } catch (error) {
      setRecords((current) =>
        current.map((item) =>
          item._id === record._id
            ? {
                ...item,
                attendanceStatus: previousStatus,
              }
            : item,
        ),
      );
      toast.error(error?.response?.data?.message || "Unable to update status.");
    }
  };

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
    <div className="min-h-full bg-slate-100/70 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Attendance Management</h1>
              <p className="mt-1 text-sm text-slate-500">Monitor, mark and update attendance records in real time.</p>
            </div>

            <button
              type="button"
              onClick={() => setManualOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Mark Attendance
            </button>
          </div>
        </section>

        <AttendanceSummary summary={summary} loading={summaryLoading} />

        <AttendanceFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          filters={filters}
          setFilters={setFilters}
          summaryMonth={summaryMonth}
          setSummaryMonth={setSummaryMonth}
          employees={employees}
          departments={departments}
          loading={tableLoading || summaryLoading}
          onRefresh={refreshAllData}
        />

        <AttendanceTable
          records={records}
          loading={tableLoading}
          emptyMessage={emptyMessage}
          onEdit={setEditRecord}
          onQuickStatusUpdate={handleQuickStatusUpdate}
          onSwitchToEmployee={handleSwitchToEmployee}
          onSwitchToDepartment={handleSwitchToDepartment}
        />
      </div>

      <AttendanceForm
        isOpen={manualOpen}
        mode="manual"
        employees={employees}
        departments={departments}
        onClose={() => setManualOpen(false)}
        onSubmit={handleManualSubmit}
        submitting={submitting}
      />

      <AttendanceForm
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
