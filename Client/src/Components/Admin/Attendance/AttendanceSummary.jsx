import React from "react";
import AttendanceSummaryCards from "./AttendanceSummaryCards";

const AttendanceSummary = ({ summary, loading }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Attendance Summary</h2>
      <AttendanceSummaryCards summary={summary} loading={loading} />
    </section>
  );
};

export default AttendanceSummary;
