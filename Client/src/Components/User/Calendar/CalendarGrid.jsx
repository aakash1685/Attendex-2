import React, { useMemo } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getISODate = (date) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toISOString()
    .split("T")[0];
};

const CalendarGrid = ({
  year,
  selectedMonth,
  weeklyOff,
  holidays,
  workingDaysOverride,
  attendanceMonthData,
}) => {
  const monthIndex = useMemo(
    () =>
      [
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
      ].indexOf(selectedMonth),
    [selectedMonth],
  );

  const dayObjects = useMemo(() => {
    if (monthIndex < 0) return [];

    const firstDate = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const holidayMap = new Map(
      (holidays || []).map((holiday) => [
        new Date(holiday.date).toISOString().split("T")[0],
        holiday.title,
      ]),
    );

    const overrideMap = new Map(
      (workingDaysOverride || []).map((override) => [
        new Date(override.date).toISOString().split("T")[0],
        override.reason,
      ]),
    );

    const attendanceMap = new Map(
      (attendanceMonthData || []).map((entry) => [
        new Date(entry.date).toISOString().split("T")[0],
        entry,
      ]),
    );

    const paddedDays = [];

    for (let empty = 0; empty < firstDate.getDay(); empty += 1) {
      paddedDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(year, monthIndex, day);
      const key = getISODate(currentDate);
      const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

      const holidayTitle = holidayMap.get(key);
      const overrideReason = overrideMap.get(key);
      const attendanceEntry = attendanceMap.get(key);
      const isWeeklyOff = weeklyOff.includes(dayName) && !overrideReason;

      const badges = [];
      let typeClass = "state-working";

      if (isWeeklyOff) {
        typeClass = "state-weekly-off";
        badges.push("Weekly Off");
      }

      if (holidayTitle) {
        typeClass = "state-holiday";
        badges.push("Holiday");
      }

      if (overrideReason) {
        typeClass = "state-override";
        badges.push("Override");
      }

      if (attendanceEntry?.leaveStatus === "APPROVED") {
        badges.push("Leave");
      }

      if (attendanceEntry?.attendanceStatus === "PRESENT") {
        badges.push("Present");
      }

      if (attendanceEntry?.attendanceStatus === "ABSENT") {
        badges.push("Absent");
      }

      const tooltip = [
        `Date: ${key}`,
        holidayTitle ? `Holiday: ${holidayTitle}` : null,
        overrideReason ? `Override: ${overrideReason}` : null,
        isWeeklyOff ? `Weekly Off: ${dayName}` : null,
        attendanceEntry?.attendanceStatus ? `Attendance: ${attendanceEntry.attendanceStatus}` : null,
        attendanceEntry?.leaveStatus ? `Leave: ${attendanceEntry.leaveStatus}` : null,
      ]
        .filter(Boolean)
        .join(" • ");

      paddedDays.push({
        day,
        key,
        holidayTitle,
        overrideReason,
        attendanceEntry,
        badges,
        typeClass,
        tooltip,
      });
    }

    return paddedDays;
  }, [attendanceMonthData, holidays, monthIndex, selectedMonth, weeklyOff, workingDaysOverride, year]);

  return (
    <section className="calendar-grid">
      {WEEK_DAYS.map((weekDay) => (
        <div key={weekDay} className="calendar-weekday">
          {weekDay}
        </div>
      ))}

      {dayObjects.map((dayData, index) => {
        if (!dayData) {
          return <div key={`pad-${index + 1}`} className="calendar-day empty" />;
        }

        return (
          <div key={dayData.key} className={`calendar-day ${dayData.typeClass}`} title={dayData.tooltip}>
            <div className="calendar-day-top">
              <strong>{dayData.day}</strong>
              <span>{new Date(dayData.key).toLocaleDateString("en-US", { weekday: "short" })}</span>
            </div>

            <div className="calendar-day-badges">
              {dayData.badges.slice(0, 2).map((badge) => (
                <span key={`${dayData.key}-${badge}`} className={`badge badge-${badge.toLowerCase().replace(/\s+/g, "-")}`}>
                  {badge}
                </span>
              ))}
            </div>

            {dayData.holidayTitle ? <p>{dayData.holidayTitle}</p> : null}
            {dayData.overrideReason ? <p>{dayData.overrideReason}</p> : null}
          </div>
        );
      })}
    </section>
  );
};

export default CalendarGrid;
