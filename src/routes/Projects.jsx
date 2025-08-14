// src/routes/Projects.jsx
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import AddTask from "../components/AddTask";
import KanbanBoard from "../components/KanbanBoard";
import TaskModal from "../components/TaskModal";
import { getTasks, updateTaskFields, moveTaskToSection } from "../api/asana";
import { mapAsanaTask } from "../utils/taskMapper";

const STATUSES = ["To Do", "In Progress", "Done"];

const Projects = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [loading, setLoading] = useState(true);

  // modal state
  const [activeTask, setActiveTask] = useState(null); // object or null
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getTasks();
        const mapped = raw.map(mapAsanaTask);
        setTasks(mapped);
      } catch (e) {
        console.error("Failed to load tasks:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addTask = (newTask) => setTasks((prev) => [...prev, newTask]);

  // Filter + search (memoized for perf/readability)
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

  // ===== Drag & Drop =====
  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/taskId", String(taskId));
  };

  const onDropToStatus = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/taskId");
    if (!taskId) return;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // TODO: Persist via Flowgear → Asana sections
    try {
      await moveTaskToSection(/* taskId, sectionGidMappedFrom(newStatus) */);
    } catch (err) {
      console.error("Move failed, reverting...", err);
      // revert if needed (simple way: reload from server)
      try {
        const raw = await getTasks();
        setTasks(raw.map(mapAsanaTask));
      } catch {}
    }
  };

  // ===== Modal open/close =====
  const openTask = (task, edit = false) => {
    setActiveTask(task);
    setIsEditing(edit);
  };
  const closeTask = () => {
    setActiveTask(null);
    setIsEditing(false);
  };

  // ===== Save edits (optimistic) =====
  const saveTask = async (updated) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    closeTask();

    try {
      await updateTaskFields(/* updated.id, buildPatchFrom(updated) */);
    } catch (err) {
      console.error("Save failed, reverting...", err);
      // revert by refetching
      try {
        const raw = await getTasks();
        setTasks(raw.map(mapAsanaTask));
      } catch {}
    }
  };

  if (loading) return <p className="m-4">Loading tasks...</p>;

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

      <KanbanBoard
        statuses={STATUSES}
        tasks={filteredTasks}
        onDragStart={onDragStart}
        onDropToStatus={onDropToStatus}
        onCardClick={(t) => openTask(t, false)}
        onCardEdit={(t) => openTask(t, true)}
      />

      <AddTask onAdd={addTask} />

      {/* Details / Edit modal */}
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
