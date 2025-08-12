// src/api/asana.js
const BASE_URL = "https://api-test-triaseyg.flowgear.net/asana";

export async function getTasks() {
  const url = `${BASE_URL}/task?opt_fields=name,notes,memberships.section.name,assignee.name,due_on`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Asana API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}
