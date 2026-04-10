import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiArrowLeft, FiMail, FiSend } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/auth/forgot-password`, {
        email: email.trim(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to process request.");
      }

      toast.success("Reset link sent successfully. Check your inbox.");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
          <FiArrowLeft /> Back to Login
        </Link>

        <div className="mb-6 rounded-2xl bg-indigo-50 p-4">
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="mt-1 text-sm text-slate-600">Enter your registered email to receive a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Registered Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none ring-indigo-500 focus:ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-75"
          >
            <FiSend /> {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
