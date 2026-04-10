import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarToolbar from "../../Components/Admin/Calendar/CalendarToolbar";
import CalendarForm from "../../Components/Admin/Calendar/CalendarForm";
import CalendarCard from "../../Components/Admin/Calendar/CalendarCard";


// 🔥 DUMMY DATA (PUT HERE - OUTSIDE COMPONENT)
const DUMMY_DEPTS = [
  { _id: "d1", deptName: "IT Department" },
  { _id: "d2", deptName: "HR Department" },
  { _id: "d3", deptName: "Finance Department" },
  { _id: "d4", deptName: "Marketing Department" },
  { _id: "d5", deptName: "Operations Department" },
  { _id: "d6", deptName: "Sales Department" }
];

export const DUMMY_CALENDARS = [
  {
    _id: "1",
    deptName: "IT Department",
    deptId: "d1",
    year: 2027,
    weeklyOff: ["SATURDAY", "SUNDAY"],
    months: [
      {
        month: "JANUARY",
        holidays: [
          { date: "2027-01-01", title: "New Year" },
          { date: "2027-01-26", title: "Republic Day" }
        ],
        workingDaysOverride: []
      },
      {
        month: "FEBRUARY",
        holidays: [{ date: "2027-02-19", title: "Shivaji Jayanti" }],
        workingDaysOverride: []
      },
      {
        month: "MARCH",
        holidays: [{ date: "2027-03-25", title: "Holi" }],
        workingDaysOverride: []
      },
      {
        month: "APRIL",
        holidays: [{ date: "2027-04-14", title: "Ambedkar Jayanti" }],
        workingDaysOverride: []
      },
      {
        month: "MAY",
        holidays: [{ date: "2027-05-01", title: "Labour Day" }],
        workingDaysOverride: []
      },
      { month: "JUNE", holidays: [], workingDaysOverride: [] },
      { month: "JULY", holidays: [], workingDaysOverride: [] },
      {
        month: "AUGUST",
        holidays: [{ date: "2027-08-15", title: "Independence Day" }],
        workingDaysOverride: []
      },
      { month: "SEPTEMBER", holidays: [], workingDaysOverride: [] },
      {
        month: "OCTOBER",
        holidays: [{ date: "2027-10-02", title: "Gandhi Jayanti" }],
        workingDaysOverride: []
      },
      { month: "NOVEMBER", holidays: [], workingDaysOverride: [] },
      {
        month: "DECEMBER",
        holidays: [{ date: "2027-12-25", title: "Christmas" }],
        workingDaysOverride: []
      }
    ]
  },
  {
  _id: "2",
  deptName: "HR Department",
  deptId: "d2",
  year: 2027,
  weeklyOff: ["SUNDAY"],
  months: Array.from({ length: 12 }, (_, i) => ({
    month: [
      "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ][i],
    holidays: i === 0 ? [{ date: "2027-01-01", title: "New Year" }] : [],
    workingDaysOverride: []
  }))
},

{
  _id: "3",
  deptName: "Finance Department",
  deptId: "d3",
  year: 2027,
  weeklyOff: ["SATURDAY"],
  months: Array.from({ length: 12 }, (_, i) => ({
    month: [
      "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ][i],
    holidays: i === 2 ? [{ date: "2027-03-31", title: "Financial Year End" }] : [],
    workingDaysOverride: i === 2 ? [{ date: "2027-03-30", reason: "Audit Work" }] : []
  }))
},

{
  _id: "4",
  deptName: "Marketing Department",
  deptId: "d4",
  year: 2027,
  weeklyOff: ["SUNDAY"],
  months: Array.from({ length: 12 }, (_, i) => ({
    month: [
      "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ][i],
    holidays: i === 7 ? [{ date: "2027-08-15", title: "Independence Day" }] : [],
    workingDaysOverride: []
  }))
},

{
  _id: "5",
  deptName: "Operations Department",
  deptId: "d5",
  year: 2027,
  weeklyOff: ["FRIDAY"],
  months: Array.from({ length: 12 }, (_, i) => ({
    month: [
      "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ][i],
    holidays: [],
    workingDaysOverride: i === 11 ? [{ date: "2027-12-31", reason: "Year End Ops" }] : []
  }))
},

{
  _id: "6",
  deptName: "Sales Department",
  deptId: "d6",
  year: 2027,
  weeklyOff: ["SUNDAY"],
  months: Array.from({ length: 12 }, (_, i) => ({
    month: [
      "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ][i],
    holidays: i === 9 ? [{ date: "2027-10-02", title: "Gandhi Jayanti" }] : [],
    workingDaysOverride: []
  }))
}
];


const CalenderMgmt = () => {
  const navigate = useNavigate();

  const [dept, setDept] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("list");

  // ✅ USE DUMMY DATA HERE
  const [departments, setDepartments] = useState(DUMMY_DEPTS);
  const [calendars, setCalendars] = useState(DUMMY_CALENDARS);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCalendar = () => {
    console.log("fetching...");
  };

  const handleSave = (data) => {
    console.log("Form Data:", data);
    setOpenForm(false);
  };

  const handleDelete = (id) => {
    console.log("delete:", id);
  };

  return (
    <div className="p-4 space-y-4">

      {/* 🔥 TOOLBAR */}
      <CalendarToolbar
        dept={dept}
        setDept={setDept}
        year={year}
        setYear={setYear}
        view={view}
        setView={setView}
        onCreate={() => {
          setEditData(null);
          setOpenForm(true);
        }}
        onRefresh={fetchCalendar}
        departments={departments}
      />

      {/* 🔥 FORM */}
      <CalendarForm
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        departments={departments}
        editData={editData}
      />

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calendars.map((cal) => (
          <CalendarCard
            key={cal._id}
            data={cal}
onView={() => navigate(`/admin/calendar/${cal._id}`)}            onEdit={() => {
              setEditData(cal);
              setOpenForm(true);
            }}
            onDelete={() => handleDelete(cal._id)}
          />
        ))}
      </div>

    </div>
  );
};

export default CalenderMgmt;