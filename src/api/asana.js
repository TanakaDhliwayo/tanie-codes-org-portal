// src/api/asana.js
const BASE_URL = "https://api-test-triaseyg.flowgear.net/asana";

const AUTH_KEY = process.env.REACT_APP_FLOWGEAR_KEY;

// GET tasks coming from Flowgear (already filtered to the project)
export async function getTasks() {
  const url = `${BASE_URL}/task?auth-key=${AUTH_KEY}&opt_fields=gid,name,notes,memberships.section.name,assignee.name,due_on`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  return json.data || [];
}

export async function moveTaskToSection(taskId, projectId, sectionName) {
  const response = await fetch(
    "https://api-test-triaseyg.flowgear.net/asana/task/move",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_KEY}`,
      },
      body: JSON.stringify({
        task_gid: taskId,
        project_gid: projectId,
        section_name: sectionName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to move task");
  }
  return response.json();
}

// New helper function: update task fields
export async function updateTaskFields(taskId, projectId, fields) {
  const response = await fetch(
    "https://api-test-triaseyg.flowgear.net/asana/task/update",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_gid: taskId,
        project_gid: projectId,
        fields,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
}
