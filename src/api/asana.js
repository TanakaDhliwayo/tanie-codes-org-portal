// src/api/asana.js
const BASE_URL = "https://api-test-triaseyg.flowgear.net/asana";
const AUTH_KEY = process.env.REACT_APP_FLOWGEAR_KEY;

// Get tasks for a given project_gid
export async function getTasks(project_gid) {
  if (!project_gid) throw new Error("No project_gid provided");

  const url = `${BASE_URL}/task?auth-key=${AUTH_KEY}&project_gid=${project_gid}&opt_fields=gid,name,notes,memberships.section.name,assignee.gid,assignee.name,due_on`;
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
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  return json.data || [];
}

// Update an existing Asana task via Flowgear
export async function updateTaskFields(taskId, projectId, fields) {
  const response = await fetch(`${BASE_URL}/task/update?auth-key=${AUTH_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        task_gid: taskId,
        project_gid: projectId,
        name: fields.name,
        notes: fields.description || "",
        assignee: fields.assignee || null,
        due_on: fields.dueDate?.trim() ? fields.dueDate : undefined,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to update task: ${err}`);
  }

  return response.json();
}

// Get all users in the workspace
export async function getUsers() {
  const url = `${BASE_URL}/users?auth-key=${AUTH_KEY}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

// Create a new task in a project via Flowgear
export async function createTask(projectId, fields) {
  const response = await fetch(`${BASE_URL}/task/create?auth-key=${AUTH_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        projects: [projectId],
        name: fields.name,
        notes: fields.description || "",
        assignee: fields.assignee || null,
        due_on: fields.dueDate?.trim() ? fields.dueDate : undefined,
      },
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.Message || "Failed to create task");
  }
  return json.data;
}
