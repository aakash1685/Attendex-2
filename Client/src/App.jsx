import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMMON PAGES
import Landingpage from "./Pages/Common Pages/LandingPage";
import NotFoundPage from "./Pages/Common Pages/NotFoundPage";

// ADMIN PAGES
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminUser from "./Pages/Admin/UserMgmt";
import AdminDepartment from "./Pages/Admin/DeptMgmt";
import AdminDesig from "./Pages/Admin/DesignationMgmt";
import AdminCalendar from "./Pages/Admin/CalenderMgmt";
import AdminLeaves from "./Pages/Admin/LeavesMgmt";
import AdminAttendance from "./Pages/Admin/AttendanceMgmt";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminCalendarDetail from "./Pages/Admin/CalendarDetails";

// USER PAGES
import UserDashBoard from "./Pages/User/DashBoard";
import ProtectedRoute from "./Components/Admin/ProtectedRoute";
import UserLayout from "./Pages/User/UserLayout";
import UserHome from "./Pages/User/Home";
import UserAttendance from './Pages/User/Attendance';
import UserLeave from './Pages/User/Leave';
import UserCalendar from './Pages/User/Calendar';
import UserProfile from './Pages/User/Profile';
import UserForgotPW from './Pages/User/ForgotPassword';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* COMMON ROUTES */}
        <Route path="/" element={<Landingpage />} />
        <Route path="*" element={<NotFoundPage />} />

     <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="user" element={<AdminUser />} />
  <Route path="department" element={<AdminDepartment />} />
  <Route path="designation" element={<AdminDesig />} />
  <Route path="calendar" element={<AdminCalendar />} />

  {/* ✅ THIS IS MISSING */}
  <Route path="calendar/:id" element={<AdminCalendarDetail />} />

  <Route path="leaves" element={<AdminLeaves />} />
  <Route path="attendance" element={<AdminAttendance />} />
</Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashBoard />} />
          <Route path="home" element={<UserHome />} />
          <Route path="attendance" element={<UserAttendance />} />
          <Route path="leave" element={<UserLeave />} />
          <Route path="calendar" element={<UserCalendar />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="forgotpw" element={<UserForgotPW />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
