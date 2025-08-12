import React from "react";
import TaskCard from "./TaskCard";
import "../styles/kanban.css";

const KanbanBoard = ({ tasks }) => {
  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="kanban-board d-flex justify-content-between gap-2">
      {statuses.map((status, index) => (
        <div
          key={status}
          className={`kanban-column ${
            index < statuses.length - 1 ? "with-border" : ""
          }`}
        >
          <h5 className="kanban-title">{status}</h5>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
