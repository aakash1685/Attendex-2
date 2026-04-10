import React, { useState } from "react";
import AdminLogin from "../../Components/Admin/Login";
import UserLogin from "../../Components/User/Login";

const LandingPage = () => {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* 🔹 Show Selection Screen */}
      {!role && (
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to Attendex</h1>
          <p className="text-gray-500 mb-6">
            Choose how you want to login
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setRole("admin")}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login as Admin
            </button>

            <button
              onClick={() => setRole("user")}
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Login as Employee
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Show Admin Login */}
      {role === "admin" && (
        <AdminLogin onBack={() => setRole(null)} />
      )}

      {/* 🔹 Show User Login */}
      {role === "user" && (
        <UserLogin onBack={() => setRole(null)} />
      )}

    </div>
  );
};

export default LandingPage;