import { useState } from "react";
import "./Login.css"
import adminImg from "./assets/admin.png";
import superAdminImg from "./assets/aadmin.png";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        } else if (username.length > 50) {
            newErrors.username = "Username cannot exceed 50 characters";
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            newErrors.username = "Username can only contain letters, numbers, underscores and hyphens";
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
                    username: username.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessage("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("adminId", data.adminId);
                localStorage.setItem("adminName", username.trim());
                // Redirect based on role
                setTimeout(() => {
                    if (data.role === "SUPER_ADMIN") {
                        window.location.href = "/dashboard";
                    } else {
                        window.location.href = "/dashboard-user";
                    }
                }, 1000);
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
                    <h2>Super Admin Login</h2>
                    <div className="super-admin-icon">
                        <img
                            src={adminImg}
                            alt="Super Admin"
                            className="super-admin-img"
                        />
                    </div>
                    
                    <form onSubmit={handleLogin}>
                        {/* <div style={{
                            padding: "12px",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "6px",
                            marginBottom: "20px",
                            fontSize: "13px",
                            color: "#1565c0"
                        }}>
                            <strong>Default Credentials:</strong><br/>
                            Username: <strong>prerana</strong><br/>
                            Password: <strong>Prerana@542004</strong>
                        </div> */}

                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter username (prerana)"
                                className={`login-input ${errors.username ? "error" : ""}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <br />

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Enter password"
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
export default Login