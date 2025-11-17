import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
  Send,
  Shield,
  RotateCcw,
} from "lucide-react";
import firebase from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  checkAvailability,
  sendEmailVerification,
  verifyEmail,
} from "../../../redux/actions/authActions";
import { useNotify } from "../../../components/notifications/NotificationsProvider";

export default function ChangePassword() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const notify = useNotify();
  const { profile } = useSelector((state: RootState) => state.user);

  // 🧠 reCAPTCHA setup
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("✅ reCAPTCHA solved"),
        }
      );
      window.recaptchaVerifier.render();
    }
  }, []);

  // 🧠 Prefill email / phone
  useEffect(() => {
    if (method === "phone" && profile?.phone) setInput(profile.phone);
    if (method === "email" && profile?.email) setInput(profile.email);
  }, [method, profile]);

  const normalizePhone = (phone: string) => {
    let p = phone.trim();
    if (p.startsWith("0")) p = "+84" + p.slice(1);
    return p;
  };

  // 🔹 Gửi OTP qua Firebase
  const sendOtpFirebase = async (phone: string) => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await firebase
        .auth()
        .signInWithPhoneNumber(normalizePhone(phone), appVerifier);
      setConfirmation(result);
      setShowOtpModal(true);
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("sendOtpFirebase error:", err);
      notify.error("❌ Gửi OTP thất bại");
    }
  };

  // 🔹 Gửi mã xác thực hoặc OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      const msg = "❌ Please enter your phone number or email.";
      setError(msg);
      notify.error(msg);
      return;
    }

    if (method === "phone" && !/^0\d{9,}$/.test(input)) {
      const msg =
        "❌ Phone number must start with 0 and be at least 10 digits.";
      setError(msg);
      notify.error(msg);
      return;
    }

    if (
      method === "email" &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input)
    ) {
      const msg = "❌ Invalid email address.";
      setError(msg);
      notify.error(msg);
      return;
    }

    setError("");

    if (method === "phone") {
      try {
        await checkAvailability(input)();
        notify.error("❌ Phone number not registered");
      } catch (err: any) {
        if (err.message === "Phone or Email already exists") {
          await sendOtpFirebase(input);
          notify.success("📲 OTP has been sent to your phone!");
        } else {
          notify.error("❌ Something went wrong");
        }
      }
    } else {
      try {
        await checkAvailability(undefined, input)();
        notify.error("❌ Email not registered");
      } catch (err: any) {
        if (err.message === "Phone or Email already exists") {
          await sendEmailVerification(input)();
          notify.success("📩 Verification code sent to your email!");
          setShowOtpModal(true);
          setTimer(60);
          setCanResend(false);
          setOtp(["", "", "", "", "", ""]);
        } else {
          notify.error("❌ Something went wrong");
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      notify.error("❗ Please enter the full 6-digit code.");
      return;
    }

    try {
      if (method === "phone" && confirmation) {
        await confirmation.confirm(code);
        notify.success("✅ OTP verified!");
        navigate("/reset-password", { state: { phone: input, from: "change" } });
      } else {
        await verifyEmail(input, code)();
        notify.success("✅ Email verified!");
        navigate("/reset-password", { state: { email: input, from: "change" } });
      }
    } catch (err) {
      console.error("verifyOtp error:", err);
      notify.error("❌ Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      if (method === "phone") {
        await sendOtpFirebase(input);
        notify.success("📲 OTP resent to your phone!");
      } else {
        await sendEmailVerification(input)();
        notify.success("📩 Verification code resent to your email!");
      }
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error("resend error:", err);
      notify.error("❌ Failed to resend code");
    }
  };

  // ⏱ Countdown Timer
  useEffect(() => {
    let interval: any;
    if (showOtpModal && !canResend && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timer, canResend]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* 🔹 Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Left Card */}
        <div className="w-full md:w-1/2 max-w-md relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="relative bg-white/90 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-blue-200/60 shadow-cyan-500/20">
            <div className="flex items-center gap-4 mb-8">
              <img
                src="/src/assets/logo.png"
                alt="NutriAI Logo"
                className="relative w-25 h-20 object-contain rounded-full drop-shadow-2xl"
              />
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  NutriAI
                </h2>
                <p className="text-blue-600 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Change Password
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Method */}
              <div className="bg-blue-50/70 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 font-semibold mb-3 text-center">
                  Choose recovery method:
                </p>
                <div className="flex items-center justify-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="phone"
                      checked={method === "phone"}
                      onChange={() => setMethod("phone")}
                    />
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Phone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={method === "email"}
                      onChange={() => setMethod("email")}
                    />
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">Email</span>
                  </label>
                </div>
              </div>

              {/* Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {method === "phone" ? (
                    <Phone className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Mail className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <input
                  type={method === "phone" ? "tel" : "email"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  readOnly
                  className="w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
                >
                  <Send className="w-5 h-5 inline mr-2 animate-pulse" />
                  Send Reset Code
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="w-full bg-white/80 border-2 border-blue-300 text-blue-700 py-4 rounded-xl font-semibold text-lg shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                  Back to Setting
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex justify-center items-center w-full md:w-1/2 px-8">
          <img
            src="/src/assets/login_left_image.png"
            alt="Medical Illustration"
            className="max-w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
          />
        </div>
      </div>

      {/* 🔹 OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl p-8 border border-blue-200/60">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-blue-600 text-sm">
                We sent a 6-digit code to your{" "}
                {method === "phone" ? "phone number" : "email address"}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[i] = el!;
                  }}                  
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-blue-200 rounded-lg bg-blue-50/70 text-blue-900"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
            >
              <Lock className="w-5 h-5 inline mr-2 animate-pulse" />
              Verify Code
            </button>

            <div className="text-center mt-4">
              {!canResend ? (
                <div className="text-blue-600 text-sm">
                  Resend in {timer}s...
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-500 hover:text-cyan-500 font-semibold underline"
                >
                  <RotateCcw className="w-4 h-4 inline mr-1" />
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Firebase Recaptcha Container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
