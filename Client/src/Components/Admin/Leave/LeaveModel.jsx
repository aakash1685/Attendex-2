import React from "react";
import { FiX, FiUser, FiCalendar, FiFileText } from "react-icons/fi";

const LeaveModal = ({ leave, onClose }) => {

  // 🔥 Close when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  const badge = {
    APPROVED: "bg-emerald-100 text-emerald-600",
    PENDING: "bg-amber-100 text-amber-600",
    REJECTED: "bg-rose-100 text-rose-600",
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      {/* 🔥 Modal Box */}
      <div
        className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 w-[420px] shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 🔥 Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
        >
          <FiX size={18} />
        </button>

        {/* 🔥 Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Leave Details
        </h2>

        {/* 🔥 Employee */}
        <div className="flex items-center gap-2 mb-2 text-gray-700">
          <FiUser />
          <span className="font-medium">{leave.empId?.name}</span>
        </div>

        {/* 🔥 Department */}
        <p className="text-sm text-gray-500 mb-2">
          Dept: {leave.deptId?.name}
        </p>

        {/* 🔥 Status Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs mb-3 ${badge[leave.leaveStatus]}`}
        >
          {leave.leaveStatus}
        </span>

        {/* 🔥 Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <p><b>Type:</b> {leave.leaveType}</p>
          <p><b>Days:</b> {leave.totalDays}</p>
        </div>

        {/* 🔥 Reason */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <FiFileText />
            Reason
          </div>
          <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
            {leave.reason}
          </p>
        </div>

        {/* 🔥 Dates */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <FiCalendar />
            Dates
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {leave.leaveDates.map((d, i) => (
              <span
                key={i}
                className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded"
              >
                {new Date(d).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>

        {/* 🔥 Footer Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default LeaveModal;