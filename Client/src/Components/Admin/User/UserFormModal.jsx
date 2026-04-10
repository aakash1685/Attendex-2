import React, { useEffect, useMemo, useState } from "react";

const initialState = {
  name: "",
  email: "",
  mobileNo: "",
  address: "",
  dept: "",
  designation: "",
  gender: "MALE",
  salary: "",
  accNo: "",
  ifsc: "",
  CL: 10,
  SL: 8,
  PL: 15,
  LOP: 0,
  activeStatus: true,
};

const UserFormModal = ({ isOpen, onClose, onSave, departments, designations, editUser, submitting }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!editUser) {
      setForm(initialState);
      return;
    }

    setForm({
      name: editUser.name || "",
      email: editUser.email || "",
      mobileNo: editUser.mobileNo || "",
      address: editUser.address || "",
      dept: editUser.deptId || "",
      designation: editUser.designationId || "",
      gender: editUser.gender || "MALE",
      salary: editUser.salary || "",
      accNo: editUser.bank?.accNo || "",
      ifsc: editUser.bank?.ifsc || "",
      CL: editUser.leaves?.CL?.total ?? 10,
      SL: editUser.leaves?.SL?.total ?? 8,
      PL: editUser.leaves?.PL?.total ?? 15,
      LOP: editUser.leaves?.LOP?.total ?? 0,
      activeStatus: Boolean(editUser.activeStatus),
    });
  }, [editUser]);

  const designationOptions = useMemo(() => {
    if (!form.dept) return designations;
    return designations.filter((item) => item.dept === form.dept);
  }, [designations, form.dept]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{editUser ? "Edit User" : "Add User"}</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["mobileNo", "Mobile"],
            ["address", "Address"],
            ["salary", "Salary"],
            ["accNo", "Account Number"],
            ["ifsc", "IFSC"],
          ].map(([key, label]) => (
            <input
              key={key}
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              placeholder={label}
              required={["name", "email", "mobileNo", "accNo"].includes(key)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <select
            value={form.dept}
            onChange={(event) => setForm((current) => ({ ...current, dept: event.target.value, designation: "" }))}
            required
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((item) => (
              <option key={item._id} value={item._id}>{item.deptName}</option>
            ))}
          </select>

          <select
            value={form.designation}
            onChange={(event) => setForm((current) => ({ ...current, designation: event.target.value }))}
            required
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Designation</option>
            {designationOptions.map((item) => (
              <option key={item._id} value={item._id}>{item.desigName}</option>
            ))}
          </select>

          <select
            value={form.gender}
            onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.activeStatus}
              onChange={(event) => setForm((current) => ({ ...current, activeStatus: event.target.checked }))}
            />
            Active Status
          </label>

          <div className="md:col-span-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            {["CL", "SL", "PL", "LOP"].map((leaveType) => (
              <input
                key={leaveType}
                type="number"
                min="0"
                value={form[leaveType]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [leaveType]: Number(event.target.value || 0) }))
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder={`${leaveType} total`}
              />
            ))}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
