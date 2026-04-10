import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCrosshair,
  FiLogIn,
  FiLogOut,
  FiMapPin,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [geo, setGeo] = useState({ latitude: null, longitude: null, accuracy: null, error: "" });
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result = {
            latitude: Number(position.coords.latitude.toFixed(7)),
            longitude: Number(position.coords.longitude.toFixed(7)),
            accuracy: Math.round(position.coords.accuracy || 0),
          };
          resolve(result);
        },
        (error) => reject(new Error(error.message || "Unable to fetch location.")),
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        },
      );
    });

  const updateLocation = async () => {
    setLocating(true);
    try {
      const result = await getCurrentLocation();
      setGeo({ ...result, error: "" });
      return result;
    } catch (error) {
      setGeo({ latitude: null, longitude: null, accuracy: null, error: error.message });
      toast.error(error.message || "Please allow location permission.");
      throw error;
    } finally {
      setLocating(false);
    }
  };

  useEffect(() => {
    updateLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttendanceAction = async (type) => {
    setLoading(true);

    try {
      const latestLocation = geo.latitude && geo.longitude ? geo : await updateLocation();
      const payload = {
        latitude: latestLocation.latitude,
        longitude: latestLocation.longitude,
      };

      const endpoint = type === "check-in" ? "/api/user/attendance/check-in" : "/api/user/attendance/check-out";
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
        headers: authHeaders,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to complete attendance action.");
      }

      const data = response.data?.attendance || response.data?.Attendance || null;
      setAttendance(data);
      toast.success(response.data?.message || `${type === "check-in" ? "Check-in" : "Check-out"} successful.`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Attendance request failed.");
    } finally {
      setLoading(false);
    }
  };

  const canCheckIn = !loading && !attendance?.checkInTime;
  const canCheckOut = !loading && Boolean(attendance?.checkInTime) && !attendance?.checkOutTime;

  return (
    <div className="space-y-6 p-1">
      <Toaster position="top-right" />

      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="absolute -top-24 right-[-10%] h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-[-6%] h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-100">
              <FiShield /> Smart Attendance
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">Attendance Control Center</h1>
            <p className="mt-2 text-sm text-indigo-100/90">Secure check-in/check-out powered by office Wi-Fi and live GPS verification.</p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wide text-indigo-100">Live Date & Time</p>
            <p className="mt-1 text-xl font-semibold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-sm text-indigo-100/90">{currentTime.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Check In", value: formatDateTime(attendance?.checkInTime), icon: FiLogIn },
          { label: "Check Out", value: formatDateTime(attendance?.checkOutTime), icon: FiLogOut },
          { label: "Working Hours", value: attendance?.workingHours ? `${attendance.workingHours} hrs` : "--", icon: FiClock },
          { label: "Status", value: attendance?.attendanceStatus || (attendance?.checkOutTime ? "COMPLETED" : "READY"), icon: FiActivity },
        ].map(({ label, value, icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              {React.createElement(icon, { className: "text-indigo-500" })}
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Attendance Actions</h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Location + Network Validation Enabled</span>
          </div>

          <p className="mb-6 text-sm text-slate-600">Before marking attendance, ensure location permission is enabled and you are connected to office Wi-Fi.</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!canCheckIn}
              onClick={() => handleAttendanceAction("check-in")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCheckCircle /> {loading ? "Processing..." : "Check In"}
            </button>
            <button
              type="button"
              disabled={!canCheckOut}
              onClick={() => handleAttendanceAction("check-out")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiLogOut /> {loading ? "Processing..." : "Check Out"}
            </button>
            <button
              type="button"
              onClick={updateLocation}
              disabled={locating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw className={locating ? "animate-spin" : ""} /> {locating ? "Refreshing..." : "Refresh Location"}
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">Live Location Snapshot</h3>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-700">
              <FiMapPin className="text-indigo-500" /> Latitude: <span className="font-semibold">{geo.latitude ?? "--"}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <FiCrosshair className="text-indigo-500" /> Longitude: <span className="font-semibold">{geo.longitude ?? "--"}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <FiCalendar className="text-indigo-500" /> Accuracy: <span className="font-semibold">{geo.accuracy ? `${geo.accuracy}m` : "--"}</span>
            </p>

            {geo.error ? (
              <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                <p className="inline-flex items-center gap-2 font-medium">
                  <FiAlertCircle /> {geo.error}
                </p>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                <p className="inline-flex items-center gap-2 font-medium">
                  <FiCheckCircle /> Location ready for attendance validation.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Attendance;
