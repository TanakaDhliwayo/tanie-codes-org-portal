// src/components/TaskCard.jsx
import React from "react";
import "../styles/taskCard.css";

const TaskCard = ({ task, users = [], onDragStart, onClick, onEdit }) => {
  const handleClick = (e) => {
    if (e.defaultPrevented) return;
    onClick();
  };

  const statusKey = (task.status || "To Do").replace(/\s+/g, "").toLowerCase();

  const assigneeName = task.assignee
    ? users.find((u) => u.gid === task.assignee)?.name || "Unknown"
    : "Unassigned";

  return (
    <div
      className={`card task-card mb-3 shadow-sm status-${statusKey}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={handleClick}
      title={task.name}
    >
      <div className="task-title">{task.name}</div>

      <div className="task-meta">
        <span className="chip">👤 {assigneeName}</span>
        <span className="chip">📅 {task.dueDate}</span>
      </div>

      <div className="task-actions">
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
};

export default TaskCard;
