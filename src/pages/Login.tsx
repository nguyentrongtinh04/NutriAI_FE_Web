import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setErrorMsg("Please enter both username and password.");
        } else {
            setErrorMsg("");
            console.log("Logging in with:", username, password);
            // Bạn có thể thay bằng logic gửi API
        }
    };

    return (
        <div className="min-h-screen w-full font-sans overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] relative">

            {/* Left Side Login Form */}
            <div className="w-full md:w-1/2 px-6 sm:px-12 md:px-20">
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.05)] p-8 sm:p-10">
                    {/* Title + Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/src/assets/logo.png" alt="NutriAI Logo" className="w-25 h-20" />
                        <h2 className="text-3xl font-extrabold text-[#1c3c64]">NutriAI</h2>
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                        <div className="text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm mb-4">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-[#bcdaf7] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-[#bcdaf7] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]"
                        />

                        {/* Login + Register buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white font-extrabold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="flex-1 flex items-center justify-center gap-2 border border-[#90c2e7] px-6 py-3 rounded-full text-lg font-extrabold text-[#1c3c64] bg-white/40 backdrop-blur-sm hover:bg-[#e3f3fd] shadow-lg transition"
                            >
                                Register
                            </button>
                        </div>

                        {/* Google login */}
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border font-bold border-[#90c2e7] px-5 py-2 rounded-full text-sm text-[#1c3c64] hover:bg-[#e3f3fd] transition backdrop-blur-sm bg-white/40 mt-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l6-6A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z" />
                                <path fill="#e53935" d="M6.3 14.6 13 19.2c1.7-3.4 5.1-6.2 11-6.2 3 0 5.8 1.1 7.9 3l6-6C33.8 5.6 29.2 4 24 4c-7.6 0-14.1 4.3-17.7 10.6z" />
                                <path fill="#4caf50" d="M24 44c5.9 0 10.9-1.9 14.5-5.2l-6.7-5.5c-2 1.3-4.6 2.1-7.8 2.1a12 12 0 0 1-11.3-8l-6.7 5.1C9.9 39.7 16.5 44 24 44z" />
                                <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.3 4.5-4.5 6l0.1-0.1 6.7 5.5c-0.5.5 7.4-5.4 7.4-15.9 0-1.2-.1-2.1-.4-3.5z" />
                            </svg>
                            Google Login
                        </button>

                        <p
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-right text-[#224665] mt-4 hover:underline cursor-pointer"
                        >
                            Forgot password?
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side Image */}
            <div className="hidden md:flex justify-center items-center w-1/2 h-full px-8">
                <img
                    src="/src/assets/login_left_image.png"
                    alt="Medical Illustration"
                    className="max-w-full h-auto object-contain drop-shadow-2xl"
                />
            </div>
        </div>
    );
}
