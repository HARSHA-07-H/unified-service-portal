import { useState } from "react";
import "./User.css";

function User() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">My App</div>

        <ul className="navbar-menu">
          {/* USER with dropdown */}
          <li
            className="nav-item dropdown"
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <span className="nav-link">User ▾</span>

            {showUserDropdown && (
              <ul className="dropdown-menu">
                <li>Add User</li>
                <li>Edit User</li>
                <li>List Users</li>
                <li>Delete User</li>
              </ul>
            )}
          </li>

          <li className="nav-item">Units</li>
          <li className="nav-item">Event</li>
          <li className="nav-item">Log</li>
          <li className="nav-item">Configuration</li>
          <li className="nav-item">Data</li>
          <li className="nav-item">Help</li>
        </ul>
      </nav>
    </>
  );
}

export default User;
