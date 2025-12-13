import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useNotify } from "../components/notifications/NotificationsProvider";
import { authService } from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { clearUser, fetchMe } from "../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";

import logo from "../assets/logo.png";
import MedicalIllustration from "../assets/login_left_image.png";
import { clearAuth, setAuth } from "../redux/slices/authSlice";
import { normalizeUser } from "../utils/normalizeUser";
declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const [username, setUsername] = useState("0379664715");
  const [password, setPassword] = useState("nam123");
  const [errorMsg, setErrorMsg] = useState("");
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();

  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/home";

  const dispatch = useDispatch<AppDispatch>();
  // ===== Normal login =====
  interface TokenPayload {
    role: "user" | "admin";
    sub: string; // authId
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearUser());
    dispatch(clearAuth());

    try {
      if (!username || !password) {
        const msg = "❌ Username and password must not be empty.";
        setErrorMsg(msg);
        notify.error(msg);
        return;
      }

      // Đăng nhập
      const res = await authService.loginWithPassword(username, password);

      notify.success("🎉 Login successful!");
      setErrorMsg("");

      // Lưu token
      localStorage.setItem("accessToken", res.access_token);
      localStorage.setItem("refreshToken", res.refresh_token);

      // ⛔ LẤY ROLE từ token (không phải fetchMe)
      const decoded = jwtDecode<TokenPayload>(res.access_token);
      localStorage.setItem("role", decoded.role);

      // Nếu ADMIN → không gọi fetchMe(), không gọi User-Service
      if (decoded.role === "admin") {
        dispatch(
          setAuth({
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            user: normalizeUser(res.user), // 🔥 LẤY TỪ LOGIN RESPONSE
          })
        );
      
        localStorage.setItem("userId", res.user.id);
        navigate("/admin");
        return;
      }          

      // 🟢 USER THƯỜNG → gọi fetch profile
      const userRes = await dispatch(fetchMe()).unwrap();

      const uid = userRes?.id || userRes?.authId || decoded.sub;
      localStorage.setItem("userId", uid);

      navigate(redirectPath);

    } catch (e: any) {
      const status = e.response?.status;
      const message = e.response?.data?.message || e.message;

      if (status === 404) {
        setErrorMsg("❌ Username does not exist.");
        notify.error("❌ Username does not exist.");
      } else if (status === 401) {
        setErrorMsg("❌ Incorrect password.");
        notify.error("❌ Incorrect password.");
      } else {
        setErrorMsg(`❌ Login failed: ${message}`);
        notify.error(`❌ Login failed: ${message}`);
      }
    }
  };



  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Aurora Waves */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Aurora Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
          <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/45 via-cyan-400/55 to-blue-500/45 rounded-full blur-3xl animate-bounce delay-3000"></div>
        </div>

        {/* Animated Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-sky-300/40 via-transparent to-blue-400/40 animate-pulse delay-2000"></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-300 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Ripple Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-blue-400/40 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-2/3 left-1/2 w-20 h-20 border-2 border-sky-400/35 rounded-full animate-ping delay-2000"></div>
        </div>

        {/* Moving Aurora Streams */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -skew-y-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent transform -skew-y-6 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">

        {/* Left Side Login Form */}
        <div className="w-full md:w-1/2 max-w-md">
          {/* Enhanced Glowing Border */}
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

          {/* Main Card with Enhanced Glass Effect */}
          <div className="relative bg-white/90 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-blue-200/60 shadow-cyan-500/20">

            {/* Enhanced Header with Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-500/40 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -inset-1 bg-white/30 rounded-full blur-lg animate-pulse delay-500"></div>
                <img src={logo}
                  alt="NutriAI Logo"
                  className="relative w-25 h-20 object-contain drop-shadow-2xl filter brightness-110 contrast-110 saturate-110"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-pulse">
                  NutriAI
                </h2>
                <p className="text-blue-600 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Welcome back
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Enhanced Username Field */}
              <div className="relative group">
                {/* Tooltip */}
                {errorMsg.includes("Username") && (
                  <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded-md shadow-lg animate-fade-in">
                    {errorMsg}
                  </div>
                )}

                {/* Username Field */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errorMsg.includes("Username") ? "border-red-400" : "border-blue-200"
                      } rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 backdrop-blur-sm`}
                  />
                </div>
              </div>

              {/* Enhanced Password Field */}
              <div className="relative group">
                {/* Tooltip */}
                {errorMsg.includes("Password") && (
                  <div className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded-md shadow-lg animate-fade-in">
                    {errorMsg}
                  </div>
                )}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-cyan-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5 animate-pulse" />}
                  </button>
                </div>
              </div>

              {/* Enhanced Buttons */}
              <div className="space-y-4">
                {/* Login Button */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                  <button
                    type="submit"
                    className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5 animate-pulse" />
                      Sign In
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>

                {/* Register Button */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="relative w-full bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-white/90 hover:border-cyan-400 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5 group-hover:animate-pulse" />
                      Sign Up
                    </span>
                  </button>
                </div>
                {/* Google Login Button (Custom styled) */}
                <div
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      const idToken = credentialResponse.credential;
                      if (!idToken) {
                        notify.error("Failed to retrieve Google ID token.");
                        return;
                      }

                      try {
                        // 🔥 Gửi ID token sang BE để login / auto-register
                        const res = await authService.loginWithGoogle(idToken, dispatch, navigate);

                        // ⚡ Nếu BE trả new_user flag (người mới tạo tài khoản)
                        if (res?.new_user) {
                          notify.success("🎉 Welcome! Your Google account has been created successfully!");
                        } else {
                          notify.success("✅ Google login successful!");
                        }
                      } catch (err: any) {
                        console.error("Google login error:", err);

                        const msg =
                          err?.message ||
                          err?.response?.data?.message ||
                          "❌ Google login failed. Please try again.";

                        // 🧩 Xử lý các thông báo đặc biệt
                        if (msg.includes("not verified")) {
                          notify.error("🚫 Your Google email is not verified. Please verify it before logging in.");
                        } else if (msg.includes("Invalid") || msg.includes("expired")) {
                          notify.error("❌ Invalid or expired Google login token. Please try again.");
                        } else {
                          notify.error(msg);
                        }
                      }
                    }}
                    onError={() => notify.error("❌ Google login failed")}
                    useOneTap={false}
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-500 hover:text-cyan-500 text-sm transition-colors duration-300 underline decoration-blue-400 decoration-2 underline-offset-4 flex items-center justify-center gap-2 mx-auto group"
                >
                  Forgot password?
                  <ArrowRight className="w-4 h-4 group-hover:animate-bounce" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:flex justify-center items-center w-full md:w-1/2 px-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-cyan-300/40 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl animate-pulse delay-500"></div>
            <img src={MedicalIllustration}
              alt="Medical Illustration"
              className="relative max-w-full h-auto object-contain drop-shadow-2xl filter brightness-110 contrast-110 saturate-110 transform hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Enhanced UserDetail Modal */}
      {showUserDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center px-4">
          <div className="relative w-full max-w-2xl">
            {/* Enhanced Modal Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

            <div className="relative bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-6 md:p-10 border border-blue-200/60 shadow-cyan-500/20 transform scale-100 hover:scale-[1.01] transition-transform duration-300">
              {/* Enhanced Skip Button */}
              <button
                onClick={() => setShowUserDetail(false)}
                className="absolute top-4 right-6 text-blue-500 hover:text-cyan-500 font-semibold transition-colors duration-300 flex items-center gap-2 group"
              >
                Skip for now
                <ArrowRight className="w-4 h-4 group-hover:animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-32 h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
      <div className="absolute bottom-1/4 right-5 w-36 h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
      <div id="recaptcha-container-login" className="hidden" />
    </div>
  );
}
