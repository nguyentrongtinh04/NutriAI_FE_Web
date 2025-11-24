import axios from "axios";
import { saveTokens, clearTokens, getTokens } from "./auth";

const AUTH_SERVICES = import.meta.env.VITE_AUTH_SERVICES || "http://localhost:5000";
const USER_SERVICES = import.meta.env.VITE_USER_SERVICES || "http://localhost:5000";

// 👉 Auth service: BE mount /auth/*
export const authApi = axios.create({
  baseURL: `${AUTH_SERVICES}/auth`, // 👈 quan trọng
  timeout: 10000,
});

// 👉 User service: BE mount /users/*
export const userApi = axios.create({
  baseURL: `${USER_SERVICES}/users`,
  timeout: 10000,
});

// 👉 Gắn access_token vào headers
[authApi, userApi].forEach((api) => {
  api.interceptors.request.use((config) => {
    const tokens = getTokens();
    if (tokens?.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  });
});

// 👉 Xử lý refresh token khi 401
[authApi, userApi].forEach((api) => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const tokens = getTokens();
        if (tokens?.refresh_token) {
          try {
            const res = await axios.post(`${AUTH_SERVICES}/auth/refresh`, {
              refresh_token: tokens.refresh_token,
            });
            const { access_token, refresh_token } = res.data;
            saveTokens({ access_token, refresh_token });
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);
          } catch (err) {
            clearTokens();
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );
});
