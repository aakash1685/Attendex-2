import React, { useEffect, useState } from "react";

const defaultForm = {
  desigName: "",
  dept: "",
};

const DesignationFormModal = ({ isOpen, onClose, onSave, departments, editData, submitting }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!editData) {
      setForm(defaultForm);
      return;
    }

    setForm({
      desigName: editData.desigName || "",
      dept: editData.deptId || "",
    });
  }, [editData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800">{editData ? "Edit Designation" : "Add Designation"}</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
          className="mt-4 space-y-4"
        >
          <input
            value={form.desigName}
            onChange={(event) => setForm((current) => ({ ...current, desigName: event.target.value }))}
            placeholder="Designation Name"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <select
            value={form.dept}
            onChange={(event) => setForm((current) => ({ ...current, dept: event.target.value }))}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Select Department</option>
            {departments.map((item) => (
              <option key={item._id} value={item._id}>{item.deptName}</option>
            ))}
          </select>

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

export default DesignationFormModal;
