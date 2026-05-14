const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  // Try to parse JSON, fallback to text
  try {
    data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    data = await response.text(); // Raw text if parsing fails
  }

  // Handle non-JSON (HTML/error) responses
  if (!response.ok) {
    if (typeof data === "string" && data.includes("<!DOCTYPE")) {
      throw new Error(
        `Server returned HTML (HTTP ${response.status}). Is the backend running and the API URL correct? URL: ${response.url}`
      );
    }
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateProfile = async (token, userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const getRandomPuzzle = async () => {
  const response = await fetch(`${API_BASE_URL}/puzzles/random`);
  return handleResponse(response);
};

export const getPuzzleById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/puzzles/${id}`);
  return handleResponse(response);
};

export const submitAnswer = async (token, puzzleId, answer) => {
  const response = await fetch(`${API_BASE_URL}/puzzles/${puzzleId}/attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });
  return handleResponse(response);
};

export const getLeaderboard = async () => {
  const response = await fetch(`${API_BASE_URL}/leaderboard`);
  return handleResponse(response);
};

export const getMyRank = async (token) => {
  const response = await fetch(`${API_BASE_URL}/leaderboard/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};