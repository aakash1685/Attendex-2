import React, { useState } from "react";
import { Eye, EyeOff, Mail, Phone, MapPin, Building2, Briefcase, Wallet, Lock, User, Power, Pencil } from "lucide-react";

const LabelValue = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 px-3 py-2">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 break-all text-sm text-slate-800">{value || "-"}</p>
  </div>
);

const LeaveCard = ({ leaveType, leave = {} }) => {
  const total = Number(leave.total || 0);
  const used = Number(leave.used || 0);
  const remaining = Number(leave.remaining || 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold text-slate-700">{leaveType}</p>
      <div className="mt-2 space-y-1 text-xs text-slate-600">
        <p>Total: {total}</p>
        <p>Used: {used}</p>
        <p>Remaining: {remaining}</p>
      </div>
    </div>
  );
};

const UserCard = ({ user, onEdit, onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const passwordToShow = user.generatedPassword || "Not available after creation";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "https://i.pravatar.cc/120?img=12"}
            alt={user.name}
            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
          />
          <div>
            <h3 className="text-base font-semibold text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500">{user.designationName || "-"} • {user.deptName || "-"}</p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                user.activeStatus ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
              }`}
            >
              {user.activeStatus ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            title="Edit user"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onToggle(user)}
            className="rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
            title="Toggle active status"
          >
            <Power size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        <div className="flex items-center gap-2 text-slate-700"><Mail size={14} /> {user.email || "-"}</div>
        <div className="flex items-center gap-2 text-slate-700"><Phone size={14} /> {user.mobileNo || "-"}</div>
        <div className="flex items-center gap-2 text-slate-700 md:col-span-2"><MapPin size={14} /> {user.address || "-"}</div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
        <span className="flex items-center gap-2 text-slate-700">
          <Lock size={14} /> {showPassword ? passwordToShow : "••••••••"}
        </span>
        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-500 hover:text-slate-800">
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        {expanded ? "Hide full details" : "View full details"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <LabelValue label="Gender" value={user.gender} />
            <LabelValue label="Salary" value={`₹ ${user.salary ?? 0}`} />
            <LabelValue label="Department" value={user.deptName} />
            <LabelValue label="Designation" value={user.designationName} />
            <LabelValue label="Bank Account" value={user.bank?.accNo} />
            <LabelValue label="IFSC" value={user.bank?.ifsc} />
            <LabelValue label="First Login" value={String(Boolean(user.isFirstLogin))} />
            <LabelValue label="Reset Token" value={user.resetPasswordToken} />
            <LabelValue label="Reset Expiry" value={user.resetPasswordExpire} />
            <LabelValue label="Created At" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"} />
            <LabelValue label="Updated At" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"} />
            <LabelValue label="User ID" value={user._id} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Leave Balance</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <LeaveCard leaveType="CL" leave={user.leaves?.CL} />
              <LeaveCard leaveType="SL" leave={user.leaves?.SL} />
              <LeaveCard leaveType="PL" leave={user.leaves?.PL} />
              <LeaveCard leaveType="LOP" leave={user.leaves?.LOP} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-3">
            <div className="flex items-center gap-2"><Building2 size={14} /> Dept Ref: {user.deptId || "-"}</div>
            <div className="flex items-center gap-2"><Briefcase size={14} /> Desig Ref: {user.designationId || "-"}</div>
            <div className="flex items-center gap-2"><Wallet size={14} /> Active: {String(Boolean(user.activeStatus))}</div>
            <div className="flex items-center gap-2 md:col-span-3"><User size={14} /> Profile: {user.profilePic || "No image"}</div>
          </div>
        </div>
      )}
    </article>
  );
};

export default UserCard;
