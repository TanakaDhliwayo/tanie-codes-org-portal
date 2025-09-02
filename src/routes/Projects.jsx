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
  createTask,
} from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";
import Loader from "../components/loader";
import "../styles/loader.css";
import { getUsers } from "../api/asana";

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

  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const allUsers = await getUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    })();
  }, []);

  //  Load projects first, then select default and fetch tasks
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

  //  Fetch tasks when project changes
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

  //  Add new task → open modal immediately in edit mode
  const addTask = () => {
    const draftTask = {
      id: null,
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
    //
    if (activeTask && activeTask.id === null) {
      setActiveTask(null);
      setIsEditing(false);
      return;
    }
    setActiveTask(null);
    setIsEditing(false);
  };
  const saveTask = async (updated) => {
    try {
      if (!updated.id) {
        // ✅ Optimistically add task
        const tempId = `temp-${Date.now()}`;
        const tempTask = {
          id: tempId,
          name: updated.name,
          description: updated.description || "",
          status: "To Do",
          assignee: updated.assignee || null,
          dueDate: updated.dueDate || null,
        };

        setTasks((prev) => [...prev, tempTask]); // show instantly

        // Call Asana API
        const saved = await createTask(selectedProject, {
          name: updated.name,
          notes: updated.description || "",
          assignee: updated.assignee || null,
          due_on: updated.dueDate || null,
        });

        const mapped = mapAsanaTask(saved);

        // ✅ Replace temp with Asana task
        setTasks((prev) => prev.map((t) => (t.id === tempId ? mapped : t)));
      } else {
        // ✅ Optimistically update existing
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
        );

        // Call Asana API
        const saved = await updateTaskFields(updated.id, {
          name: updated.name,
          notes: updated.description || "",
          assignee: updated.assignee || null,
          due_on: updated.dueDate || null,
        });

        const mapped = mapAsanaTask(saved);

        // ✅ Sync final version
        setTasks((prev) => prev.map((t) => (t.id === mapped.id ? mapped : t)));
      }

      closeTask();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save task. Please try again.");
    }
  };

  if (loading)
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Loader title="getting tasks" />
      </div>
    );

  return (
    <>
      {/* 🔹 Top section stays white inside the container */}
      <div className="container mt-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="form-select"
              style={{ display: "inline-block", width: "auto" }}
            >
              {loading && projects.length === 0 && (
                <option disabled>Loading projects...</option>
              )}
              {!loading && projects.length === 0 && (
                <option disabled>No projects available</option>
              )}
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
              users={users}
            />
          </div>
        </div>
      </div>

      {/*Full-width gray section below the white header */}
      <div className="kanban-section">
        <div className="container">
          <KanbanBoard
            key={tasks.length}
            statuses={STATUSES}
            tasks={filteredTasks}
            users={users}
            onDragStart={onDragStart}
            onDropToStatus={onDropToStatus}
            onCardClick={(t) => openTask(t, false)}
            onCardEdit={(t) => openTask(t, true)}
          />
          <AddTask onAdd={addTask} projectId={selectedProject} />
        </div>
      </div>

      {activeTask && (
        <TaskModal
          task={activeTask}
          isEditing={isEditing}
          onClose={closeTask}
          onSave={saveTask}
          users={users}
        />
      )}
    </>
  );
};

export default Projects;
