import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { activateSessionForRole, getScopedToken } from "../../utils/authStorage";

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  const token = getScopedToken(role);
  const userRole = localStorage.getItem("role");
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

  if (token) {
    activateSessionForRole(role);
  }

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" />;
  }

  // ❌ Wrong role
  if (role && userRole !== role && !getScopedToken(role)) {
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
