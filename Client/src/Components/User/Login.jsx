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
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
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
    setErrorMsg("");

    const res = await axios.post(
      "http://localhost:5000/api/user/auth/login",
      form
    );

    const token = res.data?.token;

    if (!token) {
      throw new Error("Token not received");
    }

    localStorage.clear();
    localStorage.setItem("token", token);
    localStorage.setItem("role", "user");

    navigate("/user/dashboard");

  } catch (err) {
    setErrorMsg(
      err.response?.data?.message || err.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 relative">

      {/* 🔙 Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black transition z-50"
      >
        <span className="text-2xl">←</span>
        <span className="text-base font-medium">Back</span>
      </button>

      {/* Center Content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Employee Login
          </h2>

          {errorMsg && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

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
                <p className="text-sm text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex justify-center items-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Access your attendance and leave records securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;