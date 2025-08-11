// src/api/axios.js
import axios from "axios";

function normalizeBase(url) {
  if (!url) return "http://localhost:5000/api";
  // If it already ends with /api, keep it. Otherwise append /api.
  return url.replace(/\/+$/, "").endsWith("/api")
    ? url.replace(/\/+$/, "")
    : `${url.replace(/\/+$/, "")}/api`;
}

// Detect if running in dev mode
const isDev = import.meta.env.DEV;

// In dev → use /api so Vite dev proxy can handle requests (no CORS issues)
// In prod → use env variables
const base = isDev
  ? "/api"
  : normalizeBase(
      import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        ""
    );

const API = axios.create({
  baseURL: base,
  // Default: no cookies unless explicitly set in request
  withCredentials: false,
});

export default API;
