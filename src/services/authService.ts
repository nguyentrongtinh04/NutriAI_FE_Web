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
      localStorage.removeItem("persist:root");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token }));
      // 🔥 Lưu vào localStorage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const [profileRes, authRes] = await Promise.all([
        userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
        authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      ]);

      const mergedUser = {
        ...profileRes.data,
        email: authRes.data.email,
        phone: authRes.data.phone,
        role: authRes.data.role,
        providers: authRes.data.providers || [],
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
      localStorage.removeItem("persist:root");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token }));
      // 🔥 Lưu vào localStorage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const [profileRes, authRes] = await Promise.all([
        userApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
        authApi.get("/me", { headers: { Authorization: `Bearer ${access_token}` } }),
      ]);

      const mergedUser = {
        ...profileRes.data,
        email: authRes.data.email,
        phone: authRes.data.phone,
        role: authRes.data.role,
        providers: authRes.data.providers || [],
      };

      dispatch(setUser(mergedUser));
      navigate("/home");
      return res.data;
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

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
        providers: authRes.data.providers || [],
      };

      dispatch(setUser(mergedUser));
      navigate("/login");
    } catch (err: any) {
      console.log("Register Error:", err.response?.data || err.message);
      throw err;
    }
  },

  checkAvailability: async (phone?: string, email?: string) => {
    const res = await authApi.post("/check-availability", { phone, email });
    return res.data; // { available: true } hoặc { message: "...", 409 }
  },
  

  // Link Google
  linkGoogle: async (idToken: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await authApi.post(
        "/link-google",
        { id_token: idToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data;
    } catch (err: any) {
      console.log("Link Google Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Link Phone + Password
  linkPhone: async (phone: string, password: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await authApi.post(
        "/link-phone",
        { phone, password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data;
    } catch (err: any) {
      console.log("Link Phone Error:", err.response?.data || err.message);
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
  // reset password by email
  resetPasswordByEmail: async (email: string, newPassword: string) => {
    try {
      const res = await authApi.post("/change-password-email", {
        email,
        newPassword,
      });
      return res.data;
    } catch (err: any) {
      console.log("Reset Password Email Error:", err.response?.data || err.message);
      throw err;
    }
  },


  // Gửi mã xác thực email
  sendEmailVerification: async (email: string) => {
    try {
      const res = await authApi.post("/send-email-verification", { email });
      return res.data;
    } catch (err: any) {
      console.log("Send Email Verification Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Xác minh email
  verifyEmail: async (email: string, code: string) => {
    try {
      const res = await authApi.post("/verify-email", { email, code });
      return res.data;
    } catch (err: any) {
      console.log("Verify Email Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // gửi yêu cầu đổi email (gửi code về email cũ)
  requestEmailChange: async (oldEmail: string, newEmail: string) => {
    try {
      const res = await authApi.post("/request-email-change", { oldEmail, newEmail });
      return res.data;
    } catch (err: any) {
      console.log("Request Email Change Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // xác nhận đổi email (nhập code từ email cũ)
  confirmEmailChange: async (oldEmail: string, code: string) => {
    try {
      const res = await authApi.post("/confirm-email-change", { oldEmail, code });
      return res.data;
    } catch (err: any) {
      console.log("Confirm Email Change Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ Check phone tồn tại
  checkPhoneExists: async (phone: string) => {
    try {
      const res = await authApi.post("/check-phone", { phone });
      return res.data; // { exists: true/false }
    } catch (err: any) {
      console.log("Check Phone Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ Check email tồn tại
  checkEmailExists: async (email: string) => {
    try {
      const res = await authApi.post("/check-email", { email });
      return res.data; // { exists: true/false }
    } catch (err: any) {
      console.log("Check Email Error:", err.response?.data || err.message);
      throw err;
    }
  },
  requestUnlink: async (type: "google" | "phone") => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await authApi.post(
        "/request-unlink",
        { type },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data; // { success: true, message: "OTP sent ..." }
    } catch (err: any) {
      console.log("Request Unlink Error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Xác nhận unlink (nhập code OTP)
  confirmUnlink: async (type: "google" | "phone", code: string) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await authApi.post(
        "/confirm-unlink",
        { type, code },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return res.data; // { success: true, message: "xxx unlinked successfully" }
    } catch (err: any) {
      console.log("Confirm Unlink Error:", err.response?.data || err.message);
      throw err;
    }
  },
};

