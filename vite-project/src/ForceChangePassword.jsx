import { useState, useEffect } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";

function ForceChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();

    // Get admin info from localStorage
    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Check if admin is logged in and needs to change password
        if (!adminId || !token) {
            navigate("/loginadmin");
            return;
        }

        // Check if this is force password change
        if (localStorage.getItem("forcePasswordChange") !== "true") {
            navigate("/dashboard-user");
        }
    }, [adminId, token, navigate]);

    // Validate password strength
    const checkPasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength("");
            return;
        }

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
        const isLongEnough = password.length >= 8;

        if (hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough) {
            setPasswordStrength("strong");
        } else if ((hasUpper || hasLower) && hasNumber && isLongEnough) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("weak");
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // New password validation
        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (newPassword.length > 100) {
            newErrors.newPassword = "Password cannot exceed 100 characters";
        } else {
            const hasUpper = /[A-Z]/.test(newPassword);
            const hasLower = /[a-z]/.test(newPassword);
            const hasNumber = /\d/.test(newPassword);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(newPassword);

            if (!hasUpper) {
                newErrors.newPassword = "Password must contain at least one uppercase letter";
            } else if (!hasLower) {
                newErrors.newPassword = "Password must contain at least one lowercase letter";
            } else if (!hasNumber) {
                newErrors.newPassword = "Password must contain at least one number";
            } else if (!hasSpecial) {
                newErrors.newPassword = "Password must contain at least one special character";
            }
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:8081/api/auth/force-change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    adminId: adminId,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessage("Password changed successfully! Redirecting to dashboard...");
                // Clear the force password change flag
                localStorage.removeItem("forcePasswordChange");
                setTimeout(() => {
                    window.location.href = "/dashboard-user";
                }, 1500);
            } else {
                setMessage(data.message || "Failed to change password. Please try again.");
            }
        } catch (error) {
            setMessage("Error connecting to server. Please try again.");
            console.error("Password change error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-card" style={{ maxWidth: "450px" }}>
                    <h2>🔒 Change Password Required</h2>
                    <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
                        This is your first login. Please change your default password to continue.
                    </p>

                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className={`login-input ${errors.newPassword ? "error" : ""}`}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    checkPasswordStrength(e.target.value);
                                }}
                                disabled={loading}
                            />
                            {errors.newPassword && (
                                <span className="error-message">{errors.newPassword}</span>
                            )}
                            {passwordStrength && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        backgroundColor:
                                            passwordStrength === "strong"
                                                ? "#d4edda"
                                                : passwordStrength === "medium"
                                                ? "#fff3cd"
                                                : "#f8d7da",
                                        color:
                                            passwordStrength === "strong"
                                                ? "#155724"
                                                : passwordStrength === "medium"
                                                ? "#856404"
                                                : "#721c24",
                                    }}
                                >
                                    Password Strength: <strong>{passwordStrength.toUpperCase()}</strong>
                                </div>
                            )}
                        </div>
                        <br />

                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className={`login-input ${errors.confirmPassword ? "error" : ""}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <span className="error-message">{errors.confirmPassword}</span>
                            )}
                        </div>
                        <br />

                        

                        {message && (
                            <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                                {message}
                            </div>
                        )}
                        <br />

                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                            style={{ width: "100%" }}
                        >
                            {loading ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForceChangePassword;
