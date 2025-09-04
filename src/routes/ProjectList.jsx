// src/routes/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/asana";
import Loader from "../components/loader";
import "../styles/loader.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Loader title="loading projects" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>TANIE CODES.ORG</h2>

      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        <ul className="list-group">
          {projects.map((proj) => (
            <li
              key={proj.gid}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{proj.name?.trim() || "Untitled Project"}</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate(`/projects/${proj.gid}`)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
