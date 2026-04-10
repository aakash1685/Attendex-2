import React from "react";
import DeptActions from "./DeptActions";

const DeptTable = ({ departments, loading, error, onEdit, onDelete, onToggle, togglingId }) => {
  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading departments...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>;
  }

  if (!departments.length) {
    return <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">No Data Found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Department Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Total Employees</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept._id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{dept.deptName || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{dept.description || "-"}</td>
              <td className="px-4 py-3 text-slate-600">{dept.totalEmployees ?? "-"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${dept.activeStatus ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {dept.activeStatus ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <DeptActions
                  dept={dept}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggle}
                  toggling={togglingId === dept._id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeptTable;
