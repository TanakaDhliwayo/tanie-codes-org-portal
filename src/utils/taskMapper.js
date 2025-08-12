// src/utils/taskMapper.js
function normalizeStatus(sectionName) {
  if (!sectionName) return "To Do";
  const name = sectionName.toLowerCase();

  if (name.includes("progress")) return "In Progress";
  if (name.includes("done")) return "Done";
  return "To Do";
}

export function mapAsanaTask(task) {
  return {
    id: task.gid,
    name: task.name || "Untitled Task",
    description: task.notes || "No description",
    status: normalizeStatus(task.memberships?.[0]?.section?.name),
    assignee: task.assignee?.name || "Unassigned",
    dueDate: task.due_on || "N/A",
  };
}
