import { NavigateFunction } from "react-router-dom";
import { setAuth } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import { authApi, userApi } from "./api";
import { fetchMe } from "../redux/slices/userSlice";

export const authService = {
  // ========================
  // 🔹 LOGIN / REGISTER / LOGOUT
  // ========================

  // Đăng nhập bằng Google
  loginWithGoogle: async (
    idToken: string,
    dispatch: AppDispatch,
    navigate: NavigateFunction
  ) => {
    const res = await authApi.post("/google", { id_token: idToken });
    const data = res.data;

    dispatch(setAuth({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }));

    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    const user = await dispatch(fetchMe()).unwrap();
    localStorage.setItem("userId", user.id || user.authId);

    navigate("/home");
    return data;
  },

  // Đăng nhập bằng phone/email + password
  loginWithPassword: async (username: string, password: string) => {
    const res = await authApi.post("/login", { phoneOrEmail: username, password });
    return res.data; // { access_token, refresh_token }
  },

  // Lấy thông tin user (gộp auth + profile)
  fetchUserProfile: async (access_token: string) => {
    const [profileRes, authRes] = await Promise.all([
      userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
    ]);

    return {
      ...profileRes.data,
      email: authRes.data.email,
      phone: authRes.data.phone,
      role: authRes.data.role,
      providers: authRes.data.providers || [],
    };
  },

  // Đăng xuất
  logout: async (refreshToken: string) => {
    if (refreshToken) {
      await authApi.post("/logout", { refresh_token: refreshToken });
    }
  },

  // Đăng ký
  register: async (payload: { phone: string; email: string; password: string }) => {
    const res = await authApi.post("/register", payload);
    return res.data; // { access_token, refresh_token }
  },

  // ========================
  // 🔹 ACCOUNT LINK / UNLINK
  // ========================

  // Liên kết tài khoản Google
  linkGoogle: async (idToken: string) => {
    const res = await authApi.post("/link-google", { id_token: idToken });
    return res.data;
  },

  // Liên kết số điện thoại
  linkPhone: async (phone: string, password: string) => {
    const res = await authApi.post("/link-phone", { phone, password });
    return res.data;
  },

  // Yêu cầu gỡ liên kết tài khoản (Google / Phone)
  requestUnlink: async (type: "google" | "phone") => {
    const res = await authApi.post("/request-unlink", { type });
    return res.data;
  },

  // Xác nhận gỡ liên kết tài khoản
  confirmUnlink: async (type: "google" | "phone", code: string) => {
    const res = await authApi.post("/confirm-unlink", { type, code });
    return res.data;
  },

  // ========================
  // 🔹 EMAIL / PASSWORD MANAGEMENT
  // ========================

  // Kiểm tra trùng email/phone
  checkAvailability: async (phone?: string, email?: string) => {
    const res = await authApi.post("/check-availability", { phone, email });
    return res.data;
  },

  // Gửi mã xác thực email
  sendEmailVerification: async (email: string) => {
    const res = await authApi.post("/send-email-verification", { email });
    return res.data;
  },

  // Xác minh email
  verifyEmail: async (email: string, code: string) => {
    const res = await authApi.post("/verify-email", { email, code });
    return res.data;
  },

  // Gửi mã đổi email
  requestEmailChange: async (oldEmail: string, newEmail: string) => {
    const res = await authApi.post("/request-email-change", { oldEmail, newEmail });
    return res.data;
  },

  // Xác nhận đổi email
  confirmEmailChange: async (oldEmail: string, code: string) => {
    const res = await authApi.post("/confirm-email-change", { oldEmail, code });
    return res.data;
  },
};
