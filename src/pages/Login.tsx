import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Sparkles, LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            let message = "";
            if (!username) message = "Username is required.";
            else if (!password) message = "Password is required.";
            setErrorMsg(message);
        } else {
            setErrorMsg("");
            // Redirect to Home page after successful login
            navigate("/home");
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
                                <img
                                    src="/src/assets/logo.png"
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

                                {/* Google Login Button */}
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                                    <button
                                        type="button"
                                        className="relative w-full bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold shadow-lg hover:bg-white/90 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] group"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l6-6A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z" />
                                                <path fill="#e53935" d="M6.3 14.6 13 19.2c1.7-3.4 5.1-6.2 11-6.2 3 0 5.8 1.1 7.9 3l6-6C33.8 5.6 29.2 4 24 4c-7.6 0-14.1 4.3-17.7 10.6z" />
                                                <path fill="#4caf50" d="M24 44c5.9 0 10.9-1.9 14.5-5.2l-6.7-5.5c-2 1.3-4.6 2.1-7.8 2.1a12 12 0 0 1-11.3-8l-6.7 5.1C9.9 39.7 16.5 44 24 44z" />
                                                <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.3 4.5-4.5 6l0.1-0.1 6.7 5.5c-0.5.5 7.4-5.4 7.4-15.9 0-1.2-.1-2.1-.4-3.5z" />
                                            </svg>
                                            Google Sign In
                                        </span>
                                    </button>
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
                        <img
                            src="/src/assets/login_left_image.png"
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
        </div>
    );
}