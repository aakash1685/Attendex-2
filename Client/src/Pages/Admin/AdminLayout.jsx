import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/Sidebar";
import AdminNavbar from "../../Components/Admin/AdminNavabar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col ml-72">

        {/* Navbar */}
        <AdminNavbar />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-100 mt-16">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout; // ✅ THIS WAS MISSING