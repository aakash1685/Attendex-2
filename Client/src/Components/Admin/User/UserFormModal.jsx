import React, { useEffect, useMemo, useState } from "react";

const LEAVE_TYPES = ["CL", "SL", "PL", "LOP"];

const initialState = {
  name: "",
  email: "",
  mobileNo: "",
  gender: "MALE",
  address: "",
  profilePic: "",
  profilePicFile: null,
  dept: "",
  designation: "",
  bank: {
    accNo: "",
    ifsc: "",
  },
  salary: "",
  activeStatus: true,
  isFirstLogin: true,
  resetPasswordToken: "",
  resetPasswordExpire: "",
  leaves: {
    CL: { total: 10, used: 0, remaining: 10 },
    SL: { total: 8, used: 0, remaining: 8 },
    PL: { total: 15, used: 0, remaining: 15 },
    LOP: { total: 0, used: 0, remaining: 0 },
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserFormModal = ({ isOpen, onClose, onSave, departments, designations, editUser, submitting }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editUser) {
      setFormData(initialState);
      setErrors({});
      return;
    }

    const leaves = editUser.leaves || {};

    setFormData({
      name: editUser.name || "",
      email: editUser.email || "",
      mobileNo: String(editUser.mobileNo || ""),
      gender: editUser.gender || "MALE",
      address: editUser.address || "",
      profilePic: editUser.profilePic || "",
      profilePicFile: null,
      dept: editUser.deptId || "",
      designation: editUser.designationId || "",
      bank: {
        accNo: editUser.bank?.accNo || "",
        ifsc: editUser.bank?.ifsc || "",
      },
      salary: editUser.salary ?? "",
      activeStatus: Boolean(editUser.activeStatus),
      isFirstLogin: Boolean(editUser.isFirstLogin),
      resetPasswordToken: editUser.resetPasswordToken || "",
      resetPasswordExpire: editUser.resetPasswordExpire || "",
      leaves: {
        CL: {
          total: leaves.CL?.total ?? 10,
          used: leaves.CL?.used ?? 0,
          remaining: leaves.CL?.remaining ?? Math.max((leaves.CL?.total ?? 10) - (leaves.CL?.used ?? 0), 0),
        },
        SL: {
          total: leaves.SL?.total ?? 8,
          used: leaves.SL?.used ?? 0,
          remaining: leaves.SL?.remaining ?? Math.max((leaves.SL?.total ?? 8) - (leaves.SL?.used ?? 0), 0),
        },
        PL: {
          total: leaves.PL?.total ?? 15,
          used: leaves.PL?.used ?? 0,
          remaining: leaves.PL?.remaining ?? Math.max((leaves.PL?.total ?? 15) - (leaves.PL?.used ?? 0), 0),
        },
        LOP: {
          total: leaves.LOP?.total ?? 0,
          used: leaves.LOP?.used ?? 0,
          remaining: leaves.LOP?.remaining ?? Math.max((leaves.LOP?.total ?? 0) - (leaves.LOP?.used ?? 0), 0),
        },
      },
    });
    setErrors({});
  }, [editUser]);

  const designationOptions = useMemo(() => {
    if (!formData.dept) return designations;
    return designations.filter((item) => {
      const deptId = typeof item.dept === "object" ? item.dept?._id : item.dept;
      return deptId === formData.dept;
    });
  }, [designations, formData.dept]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = "Enter a valid email";
    }

    const mobile = formData.mobileNo.replace(/\D/g, "");
    if (!mobile) {
      nextErrors.mobileNo = "Mobile number is required";
    } else if (mobile.length !== 10) {
      nextErrors.mobileNo = "Mobile number must be 10 digits";
    }

    if (!formData.dept) nextErrors.dept = "Department is required";
    if (!formData.designation) nextErrors.designation = "Designation is required";
    if (!formData.bank.accNo.trim()) nextErrors.accNo = "Account number is required";

    if (formData.salary !== "" && Number(formData.salary) < 0) {
      nextErrors.salary = "Salary cannot be negative";
    }

    LEAVE_TYPES.forEach((leaveType) => {
      const leaveData = formData.leaves[leaveType];
      ["total", "used", "remaining"].forEach((key) => {
        if (Number(leaveData[key]) < 0) {
          nextErrors[`${leaveType}.${key}`] = "Cannot be negative";
        }
      });
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{editUser ? "Edit Employee" : "Create Employee"}</h2>
            <p className="text-xs text-slate-500">All user model fields available in one professional setup.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Personal Info</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Full Name"
                  className={inputClass}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className={inputClass}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(event) => setFormData((prev) => ({ ...prev, mobileNo: event.target.value }))}
                  placeholder="Mobile Number"
                  className={inputClass}
                />
                {errors.mobileNo && <p className="mt-1 text-xs text-rose-600">{errors.mobileNo}</p>}
              </div>

              <div>
                <select
                  value={formData.gender}
                  onChange={(event) => setFormData((prev) => ({ ...prev, gender: event.target.value }))}
                  className={inputClass}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <input
                  value={formData.address}
                  onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="Address"
                  className={inputClass}
                />
              </div>

              <div>
                <input
                  value={formData.profilePic}
                  onChange={(event) => setFormData((prev) => ({ ...prev, profilePic: event.target.value }))}
                  placeholder="Profile Picture URL"
                  className={inputClass}
                />
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      profilePicFile: event.target.files?.[0] || null,
                    }))
                  }
                  className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-blue-700`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Organization</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <select
                  value={formData.dept}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, dept: event.target.value, designation: "" }))
                  }
                  className={inputClass}
                >
                  <option value="">Select Department</option>
                  {departments.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.deptName}
                    </option>
                  ))}
                </select>
                {errors.dept && <p className="mt-1 text-xs text-rose-600">{errors.dept}</p>}
              </div>

              <div>
                <select
                  value={formData.designation}
                  onChange={(event) => setFormData((prev) => ({ ...prev, designation: event.target.value }))}
                  className={inputClass}
                >
                  <option value="">Select Designation</option>
                  {designationOptions.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.desigName}
                    </option>
                  ))}
                </select>
                {errors.designation && <p className="mt-1 text-xs text-rose-600">{errors.designation}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Leaves</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {LEAVE_TYPES.map((leaveType) => (
                <div key={leaveType} className="rounded-xl border border-slate-200 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-600">{leaveType}</p>
                  <div className="space-y-2">
                    {[
                      { key: "total", label: "Total" },
                      { key: "used", label: "Used" },
                      { key: "remaining", label: "Remaining" },
                    ].map((item) => (
                      <div key={item.key}>
                        <label className="mb-1 block text-[11px] text-slate-500">{item.label}</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.leaves[leaveType][item.key]}
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              leaves: {
                                ...prev.leaves,
                                [leaveType]: {
                                  ...prev.leaves[leaveType],
                                  [item.key]: Number(event.target.value),
                                },
                              },
                            }))
                          }
                          className={inputClass}
                        />
                        {errors[`${leaveType}.${item.key}`] && (
                          <p className="mt-1 text-xs text-rose-600">{errors[`${leaveType}.${item.key}`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Bank & Account</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <input
                  value={formData.bank.accNo}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, bank: { ...prev.bank, accNo: event.target.value } }))
                  }
                  placeholder="Account Number"
                  className={inputClass}
                />
                {errors.accNo && <p className="mt-1 text-xs text-rose-600">{errors.accNo}</p>}
              </div>
              <input
                value={formData.bank.ifsc}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, bank: { ...prev.bank, ifsc: event.target.value } }))
                }
                placeholder="IFSC"
                className={inputClass}
              />
              <div>
                <input
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={(event) => setFormData((prev) => ({ ...prev, salary: event.target.value }))}
                  placeholder="Salary"
                  className={inputClass}
                />
                {errors.salary && <p className="mt-1 text-xs text-rose-600">{errors.salary}</p>}
              </div>
              <input
                value={formData.resetPasswordToken}
                onChange={(event) => setFormData((prev) => ({ ...prev, resetPasswordToken: event.target.value }))}
                placeholder="Reset Password Token (optional)"
                className={inputClass}
              />
              <div className="md:col-span-2">
                <input
                  value={formData.resetPasswordExpire}
                  onChange={(event) => setFormData((prev) => ({ ...prev, resetPasswordExpire: event.target.value }))}
                  placeholder="Reset Password Expire (optional)"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Flags</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                Active Status
                <input
                  type="checkbox"
                  checked={formData.activeStatus}
                  onChange={(event) => setFormData((prev) => ({ ...prev, activeStatus: event.target.checked }))}
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                Is First Login
                <input
                  type="checkbox"
                  checked={formData.isFirstLogin}
                  onChange={(event) => setFormData((prev) => ({ ...prev, isFirstLogin: event.target.checked }))}
                />
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : editUser ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
