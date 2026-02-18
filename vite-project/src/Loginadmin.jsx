import { useState } from "react";
import "./Login.css"
import superAdminImg from "./assets/aadmin.png";

function Loginadmin() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Admin ID validation
        if (!name.trim()) {
            newErrors.name = "Admin ID is required";
        } else if (name.length < 2) {
            newErrors.name = "Admin ID must be at least 2 characters";
        } else if (name.length > 50) {
            newErrors.name = "Admin ID cannot exceed 50 characters";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (password.length > 100) {
            newErrors.password = "Password cannot exceed 100 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage("");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:8081/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: name.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessage("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("adminId", data.adminId);
                localStorage.setItem("adminName", name.trim());
                
                // Check if admin needs to change password on first login
                if (data.needsPasswordChange) {
                    localStorage.setItem("forcePasswordChange", "true");
                    setTimeout(() => {
                        window.location.href = "/force-change-password";
                    }, 500);
                } else {
                    // Redirect to admin user dashboard
                    console.log("Redirecting to /dashboard-user after admin login");
                    setTimeout(() => {
                        window.location.href = "/dashboard-user";
                    }, 1000);
                }
            } else {
                setMessage(data.message || "Login failed. Invalid credentials.");
            }
        } catch (error) {
            setMessage("Error connecting to server. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <h2>Admin Login</h2>
                    <div className="super-admin-icon">
                        <img
                            src={superAdminImg}
                            alt="Admin"
                            className="super-admin-img"
                        />
                    </div>

                    <div className="info-box">
                        <p className="info-text">
                            <strong>📝 Default Password:</strong> Admin@123456
                        </p>
                        <p className="info-text warning-text">
                            ⚠️ You will be forced to change your password on first login
                        </p>
                    </div>
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Admin ID"
                                className={`login-input ${errors.name ? "error" : ""}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        <br />

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                className={`login-input ${errors.password ? "error" : ""}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <br />

                        {message && (
                            <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
                                {message}
                            </div>
                        )}
                        <br />

                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Loginadmin