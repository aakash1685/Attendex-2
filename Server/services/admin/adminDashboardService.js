const userModel = require("../../models/userModel");
const deptModel = require("../../models/deptModel");
const desigModel = require("../../models/desigModel");
const attendanceModel = require("../../models/attendanceModel");
const leavesModel = require("../../models/leavesModel");
const adminCheck = require("../../utils/adminCheck");

const getAdminDashboardOverviewService = async (admin) => {
  const check = adminCheck(admin);
  if (check) return check;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const nextMonthStart = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 1);

  const [
    totalUsers,
    activeUsers,
    totalDepartments,
    activeDepartments,
    totalDesignations,
    attendanceToday,
    leaveStatusThisMonth,
    recentLeaves,
    recentUsers,
  ] = await Promise.all([
    userModel.countDocuments({}),
    userModel.countDocuments({ activeStatus: true }),
    deptModel.countDocuments({}),
    deptModel.countDocuments({ activeStatus: true }),
    desigModel.countDocuments({ activeStatus: true }),
    attendanceModel.aggregate([
      { $match: { date: { $gte: todayStart, $lt: todayEnd } } },
      { $group: { _id: "$attendanceStatus", count: { $sum: 1 } } },
    ]),
    leavesModel.aggregate([
      {
        $match: {
          startDate: { $gte: monthStart, $lt: nextMonthStart },
        },
      },
      { $group: { _id: "$leaveStatus", count: { $sum: 1 } } },
    ]),
    leavesModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("empId", "name")
      .lean(),
    userModel.find({}).sort({ createdAt: -1 }).limit(5).select("name email createdAt").lean(),
  ]);

  const attendanceSummary = {
    total: 0,
    PRESENT: 0,
    ABSENT: 0,
    HALF_DAY: 0,
    LEAVE: 0,
  };

  attendanceToday.forEach((record) => {
    attendanceSummary[record._id] = record.count;
    attendanceSummary.total += record.count;
  });

  const leaveSummary = {
    total: 0,
    APPROVED: 0,
    REJECTED: 0,
    PENDING: 0,
  };

  leaveStatusThisMonth.forEach((record) => {
    leaveSummary[record._id] = record.count;
    leaveSummary.total += record.count;
  });

  const presentRate = totalUsers > 0 ? Number(((attendanceSummary.PRESENT / totalUsers) * 100).toFixed(1)) : 0;
  const pendingLeaveRate = leaveSummary.total > 0
    ? Number(((leaveSummary.PENDING / leaveSummary.total) * 100).toFixed(1))
    : 0;

  return {
    status: 200,
    success: true,
    message: "Admin dashboard overview fetched successfully",
    data: {
      organization: {
        totalUsers,
        activeUsers,
        inactiveUsers: Math.max(totalUsers - activeUsers, 0),
        totalDepartments,
        activeDepartments,
        totalDesignations,
      },
      attendanceToday: {
        ...attendanceSummary,
        presentRate,
      },
      leavesThisMonth: {
        ...leaveSummary,
        pendingRate: pendingLeaveRate,
      },
      recentActivity: {
        leaves: recentLeaves.map((leave) => ({
          _id: leave._id,
          leaveType: leave.leaveType,
          leaveStatus: leave.leaveStatus,
          totalDays: leave.totalDays,
          startDate: leave.startDate,
          endDate: leave.endDate,
          employeeName: leave.empId?.name || "Unknown",
          createdAt: leave.createdAt,
        })),
        users: recentUsers,
      },
      generatedAt: new Date().toISOString(),
    },
  };
};

module.exports = {
  getAdminDashboardOverviewService,
};
