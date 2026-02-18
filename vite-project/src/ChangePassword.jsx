import { useState } from "react";
import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
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

    // Check if admin is logged in and needs to change password
    if (!adminId || !token) {
        navigate("/login");
        return null;
    }

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

        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || 
                   !/\d/.test(newPassword) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(newPassword)) {
            newErrors.newPassword = "Password must contain uppercase, lowercase, number, and special character";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage("");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:8081/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    adminId: adminId,
                    oldPassword: currentPassword,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessage("Password changed successfully! Redirecting...");
                setTimeout(() => {
                    // Clear the tokens and redirect to admin dashboard
                    localStorage.removeItem("forcePasswordChange");
                    window.location.href = "/admin-dashboard";
                }, 2000);
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
        <div className="change-password-container">
            <div className="change-password-card">
                <h2>Change Password</h2>
                <p className="subtitle">You must change your password on your first login</p>

                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter your current password"
                            className={`password-input ${errors.currentPassword ? "error" : ""}`}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={loading}
                        />
                        {errors.currentPassword && (
                            <span className="error-message">{errors.currentPassword}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            className={`password-input ${errors.newPassword ? "error" : ""}`}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                checkPasswordStrength(e.target.value);
                            }}
                            disabled={loading}
                        />
                        {newPassword && (
                            <div className={`password-strength ${passwordStrength}`}>
                                Strength: <span>{passwordStrength}</span>
                            </div>
                        )}
                        {errors.newPassword && (
                            <span className="error-message">{errors.newPassword}</span>
                        )}
                    </div>

                    <div className="password-requirements">
                        <p className="req-title">Password must contain:</p>
                        <ul>
                            <li className={newPassword.length >= 8 ? "met" : ""}>At least 8 characters</li>
                            <li className={/[A-Z]/.test(newPassword) ? "met" : ""}>Uppercase letter</li>
                            <li className={/[a-z]/.test(newPassword) ? "met" : ""}>Lowercase letter</li>
                            <li className={/\d/.test(newPassword) ? "met" : ""}>Number</li>
                            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(newPassword) ? "met" : ""}>Special character</li>
                        </ul>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your new password"
                            className={`password-input ${errors.confirmPassword ? "error" : ""}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {message && (
                        <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        className="change-password-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Changing Password..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
