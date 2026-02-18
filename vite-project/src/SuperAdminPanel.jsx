import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function SuperAdminPanel() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadResults, setUploadResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Validate user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "/loginadmin";
        return null;
    }

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
                setMessage("Please select a valid Excel file (.xlsx or .xls)");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setMessage("");
            setShowResults(false);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://localhost:8081/api/auth/upload-admins", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.status === "success") {
                setMessage("✓ Excel file processed successfully!");
                setUploadResults(data.results || []);
                setShowResults(true);
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setMessage(data.error || "Failed to upload file. Please try again.");
            }
        } catch (error) {
            setMessage("Error uploading file. Please try again.");
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminName");
        navigate("/loginadmin");
    };

    const handleDownloadTemplate = () => {
        // Create a sample Excel template
        const templateContent = `Admin ID,Name,Rank,Area of Working
ADM001,John Doe,Senior,Operations
ADM002,Jane Smith,Junior,IT Support
ADM003,Mike Johnson,Manager,Finance`;

        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(templateContent));
        element.setAttribute("download", "admin_template.txt");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">👨‍💼</div>
                    <h1>Super Admin Panel</h1>
                </div>

                <nav className="sidebar-menu">
                    <div className="menu-item active">
                        <span className="menu-icon">📤</span>
                        <span className="menu-text">Upload Admins</span>
                    </div>
                </nav>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        right: "20px",
                    }}
                >
                    🚪 Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "28px", marginBottom: "30px", color: "#333" }}>
                        📊 Upload Admin Users from Excel
                    </h2>

                    {/* Upload Section */}
                    <div
                        style={{
                            backgroundColor: "#f9f9f9",
                            padding: "40px",
                            borderRadius: "8px",
                            border: "2px dashed #4CAF50",
                            marginBottom: "30px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ marginBottom: "30px" }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                disabled={loading}
                                style={{ display: "none" }}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                style={{
                                    padding: "12px 30px",
                                    fontSize: "16px",
                                    backgroundColor: "#2196F3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                📁 Choose Excel File
                            </button>
                            <button
                                onClick={handleDownloadTemplate}
                                style={{
                                    padding: "12px 30px",
                                    fontSize: "16px",
                                    backgroundColor: "#FF9800",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                ⬇️ Download Template
                            </button>
                        </div>

                        {file && (
                            <div
                                style={{
                                    padding: "15px",
                                    backgroundColor: "#E8F5E9",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                    color: "#2E7D32",
                                }}
                            >
                                ✓ Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                            </div>
                        )}

                        {message && (
                            <div
                                style={{
                                    padding: "15px",
                                    backgroundColor: message.includes("✓") ? "#E8F5E9" : "#FFEBEE",
                                    color: message.includes("✓") ? "#2E7D32" : "#C62828",
                                    borderRadius: "4px",
                                    marginBottom: "20px",
                                }}
                            >
                                {message}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            style={{
                                padding: "12px 40px",
                                fontSize: "16px",
                                backgroundColor: file && !loading ? "#4CAF50" : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: file && !loading ? "pointer" : "not-allowed",
                            }}
                        >
                            {loading ? "⏳ Uploading..." : "📤 Upload File"}
                        </button>
                    </div>

                    {/* Instructions */}
                    <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#E3F2FD", borderRadius: "8px" }}>
                        <h3 style={{ color: "#1565C0", marginBottom: "15px" }}>📝 Instructions:</h3>
                        <ol style={{ color: "#333", lineHeight: "1.8", margin: "0 0 0 20px", padding: "0" }}>
                            <li>
                                <strong>Download the template</strong> using the "Download Template" button
                            </li>
                            <li>
                                <strong>Fill in the data</strong> with the following columns:
                                <ul style={{ margin: "10px 0", padding: "0 0 0 20px" }}>
                                    <li><strong>Admin ID</strong>: Unique identifier (e.g., ADM001)</li>
                                    <li><strong>Name</strong>: Full name of the admin</li>
                                    <li><strong>Rank</strong>: Position/rank (e.g., Senior, Manager)</li>
                                    <li><strong>Area of Working</strong>: Department/area (e.g., IT, Finance)</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Save the file</strong> as an Excel file (.xlsx or .xls)
                            </li>
                            <li>
                                <strong>Upload the file</strong> using the upload button above
                            </li>
                            <li>
                                <strong>Default password</strong> will be: <code style={{ backgroundColor: "#fff3cd", padding: "2px 6px", borderRadius: "3px" }}>Admin@123456</code>
                            </li>
                            <li>
                                <strong>First login</strong> will force admins to change their password
                            </li>
                        </ol>
                    </div>

                    {/* Results Section */}
                    {showResults && uploadResults.length > 0 && (
                        <div style={{ marginTop: "30px" }}>
                            <h3 style={{ color: "#333", marginBottom: "20px" }}>Upload Results:</h3>
                            <div style={{ overflowX: "auto" }}>
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        backgroundColor: "white",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <thead>
                                        <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                            <th style={{ padding: "15px", textAlign: "left", fontWeight: "600", color: "#333" }}>
                                                Status
                                            </th>
                                            <th style={{ padding: "15px", textAlign: "left", fontWeight: "600", color: "#333" }}>
                                                Admin ID
                                            </th>
                                            <th style={{ padding: "15px", textAlign: "left", fontWeight: "600", color: "#333" }}>
                                                Name
                                            </th>
                                            <th style={{ padding: "15px", textAlign: "left", fontWeight: "600", color: "#333" }}>
                                                Message
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadResults.map((result, index) => (
                                            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                                                <td
                                                    style={{
                                                        padding: "15px",
                                                        color:
                                                            result.status === "success"
                                                                ? "#2E7D32"
                                                                : result.status === "skipped"
                                                                ? "#F57C00"
                                                                : "#C62828",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {result.status === "success" && "✓ Success"}
                                                    {result.status === "skipped" && "⊘ Skipped"}
                                                    {result.status === "error" && "✗ Error"}
                                                </td>
                                                <td style={{ padding: "15px", color: "#333" }}>{result.adminId || "-"}</td>
                                                <td style={{ padding: "15px", color: "#333" }}>{result.name || "-"}</td>
                                                <td style={{ padding: "15px", color: "#666", fontSize: "14px" }}>
                                                    {result.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SuperAdminPanel;
