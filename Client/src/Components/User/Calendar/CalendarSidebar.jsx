import React, { useMemo } from "react";

const CalendarSidebar = ({ month, holidays, workingDaysOverride, attendanceMonthData }) => {
  const approvedLeaves = useMemo(() => {
    return (attendanceMonthData || []).filter((day) => day.leaveStatus === "APPROVED");
  }, [attendanceMonthData]);

  const presentDays = useMemo(() => {
    return (attendanceMonthData || []).filter((day) => day.attendanceStatus === "PRESENT").length;
  }, [attendanceMonthData]);

  return (
    <aside className="calendar-sidebar">
      <section>
        <h3>{month} Highlights</h3>
        <ul>
          <li>
            <span>Holidays</span>
            <strong>{holidays?.length || 0}</strong>
          </li>
          <li>
            <span>Override Working Days</span>
            <strong>{workingDaysOverride?.length || 0}</strong>
          </li>
          <li>
            <span>Approved Leaves</span>
            <strong>{approvedLeaves.length}</strong>
          </li>
          <li>
            <span>Present Marked</span>
            <strong>{presentDays}</strong>
          </li>
        </ul>
      </section>

      <section>
        <h4>Holiday List</h4>
        {holidays?.length ? (
          <div className="calendar-list">
            {holidays.map((holiday) => (
              <article key={`${holiday.date}-${holiday.title}`}>
                <strong>{holiday.title}</strong>
                <span>{new Date(holiday.date).toLocaleDateString()}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="calendar-empty-text">No holidays configured for this month.</p>
        )}
      </section>

      <section>
        <h4>Working Day Overrides</h4>
        {workingDaysOverride?.length ? (
          <div className="calendar-list">
            {workingDaysOverride.map((override) => (
              <article key={`${override.date}-${override.reason}`}>
                <strong>{override.reason}</strong>
                <span>{new Date(override.date).toLocaleDateString()}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="calendar-empty-text">No override days in this month.</p>
        )}
      </section>
    </aside>
  );
};

export default CalendarSidebar;
