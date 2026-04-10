import React, { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Lock,
  MapPin,
  Edit,
  Power,
  Eye,
  EyeOff,
  Wallet,
  User,
  ChevronDown,
} from "lucide-react";

const UserCard = ({ user, deptName, desigName, onEdit, onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const leaves = user.leaves || {};

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4 
    hover:shadow-md hover:border-gray-300 hover:scale-[1.02] transition-all duration-200">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-start">

        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "https://i.pravatar.cc/100?img=5"}
            alt="profile"
            className="w-12 h-12 rounded-xl object-cover"
          />

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {user.name}
            </h3>

            {/* Role Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                {desigName}
              </span>
              <span className="text-[10px] text-gray-400">
                {deptName}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            user.activeStatus
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {user.activeStatus ? "Active" : "Inactive"}
        </span>
      </div>

      {/* 🔥 BASIC INFO */}
      <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
        <Info icon={<Mail size={14} />} text={user.email} />
        <Info icon={<Phone size={14} />} text={user.mobileNo} />
        <Info icon={<MapPin size={14} />} text={user.address || "No address"} />
      </div>

      {/* 🔥 PASSWORD */}
      <div className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <Lock size={14} />
          {showPassword ? user.password : "••••••••"}
        </div>

        <button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

{/* 🔥 LEAVES INSANE UI */}
<div className="flex justify-between gap-3">

  {["CL", "SL", "PL"].map((l) => {
    const total = leaves[l]?.total || 0;
    const used = leaves[l]?.used || 0;
    const remaining = leaves[l]?.remaining || 0;

    const percent = total ? (remaining / total) * 100 : 0;

    // Stroke calculation
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    // Color logic
    const color =
      percent < 30
        ? "#ef4444" // red
        : percent < 60
        ? "#f59e0b" // yellow
        : "#10b981"; // green

    return (
      <div
        key={l}
        className="flex-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center 
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
      >

        {/* Label */}
        <span className="text-[10px] text-gray-400 mb-1">{l}</span>

        {/* 🔥 RADIAL PROGRESS */}
        <div className="relative w-12 h-12 flex items-center justify-center">

          <svg className="w-12 h-12 rotate-[-90deg]">
            {/* Background */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="transparent"
            />

            {/* Progress */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke={color}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center Number */}
          <span className="absolute text-[11px] font-semibold text-gray-800">
            {remaining}
          </span>
        </div>

        {/* Info */}
        <p className="text-[10px] text-gray-500 mt-1">
          {used} / {total}
        </p>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition"
          style={{
            background: `radial-gradient(circle at center, ${color}20, transparent 70%)`,
          }}
        />

      </div>
    );
  })}

</div>

      {/* 🔥 EXPAND BUTTON */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center text-xs text-gray-500 hover:text-gray-700"
      >
        <ChevronDown
          size={16}
          className={`transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* 🔥 EXPANDED CONTENT */}
      {expanded && (
        <div className="space-y-3 border-t pt-3">

          {/* Work */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <Info icon={<Building2 size={14} />} text={deptName} />
            <Info icon={<Briefcase size={14} />} text={desigName} />
            <Info icon={<User size={14} />} text={user.gender || "N/A"} />
            <Info icon={<Wallet size={14} />} text={`₹ ${user.salary || 0}`} />
          </div>

          {/* Bank */}
          <div className="text-xs text-gray-600 border border-gray-100 rounded-xl p-2">
            <p><strong>Acc:</strong> {user.bank?.accNo || "-"}</p>
            <p><strong>IFSC:</strong> {user.bank?.ifsc || "-"}</p>
          </div>

          {/* LOP */}
          <div className="text-xs text-gray-500">
            LOP: {leaves.LOP?.used || 0}/{leaves.LOP?.total || 0}
          </div>

        </div>

        
      )}

      {/* 🔥 ACTIONS */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">

        <button
          onClick={() => onToggle(user)}
          className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition"
        >
          <Power size={14} />
          {user.activeStatus ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => onEdit(user)}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <Edit size={14} />
          Edit
        </button>

      </div>
    </div>
  );
};

const Info = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

export default UserCard;