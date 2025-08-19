// src/routes/Projects.jsx
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import AddTask from "../components/AddTask";
import KanbanBoard from "../components/KanbanBoard";
import TaskModal from "../components/TaskModal";
import {
  getTasks,
  getProjects,
  updateTaskFields,
  moveTaskToSection,
} from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";
import { createTask } from "../api/asana";

const STATUSES = ["To Do", "In Progress", "Done"];

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTask, setActiveTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Load projects first, then select default and fetch tasks
  useEffect(() => {
    (async () => {
      try {
        const allProjects = await getProjects();
        setProjects(allProjects);

        if (allProjects.length > 0) {
          const defaultProject = allProjects[0];
          setSelectedProject(defaultProject.gid);

          const raw = await getTasks(defaultProject.gid);
          setTasks(raw.map(mapAsanaTask));
        }
      } catch (e) {
        console.error("Failed to load projects or tasks:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Fetch tasks when project changes
  useEffect(() => {
    if (!selectedProject) return;
    (async () => {
      try {
        setLoading(true);
        const raw = await getTasks(selectedProject);
        setTasks(raw.map(mapAsanaTask));
      } catch (e) {
        console.error("Failed to load tasks:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedProject]);

  const addTask = () => {
    const draftTask = {
      id: null, // temporary ID
      name: "",
      description: "",
      status: "To Do",
      assignee: null,
      due_on: null,
    };
    setActiveTask(draftTask);
    setIsEditing(true);
  };

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => {
      const matchesSearch =
        (t.name || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q);
      const matchesAssignee = filterAssignee
        ? t.assignee === filterAssignee
        : true;
      return matchesSearch && matchesAssignee;
    });
  }, [tasks, searchQuery, filterAssignee]);

  // Drag & Drop
  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/taskId", taskId);
  };

  const onDropToStatus = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/taskId");
    if (!taskId) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await moveTaskToSection(taskId, selectedProject, newStatus);
    } catch (err) {
      console.error("Move failed, reverting...", err);
      try {
        const raw = await getTasks(selectedProject);
        setTasks(raw.map(mapAsanaTask));
      } catch {}
    }
  };

  // Modal
  const openTask = (task, edit = false) => {
    setActiveTask(task);
    setIsEditing(edit);
  };

  const closeTask = () => {
    setActiveTask(null);
    setIsEditing(false);
  };

  const saveTask = async (updated) => {
    closeTask();
    try {
      let saved;
      if (!updated.id) {
        // NEW TASK → call Flowgear create workflow
        saved = await createTask(selectedProject, {
          name: updated.name,
          notes: updated.description || "",
        });
      } else {
        // EXISTING TASK → update workflow
        saved = await updateTaskFields(updated.id, selectedProject, updated);
      }

      // Map back into frontend model
      const mapped = mapAsanaTask(saved);

      setTasks((prev) => {
        if (!updated.id) {
          // new task → append
          return [...prev, mapped];
        } else {
          // existing task → replace
          return prev.map((t) => (t.id === mapped.id ? mapped : t));
        }
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  if (loading) return <p className="m-4">Loading...</p>;

  return (
    <div className="container mt-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="form-select"
            style={{ display: "inline-block", width: "auto" }}
          >
            {/* Show a placeholder while loading */}
            {loading && projects.length === 0 && (
              <option disabled>Loading projects...</option>
            )}

            {/* If no projects returned */}
            {!loading && projects.length === 0 && (
              <option disabled>No projects available</option>
            )}

            {/* Map projects to options */}
            {!loading &&
              projects.map((proj) => (
                <option key={proj.gid} value={proj.gid}>
                  {proj.name?.trim() || "Untitled Project"}
                </option>
              ))}
          </select>
        </h2>

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

      <KanbanBoard
        statuses={STATUSES}
        tasks={filteredTasks}
        onDragStart={onDragStart}
        onDropToStatus={onDropToStatus}
        onCardClick={(t) => openTask(t, false)}
        onCardEdit={(t) => openTask(t, true)}
      />
      <AddTask
        onAdd={addTask}
        projectId={selectedProject}
        onOpenTask={openTask}
      />

      {activeTask && (
        <TaskModal
          task={activeTask}
          isEditing={isEditing}
          onClose={closeTask}
          onSave={saveTask}
        />
      )}
    </div>
  );
};

export default Projects;
