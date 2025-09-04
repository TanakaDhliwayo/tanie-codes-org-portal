// src/components/AddTask.jsx
import React from "react";
import "../styles/AddTask.css";

const AddTask = ({ onAdd }) => {
  const handleAdd = () => {
    const draftTask = {
      id: null,
      name: "",
      description: "",
      status: "To Do",
      assignee: "", // assignee: null,
      dueDate: "", // dueDate: null,
    };

    onAdd(draftTask);
  };

  return (
    <button className="floating-add-btn" onClick={handleAdd}>
      ＋ Add Task
    </button>
  );
};

export default AddTask;
