import React, { useState } from "react";
import { apiCall } from "./api";

export default function EditUser() {
  const [username, setUsername] = useState("");
  const [rank, setRank] = useState("");
  const [areaOfWorking, setAreaOfWorking] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const adminId = localStorage.getItem("adminId");

  const handleEdit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username || !rank || !areaOfWorking) {
      setError("All fields are required");
      return;
    }

    try {
      await apiCall("/auth/edit-user", {
        method: "PUT",
        body: JSON.stringify({
          adminId,
          username,
          rank,
          areaOfWorking,
        }),
        headers: { "Content-Type": "application/json" },
      });

      setMessage("User details updated successfully");
      setUsername("");
      setRank("");
      setAreaOfWorking("");
    } catch (err) {
      setError("Failed to update user");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit User</h2>

        <form onSubmit={handleEdit}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Area of Working"
            value={areaOfWorking}
            onChange={(e) => setAreaOfWorking(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Update
          </button>
        </form>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width:"100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 400,
    padding: 24,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(13,110,253,0.25)",
  },
  title: {
    textAlign: "center",
    color: "#0d6efd",
    marginBottom: 20,
  },
  input: {
    width: "95%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #0d6efd",
  },
  button: {
    width: "50%",
    padding: 10,
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    marginLeft: "25%",
    cursor: "pointer",
  },
  success: {
    marginTop: 12,
    color: "green",
    textAlign: "center",
  },
  error: {
    marginTop: 12,
    color: "red",
    textAlign: "center",
  },
};
