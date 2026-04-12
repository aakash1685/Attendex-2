import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { CalendarRange } from "lucide-react";
import CalendarToolbar from "../../Components/Admin/Calendar/CalendarToolbar";
import CalendarForm from "../../Components/Admin/Calendar/CalendarForm";
import CalendarCard from "../../Components/Admin/Calendar/CalendarCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CalenderMgmt = () => {
  const [departments, setDepartments] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const deptRes = await axios.get(`${API_BASE_URL}/api/admin/dept/`, { headers: authHeaders });
      const deptList = Array.isArray(deptRes.data?.result?.data) ? deptRes.data.result.data : [];
      setDepartments(deptList);

      const calendarResponses = await Promise.all(
        deptList.map((dept) =>
          axios
            .get(`${API_BASE_URL}/api/admin/dept-calendar/years/${dept._id}`, { headers: authHeaders })
            .then((response) => ({ dept, calendars: response.data?.calendars || [] }))
            .catch(() => ({ dept, calendars: [] })),
        ),
      );

      const mergedCalendars = calendarResponses.flatMap(({ dept, calendars: deptCalendars }) =>
        deptCalendars.map((calendar) => ({
          ...calendar,
          deptId: calendar.deptId || dept._id,
          deptName: dept.deptName,
        })),
      );

      setCalendars(mergedCalendars);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load calendars.");
      setCalendars([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSave = async (payload) => {
    setSubmitting(true);
    try {
      if (editData?._id) {
        await axios.put(`${API_BASE_URL}/api/admin/dept-calendar/update/${editData.deptId}/${editData.year}`, payload, {
          headers: authHeaders,
        });
        toast.success("Calendar updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/dept-calendar/create`, payload, { headers: authHeaders });
        toast.success("Calendar created successfully.");
      }

      setOpenForm(false);
      setEditData(null);
      await fetchAll();
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || "Failed to save calendar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (calendar) => {
    const confirmDelete = window.confirm(`Delete calendar ${calendar.year} for ${calendar.deptName}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/dept-calendar/year/${calendar.deptId}/${calendar.year}`, {
        headers: authHeaders,
      });
      toast.success("Calendar deleted successfully.");
      await fetchAll();
    } catch (deleteError) {
      toast.error(deleteError?.response?.data?.message || "Failed to delete calendar.");
    }
  };

  const filtered = useMemo(() => {
    return calendars
      .filter((calendar) => {
        const matchSearch = calendar.deptName?.toLowerCase().includes(search.toLowerCase());
        const matchDept = selectedDept ? calendar.deptId === selectedDept : true;
        const matchYear = selectedYear ? String(calendar.year) === String(selectedYear) : true;
        return matchSearch && matchDept && matchYear;
      })
      .sort((a, b) => b.year - a.year);
  }, [calendars, search, selectedDept, selectedYear]);

  return (
    <div className="min-h-full bg-slate-100/70 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Calendar Management</h1>
              <p className="text-sm text-slate-500">Create and control department calendars, holidays, and working-day overrides.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              <CalendarRange size={15} /> SaaS Calendar Suite
            </div>
          </div>
        </section>

        <CalendarToolbar
          search={search}
          onSearchChange={setSearch}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          departments={departments}
          onCreate={() => {
            setEditData(null);
            setFormKey((prev) => prev + 1);
            setOpenForm(true);
          }}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading calendars...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">No calendars found for selected filters.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((calendar) => (
              <CalendarCard
                key={`${calendar.deptId}-${calendar.year}`}
                calendar={calendar}
                onEdit={() => {
                  setEditData(calendar);
                  setFormKey((prev) => prev + 1);
                  setOpenForm(true);
                }}
                onDelete={() => handleDelete(calendar)}
              />
            ))}
          </div>
        )}
      </div>

      <CalendarForm
        key={formKey}
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSave={handleSave}
        departments={departments}
        editData={editData}
        submitting={submitting}
      />
    </div>
  );
};

export default CalenderMgmt;
