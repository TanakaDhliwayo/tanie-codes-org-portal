// src/routes/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/asana";
import Loader from "../components/loader";
import "../styles/loader.css";

const statusMap = {
  green: { label: "On track", style: { color: "#198754", fontWeight: 500 } },
  yellow: { label: "At risk", style: { color: "#ffff00", fontWeight: 500 } },
  red: { label: "Off track", style: { color: "red", fontWeight: 500 } },
  complete: { label: "Complete", style: { color: "#00f5ff", fontWeight: 500 } },
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
      <div className="d-flex justify-content-center mb-4">
        <div
          className="input-group"
          style={{
            maxWidth: "500px",
            backgroundColor: "#E6FEFF",
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ backgroundColor: "#E6FEFF" }}
          />
          <span
            className="input-group-text border-0"
            style={{ backgroundColor: "#E6FEFF" }}
          >
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

      {/* Table */}
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>Name</th>
            <th>Assign</th>
            <th>Status</th>
            <th></th>
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
                <td>{proj.name?.trim() || "Untitled Project"}</td>

                <td>
                  {proj.members?.length > 0
                    ? proj.members.map((m) => m.name).join(", ")
                    : "Unassigned"}
                </td>

                <td>
                  {proj.current_status ? (
                    <span style={statusMap[proj.current_status.color]?.style}>
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
                    style={{ backgroundColor: "#00f5ff", color: "black" }}
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
