import React, { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LeaveActions = ({ leave, refresh }) => {
  const [busyAction, setBusyAction] = useState("");

  const axiosClient = useMemo(() => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  const updateLeave = async (actionType) => {
    setBusyAction(actionType);

    try {
      await axiosClient.patch(`/api/admin/leave/${actionType}/${leave._id}`);
      toast.success(`Leave ${actionType}d successfully.`);
      await refresh?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || `Unable to ${actionType} leave.`);
    } finally {
      setBusyAction("");
    }
  };

  const deleteLeave = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmed) return;

    setBusyAction("delete");

    try {
      await axiosClient.delete(`/api/admin/leave/delete/${leave._id}`);
      toast.success("Leave deleted successfully.");
      await refresh?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete leave.");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {leave.leaveStatus === "PENDING" ? (
        <button
          onClick={() => updateLeave("approve")}
          disabled={Boolean(busyAction)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyAction === "approve" ? "Approving..." : "Approve"}
        </button>
      ) : null}

      {leave.leaveStatus === "PENDING" ? (
        <button
          onClick={() => updateLeave("reject")}
          disabled={Boolean(busyAction)}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyAction === "reject" ? "Rejecting..." : "Reject"}
        </button>
      ) : null}

      <button
        onClick={deleteLeave}
        disabled={Boolean(busyAction)}
        className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busyAction === "delete" ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default LeaveActions;
