import React, { useEffect, useState } from "react";

const DeptFormModal = ({ isOpen, onClose, onSave, editData, submitting }) => {
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    setDeptName(editData?.deptName || "");
  }, [editData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800">{editData ? "Edit Department" : "Add Department"}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave({ deptName: deptName.trim() });
          }}
          className="mt-4 space-y-4"
        >
          <input
            value={deptName}
            onChange={(event) => setDeptName(event.target.value)}
            placeholder="Department Name"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeptFormModal;
