import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Lock, ArrowLeft, Sparkles, Send, Shield, RotateCcw } from "lucide-react";
import firebase from "../firebase"; // 👈 import firebase như Register.tsx
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { checkAvailability, sendEmailVerification, verifyEmail } from "../redux/slices/authSlice";
import { useNotify } from "../components/notifications/NotificationsProvider";

export default function ForgotPassword() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null); // 👈 để lưu confirmationResult
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const notify = useNotify();

  // reCAPTCHA setup (giống Register.tsx)
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: (response: any) => console.log("✅ reCAPTCHA solved"),
      });
      window.recaptchaVerifier.render();
    }
  }, []);

  const normalizePhone = (phone: string) => {
    let p = phone.trim();
    if (p.startsWith("0")) {
      p = "+84" + p.slice(1);
    }
    return p;
  };

  // gửi OTP qua Firebase
  const sendOtpFirebase = async (phone: string) => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await firebase.auth().signInWithPhoneNumber(normalizePhone(phone), appVerifier);
      setConfirmation(result);
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      notify.success("📲 Mã OTP đã được gửi đến số điện thoại của bạn!");
    } catch (err) {
      console.error("sendOtpFirebase error:", err);
      const msg = "⚠️ Gửi mã OTP thất bại. Vui lòng kiểm tra số điện thoại và thử lại.";
      setError(msg);
      notify.error(msg);
    }    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      const msg = "❌ Please enter your phone number or email.";
      setError(msg);
      notify.error(msg);
      return;
    }

    if (method === "phone" && !/^0\d{9,}$/.test(input)) {
      const msg = "❌ Phone number must start with 0 and be at least 10 digits.";
      setError(msg);
      notify.error(msg);
      return;
    }

    if (method === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input)) {
      const msg = "❌ Invalid email address.";
      setError(msg);
      notify.error(msg);
      return;
    }

    setError("");

    if (method === "email") {
      try {
        await dispatch(checkAvailability({ email: input })).unwrap();
        notify.error("❌ Email chưa được đăng ký");
      } catch (err: any) {
        // Nếu BE báo "Phone or Email already exists" nghĩa là có tài khoản
        if (err.message === "Phone or Email already exists") {
          try {
            const res = await dispatch(sendEmailVerification(input)).unwrap();
            notify.success(res.message); // ✅ Hiển thị đúng thông báo BE
            // ✅ Chỉ bật modal nếu BE trả success thật
            if (res.success) {
              setShowOtpModal(true);
              setTimer(60);
              setCanResend(false);
              setOtp(["", "", "", "", "", ""]);
            }
          } catch (err2: any) {
            // ❌ Nếu gửi thất bại (email chưa verify, tài khoản google, v.v.)
            const msg =
              err2.response?.data?.message ||
              err2.message ||
              "⚠️ Gửi mã xác thực thất bại.";
            setError(msg);
            notify.error(msg);
            // 🚫 Không mở modal ở đây!
            setShowOtpModal(false);
          }
        } else {
          notify.error("❌ Có lỗi không xác định khi kiểm tra email.");
        }
      }
    }    
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      const msg = "❗ Please enter the full 6-digit code.";
      setError(msg);
      notify.error(msg);
      return;
    }

    try {
      if (method === "phone" && confirmation) {
        await confirmation.confirm(code);
        notify.success("✅ OTP verified!");
        navigate("/reset-password", { state: { phone: input, from: "forgot" } });
      } else {
        await dispatch(verifyEmail({ email: input, code })).unwrap();
        notify.success("✅ Email verified!");
        navigate("/reset-password", { state: { email: input, from: "forgot" } });
      }
    } catch (err) {
      console.error("verifyOtp error:", err);
      notify.error("❌ OTP không đúng");
    }
  };

  function handleResend() {
    if (!canResend) return;

    if (method === "phone") {
      sendOtpFirebase(input)
        .then(() => {
          notify.success("📲 OTP resent to your phone!");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          setTimer(60);
          setCanResend(false);
        })
        .catch((err) => {
          console.error("resend phone OTP error:", err);
          const msg = "❌ Failed to resend OTP to phone";
          setError(msg);
          notify.error(msg);
        });
    } else {
      dispatch(sendEmailVerification(input))
        .unwrap()
        .then((res) => {
          notify.success(res.message);
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          setTimer(60);
          setCanResend(false);
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err.message || "❌ Gửi lại mã xác thực thất bại.";
          setError(msg);
          notify.error(msg);
        });
    }
  }

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

        {/* Left Side Forgot Password Form */}
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
                <img
                  src="/src/assets/logo.png"
                  alt="NutriAI Logo"
                  className="relative w-25 h-20 object-contain rounded-full drop-shadow-2xl filter brightness-110 contrast-110 saturate-110"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-pulse">
                  NutriAI
                </h2>
                <p className="text-blue-600 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Reset Password
                </p>
              </div>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
                <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center backdrop-blur-sm">
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Method Selection */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 transition duration-300"></div>
                <div className="relative bg-blue-50/70 border-2 border-blue-200 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-blue-700 font-semibold mb-3 text-center">Choose recovery method:</p>
                  <div className="flex items-center justify-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        value="phone"
                        checked={method === "phone"}
                        onChange={() => setMethod("phone")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <Phone className="w-4 h-4 text-blue-600 group-hover:text-cyan-500 transition-colors" />
                      <span className="text-blue-700 font-medium group-hover:text-cyan-600 transition-colors">Phone</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        value="email"
                        checked={method === "email"}
                        onChange={() => setMethod("email")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <Mail className="w-4 h-4 text-blue-600 group-hover:text-cyan-500 transition-colors" />
                      <span className="text-blue-700 font-medium group-hover:text-cyan-600 transition-colors">Email</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Enhanced Input Field */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {method === "phone" ? (
                      <Phone className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                    ) : (
                      <Mail className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                    )}
                  </div>
                  <input
                    type={method === "phone" ? "tel" : "email"}
                    placeholder={method === "phone" ? "Enter your phone number" : "Enter your email"}
                    value={input}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (method === "phone" && /^[0-9]*$/.test(val)) {
                        setInput(val);
                        setError("");
                      } else if (method === "email") {
                        setInput(val);
                        setError("");
                      }
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Enhanced Buttons */}
              <div className="space-y-4">
                {/* Send Reset Button */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                  <button
                    type="submit"
                    className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-5 h-5 animate-pulse" />
                      Send Reset Code
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>

                {/* Back to Login Button */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="relative w-full bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-white/90 hover:border-cyan-400 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
                      Back to Sign In
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden md:flex justify-center items-center w-full md:w-1/2 px-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-cyan-300/40 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl animate-pulse delay-500"></div>
            <img
              src="/src/assets/login_left_image.png"
              alt="Medical Illustration"
              className="relative max-w-full h-auto object-contain drop-shadow-2xl filter brightness-110 contrast-110 saturate-110 transform hover:scale-105 transition-all duration-300 rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Enhanced OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            {/* Enhanced Modal Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

            <div className="relative bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-8 border border-blue-200/60 shadow-cyan-500/20 transform scale-100 hover:scale-[1.01] transition-transform duration-300">

              {/* Enhanced Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-500/40 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-blue-100 p-3 rounded-full">
                      <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-blue-600 text-sm">
                  We sent a 6-digit code to your {method === "phone" ? "phone number" : "email address"}
                </p>
              </div>

              {/* Enhanced OTP Input */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-25 transition duration-300"></div>
                    <input
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="relative w-12 h-14 text-center text-xl font-bold border-2 border-blue-200 rounded-lg bg-blue-50/70 text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Enhanced Verify Button */}
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                <button
                  onClick={handleVerifyOtp}
                  className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5 animate-pulse" />
                    Verify Code
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>

              {/* Enhanced Timer/Resend */}
              <div className="text-center">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Resend in {timer}s</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-blue-500 hover:text-cyan-500 font-semibold transition-colors duration-300 underline decoration-blue-400 decoration-2 underline-offset-4 flex items-center justify-center gap-2 mx-auto group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:animate-spin" />
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-32 h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
      <div className="absolute bottom-1/4 right-5 w-36 h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
    </div>
  );
}