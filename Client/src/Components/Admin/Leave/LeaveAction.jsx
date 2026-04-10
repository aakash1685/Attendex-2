import React from "react";
import axios from "axios";
import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";

const LeaveActions = ({ leave, refresh }) => {

  const approve = async () => {
    await axios.patch(`/api/admin/leaves/approve/${leave._id}`);
    refresh();
  };

  const reject = async () => {
    await axios.patch(`/api/admin/leaves/reject/${leave._id}`);
    refresh();
  };

  const remove = async () => {
    await axios.delete(`/api/admin/leaves/delete/${leave._id}`);
    refresh();
  };

  return (
    <div className="flex justify-center items-center gap-2">

      {/* ✅ ACCEPT */}
      {leave.leaveStatus === "PENDING" && (
        <button
          onClick={approve}
          title="Accept"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition shadow-sm hover:scale-105 active:scale-95"
        >
          <FiCheck size={14} />
          <span className="text-xs font-medium">Accept</span>
        </button>
      )}

      {/* ❌ REJECT */}
      {leave.leaveStatus === "PENDING" && (
        <button
          onClick={reject}
          title="Reject"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition shadow-sm hover:scale-105 active:scale-95"
        >
          <FiX size={14} />
          <span className="text-xs font-medium">Reject</span>
        </button>
      )}

      {/* 🗑 DELETE */}
      <button
        onClick={remove}
        title="Delete"
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition shadow-sm hover:scale-105 active:scale-95"
      >
        <FiTrash2 size={14} />
        <span className="text-xs font-medium">Delete</span>
      </button>

    </div>
  );
};

export default LeaveActions;