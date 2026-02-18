import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const fileInputRef = useRef(null);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    setUploadResults([]);
    setUploadSummary(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8081/api/auth/upload-admins", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setUploadMessage("✓ Excel file processed successfully!");
        setUploadResults(data.results || []);
        // Summarize results
        const summary = { total: 0, success: 0, skipped: 0, error: 0 };
        (data.results || []).forEach(r => {
          summary.total++;
          if (r.status === "success") summary.success++;
          else if (r.status === "skipped") summary.skipped++;
          else summary.error++;
        });
        setUploadSummary(summary);
      } else {
        setUploadMessage(data.error || "Error processing file");
      }
    } catch (err) {
      setUploadMessage("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content" style={{ flexDirection: "column", alignItems: "center" }}>
        {/* Upload Excel Box */}
        <div className="upload-box" onClick={handleUploadClick} style={{ marginBottom: 24 }}>
          <div className="upload-icon">⬆️</div>
          <p>{uploading ? "Uploading..." : "Upload Excel File"}</p>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Upload Results Summary */}
        {uploadMessage && (
          <div style={{ marginBottom: 12, color: uploadMessage.startsWith("✓") ? "#15803d" : "#b91c1c", fontWeight: 500 }}>{uploadMessage}</div>
        )}
        {uploadSummary && (
          <div style={{ marginBottom: 16, background: "#f1f5f9", padding: 12, borderRadius: 6 }}>
            <strong>Summary:</strong> {uploadSummary.total} rows processed —
            <span style={{ color: '#15803d', marginLeft: 8 }}>{uploadSummary.success} added</span>,
            <span style={{ color: '#ca8a04', marginLeft: 8 }}>{uploadSummary.skipped} skipped</span>,
            <span style={{ color: '#b91c1c', marginLeft: 8 }}>{uploadSummary.error} errors</span>
          </div>
        )}
        {/* Detailed Results Table */}
        {uploadResults.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: 'auto', width: '100%' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#e0e7ef' }}>
                  <th style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>Admin ID</th>
                  <th style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>Name</th>
                  <th style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>Status</th>
                  <th style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {uploadResults.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>{r.adminId || '-'}</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>{r.name || '-'}</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #cbd5e1', color: r.status === 'success' ? '#15803d' : r.status === 'skipped' ? '#ca8a04' : '#b91c1c', fontWeight: 500 }}>{r.status}</td>
                    <td style={{ padding: '6px 12px', border: '1px solid #cbd5e1' }}>{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
