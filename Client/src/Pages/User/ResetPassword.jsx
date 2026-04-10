import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiArrowLeft, FiLock, FiShield } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      toast.error("Both fields are required.");
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
      const response = await axios.post(`${API_BASE_URL}/api/user/auth/reset-password/${token}`, {
        newPassword: form.newPassword,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to reset password.");
      }

      toast.success("Password reset successful. Please login.");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100 p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
          <FiArrowLeft /> Back to Login
        </Link>

        <div className="mb-6 rounded-2xl bg-violet-50 p-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FiShield /> Reset Password
          </h1>
          <p className="mt-1 text-sm text-slate-600">Create a fresh password for your Attendex account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.newPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none ring-indigo-500 focus:ring"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none ring-indigo-500 focus:ring"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
