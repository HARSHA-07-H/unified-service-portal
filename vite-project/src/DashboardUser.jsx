

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
function DashboardUser() {
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      {/* Nav Bar */}
      <nav className="navbar" style={{ background: '#e0e7ef', padding: '0 24px', display: 'flex', alignItems: 'center', height: 48 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* User Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="nav-btn"
              style={{ background: 'none', border: 'none', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}
              onClick={() => setUserDropdown((v) => !v)}
            >
              User &#9662;
            </button>
            {userDropdown && (
              <div
                style={{ position: 'absolute', top: 36, left: 0, background: '#fff', boxShadow: '0 2px 8px #0001', borderRadius: 6, minWidth: 120, zIndex: 10 }}
                tabIndex={0}
                onBlur={() => setTimeout(() => setUserDropdown(false), 200)}
              >
                <div className="dropdown-item" style={dropdownItemStyle} onClick={() => { setUserDropdown(false); navigate("/add-user"); }}>Add</div>
                <div className="dropdown-item" style={dropdownItemStyle} onClick={() => { setUserDropdown(false); navigate("/edit-user"); }}>Edit</div>
                <div className="dropdown-item" style={dropdownItemStyle} onClick={() => { setUserDropdown(false); navigate("/user-list"); }}>List</div>
                <div className="dropdown-item" style={dropdownItemStyle} onClick={() => { setUserDropdown(false); navigate("/delete-user"); }}>Delete</div>
              </div>
            )}
          </div>
          <button className="nav-btn" style={navBtnStyle}>Units</button>
          <button className="nav-btn" style={navBtnStyle}>Area</button>
          <button className="nav-btn" style={navBtnStyle}>Field</button>
          <button className="nav-btn" style={navBtnStyle}>Log</button>
          <button className="nav-btn" style={navBtnStyle}>Configuration</button>
          <button className="nav-btn" style={navBtnStyle}>Data</button>
          <button className="nav-btn" style={navBtnStyle}>Help</button>
        </div>
      </nav>
      <main className="dashboard-content">
        <div style={{ fontSize: 20, color: "#0e59c2" }}>
          Welcome, Admin! You have successfully logged in.
        </div>
      </main>
    </div>
  );
}

const navBtnStyle = {
  background: 'none',
  border: 'none',
  fontWeight: 500,
  fontSize: 16,
  cursor: 'pointer',
  padding: '0 8px',
};

const dropdownItemStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 15,
  borderBottom: '1px solid #e5e7eb',
  background: '#fff',
};

// Modal styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const modalStyle = {
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 4px 24px #0002',
  padding: '32px 28px',
  minWidth: 340,
  maxWidth: 400,
};

const inputStyle = {
  padding: '8px 12px',
  fontSize: 15,
  borderRadius: 4,
  border: '1px solid #cbd5e1',
};

const errorStyle = {
  color: '#b91c1c',
  fontSize: 13,
  marginTop: '-8px',
  marginBottom: '4px',
};
export default DashboardUser;
