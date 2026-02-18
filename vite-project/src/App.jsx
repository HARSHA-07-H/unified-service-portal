// import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import adminImg from "./assets/admin.png";
import superAdminImg from "./assets/aadmin.png";

import Login from "./Login";
import LoginAdmin from "./Loginadmin";
import Dashboard from "./Dashboard";
import DashboardUser from "./DashboardUser";

import SuperAdminPanel from "./SuperAdminPanel";
import ChangePassword from "./ChangePassword";
import ForceChangePassword from "./ForceChangePassword";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import UserList from "./UserList";

import { healthCheck } from "./api";

function App() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("checking...");

  // Check backend when app loads
  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      await healthCheck();
      setBackendStatus("✓ Backend connected");
    } catch (error) {
      setBackendStatus("✗ Backend not available");
    }
  };

  // Handle role selection
  const handleSelect = (role) => {
    if (backendStatus.includes("✗")) {
      alert("Backend is not running. Please start Spring Boot.");
      return;
    }

    if (role === "SUPER_ADMIN") {
      navigate("/super-admin/login");
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <>
      {/* Backend status indicator */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "20px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: "bold",
          backgroundColor: backendStatus.includes("✓") ? "#d4edda" : "#f8d7da",
          color: backendStatus.includes("✓") ? "#155724" : "#721c24",
          border: `2px solid ${
            backendStatus.includes("✓") ? "#28a745" : "#dc3545"
          }`,
          borderRadius: "4px",
          zIndex: 1000,
        }}
      >
        Backend Status: {backendStatus}
      </div>

      <Routes>
        {/* ROLE SELECTION PAGE */}
        <Route
          path="/"
          element={
            <div className="container">
              <h1>Select Role</h1>

              <div className="card-container">
                <div className="card">
                  <h2>Super Admin</h2>
                  <img
                    src={superAdminImg}
                    alt="Super Admin"
                    className="super-admin-img"
                  />
                  <button onClick={() => handleSelect("SUPER_ADMIN")}>
                    Select Super Admin
                  </button>
                </div>

                <div className="card">
                  <h2>Admin</h2>
                  <img
                    src={adminImg}
                    alt="Admin"
                    className="admin-img"
                  />
                  <button onClick={() => handleSelect("ADMIN")}>
                    Select Admin
                  </button>
                </div>
              </div>
            </div>
          }
        />

        {/* LOGIN ROUTES */}
        <Route path="/super-admin/login" element={<Login />} />
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* DASHBOARDS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/dashboard-user" element={<DashboardUser />} />

        {/* SUPER ADMIN PANEL */}
        <Route path="/super-admin/panel" element={<SuperAdminPanel />} />

        {/* PASSWORD MANAGEMENT */}
        <Route
          path="/change-password"
          element={
            <ChangePassword
              username={localStorage.getItem("username")}
              onPasswordChanged={() => (window.location.href = "/dashboard")}
            />
          }
        />
        <Route path="/force-change-password" element={<ForceChangePassword />} />

        {/* USER MANAGEMENT */}
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </>
  );
}

export default App;
