import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import điều hướng

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 khởi tạo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      alert("✅ Password has been reset successfully!");

      // TODO: Call API to reset password
      // ✅ Sau đó điều hướng về trang login
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] px-4">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-extrabold text-[#1c3c64] mb-4">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[#bcdaf7] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[#bcdaf7] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
