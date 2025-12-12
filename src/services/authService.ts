import { NavigateFunction } from "react-router-dom";
import { setAuth } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import { authApi, userApi } from "./api";
import { fetchMe } from "../redux/slices/userSlice";

export const authService = {
  // ======================================
  // 🔹 LOGIN / REGISTER / LOGOUT
  // ======================================

  // Đăng nhập bằng Google
  loginWithGoogle: async (
    idToken: string,
    dispatch: AppDispatch,
    navigate: NavigateFunction
  ) => {
    const res = await authApi.post("/google", { id_token: idToken });
    const data = res.data;

    dispatch(
      setAuth({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })
    );

    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    const user = await dispatch(fetchMe()).unwrap();
    localStorage.setItem("userId", user.id || user.authId);

    navigate("/home");
    return data;
  },

  // Đăng nhập bằng phone/email + password
  loginWithPassword: async (username: string, password: string) => {
    const res = await authApi.post("/login", {
      phoneOrEmail: username,
      password,
    });
    return res.data;
  },

  // Lấy thông tin user (auth + user profile)
  fetchUserProfile: async (access_token: string) => {
    const [profileRes, authRes] = await Promise.all([
      userApi.get("/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      authApi.get("/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    return {
      ...profileRes.data,
      email: authRes.data.email,
      phone: authRes.data.phone,
      role: authRes.data.role,
      providers: authRes.data.providers || [],
    };
  },

  logout: async (refreshToken: string) => {
    if (refreshToken) {
      await authApi.post("/logout", { refresh_token: refreshToken });
    }
  },

  register: async (payload: {
    phone: string;
    email: string;
    password: string;
    fullname: string;
    DOB: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    height: number;
    weight: number;
  }) => {
    const res = await authApi.post("/register", payload);
    return res.data;
  },

  // ======================================
  // 🔹 LINK / UNLINK ACCOUNT
  // ======================================

  linkGoogle: async (idToken: string) => {
    const res = await authApi.post("/link-google", { id_token: idToken });
    return res.data;
  },

  linkPhone: async (phone: string, password: string) => {
    const res = await authApi.post("/link-phone", { phone, password });
    return res.data;
  },
  
  confirmLinkPhone: async (code: string) => {
    const res = await authApi.post("/confirm-link-phone", { code });
    return res.data;
  },  

  requestUnlink: async (type: "google" | "phone") => {
    const res = await authApi.post("/request-unlink", { type });
    return res.data;
  },

  confirmUnlink: async (type: "google" | "phone", code: string) => {
    const res = await authApi.post("/confirm-unlink", { type, code });
    return res.data;
  },

  // ======================================
  // 🔹 EMAIL / PASSWORD MANAGEMENT
  // ======================================

  checkAvailability: async (phone?: string, email?: string) => {
    const res = await authApi.post("/check-availability", { phone, email });
    return res.data;
  },

  sendEmailVerification: async (email: string) => {
    const res = await authApi.post("/send-email-verification", { email });
    return res.data;
  },

  verifyEmail: async (email: string, code: string) => {
    const res = await authApi.post("/verify-email", { email, code });
    return res.data;
  },

  requestEmailChange: async (oldEmail: string, newEmail: string) => {
    const res = await authApi.post("/request-email-change", {
      oldEmail,
      newEmail,
    });
    return res.data;
  },

  confirmEmailChange: async (oldEmail: string, code: string) => {
    const res = await authApi.post("/confirm-email-change", {
      oldEmail,
      code,
    });
    return res.data;
  },

  // ======================================
  // 🔥 FIXED — ĐÚNG ROUTE CỦA BE
  // ======================================

  resetPasswordByPhone: async (phone: string, newPassword: string) => {
    const res = await authApi.post("/change-password", {
      phone,
      newPassword,
    });
    return res.data;
  },

  resetPasswordByEmail: async (email: string, newPassword: string) => {
    const res = await authApi.post("/change-password-email", {
      email,
      newPassword,
    });
    return res.data;
  },
};
