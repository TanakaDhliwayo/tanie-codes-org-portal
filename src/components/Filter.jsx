// src/components/Filter.jsx
import React from "react";

const Filter = ({ selectedAssignee, setSelectedAssignee, tasks }) => {
  const assignees = [...new Set(tasks.map((task) => task.assignee))];

  return (
    <select
      className="form-select form-select-sm"
      style={{ width: "150px" }}
      value={selectedAssignee}
      onChange={(e) => setSelectedAssignee(e.target.value)}
    >
      <option value="">All Assignees</option>
      {assignees.map((assignee, index) => (
        <option key={index} value={assignee}>
          {assignee}
        </option>
      ))}
    </select>
  );
};

export default Filter;
