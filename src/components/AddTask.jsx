// src/components/AddTask.jsx
import React from "react";
import "../styles/AddTask.css";
import { createTask } from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";

const AddTask = ({ onAdd }) => {
  const handleAdd = () => {
    const draftTask = {
      id: null,
      name: "",
      description: "",
      status: "To Do",
      assignee: "",
      dueDate: "",
    };

    // just call onAdd → Projects.jsx will handle opening the modal
    onAdd(draftTask);
  };

  return (
    <button className="floating-add-btn" onClick={handleAdd}>
      ＋ Add Task
    </button>
  );
};

export default AddTask;
