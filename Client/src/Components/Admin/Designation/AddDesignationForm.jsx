import React, { useState, useEffect } from "react";

const AddDesignationForm = ({ isOpen, onClose, onSave, departments, editData }) => {
  const [form, setForm] = useState({
    desigName: "",
    dept: "",
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({ desigName: "", dept: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;
 return (
<div
  className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center"
  onClick={onClose}
>
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit" : "Add"} Designation
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Designation Name */}
          <input
            type="text"
            name="desigName"
            placeholder="Designation Name"
            value={form.desigName}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-xl"
          />

          {/* Department Dropdown */}
          <select
            name="dept"
            value={form.dept}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-xl"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.deptName}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDesignationForm;