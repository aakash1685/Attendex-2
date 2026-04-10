import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DUMMY_CALENDARS } from '../../Pages/Admin/CalenderMgmt';

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

const CalendarDetail = () => {
  const { id } = useParams();
  const data = DUMMY_CALENDARS.find(c => c._id === id);

  if (!data) return <div className="p-6">No Data Found</div>;

  const [monthIndex, setMonthIndex] = useState(0);
  const currentMonth = data.months?.[monthIndex];
  const year = data.year;

  const getDays = () => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  };

  const days = getDays();

  const getDayType = (day) => {
    if (!day) return "empty";

    const dateStr = `${year}-${String(monthIndex+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    if (currentMonth?.holidays?.find(h => h.date === dateStr)) return "holiday";
    if (currentMonth?.workingDaysOverride?.find(o => o.date === dateStr)) return "override";

    const dayName = new Date(year, monthIndex, day)
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    if (data.weeklyOff?.includes(dayName)) return "weeklyOff";

    return "normal";
  };

  return (
    <div className="h-full bg-[#F4F6F9] p-6">

      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            {data.deptName}
          </h1>
          <p className="text-sm text-gray-500">
            {currentMonth?.month} {year}
          </p>
        </div>

        {/* MONTH NAV */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => setMonthIndex(prev => Math.max(prev - 1, 0))}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm"
          >
            ←
          </button>

          <span className="text-sm font-medium text-gray-700">
            {currentMonth?.month}
          </span>

          <button
            onClick={() => setMonthIndex(prev => Math.min(prev + 1, 11))}
            className="px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm"
          >
            →
          </button>

        </div>

      </div>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-gray-300 rounded-md p-3">
          <p className="text-xs text-gray-600">Holidays</p>
          <p className="text-lg font-semibold text-red-600">
            {currentMonth.holidays.length}
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-3">
          <p className="text-xs text-gray-600">Overrides</p>
          <p className="text-lg font-semibold text-green-600">
            {currentMonth.workingDaysOverride.length}
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-md p-3">
          <p className="text-xs text-gray-600">Weekly Off</p>
          <p className="text-sm font-semibold text-blue-600">
            {data.weeklyOff.join(", ")}
          </p>
        </div>

      </div>

      {/* 🔹 CALENDAR */}
      <div className="bg-white border border-gray-300 rounded-md p-4">

        {/* DAYS HEADER */}
        <div className="grid grid-cols-7 text-xs text-gray-600 mb-3">
          {DAYS.map(d => (
            <div key={d} className="text-center font-semibold">
              {d}
            </div>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7 gap-2">

          {days.map((day, i) => {
            const type = getDayType(day);

            return (
              <div
                key={i}
                className={`
                  h-20 border rounded-md p-2 text-sm bg-white
                  ${type === "holiday" && "bg-red-100 border-red-300"}
                  ${type === "override" && "bg-green-100 border-green-300"}
                  ${type === "weeklyOff" && "bg-blue-100 border-blue-300"}
                  ${!day && "bg-transparent border-none"}
                `}
              >
                {day && (
                  <>
                    {/* DATE */}
                    <div className="font-semibold text-gray-800">
                      {day}
                    </div>

                    {/* LABEL */}
                    <div className="text-[11px] mt-1 text-gray-700">

                      {type === "holiday" &&
                        currentMonth.holidays.find(h =>
                          h.date.endsWith(`-${String(day).padStart(2,"0")}`)
                        )?.title}

                      {type === "override" &&
                        currentMonth.workingDaysOverride.find(o =>
                          o.date.endsWith(`-${String(day).padStart(2,"0")}`)
                        )?.reason}

                    </div>
                  </>
                )}
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default CalendarDetail;