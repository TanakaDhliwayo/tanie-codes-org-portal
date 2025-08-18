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
  const sectionName = section?.name || null;
  const sectionGid = section?.gid || null;

  return {
    id: task.gid,
    name: task.name || "Untitled Task",
    description: task.notes || "No description",
    status: normalizeStatus(sectionName),
    assignee: task.assignee?.name || "Unassigned",
    dueDate: task.due_on || "N/A",
    section_name: sectionName,
    section_gid: sectionGid,
    _raw: task,
  };
}
