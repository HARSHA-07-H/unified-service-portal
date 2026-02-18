// API service for backend communication
const API_BASE_URL = "http://localhost:8081/api";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  // Handle both JSON and plain text responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

// Login API
export const login = (username, password) =>
  apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// Health Check API
export const healthCheck = () =>
  apiCall("/auth/health", {
    method: "GET",
  });
