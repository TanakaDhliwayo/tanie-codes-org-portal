import React from "react";

const TaskCard = ({ task }) => (
  <div
    className="card mb-3 shadow-sm"
    style={{
      height: "120px",
      borderRadius: "10px",
      padding: "10px",
      cursor: "pointer",
      backgroundColor: "#fdfdfd",
    }}
  >
    <div className="fw-semibold">{task.name}</div>
    <div className="d-flex justify-content-between align-items-center mt-3">
      <small className="text-muted">👤 {task.assignee}</small>
      <small className="text-muted">📅 {task.dueDate}</small>
    </div>
  </div>
);

export default TaskCard;
