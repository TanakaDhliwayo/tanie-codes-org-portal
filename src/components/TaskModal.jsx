import React, { useEffect, useState } from "react";

const STATUSES = ["To Do", "In Progress", "Done"];

const TaskModal = ({
  task,
  isEditing = false,
  onClose,
  onSave,
  users = [],
}) => {
  const [form, setForm] = useState(task);
  const [editing, setEditing] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...task }));
    setEditing(isEditing);
  }, [task, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Normalize due date: empty string → null, otherwise keep YYYY-MM-DD
      const dueDate =
        form.dueDate && form.dueDate.trim() !== "" ? form.dueDate : null;

      // Convert modal form fields to the structure saveTask expects
      const taskPayload = {
        id: form.id || null,
        name: form.name,
        description: form.description || "",
        assignee: form.assignee || null,
        dueDate, // normalized
      };

      await onSave(taskPayload);
      onClose();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editing ? "Edit Task" : "Task Details"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {editing ? (
              <>
                {/* Title */}
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  />
                </div>

                {/* Assignee dropdown */}
                <div className="mb-2">
                  <label className="form-label">Assignee</label>
                  <select
                    name="assignee"
                    value={form.assignee || ""}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.gid} value={user.gid}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="mb-2">
                  <label className="form-label">Due date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Status (disabled, auto-managed) */}
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    disabled
                    className="form-select"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <h6 className="mb-1">{form.name}</h6>
                <p className="mb-2">{form.description}</p>
                <p className="mb-1">
                  <strong>Assignee:</strong>{" "}
                  {form.assignee
                    ? users.find((u) => u.gid === form.assignee)?.name ||
                      "Unknown"
                    : "Unassigned"}
                </p>
                <p className="mb-1">
                  <strong>Due:</strong> {form.dueDate || "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Status:</strong> {form.status}
                </p>
              </>
            )}
          </div>

          <div className="modal-footer">
            {editing ? (
              <>
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
