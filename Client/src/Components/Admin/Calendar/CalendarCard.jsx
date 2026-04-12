import React, { useMemo, useState } from "react";
import { CalendarClock, ChevronDown, ChevronUp, Pencil, Sparkles, Trash2 } from "lucide-react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DAY_FULL = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getMonthGrid = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let pad = 0; pad < firstDay; pad += 1) {
    cells.push({ key: `pad-${monthIndex}-${pad}`, empty: true });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, monthIndex, day);
    const key = date.toISOString().split("T")[0];
    cells.push({ key, day, empty: false });
  }

  return cells;
};

const CalendarCard = ({ calendar, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const holidays = calendar.months.reduce((count, month) => count + (month.holidays?.length || 0), 0);
    const overrides = calendar.months.reduce((count, month) => count + (month.workingDaysOverride?.length || 0), 0);
    return { holidays, overrides };
  }, [calendar.months]);

  const monthModels = useMemo(() => {
    const weeklyOffSet = new Set((calendar.weeklyOff || []).map((day) => String(day).trim().toUpperCase()));

    return calendar.months.map((month, monthIndex) => {
      const holidayMap = new Map(
        (month.holidays || []).map((holiday) => [
          new Date(holiday.date).toISOString().split("T")[0],
          holiday.title || "Holiday",
        ]),
      );

      const overrideMap = new Map(
        (month.workingDaysOverride || []).map((override) => [
          new Date(override.date).toISOString().split("T")[0],
          override.reason || "Working Override",
        ]),
      );

      const cells = getMonthGrid(calendar.year, monthIndex).map((cell) => {
        if (cell.empty) return cell;

        const holidayTitle = holidayMap.get(cell.key);
        const overrideReason = overrideMap.get(cell.key);
        const dayName = WEEK_DAY_FULL[new Date(cell.key).getDay()];
        const isWeeklyOff = weeklyOffSet.has(dayName);
        const stateClass =
          holidayTitle && overrideReason
            ? "ring-2 ring-violet-200"
            : holidayTitle
              ? "bg-rose-50"
              : overrideReason
                ? "bg-emerald-50"
                : isWeeklyOff
                  ? "bg-slate-100"
                  : "";

        return {
          ...cell,
          holidayTitle,
          overrideReason,
          isWeeklyOff,
          stateClass,
          tooltip: [
            holidayTitle ? `Holiday: ${holidayTitle}` : null,
            overrideReason ? `Override: ${overrideReason}` : null,
            isWeeklyOff ? "Weekly Off" : null,
          ]
            .filter(Boolean)
            .join(" | "),
        };
      });

      return {
        ...month,
        cells,
      };
    });
  }, [calendar.months, calendar.weeklyOff, calendar.year]);

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
          <p className="text-sm font-semibold text-rose-700">{stats.holidays}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Overrides</p>
          <p className="text-sm font-semibold text-emerald-700">{stats.overrides}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-rose-700">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> Holiday
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Working Override
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-violet-700">
          <Sparkles size={12} /> Both on same day
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-slate-700">
          <span className="h-2 w-2 rounded-full bg-slate-500" /> Weekly Off
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
      >
        <CalendarClock size={16} />
        {expanded ? "Hide Full Year Calendar" : "View Full Year Calendar"}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded ? (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {monthModels.map((month) => (
            <div key={`${calendar._id}-${month.month}`} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-sm font-semibold text-slate-800">{month.month}</h4>
                <div className="text-right text-[11px] text-slate-500">
                  <p>Holidays: {month.holidays?.length || 0}</p>
                  <p>Overrides: {month.workingDaysOverride?.length || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {WEEK_DAYS.map((day) => (
                  <div key={`${month.month}-${day}`} className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {day}
                  </div>
                ))}

                {month.cells.map((cell) => {
                  if (cell.empty) {
                    return <div key={cell.key} className="h-12 rounded-lg border border-transparent" />;
                  }

                  return (
                    <div
                      key={cell.key}
                      title={cell.tooltip || formatDate(cell.key)}
                      className={`h-12 rounded-lg border border-slate-100 px-1.5 py-1 text-[11px] text-slate-700 ${cell.stateClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{cell.day}</span>
                        <div className="flex items-center gap-1">
                          {cell.holidayTitle ? <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}
                          {cell.overrideReason ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> : null}
                          {cell.isWeeklyOff ? <span className="h-1.5 w-1.5 rounded-full bg-slate-500" /> : null}
                        </div>
                      </div>
                      {cell.holidayTitle ? <p className="truncate text-[10px] text-rose-700">{cell.holidayTitle}</p> : null}
                      {!cell.holidayTitle && cell.overrideReason ? (
                        <p className="truncate text-[10px] text-emerald-700">{cell.overrideReason}</p>
                      ) : null}
                      {!cell.holidayTitle && !cell.overrideReason && cell.isWeeklyOff ? (
                        <p className="truncate text-[10px] text-slate-600">Weekly Off</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default CalendarCard;
