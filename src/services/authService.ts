import { clearAuth, setAuth } from "../redux/slices/authSlice";
import { clearUser, setUser } from "../redux/slices/userSlice";
import { store } from "../redux/store";

import axios from "axios";

const IP_AUTH = "http://localhost:5005/auth";
const IP_USER = "http://localhost:5001/user";
const authApi = axios.create({
  baseURL: IP_AUTH,
  // timeout: 10000,
});

const userApi = axios.create({
  baseURL: IP_USER,
  // timeout: 10000,
});
// Google login trên web dùng react-oauth/google (truyền idToken từ component vào)
function normalizeVNPhone(phone: string) {
  if (!phone) return phone.trim();

  phone = phone.trim();
  if (phone.startsWith("0")) return "+84" + phone.slice(1); // 038xxx → +8438xxx
  if (phone.startsWith("84") && !phone.startsWith("+84")) return "+" + phone;
  return phone; // nếu đã +84 thì giữ nguyên
}

export const authService = {
  // Đăng nhập bằng Google
  loginWithGoogle: async (idToken: string, dispatch: any, navigate: any) => {
    try {
      const res = await authApi.post("/google", { id_token: idToken });
      const { access_token, refresh_token } = res.data;

      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token }));

      const [profileRes, authRes] = await Promise.all([
        userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
        authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      ]);

      const mergedUser = {
        ...profileRes.data,
        email: authRes.data.email,
        phone: authRes.data.phone,
        role: authRes.data.role,
      };

      dispatch(setUser(mergedUser));
      navigate("/home");
    } catch (err: any) {
      console.log("Google Login Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Đăng nhập bằng phone/email + password
  loginWithPassword: async (
    username: string,
    password: string,
    dispatch: any,
    navigate: any
  ) => {
    try {
      const res = await authApi.post("/login", {
        phoneOrEmail: username,
        password,
      });
      const { access_token, refresh_token } = res.data;

      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token }));

      const [profileRes, authRes] = await Promise.all([
        userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
        authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      ]);

      const mergedUser = {
        ...profileRes.data,
        email: authRes.data.email,
        phone: authRes.data.phone,
        role: authRes.data.role,
      };

      dispatch(setUser(mergedUser));
      navigate("/home");
    } catch (err: any) {
      console.log("Password Login Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Đăng xuất
  logout: async (dispatch: any, navigate: any) => {
    try {
      const refreshToken = store.getState().auth.refreshToken;
      if (refreshToken) {
        await authApi.post("/logout", { refresh_token: refreshToken });
      }

      // Xoá Redux + localStorage
      dispatch(clearAuth());
      dispatch(clearUser());
      localStorage.removeItem("persist:root");

      navigate("/signin");
    } catch (err: any) {
      console.log("Logout error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Đăng ký (Sign Up)
  register: async (
    payload: {
      phone: string;
      email: string;
      password: string;
      fullname: string;
      DOB: string;
      gender: "MALE" | "FEMALE" | "OTHER";
      height: string;
      weight: string;
    },
    dispatch: any,
    navigate: any
  ) => {
    try {
      const res = await authApi.post("/register", {
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
      });
      const { access_token, refresh_token } = res.data;

      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token }));

      await userApi.post(
        "/create",
        {
          fullname: payload.fullname,
          DOB: payload.DOB,
          gender: payload.gender,
          height: payload.height,
          weight: payload.weight,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const [profileRes, authRes] = await Promise.all([
        userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
        authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      ]);

      const mergedUser = {
        ...profileRes.data,
        email: authRes.data.email,
        phone: authRes.data.phone,
        role: authRes.data.role,
      };

      dispatch(setUser(mergedUser));
      navigate("/login");
    } catch (err: any) {
      console.log("Register Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Gửi OTP
  sendOTP: async (phone: string) => {
    try {
      const normalized = normalizeVNPhone(phone);
      const res = await authApi.post("/send-otp", { phone: normalized });
      return res.data;
    } catch (err: any) {
      console.log("Send OTP Error:", err.response?.data || err.message);
      throw err;
    }
  },


  // Xác minh OTP
  verifyOTP: async (phone: string, code: string) => {
    try {
      const normalized = normalizeVNPhone(phone);
      const res = await authApi.post("/verify-otp", { phone: normalized, code });
      return res.data;
    } catch (err: any) {
      console.log("Verify OTP Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // change password by phone
  resetPasswordByPhone: async (phone: string, newPassword: string) => {
    try {
      const res = await authApi.post("/change-password", {
        phone,
        newPassword,
      });
      return res.data;
    } catch (err: any) {
      console.log("Reset Password Error:", err.response?.data || err.message);
      throw err;
    }
  },
};