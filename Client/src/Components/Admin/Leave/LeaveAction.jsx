import React, { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiCheck, FiTrash2, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LeaveActions = ({ leave, refresh, onLeaveUpdate, onLeaveDelete }) => {
  const [busyAction, setBusyAction] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const approveLeave = async () => {
    const previousStatus = leave.leaveStatus;
    setBusyAction("approve");
    onLeaveUpdate?.(leave._id, { leaveStatus: "APPROVED" });

    try {
      await axios.patch(`${API_BASE_URL}/api/admin/leave/approve/${leave._id}`, null, {
        headers: authHeaders,
      });

      toast.success("Leave approved successfully ✅");
      await refresh?.();
    } catch (error) {
      onLeaveUpdate?.(leave._id, { leaveStatus: previousStatus });
      toast.error(error?.response?.data?.message || "Unable to approve leave.");
    } finally {
      setBusyAction("");
    }
  };

  const rejectLeave = async () => {
    const previousStatus = leave.leaveStatus;
    setBusyAction("reject");
    onLeaveUpdate?.(leave._id, { leaveStatus: "REJECTED" });

    try {
      await axios.patch(`${API_BASE_URL}/api/admin/leave/reject/${leave._id}`, null, {
        headers: authHeaders,
      });

      toast.success("Leave rejected successfully ❌");
      await refresh?.();
    } catch (error) {
      onLeaveUpdate?.(leave._id, { leaveStatus: previousStatus });
      toast.error(error?.response?.data?.message || "Unable to reject leave.");
    } finally {
      setBusyAction("");
    }
  };

  const deleteLeave = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmed) return;

    setBusyAction("delete");
    onLeaveDelete?.(leave._id);

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/leave/delete/${leave._id}`, {
        headers: authHeaders,
      });

      toast.success("Leave deleted successfully 🗑");
      await refresh?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete leave.");
      await refresh?.();
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {leave.leaveStatus === "PENDING" ? (
        <button
          onClick={approveLeave}
          title="Approve"
          disabled={Boolean(busyAction)}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiCheck size={13} />
          {busyAction === "approve" ? "Approving..." : "Approve"}
        </button>
      ) : null}

      {leave.leaveStatus === "PENDING" ? (
        <button
          onClick={rejectLeave}
          title="Reject"
          disabled={Boolean(busyAction)}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiX size={13} />
          {busyAction === "reject" ? "Rejecting..." : "Reject"}
        </button>
      ) : null}

      <button
        onClick={deleteLeave}
        title="Delete"
        disabled={Boolean(busyAction)}
        className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiTrash2 size={13} />
        {busyAction === "delete" ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default LeaveActions;
