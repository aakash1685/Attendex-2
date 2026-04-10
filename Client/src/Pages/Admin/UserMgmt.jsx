import React, { useState, useEffect } from "react";
import UserToolbar from "../../Components/Admin/User/UserToolbar";
import AddUserForm from "../../Components/Admin/User/AddUserForm";
import UserCard from "../../Components/Admin/User/UserCard";

const UserMgmt = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDepartments([
      { _id: "1", deptName: "IT" },
      { _id: "2", deptName: "HR" },
    ]);

    setDesignations([
      { _id: "1", desigName: "Developer" },
      { _id: "2", desigName: "HR Manager" },
    ]);

setUsers([
  {
    _id: "1",
    name: "Aakash Patel",
    email: "aakash.patel@gmail.com",
    mobileNo: "9876543210",
    password: "pass123",
    address: "Ahmedabad, Gujarat",
    profilePic: "",
    dept: "1",
    designation: "1",
    gender: "MALE",
    salary: 45000,
    bank: { accNo: "1234567890", ifsc: "HDFC0001234" },
    leaves: {
      CL: { total: 10, used: 3, remaining: 7 },
      SL: { total: 8, used: 2, remaining: 6 },
      PL: { total: 15, used: 5, remaining: 10 },
      LOP: { total: 0, used: 0, remaining: 0 },
    },
    activeStatus: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "2",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    mobileNo: "9123456780",
    password: "rahul@123",
    address: "Delhi, India",
    profilePic: "",
    dept: "2",
    designation: "2",
    gender: "MALE",
    salary: 38000,
    bank: { accNo: "9876543210", ifsc: "SBIN0005678" },
    leaves: {
      CL: { total: 10, used: 5, remaining: 5 },
      SL: { total: 8, used: 4, remaining: 4 },
      PL: { total: 15, used: 7, remaining: 8 },
      LOP: { total: 0, used: 1, remaining: -1 },
    },
    activeStatus: false,
    createdAt: "2025-02-10",
  },
  {
    _id: "3",
    name: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    mobileNo: "9012345678",
    password: "priya@321",
    address: "Mumbai, Maharashtra",
    profilePic: "",
    dept: "1",
    designation: "1",
    gender: "FEMALE",
    salary: 52000,
    bank: { accNo: "4567891230", ifsc: "ICIC0003344" },
    leaves: {
      CL: { total: 10, used: 2, remaining: 8 },
      SL: { total: 8, used: 1, remaining: 7 },
      PL: { total: 15, used: 3, remaining: 12 },
      LOP: { total: 0, used: 0, remaining: 0 },
    },
    activeStatus: true,
    createdAt: "2025-03-05",
  },
  {
    _id: "4",
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    mobileNo: "9988776655",
    password: "vikram@007",
    address: "Jaipur, Rajasthan",
    profilePic: "",
    dept: "2",
    designation: "2",
    gender: "MALE",
    salary: 41000,
    bank: { accNo: "7891234560", ifsc: "PNB0007788" },
    leaves: {
      CL: { total: 10, used: 6, remaining: 4 },
      SL: { total: 8, used: 5, remaining: 3 },
      PL: { total: 15, used: 10, remaining: 5 },
      LOP: { total: 0, used: 2, remaining: -2 },
    },
    activeStatus: true,
    createdAt: "2025-01-25",
  },
  {
    _id: "5",
    name: "Neha Verma",
    email: "neha.verma@gmail.com",
    mobileNo: "9090909090",
    password: "neha@pass",
    address: "Lucknow, UP",
    profilePic: "",
    dept: "1",
    designation: "1",
    gender: "FEMALE",
    salary: 47000,
    bank: { accNo: "3216549870", ifsc: "AXIS0001122" },
    leaves: {
      CL: { total: 10, used: 4, remaining: 6 },
      SL: { total: 8, used: 3, remaining: 5 },
      PL: { total: 15, used: 6, remaining: 9 },
      LOP: { total: 0, used: 0, remaining: 0 },
    },
    activeStatus: false,
    createdAt: "2025-02-20",
  },
  {
    _id: "6",
    name: "Arjun Desai",
    email: "arjun.desai@gmail.com",
    mobileNo: "8888888888",
    password: "arjun@456",
    address: "Surat, Gujarat",
    profilePic: "",
    dept: "2",
    designation: "2",
    gender: "MALE",
    salary: 60000,
    bank: { accNo: "6549873210", ifsc: "KOTAK0005566" },
    leaves: {
      CL: { total: 10, used: 1, remaining: 9 },
      SL: { total: 8, used: 0, remaining: 8 },
      PL: { total: 15, used: 2, remaining: 13 },
      LOP: { total: 0, used: 0, remaining: 0 },
    },
    activeStatus: true,
    createdAt: "2025-03-15",
  },
]);
  }, []);

  // ✅ Save handler
  const handleSave = (data) => {
    console.log("User Data 👉", data);

    setUsers((prev) => [
      ...prev,
      { ...data, _id: Date.now(), createdAt: new Date() },
    ]);

    setOpen(false);
  };

  const handleEdit = (user) => {
  console.log("Edit 👉", user);
  setOpen(true);
};

const handleToggle = (user) => {
  setUsers((prev) =>
    prev.map((u) =>
      u._id === user._id
        ? { ...u, activeStatus: !u.activeStatus }
        : u
    )
  );
};

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <UserToolbar
        departments={departments}
        onSearch={setSearch}
        onSort={setSort}
        onFilter={setFilterDept}
        onAdd={() => setOpen(true)}
      />
      <AddUserForm
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        departments={departments}
        designations={designations}
      />

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
  {users.map((u) => {
    const deptName =
      departments.find((d) => d._id === u.dept)?.deptName;

    const desigName =
      designations.find((d) => d._id === u.designation)?.desigName;

    return (
      <UserCard
        key={u._id}
        user={u}
        deptName={deptName}
        desigName={desigName}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />
    );
  })}
</div>
    </div>
  );
};

export default UserMgmt;
