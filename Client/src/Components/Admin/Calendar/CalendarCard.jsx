import React, { useMemo, useState } from "react";
import { CalendarClock, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const CalendarCard = ({ calendar, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const holidays = calendar.months.reduce((count, month) => count + (month.holidays?.length || 0), 0);
    const overrides = calendar.months.reduce((count, month) => count + (month.workingDaysOverride?.length || 0), 0);
    return { holidays, overrides };
  }, [calendar.months]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-600">{calendar.deptName}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">Calendar {calendar.year}</h3>
          <p className="mt-1 text-sm text-slate-500">Weekly off: {calendar.weeklyOff.join(", ") || "Not configured"}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            title="Edit calendar"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            title="Delete calendar"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-center">
        <div>
          <p className="text-xs text-slate-500">Months</p>
          <p className="text-sm font-semibold text-slate-900">12</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Holidays</p>
          <p className="text-sm font-semibold text-slate-900">{stats.holidays}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Overrides</p>
          <p className="text-sm font-semibold text-slate-900">{stats.overrides}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
      >
        <CalendarClock size={16} />
        {expanded ? "Hide Monthly Details" : "View Monthly Details"}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {calendar.months.map((month) => (
            <div key={`${calendar._id}-${month.month}`} className="rounded-xl border border-slate-200 p-3">
              <h4 className="text-sm font-semibold text-slate-800">{month.month}</h4>
              <p className="mt-1 text-xs text-slate-500">Holidays: {month.holidays?.length || 0}</p>
              <p className="text-xs text-slate-500">Overrides: {month.workingDaysOverride?.length || 0}</p>

              {month.holidays?.slice(0, 2).map((holiday, index) => (
                <p key={`${month.month}-holiday-${index}`} className="mt-2 truncate text-xs text-slate-700" title={holiday.title}>
                  • {formatDate(holiday.date)} — {holiday.title || "Untitled"}
                </p>
              ))}

              {month.workingDaysOverride?.slice(0, 2).map((override, index) => (
                <p key={`${month.month}-override-${index}`} className="mt-1 truncate text-xs text-emerald-700" title={override.reason}>
                  • {formatDate(override.date)} — {override.reason || "Working override"}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default CalendarCard;
