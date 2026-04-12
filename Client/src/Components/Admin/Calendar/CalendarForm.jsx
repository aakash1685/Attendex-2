import React, { useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, X } from "lucide-react";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const WEEK_DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const emptyMonths = () => MONTHS.map((month) => ({ month, holidays: [], workingDaysOverride: [] }));

const createInitialForm = (editData) => {
  if (editData) {
    return {
      deptId: editData.deptId,
      year: editData.year,
      weeklyOff: editData.weeklyOff || [],
      months: editData.months || emptyMonths(),
    };
  }

  return {
    deptId: "",
    year: new Date().getFullYear(),
    weeklyOff: ["SUNDAY"],
    months: emptyMonths(),
  };
};

const CalendarForm = ({ isOpen, onClose, onSave, departments, editData, submitting }) => {
  const [form, setForm] = useState(() => createInitialForm(editData));
  const [activeMonth, setActiveMonth] = useState(0);

  const monthRecord = useMemo(() => form.months[activeMonth] || emptyMonths()[activeMonth], [form.months, activeMonth]);

  if (!isOpen) return null;

  const toggleWeeklyOff = (day) => {
    setForm((prev) => {
      const hasDay = prev.weeklyOff.includes(day);
      return {
        ...prev,
        weeklyOff: hasDay ? prev.weeklyOff.filter((item) => item !== day) : [...prev.weeklyOff, day],
      };
    });
  };

  const pushMonthItem = (type) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.months[activeMonth][type].push(type === "holidays" ? { date: "", title: "" } : { date: "", reason: "" });
      return next;
    });
  };

  const updateMonthItem = (type, index, key, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.months[activeMonth][type][index][key] = value;
      return next;
    });
  };

  const removeMonthItem = (type, index) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.months[activeMonth][type].splice(index, 1);
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      year: Number(form.year),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{editData ? "Edit Calendar" : "Create Calendar"}</h3>
            <p className="text-xs text-slate-500">Create complete 12-month department calendar with holidays and overrides.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              value={form.deptId}
              onChange={(event) => setForm((prev) => ({ ...prev, deptId: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
              disabled={Boolean(editData)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="2000"
              max="2100"
              value={form.year}
              onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
              disabled={Boolean(editData)}
            />
            <div className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Months:</span> 12 required
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">Weekly Off Configuration</h4>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeeklyOff(day)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    form.weeklyOff.includes(day)
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CalendarDays size={16} /> Month Planner
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => setActiveMonth(index)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                    activeMonth === index
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-slate-700">Holidays</h5>
                  <button type="button" onClick={() => pushMonthItem("holidays")} className="inline-flex items-center gap-1 text-xs text-blue-600">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {monthRecord.holidays.map((holiday, index) => (
                  <div key={`${monthRecord.month}-holiday-${index}`} className="grid grid-cols-12 gap-2">
                    <input
                      type="date"
                      value={holiday.date ? new Date(holiday.date).toISOString().slice(0, 10) : ""}
                      onChange={(event) => updateMonthItem("holidays", index, "date", event.target.value)}
                      className="col-span-5 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    />
                    <input
                      value={holiday.title || ""}
                      onChange={(event) => updateMonthItem("holidays", index, "title", event.target.value)}
                      placeholder="Holiday title"
                      className="col-span-6 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeMonthItem("holidays", index)}
                      className="col-span-1 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {monthRecord.holidays.length === 0 ? <p className="text-xs text-slate-400">No holidays added.</p> : null}
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-slate-700">Working Days Override</h5>
                  <button
                    type="button"
                    onClick={() => pushMonthItem("workingDaysOverride")}
                    className="inline-flex items-center gap-1 text-xs text-blue-600"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {monthRecord.workingDaysOverride.map((override, index) => (
                  <div key={`${monthRecord.month}-override-${index}`} className="grid grid-cols-12 gap-2">
                    <input
                      type="date"
                      value={override.date ? new Date(override.date).toISOString().slice(0, 10) : ""}
                      onChange={(event) => updateMonthItem("workingDaysOverride", index, "date", event.target.value)}
                      className="col-span-5 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    />
                    <input
                      value={override.reason || ""}
                      onChange={(event) => updateMonthItem("workingDaysOverride", index, "reason", event.target.value)}
                      placeholder="Override reason"
                      className="col-span-6 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeMonthItem("workingDaysOverride", index)}
                      className="col-span-1 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {monthRecord.workingDaysOverride.length === 0 ? (
                  <p className="text-xs text-slate-400">No overrides added.</p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || form.weeklyOff.length === 0}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : editData ? "Update Calendar" : "Create Calendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarForm;
