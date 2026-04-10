import React from "react";
import { CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";

const CalendarCard = ({ data, onView, onEdit, onDelete }) => {

  const totalHolidays = data.months.reduce(
    (acc, m) => acc + m.holidays.length,
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">

      {/* 🔹 TOP */}
      <div className="flex justify-between items-start mb-4">

        <div>
          <h3 className="text-base font-semibold text-gray-800">
            {data.deptName}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <CalendarDays size={14} />
            {data.year}
          </div>
        </div>

        {/* HOLIDAY COUNT */}
        <div className="text-right">
          <p className="text-lg font-semibold text-red-500">
            {totalHolidays}
          </p>
          <p className="text-[11px] text-gray-400">
            Holidays
          </p>
        </div>

      </div>

      {/* 🔹 STATS ROW */}
      <div className="grid grid-cols-3 gap-3 mb-4">

        <div className="border rounded-lg p-2 text-center">
          <p className="text-sm font-semibold text-gray-800">
            {data.weeklyOff.length}
          </p>
          <p className="text-[11px] text-gray-400">
            Weekly Off
          </p>
        </div>

        <div className="border rounded-lg p-2 text-center">
          <p className="text-sm font-semibold text-blue-600">
            {data.months.filter(m => m.holidays.length > 0).length}
          </p>
          <p className="text-[11px] text-gray-400">
            Active Months
          </p>
        </div>

        <div className="border rounded-lg p-2 text-center">
          <p className="text-sm font-semibold text-green-600">
            {data.months.reduce((a, m) => a + m.workingDaysOverride.length, 0)}
          </p>
          <p className="text-[11px] text-gray-400">
            Overrides
          </p>
        </div>

      </div>

      {/* 🔹 WEEKLY OFF (CLEAN TAGS) */}
      <div className="mb-4">
        <p className="text-[11px] text-gray-400 mb-1">Weekly Off</p>

        <div className="flex gap-2">
          {data.weeklyOff.map((d, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
            >
              {d.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      {/* 🔹 ACTIONS */}
      <div className="flex justify-between items-center pt-3 border-t">

        {/* PRIMARY ACTION */}
        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          <Eye size={16} />
          View Calendar
        </button>

        {/* SECONDARY */}
        <div className="flex gap-2">

          <button
            onClick={onEdit}
            className="p-2 rounded-md border hover:bg-gray-50"
          >
            <Pencil size={15} className="text-gray-600" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-md border hover:bg-red-50"
          >
            <Trash2 size={15} className="text-red-500" />
          </button>

        </div>

      </div>

    </div>
  );
};

export default CalendarCard;