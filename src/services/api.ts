// api.ts
import axios from "axios";
import { store } from "../redux/store";
import { updateAccessToken, clearAuth } from "../redux/slices/authSlice";
import { clearUser } from "../redux/slices/userSlice";

// -------------------------------
// 🟢 FE CHỈ GỌI QUA GATEWAY: 5000
// -------------------------------
const DEPLOY = "https://api.nutriai.sbs";

// 🟢 Giữ nguyên biến cũ nhưng trỏ vào GATEWAY
export const IP_AUTH = `${DEPLOY}/auth`;
export const IP_USER = `${DEPLOY}/user`;
export const IP_MEAL_SCAN = `${DEPLOY}/mealscan`;
export const IP_MEAL_FOOD = `${DEPLOY}/mealscan`;
export const IP_PLAN = `${DEPLOY}/schedule`;
export const IP_AI = `${DEPLOY}/schedule/ai`;
export const IP_ADMIN = `${DEPLOY}/admin`;
export const IP_CHATBOT = `${DEPLOY}/chatbot`;
export const IP_SCHEDULE_RESULT = `${DEPLOY}/schedule/schedule-result`;

// -------------------------------
// 🟢 Tạo axios instance giống FE cũ
// -------------------------------
export const authApi = axios.create({ baseURL: IP_AUTH });
export const userApi = axios.create({ baseURL: IP_USER });
export const mealApi = axios.create({ baseURL: IP_MEAL_SCAN });
export const foodApi = axios.create({ baseURL: IP_MEAL_FOOD });
export const planApi = axios.create({ baseURL: IP_PLAN });
export const aiApi = axios.create({ baseURL: IP_AI });
export const adminApi = axios.create({ baseURL: IP_ADMIN });
export const chatbotApi = axios.create({ baseURL: IP_CHATBOT });
export const scheduleResultApi = axios.create({ baseURL: IP_SCHEDULE_RESULT });

// -------------------------------
// 🟢 Gắn accessToken vào mỗi request
// -------------------------------
const attachToken = (config: any) => {
  const state = store.getState();
  const token = state.auth.accessToken || localStorage.getItem("accessToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

[
  authApi,
  userApi,
  mealApi,
  foodApi,
  planApi,
  aiApi,
  adminApi,
  chatbotApi,
  scheduleResultApi,
].forEach((api) => api.interceptors.request.use(attachToken));

// -------------------------------
// 🔄 Hàm Refresh Token
// -------------------------------
const refreshAccessToken = async () => {
  const state = store.getState();
  const refreshToken =
    state.auth.refreshToken || localStorage.getItem("refreshToken");

  console.log("🔄 Refreshing access token...");

  if (!refreshToken) throw new Error("No refresh token found");

  const res = await axios.post(`${IP_AUTH}/refresh`, {
    refresh_token: refreshToken,
  });

  const newAccessToken = res.data.access_token;
  console.log("✅ Token refreshed:", newAccessToken);

  store.dispatch(updateAccessToken(newAccessToken));
  localStorage.setItem("accessToken", newAccessToken);

  return newAccessToken;
};

// -------------------------------
// 🟢 Tự động retry request khi 401
// -------------------------------
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

[
  authApi,
  userApi,
  mealApi,
  foodApi,
  planApi,
  aiApi,
  adminApi,
  chatbotApi,
  scheduleResultApi,
].forEach(attachResponseInterceptor);

console.log("scheduleResultApi baseURL:", scheduleResultApi);