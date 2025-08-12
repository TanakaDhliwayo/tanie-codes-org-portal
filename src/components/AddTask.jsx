import React from "react";
import "../styles/AddTask.css";

const AddTask = ({ onAdd }) => {
  const handleAdd = () => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      description: "Task description",
      status: "To Do",
      assignee: "Unassigned",
    };
    onAdd(newTask);
  };

  return (
    <button className="floating-add-btn" onClick={handleAdd}>
      ＋ Add Task
    </button>
  );
};

export default AddTask;
