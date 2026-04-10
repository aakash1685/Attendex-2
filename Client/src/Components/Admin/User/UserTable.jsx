import React from "react";
import UserActions from "./UserActions";

const StatusBadge = ({ active }) => (
  <span
    className={`rounded-full px-2 py-1 text-xs font-medium ${
      active ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const UserTable = ({ users, loading, error, onEdit, onDeactivate, onToggleStatus, togglingId }) => {
  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading users...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>;
  }

  if (!users.length) {
    return <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">No Users Found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Designation</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-slate-100 transition hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{user.name || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.email || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.mobileNo || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.deptName || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.designationName || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.salary ?? 0}</td>
              <td className="px-4 py-3">
                <StatusBadge active={Boolean(user.activeStatus)} />
              </td>
              <td className="px-4 py-3">
                <UserActions
                  user={user}
                  onEdit={onEdit}
                  onDeactivate={onDeactivate}
                  onToggleStatus={onToggleStatus}
                  toggling={togglingId === user._id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
