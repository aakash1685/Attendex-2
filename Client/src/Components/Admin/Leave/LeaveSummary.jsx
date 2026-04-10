import React from "react";

const Card = ({ title, value, color }) => {
  return (
    <div className="backdrop-blur-xl bg-white/80 border border-white/40 shadow-lg rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value || 0}
      </h2>
    </div>
  );
};

const LeaveSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <Card title="Total" value={summary.total} color="text-gray-800" />
      <Card title="Approved" value={summary.APPROVED} color="text-emerald-600" />
      <Card title="Pending" value={summary.PENDING} color="text-amber-500" />
      <Card title="Rejected" value={summary.REJECTED} color="text-rose-500" />
    </div>
  );
};

export default LeaveSummary;