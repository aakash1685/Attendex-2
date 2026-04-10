import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import DesignationTable from "../../Components/Admin/Designation/DesignationTable";
import DesignationFormModal from "../../Components/Admin/Designation/DesignationFormModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DesignationMgmt = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const mapDesignations = useCallback((items, deptList) => {
    return items.map((item) => {
      const deptId = typeof item.dept === "object" ? item.dept?._id : item.dept;
      const deptName =
        (typeof item.dept === "object" ? item.dept?.deptName : null) ||
        deptList.find((dept) => dept._id === deptId)?.deptName ||
        "";

      return {
        ...item,
        deptId,
        deptName,
      };
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [deptRes, desigRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/dept/`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/api/admin/desig/`, { headers: authHeaders }),
      ]);

      const nextDepartments = Array.isArray(deptRes.data?.result?.data) ? deptRes.data.result.data : [];
      const allDesignations = Array.isArray(desigRes.data?.allDesig) ? desigRes.data.allDesig : [];

      setDepartments(nextDepartments);
      setDesignations(mapDesignations(allDesignations, nextDepartments));
    } catch (fetchError) {
      const message = fetchError?.response?.data?.message || "Failed to load designations.";
      setError(message);
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, mapDesignations]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (payload) => {
    setSubmitting(true);
    try {
      if (editData?._id) {
        await axios.put(`${API_BASE_URL}/api/admin/desig/update/${editData._id}`, payload, {
          headers: authHeaders,
        });
        toast.success("Designation updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/desig/create`, payload, { headers: authHeaders });
        toast.success("Designation created successfully.");
      }

      setEditData(null);
      setOpen(false);
      await fetchData();
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || "Failed to save designation.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDesignationStatus = async (designation, forceDeactivate = false) => {
    setTogglingId(designation._id);

    try {
      const activate = forceDeactivate ? false : !designation.activeStatus;
      const route = activate ? "activate" : "deactivate";

      await axios.patch(`${API_BASE_URL}/api/admin/desig/${route}/${designation._id}`, {}, { headers: authHeaders });
      toast.success(`Designation ${activate ? "activated" : "deactivated"} successfully.`);
      await fetchData();
    } catch (toggleError) {
      toast.error(toggleError?.response?.data?.message || "Failed to update designation status.");
    } finally {
      setTogglingId("");
    }
  };

  const filteredDesignations = useMemo(() => {
    return designations.filter((item) => {
      const matchesSearch = item.desigName?.toLowerCase().includes(search.toLowerCase());
      const matchesDept = filterDept ? item.deptId === filterDept : true;
      return matchesSearch && matchesDept;
    });
  }, [designations, search, filterDept]);

  return (
    <div className="min-h-full bg-slate-100/70 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Designation Management</h1>
              <p className="text-sm text-slate-500">Configure designation titles and department mapping.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search designation"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <select
              value={filterDept}
              onChange={(event) => setFilterDept(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.deptName}</option>
              ))}
            </select>
          </div>
        </section>

        <DesignationTable
          designations={filteredDesignations}
          loading={loading}
          error={error}
          onEdit={(designation) => {
            setEditData(designation);
            setOpen(true);
          }}
          onDelete={(designation) => toggleDesignationStatus(designation, true)}
          onToggle={toggleDesignationStatus}
          togglingId={togglingId}
        />
      </div>

      <DesignationFormModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
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

export default DesignationMgmt;
