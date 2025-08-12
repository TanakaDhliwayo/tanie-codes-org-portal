import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import AddTask from "../components/AddTask";
import KanbanBoard from "../components/KanbanBoard";

// ✅ Helper to normalize section names into board statuses
function normalizeStatus(sectionName) {
  if (!sectionName) return "To Do";
  const name = sectionName.toLowerCase();
  if (name.includes("progress")) return "In Progress";
  if (name.includes("done")) return "Done";
  return "To Do";
}

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "https://api-test-triaseyg.flowgear.net/asana/task?auth-key=-3baO-4PbBqzZeb1_BvM7yEzN27fBzgwM80c9hT5vbAnI5pg-qA0nx31_4XQrXIeNp5pHrL1CqDiFcabxCoKHg"
        );

        const json = await res.json();
        console.log("📥 Raw API response:", json);

        let tasksArray = [];

        if (Array.isArray(json.data)) {
          tasksArray = json.data;
        } else if (json.data && typeof json.data === "object") {
          tasksArray = [json.data];
        } else {
          console.warn("⚠️ Unexpected API format:", json);
        }

        const mappedTasks = tasksArray.map((task) => ({
          id: task.gid,
          name: task.name,
          description: task.notes || "No description",
          status: normalizeStatus(task.memberships?.[0]?.section?.name),
          assignee: task.assignee?.name || "Unassigned",
          dueDate: task.due_on || "N/A",
        }));

        console.log("✅ Mapped Tasks:", mappedTasks);
        setTasks(mappedTasks);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesAssignee = filterAssignee
      ? task.assignee === filterAssignee
      : true;

    return matchesSearch && matchesAssignee;
  });

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="container mt-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Projects</h2>
        <div className="d-flex gap-2">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Filter
            selectedAssignee={filterAssignee}
            setSelectedAssignee={setFilterAssignee}
            tasks={tasks}
          />
        </div>
      </div>

      <KanbanBoard tasks={filteredTasks} />

      <AddTask onAdd={addTask} />
    </div>
  );
};

export default Projects;
