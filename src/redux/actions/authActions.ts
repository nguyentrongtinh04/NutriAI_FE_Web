import { AppDispatch } from "../store";
import { authService } from "../../services/authService";
import { setAuth, clearAuth } from "../slices/authSlice";
import { setUser, clearUser } from "../slices/userSlice";
import { normalizeUser } from "../../utils/normalizeUser";

// ========================
// 🔹 LOGIN / REGISTER / LOGOUT
// ========================

// Đăng nhập bằng Google
export const loginWithGoogle = (idToken: string, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      const { access_token, refresh_token, new_user } =
        await authService.loginWithGoogle(idToken, dispatch, navigate);

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const rawUser = await authService.fetchUserProfile(access_token);

      dispatch(
        setAuth({
          accessToken: access_token,
          refreshToken: refresh_token,
          user: normalizeUser(rawUser),
        })
      );

      navigate("/home");
      return { new_user };
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  };


// Đăng nhập bằng tài khoản
export const loginWithPassword =
  (username: string, password: string, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      const { access_token, refresh_token } =
        await authService.loginWithPassword(username, password);

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const rawUser = await authService.fetchUserProfile(access_token);

      dispatch(
        setAuth({
          accessToken: access_token,
          refreshToken: refresh_token,
          user: normalizeUser(rawUser), // 🔥 QUAN TRỌNG
        })
      );

      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      throw err;
    }
  };
// Đăng ký người dùng
export const register = (payload: any, navigate: any) =>
  async (dispatch: AppDispatch) => {
    try {
      const { access_token, refresh_token } = await authService.register({
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        fullname: payload.fullName,
        DOB: payload.DOB,
        gender: payload.gender,
        height: payload.height,
        weight: payload.weight,
      });

      dispatch(setAuth({ accessToken: access_token, refreshToken: refresh_token,user: normalizeUser({}) }));
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const user = await authService.fetchUserProfile(access_token);
      dispatch(setUser(user));
      navigate("/home");
    } catch (err) {
      console.error("Register Error:", err);
      throw err;
    }
  };

// Đăng xuất
export const logout = (navigate: any) => async (dispatch: AppDispatch) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    await authService.logout(refreshToken || "");

    dispatch(clearAuth());
    dispatch(clearUser());
    localStorage.clear();
    navigate("/signin");
  } catch (err) {
    console.error("Logout Error:", err);
  }
};

// ========================
// 🔹 EMAIL VERIFICATION / CHANGE
// ========================

// Gửi mã xác thực email
export const sendEmailVerification = (email: string) => async () => {
  try {
    const res = await authService.sendEmailVerification(email);
    return res; // { message: string }
  } catch (err: any) {
    console.error("Send Email Verification Error:", err);
    throw err;
  }
};

// Xác minh email (OTP)
export const verifyEmail = (email: string, code: string) => async () => {
  try {
    const res = await authService.verifyEmail(email, code);
    return res;
  } catch (err: any) {
    console.error("Verify Email Error:", err);
    throw err;
  }
};

// Gửi mã đổi email
export const requestEmailChange = (oldEmail: string, newEmail: string) => async () => {
  try {
    return await authService.requestEmailChange(oldEmail, newEmail);
  } catch (err: any) {
    console.error("Request Email Change Error:", err);
    throw err;
  }
};

// Xác nhận đổi email
export const confirmEmailChange = (oldEmail: string, code: string) => async () => {
  try {
    return await authService.confirmEmailChange(oldEmail, code);
  } catch (err: any) {
    console.error("Confirm Email Change Error:", err);
    throw err;
  }
};

// ========================
// 🔹 ACCOUNT LINK / UNLINK
// ========================

// Liên kết Google
export const linkGoogle = (idToken: string) => async () => {
  try {
    return await authService.linkGoogle(idToken);
  } catch (err: any) {
    console.error("Link Google Error:", err);
    throw err;
  }
};

// Liên kết số điện thoại
export const linkPhone = (phone: string, password: string) => async () => {
  try {
    return await authService.linkPhone(phone, password);
  } catch (err: any) {
    console.error("Link Phone Error:", err);
    throw err;
  }
};

// Xác nhận liên kết số điện thoại (OTP)
export const confirmLinkPhone = (code: string) => async () => {
  try {
    return await authService.confirmLinkPhone(code);
  } catch (err: any) {
    console.error("Confirm Link Phone Error:", err);
    throw err;
  }
};

// Yêu cầu gỡ liên kết
export const requestUnlink = (type: "google" | "phone") => async () => {
  try {
    return await authService.requestUnlink(type);
  } catch (err: any) {
    console.error("Request Unlink Error:", err);
    throw err;
  }
};

// Xác nhận gỡ liên kết
export const confirmUnlink = (type: "google" | "phone", code: string) => async () => {
  try {
    return await authService.confirmUnlink(type, code);
  } catch (err: any) {
    console.error("Confirm Unlink Error:", err);
    throw err;
  }
};

// ========================
// 🔹 CHECK ACCOUNT EXISTENCE
// ========================

// Kiểm tra trùng email/phone
export const checkAvailability = (phone?: string, email?: string) => async () => {
  try {
    const res = await authService.checkAvailability(phone, email);
    return res;
  } catch (err: any) {
    console.error("Check Availability Error:", err);
    throw err;
  }
};
