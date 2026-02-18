import React, { useState } from "react";
import "./Login.css";
import { apiCall } from "./api";

function AddUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    rank: "",
    areaOfWorking: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.rank.trim()) errs.rank = "Rank is required";
    if (!form.areaOfWorking.trim()) errs.areaOfWorking = "Area of Working is required";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)
      errs.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const adminId = localStorage.getItem("adminId");
      if (!adminId) {
        setMessage("Admin not found. Please login again.");
        setLoading(false);
        return;
      }

      await apiCall("/auth/add-user", {
        method: "POST",
        body: JSON.stringify({
          adminId,
          username: form.username,
          password: form.password,
          rank: form.rank,
          areaOfWorking: form.areaOfWorking,
        }),
      });

      setMessage("User added successfully!");
      setForm({
        username: "",
        password: "",
        confirmPassword: "",
        rank: "",
        areaOfWorking: "",
      });
      setErrors({});
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Add User</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group" style={{marginBottom:10}}>
            <input
              type="text"
              placeholder="Username"
              className={`login-input ${errors.username ? "error" : ""}`}
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <br />

          {/* Rank */}
          <div className="form-group" style={{marginBottom:10}}>
            <input
              type="text"
              placeholder="Rank"
              className={`login-input ${errors.rank ? "error" : ""}`}
              value={form.rank}
              onChange={(e) =>
                setForm((f) => ({ ...f, rank: e.target.value }))
              }
            />
            {errors.rank && (
              <span className="error-message">{errors.rank}</span>
            )}
          </div>

          <br />

          {/* Area of Working */}
          <div className="form-group" style={{marginBottom:10}}>
            <input
              type="text"
              placeholder="Area of Working"
              className={`login-input ${errors.areaOfWorking ? "error" : ""}`}
              value={form.areaOfWorking}
              onChange={(e) =>
                setForm((f) => ({ ...f, areaOfWorking: e.target.value }))
              }
            />
            {errors.areaOfWorking && (
              <span className="error-message">{errors.areaOfWorking}</span>
            )}
          </div>

          <br />

          {/* Password */}
          <div className="form-group" style={{marginBottom:10}}>
            <input
              type="password"
              placeholder="Password"
              className={`login-input ${errors.password ? "error" : ""}`}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <br />

          {/* Confirm Password */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              className={`login-input ${errors.confirmPassword ? "error" : ""}`}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
            />
            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <br />

          {message && <div className="message success">{message}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
