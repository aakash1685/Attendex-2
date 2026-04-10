import React from "react";
import { Building2, Edit, Power } from "lucide-react";

const DeptCard = ({ dept, onToggle, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4 
    hover:shadow-md hover:border-gray-300 hover:scale-[1.02] 
    transition-all duration-200 ease-in-out">

      {/* Top Section */}
      <div className="flex items-start justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
              {dept.deptName}
            </h3>
            <p className="text-xs text-gray-400">Department</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            dept.activeStatus
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {dept.activeStatus ? "Active" : "Inactive"}
        </span>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Actions */}
      <div className="flex justify-between items-center">

        {/* Toggle */}
        <button
          onClick={() => onToggle(dept)}
          className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition"
        >
          <Power size={14} />
          {dept.activeStatus ? "Deactivate" : "Activate"}
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(dept)}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Edit size={14} />
          Update
        </button>

      </div>
    </div>
  );
};

export default DeptCard;