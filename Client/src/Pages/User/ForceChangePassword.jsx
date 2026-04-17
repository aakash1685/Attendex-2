import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiShield } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ForceChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Confirm password does not match.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/");
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/user/auth/change-password`,
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to change password.");
      }

      localStorage.setItem("isFirstLogin", "false");
      toast.success("Password changed successfully.");
      setTimeout(() => navigate("/user/home"), 900);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-6 rounded-2xl bg-indigo-50 p-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FiShield /> First Login Security
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            For account safety, please change your temporary password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Current Password", key: "oldPassword", placeholder: "Enter current password" },
            { label: "New Password", key: "newPassword", placeholder: "Enter new password" },
            { label: "Confirm Password", key: "confirmPassword", placeholder: "Re-enter new password" },
          ].map((item) => (
            <div key={item.key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{item.label}</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword[item.key] ? "text" : "password"}
                  value={form[item.key]}
                  onChange={(event) => setForm((prev) => ({ ...prev, [item.key]: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-10 text-sm outline-none ring-indigo-500 focus:ring"
                  placeholder={item.placeholder}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword[item.key] ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Updating..." : "Change Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePassword;
