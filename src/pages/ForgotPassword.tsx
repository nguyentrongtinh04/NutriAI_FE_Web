import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

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
    navigate("/otp"); // ✅ Điều hướng đến trang OTP
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] px-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="/src/assets/logo.png"
            alt="NutriAI Logo"
            className="w-25 h-20 object-contain"
          />
          <h2 className="text-2xl font-extrabold text-[#1c3c64]">
            Forgot Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-[#224665] mb-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="phone"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
              />
              Via Phone
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="email"
                checked={method === "email"}
                onChange={() => setMethod("email")}
              />
              Via Email
            </label>
          </div>

          <input
            type={method === "phone" ? "tel" : "email"}
            placeholder={method === "phone" ? "Enter your phone number" : "Enter your email"}
            value={input}
            onChange={(e) => {
              const val = e.target.value;
              if (method === "phone") {
                // Chỉ cho phép số (digits)
                if (/^[0-9]*$/.test(val)) {
                  setInput(val);
                  setError(""); // Reset lỗi nếu có
                }
              } else {
                setInput(val);
                setError(""); // Reset lỗi nếu có
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

          <p
            onClick={() => navigate("/login")}
            className="text-sm text-center text-[#224665] mt-4 hover:underline cursor-pointer"
          >
            Back to Login
          </p>
        </form>
      </div>
    </div>
  );
}
