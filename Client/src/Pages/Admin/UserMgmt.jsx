import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import UserFormModal from "../../Components/Admin/User/UserFormModal";
import UserTable from "../../Components/Admin/User/UserTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UserMgmt = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchReferenceData = useCallback(async () => {
    const [deptRes, desigRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/admin/dept/`, { headers: authHeaders }),
      axios.get(`${API_BASE_URL}/api/admin/desig/`, { headers: authHeaders }),
    ]);

    setDepartments(deptRes.data?.result?.data || []);
    setDesignations(desigRes.data?.allDesig || []);
  }, [authHeaders]);

  const mapUsers = useCallback(
    (items) => {
      return items.map((item) => {
        const deptId = typeof item.dept === "object" ? item.dept?._id : item.dept;
        const designationId =
          typeof item.designation === "object" ? item.designation?._id : item.designation;

        const deptName =
          (typeof item.dept === "object" ? item.dept?.deptName : null) ||
          departments.find((dept) => dept._id === deptId)?.deptName ||
          "";

        const designationName =
          (typeof item.designation === "object" ? item.designation?.desigName : null) ||
          designations.find((designation) => designation._id === designationId)?.desigName ||
          "";

        return {
          ...item,
          deptId,
          designationId,
          deptName,
          designationName,
        };
      });
    },
    [departments, designations],
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [activeRes, inactiveRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/user/`, { headers: authHeaders }),
        axios.get(`${API_BASE_URL}/api/admin/user/get-all-deactivate-users`, { headers: authHeaders }),
      ]);

      const activeUsers = Array.isArray(activeRes.data?.employees) ? activeRes.data.employees : [];
      const inactiveUsers = Array.isArray(inactiveRes.data?.employees) ? inactiveRes.data.employees : [];

      const merged = [...activeUsers, ...inactiveUsers].reduce((accumulator, user) => {
        if (!accumulator.some((item) => item._id === user._id)) {
          accumulator.push(user);
        }
        return accumulator;
      }, []);

      setUsers(mapUsers(merged));
    } catch (fetchError) {
      const message = fetchError?.response?.data?.message || "Failed to load users.";
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, mapUsers]);

  useEffect(() => {
    const loadPage = async () => {
      try {
        await fetchReferenceData();
        await fetchUsers();
      } catch (loadError) {
        toast.error(loadError?.response?.data?.message || "Failed to load user management data.");
      }
    };

    loadPage();
  }, [fetchReferenceData, fetchUsers]);

  const handleSave = async (formData) => {
    setSubmitting(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      mobileNo: formData.mobileNo,
      address: formData.address,
      dept: formData.dept,
      designation: formData.designation,
      gender: formData.gender,
      salary: Number(formData.salary || 0),
      bank: {
        accNo: formData.accNo,
        ifsc: formData.ifsc,
      },
      leaves: {
        CL: { total: Number(formData.CL || 0), used: 0, remaining: Number(formData.CL || 0) },
        SL: { total: Number(formData.SL || 0), used: 0, remaining: Number(formData.SL || 0) },
        PL: { total: Number(formData.PL || 0), used: 0, remaining: Number(formData.PL || 0) },
        LOP: { total: Number(formData.LOP || 0), used: 0, remaining: Number(formData.LOP || 0) },
      },
      activeStatus: formData.activeStatus,
    };

    try {
      if (editUser?._id) {
        await axios.put(`${API_BASE_URL}/api/admin/user/edit/${editUser._id}`, payload, {
          headers: authHeaders,
        });
        toast.success("User updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/user/create`, payload, {
          headers: authHeaders,
        });
        toast.success("User created successfully.");
      }

      setIsOpen(false);
      setEditUser(null);
      await fetchUsers();
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || "Failed to save user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    setTogglingId(user._id);
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/user/deactive-user/${user._id}`, {}, { headers: authHeaders });
      toast.success("User removed successfully.");
      await fetchUsers();
    } catch (deleteError) {
      toast.error(deleteError?.response?.data?.message || "Failed to delete user.");
    } finally {
      setTogglingId("");
    }
  };

  const handleToggleStatus = async (user) => {
    setTogglingId(user._id);

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/user/edit/${user._id}`,
        { activeStatus: !user.activeStatus },
        { headers: authHeaders },
      );

      toast.success(`User ${user.activeStatus ? "deactivated" : "activated"} successfully.`);
      await fetchUsers();
    } catch (toggleError) {
      toast.error(toggleError?.response?.data?.message || "Failed to toggle user status.");
    } finally {
      setTogglingId("");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch = [item.name, item.email, item.designationName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()));

      const matchesDept = filterDept ? item.deptId === filterDept : true;
      return matchesSearch && matchesDept;
    });
  }, [users, search, filterDept]);

  return (
    <div className="min-h-full bg-slate-100/70 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
              <p className="text-sm text-slate-500">Manage employee records, status and profile details.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditUser(null);
                setIsOpen(true);
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
                placeholder="Search users by name/email/designation"
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

        <UserTable
          users={filteredUsers}
          loading={loading}
          error={error}
          onEdit={(user) => {
            setEditUser(user);
            setIsOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          togglingId={togglingId}
        />
      </div>

      <UserFormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditUser(null);
        }}
        onSave={handleSave}
        departments={departments}
        designations={designations}
        editUser={editUser}
        submitting={submitting}
      />
    </div>
  );
};

export default UserMgmt;
