import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import DeptToolbar from "../../Components/Admin/Department/DeptToolbar";
import AddDeptForm from "../../Components/Admin/Department/AddDeptForm";
import DeptCard from "../../Components/Admin/Department/DeptCard";

const DeptMgmt = () => {
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [sort, setSort] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSave = async (data) => {
    try {
      const token = localStorage.getItem("token");

      if (editData) {
        // 🔥 UPDATE API
        await axios.patch(
          `http://localhost:5000/api/admin/dept/edit/${editData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Department Updated ✅");
      } else {
        // 🔥 CREATE API
        await axios.post("http://localhost:5000/api/admin/dept/create", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Department Added ✅");
      }

      fetchDepartments(); // refresh list
      setShowForm(false);
      setEditData(null);
    } catch (error) {
      console.log("SAVE ERROR 👉", error);

      toast.error(error?.response?.data?.message || "Something went wrong ❌");
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/dept/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API 👉", res.data);

      setDepartments(res.data?.result?.data || []);
    } catch (error) {
      console.log("FETCH ERROR 👉", error);
      toast.error("Failed to load departments ❌");
    }
  };

 const handleToggle = async (dept) => {
  try {
    const token = localStorage.getItem("token");

    // ✅ Optimistic UI update (instant change)
    setDepartments((prev) =>
      prev.map((d) =>
        d._id === dept._id
          ? { ...d, activeStatus: !d.activeStatus }
          : d
      )
    );

    // API call
    await axios.patch(
      `http://localhost:5000/api/admin/dept/toggle-status/${dept._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Status Updated ");

  } catch (error) {
    toast.error("Toggle failed ❌");

    // ❗ rollback if failed
    fetchDepartments();
  }
};

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Toast */}
      <Toaster position="top-right" />

      {/* Toolbar */}
      <DeptToolbar
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        onAdd={() => {
          setEditData(null);
          setShowForm(true);
        }}
      />

      {/* Form */}
      <AddDeptForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
      />

      {/* Department Cards */}
    <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {Array.isArray(departments) && departments.length > 0 ? (
    departments.map((dept) => (
      <DeptCard
        key={dept._id}
        dept={dept}
        onToggle={handleToggle}
        onEdit={(d) => {
          setEditData(d);
          setShowForm(true);
        }}
      />
    ))
  ) : (
    <p className="col-span-full text-gray-500 text-center mt-10">
      No departments found
    </p>
  )}
</div>
    </div>
  );
};

export default DeptMgmt;
