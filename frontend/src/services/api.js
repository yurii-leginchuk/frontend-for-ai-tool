import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URI || "http://localhost:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
