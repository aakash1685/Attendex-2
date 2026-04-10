import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const MONTHS = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC"
];

const WEEK_DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const CalendarForm = ({ isOpen, onClose, onSave, departments = [], editData }) => {
  const modalRef = useRef();
  const [activeMonth, setActiveMonth] = useState(0);

  const [form, setForm] = useState({
    deptId: "",
    year: new Date().getFullYear(),
    weeklyOff: [],
    months: MONTHS.map((m) => ({
      month: m,
      holidays: [],
      workingDaysOverride: []
    }))
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const updateMonth = (key, value) => {
    const updated = [...form.months];
    updated[activeMonth][key] = value;
    setForm({ ...form, months: updated });
  };

  const activeData = form.months[activeMonth];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

      <div
        ref={modalRef}
        className="w-[95%] max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden"
      >

        {/* 🔥 SIDEBAR */}
        <div className="w-56 bg-gradient-to-b from-[#FFF8EC] to-[#FDEFD3] border-r p-4">

          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Months
          </h3>

          {form.months.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveMonth(i)}
              className={`w-full flex justify-between items-center px-3 py-2 mb-2 rounded-xl text-sm font-medium transition-all duration-200
              ${
                activeMonth === i
                  ? "bg-white shadow-md text-black scale-[1.02]"
                  : "text-gray-600 hover:bg-white/70 hover:shadow-sm"
              }`}
            >
              {m.month}

              {m.holidays.length > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 rounded-full">
                  {m.holidays.length}
                </span>
              )}
            </button>
          ))}

        </div>

        {/* 🔥 MAIN */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
            <h2 className="text-xl font-semibold tracking-tight">
              {form.months[activeMonth].month} Calendar Setup
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <X />
            </button>
          </div>

          {/* SETTINGS */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b">

            <select
              value={form.deptId}
              onChange={(e) => setForm({ ...form, deptId: e.target.value })}
              className="p-2 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.deptName}</option>
              ))}
            </select>

            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="p-2 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"
            />

            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    const exists = form.weeklyOff.includes(d);
                    const updated = exists
                      ? form.weeklyOff.filter((x) => x !== d)
                      : [...form.weeklyOff, d];
                    setForm({ ...form, weeklyOff: updated });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                  ${
                    form.weeklyOff.includes(d)
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* HOLIDAYS */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold text-red-600">
                  Holidays
                </h3>
                <button
                  onClick={() => updateMonth("holidays", [...activeData.holidays, { date: "", title: "" }])}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                  <Plus size={14}/> Add
                </button>
              </div>

              {activeData.holidays.map((h, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="date"
                    value={h.date}
                    onChange={(e) => {
                      const updated = [...activeData.holidays];
                      updated[idx].date = e.target.value;
                      updateMonth("holidays", updated);
                    }}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <input placeholder="Holiday name"
                    value={h.title}
                    onChange={(e) => {
                      const updated = [...activeData.holidays];
                      updated[idx].title = e.target.value;
                      updateMonth("holidays", updated);
                    }}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <button
                    onClick={() => {
                      const updated = activeData.holidays.filter((_, i) => i !== idx);
                      updateMonth("holidays", updated);
                    }}
                    className="p-2 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={16} className="text-red-500"/>
                  </button>
                </div>
              ))}
            </div>

            {/* OVERRIDES */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-600">
                  Working Overrides
                </h3>
                <button
                  onClick={() => updateMonth("workingDaysOverride", [...activeData.workingDaysOverride, { date: "", reason: "" }])}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  <Plus size={14}/> Add
                </button>
              </div>

              {activeData.workingDaysOverride.map((o, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="date"
                    value={o.date}
                    onChange={(e) => {
                      const updated = [...activeData.workingDaysOverride];
                      updated[idx].date = e.target.value;
                      updateMonth("workingDaysOverride", updated);
                    }}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <input placeholder="Reason"
                    value={o.reason}
                    onChange={(e) => {
                      const updated = [...activeData.workingDaysOverride];
                      updated[idx].reason = e.target.value;
                      updateMonth("workingDaysOverride", updated);
                    }}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <button
                    onClick={() => {
                      const updated = activeData.workingDaysOverride.filter((_, i) => i !== idx);
                      updateMonth("workingDaysOverride", updated);
                    }}
                    className="p-2 rounded-lg hover:bg-green-100"
                  >
                    <Trash2 size={16} className="text-green-600"/>
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Save Calendar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CalendarForm;