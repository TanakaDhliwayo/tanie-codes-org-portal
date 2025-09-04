// src/utils/taskMapper.js

function normalizeStatus(sectionName) {
  if (!sectionName) return "To Do";
  const name = sectionName.toLowerCase();
  if (name.includes("progress") || name.includes("doing")) return "In Progress";
  if (name.includes("done")) return "Done";
  return "To Do";
}

export function mapAsanaTask(task) {
  const section = task.memberships?.[0]?.section || {};
  const project = task.memberships?.[0]?.project || {};

  return {
    id: task.gid,
    name: task.name || "Untitled Task",
    description: task.notes || "No description",
    status: normalizeStatus(section.name),
    assignee: task.assignee?.gid || "",
    dueDate: task.due_on || "",

    section_name: section.name || null,
    section_gid: section.gid || null,
    project_gid: project.gid || null,
    _raw: task,
  };
}
