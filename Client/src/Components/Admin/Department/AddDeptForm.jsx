import React, { useState, useEffect } from "react";

const AddDeptForm = ({ isOpen, onClose, onSave, editData }) => {
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    if (editData) {
      setDeptName(editData.deptName);
    } else {
      setDeptName("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deptName.trim()) return;

    onSave({
      deptName: deptName,
    });

    setDeptName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* Modal */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {editData ? "Update Department" : "Add Department"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Department Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Department Name
            </label>
            <input
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              placeholder="Enter department name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
            >
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeptForm;