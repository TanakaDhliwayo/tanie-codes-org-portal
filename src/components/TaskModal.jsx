// src/components/TaskModal.jsx
import React, { useEffect, useState } from "react";

const STATUSES = ["To Do", "In Progress", "Done"];

const TaskModal = ({ task, isEditing = false, onClose, onSave }) => {
  const [form, setForm] = useState(task);
  const [editing, setEditing] = useState(isEditing);

  useEffect(() => {
    setForm(task);
    setEditing(isEditing);
  }, [task, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
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
                <div className="mb-2">
                  <label className="form-label">Assignee (text)</label>
                  <input
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Due date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate === "N/A" ? "" : form.dueDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    disabled // Status is auto-managed
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
                  <strong>Assignee:</strong> {form.assignee}
                </p>
                <p className="mb-1">
                  <strong>Due:</strong> {form.dueDate}
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
                  onClick={() => onSave(form)}
                >
                  Save
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
