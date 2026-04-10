import React from "react";
import { Pencil, Trash2, RefreshCw } from "lucide-react";

const DesignationActions = ({ designation, onEdit, onDelete, onToggle, toggling }) => (
  <div className="flex items-center gap-2">
    <button type="button" onClick={() => onEdit(designation)} className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100">
      <Pencil size={14} />
    </button>
    <button type="button" onClick={() => onDelete(designation)} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50">
      <Trash2 size={14} />
    </button>
    <button
      type="button"
      onClick={() => onToggle(designation)}
      disabled={toggling}
      className="rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
    >
      <RefreshCw size={14} className={toggling ? "animate-spin" : ""} />
    </button>
  </div>
);

export default DesignationActions;
