// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNav from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Teams from "./components/Teams"; // create this if not yet
import Resources from "./components/Resources"; // create this if not yet
import Settings from "./components/Settings"; // create this if not yet

const App = () => {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;
