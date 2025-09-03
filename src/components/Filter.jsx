//src\components\Filter.jsx
import React from "react";

const Filter = ({ selectedAssignee, setSelectedAssignee, users = [] }) => {
  return (
    <select
      className="form-select form-select-sm"
      style={{ width: "150px" }}
      value={selectedAssignee}
      onChange={(e) => setSelectedAssignee(e.target.value)}
    >
      <option value="">All Assignees</option>
      {users.map((user) => (
        <option key={user.gid} value={user.gid}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

export default Filter;
