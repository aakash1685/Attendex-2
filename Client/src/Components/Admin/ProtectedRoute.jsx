import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // ❌ Wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  if (role === "user" && isFirstLogin && location.pathname !== "/user/force-change-password") {
    return <Navigate to="/user/force-change-password" replace />;
  }

  if (role === "user" && !isFirstLogin && location.pathname === "/user/force-change-password") {
    return <Navigate to="/user/home" replace />;
  }

  // ✅ Access allowed
  return children;
};

export default ProtectedRoute;
