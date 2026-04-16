const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");

const buildWelcomeMailTemplate = (employee, rawPassword) => {
  const fullName = employee.name || "Employee";
  const leaveRows = ["CL", "SL", "PL", "LOP"]
    .map((type) => {
      const leave = employee.leaves?.[type] || {};
      return `<tr>
          <td style="padding:8px;border:1px solid #e2e8f0;">${type}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${leave.total ?? 0}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${leave.used ?? 0}</td>
          <td style="padding:8px;border:1px solid #e2e8f0;">${leave.remaining ?? 0}</td>
        </tr>`;
    })
    .join("");

  return `
  <div style="font-family:Arial,sans-serif;background:#f1f5f9;padding:24px;color:#0f172a;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="padding:22px;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#ffffff;">
        <h2 style="margin:0;font-size:22px;">Welcome to Attendex</h2>
        <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">Your employee account has been created successfully.</p>
      </div>
      <div style="padding:20px;">
        <p style="margin-top:0;">Hello <strong>${fullName}</strong>,</p>
        <p>Please use the credentials and profile details below for your first login.</p>
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:14px;">
          <p style="margin:0 0 6px;"><strong>Login Email:</strong> ${employee.email || "-"}</p>
          <p style="margin:0 0 6px;"><strong>Temporary Password:</strong> ${rawPassword}</p>
          <p style="margin:0;"><strong>First Login Action:</strong> Change your password immediately after login.</p>
        </div>

        <h3 style="margin:18px 0 8px;font-size:16px;">Employee Details</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.name || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Mobile</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.mobileNo || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Department</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.dept?.deptName || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Designation</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.designation?.desigName || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Salary</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">₹ ${Number(employee.salary || 0).toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Bank Account</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.bank?.accNo || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>IFSC</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.bank?.ifsc || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Profile Photo</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${employee.profilePic || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;"><strong>Created At</strong></td><td style="padding:8px;border:1px solid #e2e8f0;">${new Date(employee.createdAt).toLocaleString("en-IN")}</td></tr>
        </table>

        <h3 style="margin:18px 0 8px;font-size:16px;">Leave Information</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr style="background:#f8fafc;">
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">Type</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">Total</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">Used</th>
            <th style="padding:8px;border:1px solid #e2e8f0;text-align:left;">Remaining</th>
          </tr>
          ${leaveRows}
        </table>

        <p style="margin-top:16px;color:#334155;font-size:13px;">If you didn't expect this email, contact your HR administrator immediately.</p>
      </div>
    </div>
  </div>
  `;
};

const createUserService = async (data, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can create users!",
    };
  }

  const normalizedEmail = String(data.email || "")
    .trim()
    .toLowerCase();
  const normalizedMobile = Number(data.mobileNo);

  const existingUser = await userModel.findOne({
    $or: [{ email: normalizedEmail }, { mobileNo: normalizedMobile }],
  });

  if (existingUser) {
    return {
      success: false,
      status: 400,
      message: "Employee already created",
    };
  }

  const rawPassword = `${String(data.name || "")
    .replace(/\s/g, "")
    .toLowerCase()}@123`;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await userModel.create({
    ...data,
    email: normalizedEmail,
    mobileNo: normalizedMobile,
    password: hashedPassword,
    initialPassword: rawPassword,
  });

  const createdEmployee = await userModel
    .findById(user._id)
    .populate("dept", "deptName")
    .populate("designation", "desigName");

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Attendex | Employee Account Created",
      html: buildWelcomeMailTemplate(createdEmployee, rawPassword),
    });
  } catch (error) {
    console.error("WELCOME EMAIL ERROR:", error.message);
  }

  return {
    success: true,
    status: 201,
    message: "Employee Created Successsfully!",
    data: {
      id: user._id,
      email: user.email,
      mobileNo: user.mobileNo,
      password: rawPassword,
    },
  };
};

const editUserService = async (userId, data, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only admin can create users!",
    };
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return {
      success: false,
      status: 404,
      message: "Employee not found",
    };
  }

  delete data.password;

  if (data.email) {
    data.email = String(data.email).trim().toLowerCase();
  }

  if (data.mobileNo) {
    data.mobileNo = Number(data.mobileNo);
  }

  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true },
  );

  return {
    success: true,
    status: 200,
    message: "Employee Updated Successfully",
    data: updateUser,
  };
};

const deactiveUserService = async (userId, admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Only Admin can Deactivate Employee",
    };
  }

  await userModel.findByIdAndUpdate(userId, {
    activeStatus: false,
  });

  return {
    success: true,
    status: 200,
    message: "Employee Deactivated successfully",
  };
};

const getAllUsersService = async (admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Admin only",
    };
  }

  const employees = await userModel
    .find({ activeStatus: true })
    .select("-password")
    .populate("dept", "deptName")
    .populate("designation", "desigName");

  return {
    success: true,
    status: 200,
    message: "Employees fetched successfully!",
    employees,
  };
};

const getAllDeactiveUsersService = async (admin) => {
  if (!admin || admin.role !== "ADMIN") {
    return {
      success: false,
      status: 403,
      message: "Admin only",
    };
  }

  const employees = await userModel
    .find({ activeStatus: false })
    .select("-password")
    .populate("dept", "deptName")
    .populate("designation", "desigName");

  return {
    success: true,
    status: 200,
    message: "All Deactivated Employees fetched successfully!",
    employees,
  };
};

module.exports = {
  createUserService,
  editUserService,
  deactiveUserService,
  getAllUsersService,
  getAllDeactiveUsersService,
};
