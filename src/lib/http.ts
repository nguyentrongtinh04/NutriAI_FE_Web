// src/lib/http.ts
import axios from "axios";
import { getAccessToken } from "./auth";

// Vite: biến cần prefix VITE_
const API_BASE = import.meta.env.VITE_AUTH_SERVICES || "http://localhost:5005";

export const http = axios.create({
  baseURL: API_BASE + "/auth",     // => /auth/google, /auth/login, /auth/refresh
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((cfg) => {
  const at = getAccessToken();
  if (at) cfg.headers.Authorization = `Bearer ${at}`;
  return cfg;
});
