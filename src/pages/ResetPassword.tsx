import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, Sparkles, Lock, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { useNotify } from "../components/notifications/NotificationsProvider";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const notify = useNotify();

    const phone = location.state?.phone;
    const email = location.state?.email;
    const from = location.state?.from || "forgot"; // mặc định là forgot

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            const msg = "❌ Password must be at least 6 characters.";
            setError(msg);
            notify.error(msg);
            return;
        }
        if (newPassword !== confirmPassword) {
            const msg = "❌ Passwords do not match.";
            setError(msg);
            notify.error(msg);
            return;
        }

        try {
            if (phone) {
                await authService.resetPasswordByPhone(phone, newPassword);
            } else if (email) {
                await authService.resetPasswordByEmail(email, newPassword);
            } else {
                const msg = "❌ No account info provided";
                setError(msg);
                notify.error(msg);
                return;
            }

            setError("");
            notify.success("✅ Password has been reset successfully!");

            if (from === "change") {
                navigate("/home"); // 👉 về Home
            } else {
                navigate("/login"); // 👉 giữ logic cũ
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "❌ Failed to reset password";
            setError(msg);
            notify.error(msg);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
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
            <div className="relative z-10 w-full max-w-md">
                {/* Enhanced Glowing Border */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur opacity-40 animate-pulse delay-500"></div>

                {/* Main Card with Enhanced Glass Effect */}
                <div className="relative bg-white/90 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-blue-200/60 shadow-cyan-500/20">
                    {/* Enhanced Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-spin-slow blur-sm"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                                <Shield className="w-10 h-10 text-white animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent mb-3 animate-pulse">
                            Reset Password
                        </h2>
                        <p className="text-blue-600 text-sm flex items-center justify-center gap-2 animate-bounce">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Create a new secure password
                            <Sparkles className="w-4 h-4 animate-spin" />
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Enhanced New Password Field */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                </div>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-cyan-500 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5 animate-pulse" />}
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Confirm Password Field */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-cyan-500 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5 animate-pulse" />}
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Error Message */}
                        {error && (
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
                                <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center backdrop-blur-sm">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Enhanced Password Requirements */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-lg blur opacity-20"></div>
                            <div className="relative bg-blue-50/80 rounded-lg p-4 space-y-2 border-2 border-blue-100 backdrop-blur-sm">
                                <p className="text-blue-700 text-sm font-medium mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Password Requirements:
                                </p>
                                <div className="space-y-1">
                                    <div className={`text-xs flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-600' : 'text-blue-500'}`}>
                                        <div className={`w-3 h-3 rounded-full ${newPassword.length >= 6 ? 'bg-green-500 animate-ping' : 'bg-blue-300 animate-pulse'}`}></div>
                                        At least 6 characters
                                    </div>
                                    <div className={`text-xs flex items-center gap-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : 'text-blue-500'}`}>
                                        <div className={`w-3 h-3 rounded-full ${newPassword === confirmPassword && newPassword.length > 0 ? 'bg-green-500 animate-ping' : 'bg-blue-300 animate-pulse'}`}></div>
                                        Passwords match
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                            <button
                                type="submit"
                                className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5 animate-pulse" />
                                    Reset Password
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>
                        </div>

                        {/* Enhanced Back to Login */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (from === "change") {
                                        navigate("/settings");
                                    } else {
                                        navigate("/login");
                                    }
                                }}
                                className="text-blue-500 hover:text-cyan-500 text-sm transition-colors duration-300 underline decoration-blue-400 decoration-2 underline-offset-4 flex items-center justify-center gap-2 mx-auto group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:animate-bounce" />
                                {from === "change" ? "Back to Settings" : "Back to Sign In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 left-5 w-32 h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
            <div className="absolute bottom-1/4 right-5 w-36 h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>
    );
}