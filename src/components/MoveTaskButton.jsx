//src/components/MoveTaskButton.jsx
import React, { useState } from "react";

const MoveTaskButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const ACCESS_TOKEN =
    "Bearer 2/1210772119935700/1210787059217931:f5b9f8b71028b3e98a82cd0b04d87a6d";
  const SECTION_GID = "1210877207786176"; // "Done" section
  const TASK_GID = "1210877207786169"; // Task i want to move

  const moveTask = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://app.asana.com/api/1.0/sections/${SECTION_GID}/addTask`,
        {
          method: "POST",
          headers: {
            Authorization: ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              task: TASK_GID,
            },
          }),
        }
      );

      if (response.ok) {
        setMessage("✅ Task moved successfully!");
      } else {
        const errorData = await response.json();
        setMessage(
          `❌ Failed: ${errorData.errors?.[0]?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      setMessage(`⚠️ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={moveTask}
        disabled={loading}
        style={{
          padding: "10px 15px",
          backgroundColor: "#1f8ceb",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Moving..." : "Move Task to Done"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MoveTaskButton;
