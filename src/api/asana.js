// src/api/asana.js
const BASE_URL = "https://api-test-triaseyg.flowgear.net/asana";

// ⚠️ Move this to .env.local -> REACT_APP_FLOWGEAR_KEY=yourKeyHere
const AUTH_KEY = process.env.REACT_APP_FLOWGEAR_KEY;

// GET tasks coming from Flowgear (already filtered to your project)
export async function getTasks() {
  const url = `${BASE_URL}/task?auth-key=${AUTH_KEY}&opt_fields=gid,name,notes,memberships.section.name,assignee.name,due_on`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.Message || `Asana API error: ${res.status}`);
  return json.data || [];
}

/**
 * TODO: Persist edits via Flowgear (when you expose endpoints).
 * Below are stubs so the UI can call them optimistically now.
 */
export async function updateTaskFields(/* taskId, payload */) {
  // Example: POST to your Flowgear workflow that proxies Asana "Update a task"
  return { ok: true };
}

// Move to a different section inside the same project
export async function moveTaskToSection(/* taskId, targetSectionGid */) {
  // Example: POST /sections/{section_gid}/addTask with { task: taskId }
  return { ok: true };
}
