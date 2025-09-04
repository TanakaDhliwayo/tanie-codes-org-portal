// src/routes/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/asana";
import Loader from "../components/loader";
import "../styles/loader.css";

const statusMap = {
  green: { label: "On track", class: "text-success" },
  yellow: { label: "At risk", class: "text-warning fw-bold" },
  red: { label: "Off track", class: "text-danger fw-bold" },
  complete: { label: "Complete", class: "text-secondary" },
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const allProjects = await getProjects();
        setProjects(allProjects);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProjects = projects.filter((proj) =>
    proj.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Loader title="loading projects" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">TANIE CODES .ORG</h2>

      {/* Search bar */}
      <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>

      {/* Table */}
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Name</th>
            <th>Assign</th>
            <th>Status</th>
            <th></th> {/* View button column */}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                No projects found
              </td>
            </tr>
          ) : (
            filteredProjects.map((proj) => (
              <tr key={proj.gid} style={{ borderBottom: "1px solid #ddd" }}>
                {/* Name */}
                <td>{proj.name?.trim() || "Untitled Project"}</td>

                {/* First member */}
                <td>{proj.members?.[0]?.name || "—"}</td>

                {/* Status */}
                <td>
                  {proj.current_status ? (
                    <span
                      className={statusMap[proj.current_status.color]?.class}
                    >
                      {statusMap[proj.current_status.color]?.label || "Unknown"}
                    </span>
                  ) : (
                    <span className="text-muted">No status</span>
                  )}
                </td>

                {/* View Button */}
                <td className="text-end">
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#00d5f9", color: "black" }}
                    onClick={() => navigate(`/projects/${proj.gid}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
