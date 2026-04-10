// DesignationMgmt.jsx
import React, { useState, useEffect } from "react";
import DesignToolbar from "../../Components/Admin/Designation/DesignToolbar";
import AddDesignationForm from "../../Components/Admin/Designation/AddDesignationForm";
import DesigCard from "../../Components/Admin/Designation/DesigCard";

const DesignationMgmt = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [open, setOpen] = useState(false);

  // Dummy fetch (replace with API)
  useEffect(() => {
    setDepartments([
      { _id: "1", deptName: "IT" },
      { _id: "2", deptName: "HR" },
    ]);

    setDesignations([{ _id: "1", desigName: "MERN Developer", dept: "1" }]);
  }, []);

  // Filtered Data
  const filteredData = designations.filter((d) => {
    return (
      d.desigName.toLowerCase().includes(search.toLowerCase()) &&
      (filterDept ? d.dept === filterDept : true)
    );
  });

  const handleSave = (data) => {
    setDesignations([...designations, { ...data, _id: Date.now() }]);
  };

const handleToggle = (id) => {
  setDesignations((prev) =>
    prev.map((d) =>
      d._id === id ? { ...d, active: !d.active } : d
    )
  );
};

const handleEdit = (data) => {
  setOpen(true);
  // later you can pass editData to form
};

  return (
    <div className="p-6">
      {/* Toolbar */}
      <DesignToolbar
        departments={departments}
        onSearch={setSearch}
        onFilter={setFilterDept}
        onAdd={() => setOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          filteredData.map((d) => {
            const deptName = departments.find(
              (dep) => dep._id === d.dept,
            )?.deptName;

            return (
              <DesigCard
                key={d._id}
                data={d}
                deptName={deptName}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            );
          })
        )}
      </div>

      {/* Modal Form */}
      <AddDesignationForm
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        departments={departments}
      />
    </div>
  );
};

export default DesignationMgmt;
