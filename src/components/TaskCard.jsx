// src/components/TaskCard.jsx
import React from "react";

const TaskCard = ({ task, onDragStart, onClick, onEdit }) => (
  <div
    className="card mb-3 shadow-sm"
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
    onClick={onClick}
    style={{
      borderRadius: "10px",
      padding: "10px",
      cursor: "pointer",
      backgroundColor: "#fdfdfd",
    }}
  >
    <div className="fw-semibold text-truncate" title={task.name}>
      {task.name}
    </div>

    <div className="d-flex justify-content-between align-items-center mt-2">
      <small className="text-muted">👤 {task.assignee}</small>
      <small className="text-muted">📅 {task.dueDate}</small>
    </div>

    <div className="mt-2">
      <button
        className="btn btn-sm btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        Edit
      </button>
    </div>
  </div>
);

export default TaskCard;
