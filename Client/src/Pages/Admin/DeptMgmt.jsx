import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import DeptFormModal from "../../Components/Admin/Department/DeptFormModal";
import DeptTable from "../../Components/Admin/Department/DeptTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DeptMgmt = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [deptRes, activeUsersRes, inactiveUsersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/dept/`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/api/admin/user/`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/api/admin/user/get-all-deactivate-users`, { headers: authHeaders }),
      ]);

      const nextDepartments = Array.isArray(deptRes.data?.result?.data) ? deptRes.data.result.data : [];
      const users = [
        ...(activeUsersRes.data?.employees || []),
        ...(inactiveUsersRes.data?.employees || []),
      ];

      const counts = users.reduce((accumulator, user) => {
        const deptId = typeof user.dept === "object" ? user.dept?._id : user.dept;
        if (!deptId) return accumulator;
        accumulator[deptId] = (accumulator[deptId] || 0) + 1;
        return accumulator;
      }, {});

      setDepartments(
        nextDepartments.map((dept) => ({
          ...dept,
          totalEmployees: counts[dept._id] || 0,
        })),
      );
    } catch (fetchError) {
      const message = fetchError?.response?.data?.message || "Failed to fetch departments.";
      setError(message);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSave = async (data) => {
    setSubmitting(true);

    try {
      if (editData?._id) {
        await axios.put(`${API_BASE_URL}/api/admin/dept/edit/${editData._id}`, data, { headers: authHeaders });
        toast.success("Department updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/dept/create`, data, { headers: authHeaders });
        toast.success("Department created successfully.");
      }

      setShowForm(false);
      setEditData(null);
      await fetchDepartments();
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || "Failed to save department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (dept) => {
    setTogglingId(dept._id);

    try {
      await axios.patch(`${API_BASE_URL}/api/admin/dept/toggle-status/${dept._id}`, {}, { headers: authHeaders });
      toast.success(`Department ${dept.activeStatus ? "deactivated" : "activated"} successfully.`);
      await fetchDepartments();
    } catch (toggleError) {
      toast.error(toggleError?.response?.data?.message || "Failed to toggle department status.");
    } finally {
      setTogglingId("");
    }
  };

  const handleDelete = async (dept) => {
    if (!dept.activeStatus) {
      toast("Department already inactive.");
      return;
    }

    await handleToggle(dept);
    toast.success("Department removed successfully.");
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => dept.deptName?.toLowerCase().includes(search.toLowerCase()));
  }, [departments, search]);

  return (
    <div className="min-h-full bg-slate-100/70 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Department Management</h1>
              <p className="text-sm text-slate-500">Maintain department structure and availability status.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search department"
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </section>

        <DeptTable
          departments={filteredDepartments}
          loading={loading}
          error={error}
          onEdit={(dept) => {
            setEditData(dept);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onToggle={handleToggle}
          togglingId={togglingId}
        />
      </div>

      <DeptFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
        submitting={submitting}
      />
    </div>
  );
};

export default DeptMgmt;
