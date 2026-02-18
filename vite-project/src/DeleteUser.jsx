import React, { useState } from "react";
import { apiCall } from "./api";

export default function DeleteUser() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const adminId = localStorage.getItem("adminId");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      await apiCall("/auth/delete-user", {
        method: "DELETE",
        body: JSON.stringify({ adminId, username }),
        headers: { "Content-Type": "application/json" },
      });

      setMessage("User deleted successfully");
      setUsername("");
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Delete User</h2>

        <form style={styles.form} onSubmit={handleDelete}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.deleteBtn}>
            Delete User
          </button>
        </form>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    minWidth:"100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
  },
  form:{
    display: "flex",
    flexDirection: "column",

  },
  card: {
    width: 400,
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(13,110,253,0.25)",
    height:200
  },
  title: {
    textAlign: "center",
    color: "#0d6efd",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "93%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #0d6efd",
    outline: "none",
  },
  deleteBtn: {
    width: "50%",
    padding: 10,
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
    margin:"auto"
  },
  success: {
    marginTop: 43,
    textAlign: "center",
    color: "#198754",
    fontWeight: "bold",
  },
  error: {
    marginTop: 43,
    textAlign: "center",
    color: "#3164cc",
    fontWeight: "bold",
  },
};
