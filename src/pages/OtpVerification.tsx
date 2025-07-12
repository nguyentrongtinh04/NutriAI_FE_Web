import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Focus ô đầu tiên khi load trang
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Đếm ngược gửi lại mã
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          setCanResend(true);
          clearInterval(timer);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // Reset lại đếm ngược và trạng thái
    setSecondsLeft(60);
    setCanResend(false);
    alert("📨 New OTP has been sent!");
    // TODO: Gửi lại mã OTP qua API
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] px-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-extrabold text-[#1c3c64] mb-4">Enter OTP</h2>
        <p className="text-[#224665] mb-6 text-sm">
          We sent a 6-digit code to your phone/email
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 h-12 text-center text-lg border border-[#bcdaf7] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
            />
          ))}
        </div>

        <button className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition mb-4">
          Verify
        </button>

        {canResend ? (
          <button
            onClick={handleResend}
            className="text-sm text-[#2a78b8] font-semibold hover:underline"
          >
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-gray-600">
            Resend available in <span className="font-medium">{secondsLeft}s</span>
          </p>
        )}

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-[#224665] mt-4 hover:underline cursor-pointer"
        >
          Back to ForgotPassword
        </p>
      </div>
    </div>
  );
}
