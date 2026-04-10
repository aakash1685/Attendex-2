import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../../Components/User/UserNavbar"; // adjust path if needed

const UserLayout = () => {
  return (
    <div>
      {/* Navbar */}
      <UserNavbar />

      {/* Page Content */}
      <div className="p-4 h-[calc(100vh-64px)] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
