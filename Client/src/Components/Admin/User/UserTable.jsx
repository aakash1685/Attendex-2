import React from "react";
import UserCard from "./UserCard";

const UserTable = ({ users, loading, error, onEdit, onToggleStatus }) => {
  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading users...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>;
  }

  if (!users.length) {
    return <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">No Users Found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user._id} user={user} onEdit={onEdit} onToggle={onToggleStatus} />
      ))}
    </div>
  );
};

export default UserTable;
