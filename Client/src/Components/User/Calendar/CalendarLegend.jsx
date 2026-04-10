import React from "react";

const legendItems = [
  { label: "Working Day", colorClass: "dot-working" },
  { label: "Weekly Off", colorClass: "dot-weekly-off" },
  { label: "Holiday", colorClass: "dot-holiday" },
  { label: "Override Working", colorClass: "dot-override" },
  { label: "Approved Leave", colorClass: "dot-leave" },
  { label: "Present", colorClass: "dot-present" },
  { label: "Absent", colorClass: "dot-absent" },
];

const CalendarLegend = () => {
  return (
    <section className="calendar-legend-card">
      {legendItems.map((item) => (
        <div key={item.label} className="calendar-legend-item">
          <span className={`legend-dot ${item.colorClass}`} />
          {item.label}
        </div>
      ))}
    </section>
  );
};

export default CalendarLegend;
