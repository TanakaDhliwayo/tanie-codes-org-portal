//src\App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./routes/Dashboard";
import Impact from "./routes/Impact";
import Team from "./routes/Team";
import Settings from "./routes/Settings";
import Login from "./routes/Login";
import Projects from "./routes/Projects";
import ProjectList from "./routes/ProjectList";
import NotFound from "./routes/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:projectId" element={<Projects />} />

          <Route path="/impact" element={<Impact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
