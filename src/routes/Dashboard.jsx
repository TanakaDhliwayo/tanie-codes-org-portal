import React from "react";

function Dashboard() {
  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="fw-bold">Welcome, Tanie Codes Org 💻</h2>
        <p className="text-muted">
          Here’s what’s happening today in your portal.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Projects</h5>
              <h2 className="fw-bold text-primary">3</h2>
              <p className="text-muted">Active community projects</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Team Members</h5>
              <h2 className="fw-bold text-success">6</h2>
              <p className="text-muted">People managing the portal</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Volunteers</h5>
              <h2 className="fw-bold text-warning">50</h2>
              <p className="text-muted">Registered contributors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row g-3">
        <div className="col-md-4">
          <a href="/projects" className="btn btn-outline-primary w-100">
            📁 View All Projects
          </a>
        </div>
        <div className="col-md-4">
          <a href="/impact" className="btn btn-outline-success w-100">
            🧩 Add Impact Report
          </a>
        </div>
        <div className="col-md-4">
          <a href="/team" className="btn btn-outline-dark w-100">
            👥 Manage Team
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
