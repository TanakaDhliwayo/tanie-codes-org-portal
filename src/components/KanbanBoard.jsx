//components/KanbanBoard.jsx
import TaskCard from "./TaskCard";
import "../styles/kanban.css";

const KanbanBoard = ({
  statuses,
  tasks,
  onDragStart,
  onDropToStatus,
  onCardClick,
  onCardEdit,
}) => {
  return (
    <div className="kanban-board d-flex justify-content-between gap-2">
      {statuses.map((status, i) => (
        <div
          key={status}
          className={`kanban-column ${
            i < statuses.length - 1 ? "with-border" : ""
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropToStatus(e, status)}
        >
          <h5 className="kanban-title">{status}</h5>
          {tasks
            .filter((t) => t.status === status)
            .map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onDragStart={onDragStart}
                onClick={() => onCardClick(t)}
                onEdit={() => onCardEdit(t)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
