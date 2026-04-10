export const STATUS_OPTIONS = [
  { label: "Present", value: "PRESENT" },
  { label: "Absent", value: "ABSENT" },
  { label: "Half Day", value: "HALF_DAY" },
  { label: "Leave", value: "LEAVE" },
];

export const VIEW_OPTIONS = [
  { label: "All Records", value: "all" },
  { label: "Employee View", value: "employee" },
  { label: "Department View", value: "department" },
];

export const getStatusClasses = (status = "") => {
  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case "PRESENT":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "ABSENT":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    case "HALF_DAY":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "LEAVE":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
};

export const formatStatusLabel = (status = "") =>
  status
    .toUpperCase()
    .split("_")
    .filter(Boolean)
    .map((chunk) => chunk[0] + chunk.slice(1).toLowerCase())
    .join(" ");

export const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatHours = (record) => {
  if (typeof record?.workingHours === "number" && record.workingHours > 0) {
    return `${record.workingHours.toFixed(1)} hrs`;
  }

  if (!record?.checkInTime || !record?.checkOutTime) {
    return "--";
  }

  const start = new Date(record.checkInTime);
  const end = new Date(record.checkOutTime);
  const diffMs = end.getTime() - start.getTime();

  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return "--";
  }

  return `${(diffMs / (1000 * 60 * 60)).toFixed(1)} hrs`;
};

export const getMonthInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
};

export const getSummaryParams = (monthValue, deptId) => {
  const [year, month] = (monthValue || "").split("-");

  return {
    ...(year ? { year } : {}),
    ...(month ? { month } : {}),
    ...(deptId ? { deptId } : {}),
  };
};

export const getEmployeeDepartmentId = (employee) =>
  employee?.dept?._id || employee?.dept || "";

export const getEmployeeDepartmentName = (employee) =>
  employee?.dept?.deptName || employee?.deptName || "--";

export const buildAttendanceQuery = (viewMode, filters) => {
  const query = {};

  if (viewMode === "all") {
    if (filters.empId) query.empId = filters.empId;
    if (filters.deptId) query.deptId = filters.deptId;
    if (filters.attendanceStatus) {
      query.attendanceStatus = filters.attendanceStatus;
    }
    if (filters.date) {
      query.date = filters.date;
      return query;
    }
  } else if (filters.attendanceStatus) {
    query.status = filters.attendanceStatus;
  }

  if (filters.fromDate) query.fromDate = filters.fromDate;
  if (filters.toDate) query.toDate = filters.toDate;

  return query;
};
