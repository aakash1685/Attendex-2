import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // ❌ Wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  // ✅ Access allowed
  return children;
};

export default ProtectedRoute;