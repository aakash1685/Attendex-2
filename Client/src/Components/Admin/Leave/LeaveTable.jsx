import React from "react";
import LeaveRow from "./LeaveRow";

const LeaveTable = ({ leaves, refresh }) => {
  return (
<div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <table className="w-full text-sm">
<thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">          <tr>
            <th className="p-4">Employee</th>
            <th>Dept</th>
            <th>Type</th>
            <th>Days</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <LeaveRow key={leave._id} leave={leave} refresh={refresh} />
          ))}
          {leaves.length === 0 && (
  <tr>
    <td colSpan="6" className="text-center py-10 text-gray-400">
      🚫 No Leaves Found
    </td>
  </tr>
)}
        </tbody>
      </table>

    </div>
  );
};

export default LeaveTable;