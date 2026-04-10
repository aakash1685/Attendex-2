import React from "react";
import AttendanceFormModal from "./AttendanceFormModal";

const AttendanceForm = (props) => {
  const key = props.mode === "edit" ? props.record?._id || "edit-closed" : `manual-${props.isOpen ? "open" : "closed"}`;
  return <AttendanceFormModal key={key} {...props} />;
};

export default AttendanceForm;
