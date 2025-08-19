// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    className="form-control form-control-sm"
    style={{ width: "200px" }}
    placeholder="Search tasks..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);

export default SearchBar;
