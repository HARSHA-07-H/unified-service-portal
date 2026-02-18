import React, { useEffect, useState } from "react";
import { apiCall } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // 
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;

    setLoading(true);
    setError("");

    apiCall(
      `/auth/admin-users?adminId=${adminId}&page=${page}&size=${size}`
    )
      .then((data) => {
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [adminId, page, size]);

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div style={styles.page}>
    <div style={styles.card}>
      <h2 style={styles.title}>User List</h2>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div>
          Total Users: <strong>{totalElements}</strong>
        </div>

        <div>
          Show{" "}
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0); // reset page
            }}
            style={styles.select}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{" "}
          entries
        </div>
      </div>

      {loading && <div style={styles.info}>Loading...</div>}
      {error && <div style={styles.error}>{error}</div>}

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Area of Working</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && !loading ? (
            <tr>
              <td colSpan={3} style={styles.noData}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.rank || "-"}</td>
                <td style={styles.td}>{user.areaOfWorking || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button style={styles.btn} disabled={page === 0} onClick={() => setPage(0)}>
          {"<<"}
        </button>
        <button style={styles.btn} disabled={page === 0} onClick={() => setPage(page - 1)}>
          {"<"}
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...styles.btn,
              ...(p === page ? styles.activeBtn : {}),
            }}
          >
            {p + 1}
          </button>
        ))}

        <button
          style={styles.btn}
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </button>
        <button
          style={styles.btn}
          disabled={page >= totalPages - 1}
          onClick={() => setPage(totalPages - 1)}
        >
          {">>"}
        </button>
      </div>
    </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
  minHeight: "100vh",
  minWidth: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  
},

  card: {
    maxWidth: 850,
    margin: "3rem auto",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
aligncontent:"center",
    padding: 24,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(13,110,253,0.2)",
  },
  title: {
    textAlign: "center",
    color: "#0d6efd",
    marginBottom: 16,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    color: "#333",
  },
  select: {
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid #0d6efd",
    color: "#0d6efd",
    fontWeight: "bold",
    outline: "none",
  },
  info: {
    textAlign: "center",
    color: "#0d6efd",
  },
  error: {
    textAlign: "center",
    color: "#dc3545",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {

    color: "#171616",
    padding: 12,
    textAlign: "left",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #dee2e6",
  },
  noData: {
    textAlign: "center",
    padding: 16,
    color: "#777",
  },
  pagination: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  btn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #0d6efd",
    background: "#fff",
    color: "#0d6efd",
    cursor: "pointer",
  },
  activeBtn: {
    background: "#0d6efd",
    color: "#fff",
  },
};
