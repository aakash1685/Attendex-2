import React, { useState } from "react";
import { FiBarChart2, FiCalendar, FiCheckCircle, FiShield, FiUsers } from "react-icons/fi";
import AdminLogin from "../../Components/Admin/Login";
import UserLogin from "../../Components/User/Login";

const features = [
  {
    title: "Attendance Intelligence",
    description: "Track check-ins, consistency and trends with a clean employee-first experience.",
    icon: FiBarChart2,
  },
  {
    title: "Leave Automation",
    description: "Apply, review and monitor leave balances with clear status visibility.",
    icon: FiCalendar,
  },
  {
    title: "Secure Access",
    description: "Role-based sign-in and protected workflows for admins and employees.",
    icon: FiShield,
  },
];

const LandingPage = () => {
  const [role, setRole] = useState(null);

  if (role === "admin") {
    return <AdminLogin onBack={() => setRole(null)} />;
  }

  if (role === "user") {
    return <UserLogin onBack={() => setRole(null)} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.3),transparent_45%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10 md:px-8">
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-100">
              <FiCheckCircle /> Workforce Platform
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Attendex — Smart attendance, leave and employee profile management.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-200 md:text-base">
              A modern portal for teams to manage attendance, leave workflows, secure account recovery, and employee
              profile operations with confidence.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setRole("user")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-600"
              >
                <FiUsers /> Login as Employee
              </button>

              <button
                onClick={() => setRole("admin")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-500 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-indigo-400 hover:text-white"
              >
                <FiShield /> Login as Admin
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
            <h2 className="text-lg font-semibold text-white">Why teams choose Attendex</h2>
            <div className="mt-4 space-y-3">
              {features.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-200">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-xs text-slate-300">{description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
