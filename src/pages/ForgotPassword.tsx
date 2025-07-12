import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // Focus vào ô đầu tiên khi modal hiện
  useEffect(() => {
    if (showOtpModal) {
      inputRefs.current[0]?.focus();
    }
  }, [showOtpModal]);

  // Countdown OTP
  useEffect(() => {
    if (showOtpModal && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [showOtpModal, timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter your phone number or email.");
      return;
    }

    if (method === "phone" && !/^\d{10,}$/.test(input)) {
      setError("Phone number must be at least 10 digits.");
      return;
    }

    if (
      method === "email" &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input)
    ) {
      setError("Invalid email address.");
      return;
    }

    setError("");
    setShowOtpModal(true);
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
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

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) {
      alert("❗ Please enter the full 6-digit code.");
      return;
    }

    alert("✅ OTP verified!");
    navigate("/reset-password"); // ✅ Chuyển hướng sang Reset Password
  };

  function handleResend() {
    if (!canResend) return;
    alert("🔁 OTP resent!");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setTimer(60);
    setCanResend(false);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] px-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <img src="/src/assets/logo.png" alt="NutriAI Logo" className="w-25 h-20 object-contain" />
          <h2 className="text-2xl font-extrabold text-[#1c3c64]">Forgot Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-[#224665] mb-1">
            <label className="flex items-center gap-1">
              <input type="radio" value="phone" checked={method === "phone"} onChange={() => setMethod("phone")} />
              Via Phone
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" value="email" checked={method === "email"} onChange={() => setMethod("email")} />
              Via Email
            </label>
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
            className={`px-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-[#bcdaf7]"} bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]`}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition mt-2"
          >
            Send Reset Password
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-[#2a78b8] font-medium hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-[#1c3c64] mb-2">Enter OTP</h2>
            <p className="text-sm text-[#224665] mb-4">We sent a 6-digit code to your {method}</p>

            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-10 h-12 text-center text-lg border border-[#bcdaf7] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
              Verify
            </button>

            <div className="text-sm text-[#1c3c64] mt-3">
              {!canResend ? (
                <p className="text-gray-500">Wait {timer}s to resend</p>
              ) : (
                <button onClick={handleResend} className="text-[#2a78b8] font-bold hover:underline">
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
