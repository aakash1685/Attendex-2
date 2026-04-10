import React, { useMemo } from "react";

const CalendarControls = ({ year, setYear, selectedMonth, setSelectedMonth, months }) => {
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, index) => currentYear - 2 + index);
  }, []);

  return (
    <section className="calendar-controls-card">
      <label>
        <span>Year</span>
        <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Month</span>
        <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
};

export default CalendarControls;
