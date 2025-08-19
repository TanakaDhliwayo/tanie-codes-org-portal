// src/components/AddTask.jsx
import React from "react";
import "../styles/AddTask.css";
import { createTask } from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";

const AddTask = ({ onAdd, projectId, onOpenTask }) => {
  const handleAdd = async () => {
    try {
      const newTask = await createTask(projectId, {
        name: "New Task",
        notes: "Created from frontend",
      });

      // Force section = "To Do"
      const mapped = mapAsanaTask({
        ...newTask,
        memberships: [{ section: { name: "To Do" } }],
      });

      onAdd(mapped);
      onOpenTask(mapped, true); // immediately open in edit mode
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("❌ Could not create task");
    }
  };

  return (
    <button className="floating-add-btn" onClick={handleAdd}>
      ＋ Add Task
    </button>
  );
};

export default AddTask;
