import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  FiActivity,
  FiBriefcase,
  FiCreditCard,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiUser,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/initials/svg?seed=Attendex";

const maskAccountNumber = (accNo = "") => {
  if (!accNo) return "—";
  if (accNo.length <= 4) return accNo;
  return `${"•".repeat(Math.max(accNo.length - 4, 4))}${accNo.slice(-4)}`;
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/auth/profile`, {
        headers: authHeaders,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to load profile.");
      }

      setProfile(response.data?.profile || null);
      localStorage.setItem("userName", response.data?.profile?.name || "Employee");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to fetch profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const leaveCards = useMemo(() => {
    const leaveData = profile?.leaves || {};
    return ["CL", "SL", "PL", "LOP"].map((type) => {
      const data = leaveData[type] || { total: 0, used: 0, remaining: 0 };
      return {
        type,
        total: data.total ?? 0,
        used: data.used ?? 0,
        remaining: data.remaining ?? 0,
      };
    });
  }, [profile]);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill old, new and confirm password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Confirm password does not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const payload = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };

      const response = await axios.patch(`${API_BASE_URL}/api/user/auth/change-password`, payload, {
        headers: authHeaders,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to change password.");
      }

      toast.success("Password changed successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      fetchProfile();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-8">
      <Toaster position="top-right" />

      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-700 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-blue-100">Employee Profile</p>
            <h1 className="text-2xl font-bold md:text-4xl">My Account & Security</h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
              View your personal profile, organization details, leave balances, and account security in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            <FiRefreshCw /> Refresh Profile
          </button>
        </div>
      </section>

      {loadingProfile ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">Loading profile...</div>
      ) : !profile ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
          Could not load profile data.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <img
                  src={profile.profilePic || FALLBACK_AVATAR}
                  alt={profile.name || "Profile"}
                  className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                />

                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{profile.name || "Employee"}</h2>
                  <p className="mt-1 text-sm text-slate-500">{profile.designation?.name || "Designation"}</p>
                  <p className="mt-1 text-sm text-slate-500">{profile.dept?.name || "Department"}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FiActivity /> {profile.activeStatus ? "Active Employee" : "Inactive Account"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FiMail /> Email Address
                  </p>
                  <p className="break-all text-sm font-semibold text-slate-900">{profile.email || "—"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FiPhone /> Mobile Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{profile.mobileNo || "—"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FiMapPin /> Address
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{profile.address || "Not provided"}</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Employment Snapshot</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Gender</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{profile.gender || "—"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                    <FiBriefcase /> Department
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{profile.dept?.name || "—"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Designation</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{profile.designation?.name || "—"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Salary</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(profile.salary)}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900">Leave Balances</h3>
              <p className="mt-1 text-sm text-slate-500">Updated from your profile service response.</p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {leaveCards.map((leave) => (
                  <div key={leave.type} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{leave.type}</p>
                    <p className="mt-2 text-xs text-slate-500">Total: {leave.total}</p>
                    <p className="text-xs text-amber-700">Used: {leave.used}</p>
                    <p className="text-xs text-emerald-700">Remaining: {leave.remaining}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiCreditCard /> Bank Details
              </h3>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Account Number</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{maskAccountNumber(profile.bank?.accNo)}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">IFSC</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{profile.bank?.ifsc || "—"}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <FiShield /> Account Security
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  <FiLock /> {showPasswordForm ? "Hide form" : "Change password"}
                </button>
              </div>

              {showPasswordForm ? (
                <form className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handlePasswordSubmit}>
                  <div className="sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Old Password</label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, oldPassword: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {changingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  Keep your account secure by changing password regularly and avoiding weak combinations.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiUser /> Recovery Options
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Forgot your password? You can request a reset link and securely update credentials.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/forgot-password"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Open Forgot Password
                </Link>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
