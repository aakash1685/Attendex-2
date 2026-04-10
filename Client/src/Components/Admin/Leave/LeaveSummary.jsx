import React from "react";

const cards = [
  { key: "total", title: "Total", color: "text-slate-800" },
  { key: "APPROVED", title: "Approved", color: "text-emerald-600" },
  { key: "PENDING", title: "Pending", color: "text-amber-500" },
  { key: "REJECTED", title: "Rejected", color: "text-rose-500" },
];

const LeaveSummary = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          <p className="text-sm text-slate-500">{card.title}</p>
          <h2 className={`mt-2 text-3xl font-bold ${card.color}`}>
            {loading ? "..." : summary?.[card.key] || 0}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default LeaveSummary;
