import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  // Handle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation
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



  // Submit
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

    const res = await axios.post(
      "http://localhost:5000/api/admin/auth",
      form
    );

    // assuming backend returns token
    const token = res.data.token;

    localStorage.setItem("token", token);
    localStorage.setItem("role", "admin");

    // 🔥 Redirect to dashboard
    navigate("/admin/dashboard");

  } catch (err) {
    setToast(
      err.response?.data?.message || "Login failed"
    );
    setTimeout(() => setToast(""), 3000);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* 🔙 Back Button (FIXED TOP LEFT) */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black transition z-50"
      >
        <span className="text-2xl">←</span>
        <span className="text-base font-medium">Back</span>
      </button>

      {/* 🔥 Toast */}
      {toast && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {toast}
        </div>
      )}

      {/* CENTER CONTENT */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md pr-16 outline-none ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;