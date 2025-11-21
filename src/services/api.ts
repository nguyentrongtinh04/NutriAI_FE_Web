import axios from "axios";
import { store } from "../redux/store";
import { updateAccessToken, clearAuth } from "../redux/slices/authSlice";
import { clearUser } from "../redux/slices/userSlice";

const IP_BASE = "http://localhost";

export const IP_AUTH = `${IP_BASE}:5005/auth`;
export const IP_USER = `${IP_BASE}:5001/user`;
export const IP_MEAL_SCAN = `${IP_BASE}:5002/meals-scand`;
export const IP_MEAL_FOOD = `${IP_BASE}:5002/foods`;
export const IP_PLAN = `${IP_BASE}:5003/schedule`;
export const IP_AI = `${IP_BASE}:5003/Ai-schedule`;
export const IP_ADMIN = `${IP_BASE}:5010/admin`;
export const IP_CHATBOT = `${IP_BASE}:5004/api/chatbot`;
export const authAdminApi = axios.create({
  baseURL: "http://localhost:5005/auth",  // AUTH-SERVICE
});
export const IP_SCHEDULE_RESULT = `${IP_BASE}:5003/schedule-result`;

// 🔹 Tạo axios instance cho từng service
export const authApi = axios.create({ baseURL: IP_AUTH });
export const userApi = axios.create({ baseURL: IP_USER });
export const mealApi = axios.create({ baseURL: IP_MEAL_SCAN });
export const foodApi = axios.create({ baseURL: IP_MEAL_FOOD });
export const planApi = axios.create({ baseURL: IP_PLAN });
export const aiApi = axios.create({ baseURL: IP_AI });
export const adminApi = axios.create({ baseURL: IP_ADMIN });
export const chatbotApi = axios.create({ baseURL: IP_CHATBOT });
export const scheduleResultApi = axios.create({
  baseURL: `${IP_BASE}:5003/schedule-result`,
});

// 🔹 Gắn accessToken cho mỗi request
const attachToken = (config: any) => {
  const state = store.getState();
  const token = state.auth.accessToken || localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
[authApi, userApi, mealApi, foodApi, planApi, aiApi, adminApi,authAdminApi,scheduleResultApi].forEach(api =>
  api.interceptors.request.use(attachToken)
);

// 🔹 Hàm refresh token
const refreshAccessToken = async () => {
  const state = store.getState();
  console.log("🔄 Refreshing access token...");
  const refreshToken = state.auth.refreshToken || localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  const res = await axios.post(`${IP_AUTH}/refresh`, { refresh_token: refreshToken });

  const newAccessToken = res.data.access_token;
  console.log("✅ Token refreshed:", newAccessToken);
  store.dispatch(updateAccessToken(newAccessToken));
  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
};

// 🔹 Tự động retry request khi 401
const attachResponseInterceptor = (instance: any) => {
  instance.interceptors.response.use(
    (res: any) => res,
    async (error: any) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (err) {
          console.error("❌ Refresh failed:", err);
          store.dispatch(clearAuth());
          store.dispatch(clearUser());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("persist:root");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
[authApi, userApi, mealApi, foodApi, planApi, aiApi, adminApi,authAdminApi,scheduleResultApi].forEach(attachResponseInterceptor);
