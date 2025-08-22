// src/components/TaskCard.jsx
import React from "react";
import "../styles/taskCard.css";

const TaskCard = ({ task, onDragStart, onClick, onEdit }) => {
  const handleClick = (e) => {
    if (e.defaultPrevented) return; // prevent click during drag
    onClick();
  };

  // turn "In Progress" -> "inprogress" for the status class
  const statusKey = (task.status || "To Do").replace(/\s+/g, "").toLowerCase();

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
        <span className="chip">👤 {task.assignee}</span>
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
