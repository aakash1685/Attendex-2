import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { CalendarDays, RefreshCw } from "lucide-react";
import CalendarControls from "../../Components/User/Calendar/CalendarControls";
import CalendarLegend from "../../Components/User/Calendar/CalendarLegend";
import CalendarGrid from "../../Components/User/Calendar/CalendarGrid";
import CalendarSidebar from "../../Components/User/Calendar/CalendarSidebar";
import "../../Components/User/Calendar/CalendarPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const Calendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [yearCalendar, setYearCalendar] = useState(null);
  const [monthCalendar, setMonthCalendar] = useState(null);
  const [attendanceMonthData, setAttendanceMonthData] = useState([]);
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchYearCalendar = useCallback(async () => {
    setLoadingYear(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/calendar`, {
        params: { year },
        headers: authHeaders,
      });

      if (!response.data?.success || !response.data?.calendar) {
        throw new Error(response.data?.message || "Unable to fetch yearly calendar.");
      }

      setYearCalendar(response.data.calendar);
    } catch (fetchError) {
      const message =
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "Yearly calendar endpoint is not available yet.";
      setYearCalendar(null);
      setError(message);
      toast.error(message);
    } finally {
      setLoadingYear(false);
    }
  }, [authHeaders, year]);

  const fetchMonthCalendar = useCallback(async () => {
    setLoadingMonth(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/calendar/month`, {
        params: { year, month: selectedMonth },
        headers: authHeaders,
      });

      if (!response.data?.success || !response.data?.month) {
        throw new Error(response.data?.message || "Unable to fetch month calendar.");
      }

      setMonthCalendar(response.data.month);
      setAttendanceMonthData([]);
    } catch (monthError) {
      setMonthCalendar(null);

      // Fallback for existing route in this repository.
      try {
        const fallbackResponse = await axios.get(`${API_BASE_URL}/api/user/auth/calendar`, {
          params: { year, month: MONTHS.indexOf(selectedMonth) + 1 },
          headers: authHeaders,
        });

        const fallbackData = fallbackResponse.data?.data || [];
        setAttendanceMonthData(Array.isArray(fallbackData) ? fallbackData : []);

        toast("Loaded monthly attendance calendar from fallback endpoint.", {
          icon: "ℹ️",
        });
      } catch (fallbackError) {
        setAttendanceMonthData([]);
        const message =
          monthError?.response?.data?.message ||
          fallbackError?.response?.data?.message ||
          "Month calendar not available.";
        toast.error(message);
      }
    } finally {
      setLoadingMonth(false);
    }
  }, [authHeaders, selectedMonth, year]);

  useEffect(() => {
    fetchYearCalendar();
  }, [fetchYearCalendar]);

  useEffect(() => {
    fetchMonthCalendar();
  }, [fetchMonthCalendar]);

  const monthStats = useMemo(() => {
    const monthSource = monthCalendar ||
      yearCalendar?.months?.find((month) => month.month === selectedMonth) ||
      {};

    return {
      holidays: monthSource.holidays || [],
      workingDaysOverride: monthSource.workingDaysOverride || [],
    };
  }, [monthCalendar, selectedMonth, yearCalendar]);

  const weeklyOff = yearCalendar?.weeklyOff || [];

  return (
    <div className="calendar-page">
      <Toaster position="top-right" />

      <div className="calendar-header-card">
        <div>
          <h1>User Calendar</h1>
          <p>Department schedule with holidays, weekly offs, overrides, and personal attendance context.</p>
        </div>
        <button
          type="button"
          className="calendar-refresh-btn"
          onClick={() => {
            fetchYearCalendar();
            fetchMonthCalendar();
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <CalendarControls
        year={year}
        setYear={setYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        months={MONTHS}
      />

      <div className="calendar-stats-grid">
        <article>
          <span>Selected Year</span>
          <strong>{year}</strong>
        </article>
        <article>
          <span>Weekly Off Days</span>
          <strong>{weeklyOff.length}</strong>
        </article>
        <article>
          <span>Month Holidays</span>
          <strong>{monthStats.holidays.length}</strong>
        </article>
        <article>
          <span>Working Overrides</span>
          <strong>{monthStats.workingDaysOverride.length}</strong>
        </article>
      </div>

      {error ? <div className="calendar-warning">{error}</div> : null}

      <CalendarLegend />

      <div className="calendar-main-layout">
        <div className="calendar-main-content">
          <div className="calendar-grid-header">
            <h2>
              <CalendarDays size={18} /> {selectedMonth} {year}
            </h2>
            {(loadingYear || loadingMonth) && <span className="calendar-loading-pill">Loading…</span>}
          </div>

          <CalendarGrid
            year={year}
            selectedMonth={selectedMonth}
            weeklyOff={weeklyOff}
            holidays={monthStats.holidays}
            workingDaysOverride={monthStats.workingDaysOverride}
            attendanceMonthData={attendanceMonthData}
          />
        </div>

        <CalendarSidebar
          month={selectedMonth}
          holidays={monthStats.holidays}
          workingDaysOverride={monthStats.workingDaysOverride}
          attendanceMonthData={attendanceMonthData}
        />
      </div>
    </div>
  );
};

export default Calendar;
