import React from "react";
import {
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-gray-500">
            Here's what's happening in your organization today.
          </p>
        </div>
      </div>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard icon={<Users />} title="Total Users" value="124" trend="+12%" />
        <StatCard icon={<Building2 />} title="Departments" value="8" trend="+2" />
        <StatCard icon={<CalendarCheck />} title="Attendance" value="92%" trend="+5%" />
        <StatCard icon={<ClipboardList />} title="Pending Leaves" value="6" trend="-2" />

      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          {/* Activity */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Recent Activity
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <p>✅ Aakash added new user</p>
              <p>📌 Rahul requested leave</p>
              <p>📊 Attendance updated</p>
              <p>🏢 New department created</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Monthly Performance
            </h2>

            <Progress label="User Growth" value={70} />
            <Progress label="Attendance Rate" value={85} />
            <Progress label="Task Completion" value={60} />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-2">
              <ActionBtn label="Add User" />
              <ActionBtn label="Create Department" />
              <ActionBtn label="Approve Leaves" />
            </div>
          </div>

          {/* Insight */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-2">
              Insights
            </h2>
            <p className="text-sm opacity-90">
              Attendance increased by 5% this week 📈
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

// 🔥 COMPONENTS

const StatCard = ({ icon, title, value, trend }) => (
  <div className="bg-white rounded-2xl border p-4 flex justify-between items-center hover:shadow-md transition">
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold text-gray-800">{value}</h2>
      <p className="text-xs text-green-600">{trend}</p>
    </div>
    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
      {icon}
    </div>
  </div>
);

const Progress = ({ label, value }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-gray-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
      <div
        className="h-2 bg-blue-500 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const ActionBtn = ({ label }) => (
  <button className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-left">
    {label}
  </button>
);

export default Dashboard;