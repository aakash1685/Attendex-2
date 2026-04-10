import React from "react";
import { Pencil, Trash2, RefreshCw } from "lucide-react";

const UserActions = ({ user, onEdit, onDelete, onToggleStatus, toggling }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(user)}
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
        title="Edit"
      >
        <Pencil size={14} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(user)}
        className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>

      <button
        type="button"
        onClick={() => onToggleStatus(user)}
        disabled={toggling}
        className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
        title="Toggle status"
      >
        <RefreshCw size={14} className={toggling ? "animate-spin" : ""} />
      </button>
    </div>
  );
};

export default UserActions;
