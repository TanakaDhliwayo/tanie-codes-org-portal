import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom"; // 👈 add this
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
  getUsers,
} from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";
import Loader from "../components/loader";
import "../styles/loader.css";

const STATUSES = ["To Do", "In Progress", "Done"];

const Projects = () => {
  const { projectId } = useParams(); // 👈 read projectId from URL

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);

  // Load users
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

  // Load projects and set selectedProject
  useEffect(() => {
    (async () => {
      try {
        const allProjects = await getProjects();
        setProjects(allProjects);

        if (projectId) {
          setSelectedProject(projectId);
        } else if (allProjects.length > 0) {
          setSelectedProject(allProjects[0].gid);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  // Load tasks when selectedProject changes
  useEffect(() => {
    if (!selectedProject) return;
    (async () => {
      setLoading(true);
      try {
        const raw = await getTasks(selectedProject);
        setTasks(raw.map(mapAsanaTask));
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedProject]);

  const addTask = () => {
    setActiveTask({
      id: null,
      name: "",
      description: "",
      status: "To Do",
      assignee: "",
      dueDate: "",
    });
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

  const openTask = (task, edit = false) => {
    setActiveTask(task);
    setIsEditing(edit);
  };

  const closeTask = () => {
    setActiveTask(null);
    setIsEditing(false);
  };

  const saveTask = async (updated) => {
    if (!updated.name || updated.name.trim() === "") {
      alert("Task name is required!");
      return;
    }

    if (!updated.id) {
      // Create new task
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...updated, id: tempId };
      setTasks((prev) => [...prev, tempTask]);

      try {
        const saved = await createTask(selectedProject, {
          name: updated.name,
          notes: updated.description || "",
          assignee: updated.assignee || "",
          dueDate: updated.dueDate || "",
        });

        const mapped = mapAsanaTask(saved);
        setTasks((prev) => prev.map((t) => (t.id === tempId ? mapped : t)));
      } catch (err) {
        console.error("Create failed:", err);
        alert("Failed to create task. Please try again.");
        // Rollback temp task
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
      }
    } else {
      // Update existing task
      const prevTasks = [...tasks];
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      );

      try {
        const saved = await updateTaskFields(updated.id, selectedProject, {
          name: updated.name,
          description: updated.description || "",
          assignee: updated.assignee || null,
          dueDate: updated.dueDate || "",
        });

        const mapped = mapAsanaTask(saved);
        setTasks((prev) => prev.map((t) => (t.id === mapped.id ? mapped : t)));
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to save task. Reverting changes.");
        setTasks(prevTasks); // Rollback
      }
    }

    closeTask();
  };

  if (loading)
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Loader title="getting tasks" />
      </div>
    );

  return (
    <>
      <div className="container mt-4 position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="form-select"
              style={{ display: "inline-block", width: "auto" }}
            >
              {projects.length === 0 && (
                <option disabled>No projects available</option>
              )}
              {projects.map((proj) => (
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

      <div className="kanban-section">
        <div className="container">
          <KanbanBoard
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
