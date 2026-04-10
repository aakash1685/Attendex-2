import React from "react";
import {
  Activity,
  Ban,
  BriefcaseMedical,
  Clock3,
  UserCheck,
} from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total Records",
    accent: "from-slate-900 to-slate-700",
    icon: Activity,
  },
  {
    key: "PRESENT",
    label: "Present",
    accent: "from-emerald-600 to-teal-500",
    icon: UserCheck,
  },
  {
    key: "ABSENT",
    label: "Absent",
    accent: "from-rose-600 to-red-500",
    icon: Ban,
  },
  {
    key: "HALF_DAY",
    label: "Half Day",
    accent: "from-amber-500 to-orange-500",
    icon: Clock3,
  },
  {
    key: "LEAVE",
    label: "Leave",
    accent: "from-indigo-600 to-blue-500",
    icon: BriefcaseMedical,
  },
];

const AttendanceSummaryCards = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = loading ? "..." : summary?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
            />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
              <div
                className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.accent}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceSummaryCards;
