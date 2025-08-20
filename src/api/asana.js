// src/api/asana.js
const BASE_URL = "https://api-test-triaseyg.flowgear.net/asana";

const AUTH_KEY = process.env.REACT_APP_FLOWGEAR_KEY;

// Get tasks for a given project_gid
export async function getTasks(project_gid) {
  if (!project_gid) throw new Error("No project_gid provided");

  const url = `${BASE_URL}/task?auth-key=${AUTH_KEY}&project_gid=${project_gid}&opt_fields=gid,name,notes,memberships.section.name,assignee.name,due_on`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  return json.data || [];
}
export async function moveTaskToSection(taskId, projectId, sectionName) {
  const response = await fetch(`${BASE_URL}/task/move`, {
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
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    console.error("Move task failed:", json, response.status);
    throw new Error(`Failed to move task: ${json?.Message || response.status}`);
  }
  return response.json();
}

// Get all projects for dropdown
export async function getProjects() {
  const url = `${BASE_URL}/projects?auth-key=${AUTH_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  return json.data || [];
}

// Nhelper function: update task fields
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

// Create a new task in a project via Flowgear
export async function createTask(projectId, fields) {
  const response = await fetch(`${BASE_URL}/task/create?auth-key=${AUTH_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        projects: [projectId], //  Asana expects array of project IDs
        name: fields.name,
        notes: fields.notes || "",
      },
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.Message || "Failed to create task");
  }
  return json.data;
}
