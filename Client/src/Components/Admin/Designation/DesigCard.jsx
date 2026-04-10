import React from "react";
import { Briefcase, Edit, Power } from "lucide-react";

const DesigCard = ({ data, deptName, onEdit, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4 
    hover:shadow-md hover:border-gray-300 hover:scale-[1.02] 
    transition-all duration-200 ease-in-out">

      {/* Top Section */}
      <div className="flex items-start justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Briefcase size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
              {data.desigName}
            </h3>
            <p className="text-xs text-gray-400">{deptName}</p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            data.active
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {data.active ? "Active" : "Inactive"}
        </span>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Actions */}
      <div className="flex justify-between items-center">

        {/* Toggle */}
        <button
          onClick={() => onToggle(data._id)}
          className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition"
        >
          <Power size={14} />
          {data.active ? "Deactivate" : "Activate"}
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(data)}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
        >
          <Edit size={14} />
          Update
        </button>

      </div>
    </div>
  );
};

export default DesigCard;