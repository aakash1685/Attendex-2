import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

const Login = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setToast("");

      const res = await axios.post("http://localhost:5000/api/admin/auth", form);

      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");

      navigate("/admin/dashboard");
    } catch (err) {
      setToast(err.response?.data?.message || "Login failed");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.24),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.2),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(15,23,42,0.85),rgba(2,6,23,0.95))]" />

      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-lg transition hover:bg-white/20"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {toast && (
        <div className="absolute top-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-300/30 bg-red-500/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
          {toast}
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl gap-8 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-900/30 backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr] md:p-6">
          <div className="hidden rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-slate-200 md:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              <Sparkles size={14} />
              ADMIN EXPERIENCE
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
              Manage teams, attendance and operations from one refined workspace.
            </h1>
            <p className="mt-4 text-sm text-slate-300">
              Secure access, analytics-ready navigation and an interface crafted for modern SaaS workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white p-7 shadow-xl shadow-slate-900/20 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
                <p className="text-sm text-slate-500">Sign in to continue to your dashboard</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-2.5 pr-16 text-sm outline-none transition focus:ring-2 ${
                      errors.password
                        ? "border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
