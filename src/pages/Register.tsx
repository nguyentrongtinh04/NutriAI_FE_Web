import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Lock, Eye, EyeOff, Sparkles, UserPlus, ArrowRight, Mail, Users } from "lucide-react";
import { auth } from "../firebase";
import { updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { http } from "../lib/http";
import { saveTokens, AuthTokens } from "../lib/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

declare global {
    interface Window {
      recaptchaVerifier: RecaptchaVerifier;
    }
  }
  
export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [confirmation, setConfirmation] = useState<any>(null);
    const [otp, setOtp] = useState("");
    const [waitingForOtp, setWaitingForOtp] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "phone" && /[^\d]/.test(value)) return;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: "383034214927-55h5bb1vgl90rmvacbqjerdd42598rf8.apps.googleusercontent.com",
                callback: handleGoogleResponse,
            });
        }
    }, []);

    const handleGoogleResponse = async (response: any) => {
        try {
            const googleIdToken = response.credential;
            const { data } = await http.post<AuthTokens>("/google", { id_token: googleIdToken });
            saveTokens(data);
            navigate("/home");
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Google login failed";
            setErrorMsg(msg);
        }
    };

    // thêm ngay dưới handleGoogleResponse
    const handleGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            setErrorMsg("Google SDK chưa sẵn sàng.");
        }
    };
    const generateRecaptcha = async () => {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear(); // clear nếu đã tồn tại
        }
      
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,                   // ✅ auth phải đứng đầu
          "recaptcha-container",  // id div
          { size: "invisible" }   // options
        );
      
        await window.recaptchaVerifier.render(); // render bắt buộc
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            fullName: "",
            email: "",
            phone: "",
            gender: "",
            password: "",
            confirmPassword: "",
        };
        let isValid = true;

        if (!form.fullName.trim()) { newErrors.fullName = "Full name is required"; isValid = false; }
        if (!form.email.trim()) { newErrors.email = "Email is required"; isValid = false; }
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) { newErrors.email = "Invalid email address"; isValid = false; }
        if (!form.phone.trim()) { newErrors.phone = "Phone number is required"; isValid = false; }
        else if (!/^0\d{9,}$/.test(form.phone)) {  // ✅ phải bắt đầu bằng 0 và có 10 số trở lên
            newErrors.phone = "Phone must start with 0 and be at least 10 digits";
            isValid = false;
        }
        if (!form.gender) { newErrors.gender = "Please select your gender"; isValid = false; }
        if (form.password.length < 6) { newErrors.password = "Password must be at least 6 characters"; isValid = false; }
        if (form.password !== form.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }

        setErrors(newErrors);
        if (!isValid) return;

        try {
            setSubmitting(true);
        
            // Khởi tạo recaptcha
            await generateRecaptcha();
            const appVerifier = window.recaptchaVerifier;
        
            // Chuyển số điện thoại sang E.164 (+84...)
            const formattedPhone = form.phone.startsWith("+")
              ? form.phone
              : "+84" + form.phone.substring(1);
        
            console.log("Formatted phone:", formattedPhone);
        
            // Gửi OTP
            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmation(result);
            setWaitingForOtp(true);
        
            alert("📲 OTP đã gửi về " + formattedPhone);
          } catch (err: any) {
            console.error("🔥 Firebase OTP Error:", err);
            alert("❌ Gửi OTP thất bại: " + err.message);
          } finally {
            setSubmitting(false);
          }
        };

    const verifyOtp = async () => {
        try {
            const userCredential = await confirmation.confirm(otp);
            const phoneNumber = userCredential.user.phoneNumber;

            // Gọi backend để lưu user
            const { data } = await http.post<AuthTokens>("/register", {
                phone: phoneNumber,
                email: form.email,
                password: form.password,
            });

            saveTokens(data);

            if (auth.currentUser && form.fullName) {
                await updateProfile(auth.currentUser, { displayName: form.fullName });
            }

            alert("✅ Đăng ký thành công!");
            navigate("/home");
        } catch (err: any) {
            alert("❌ OTP không hợp lệ: " + err.message);
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

                {/* Left Side Registration Form */}
                <div className="w-full lg:w-2/3 max-w-4xl">
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
                                    Join us today
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Two Column Form Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Full Name, Email, Phone */}
                                <div className="space-y-6">
                                    {/* Enhanced Full Name Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Full Name"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.fullName ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            {/* Tooltip Error */}
                                            {errors.fullName && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse">
                                                            {errors.fullName}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Enhanced Email Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.email ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            {/* Tooltip Error */}
                                            {errors.email && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse whitespace-nowrap">
                                                            {errors.email}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Enhanced Phone Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="Phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.phone ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            {/* Tooltip Error */}
                                            {errors.phone && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse whitespace-nowrap">
                                                            {errors.phone}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Gender, Password, Confirm Password */}
                                <div className="space-y-6">
                                    {/* Enhanced Gender Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Users className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <select
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.gender ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer`}
                                            >
                                                <option value="" className="text-blue-400">Select Gender</option>
                                                <option value="male" className="text-blue-900">Male</option>
                                                <option value="female" className="text-blue-900">Female</option>
                                                <option value="other" className="text-blue-900">Other</option>
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            {/* Tooltip Error */}
                                            {errors.gender && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse whitespace-nowrap">
                                                            {errors.gender}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Enhanced Password Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-12 py-4 bg-blue-50/70 border-2 ${errors.password ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-cyan-500 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5 animate-pulse" />}
                                            </button>
                                            {/* Tooltip Error */}
                                            {errors.password && (
                                                <div className="absolute -top-2 right-16 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse whitespace-nowrap">
                                                            {errors.password}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
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
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-12 py-4 bg-blue-50/70 border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-cyan-500 transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5 animate-pulse" /> : <Eye className="h-5 w-5 animate-pulse" />}
                                            </button>
                                            {/* Tooltip Error */}
                                            {errors.confirmPassword && (
                                                <div className="absolute -top-2 right-16 z-10">
                                                    <div className="relative">
                                                        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse whitespace-nowrap">
                                                            {errors.confirmPassword}
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Buttons */}
                            <div className="space-y-4 mt-8">
                                {/* Register Button */}
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                                    <button
                                        type="submit"
                                        className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white group"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <UserPlus className="w-5 h-5 animate-pulse" />
                                            Sign Up
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </button>
                                </div>
                                {waitingForOtp && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP"
                                                className="flex-1 border rounded-lg px-3 py-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={verifyOtp}
                                                className="px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Verify OTP
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Google Register Button */}
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                                    <button
                                        type="button" onClick={handleGoogleLogin}
                                        className="relative w-full bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold shadow-lg hover:bg-white/90 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] group"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l6-6A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z" />
                                                <path fill="#e53935" d="M6.3 14.6 13 19.2c1.7-3.4 5.1-6.2 11-6.2 3 0 5.8 1.1 7.9 3l6-6C33.8 5.6 29.2 4 24 4c-7.6 0-14.1 4.3-17.7 10.6z" />
                                                <path fill="#4caf50" d="M24 44c5.9 0 10.9-1.9 14.5-5.2l-6.7-5.5c-2 1.3-4.6 2.1-7.8 2.1a12 12 0 0 1-11.3-8l-6.7 5.1C9.9 39.7 16.5 44 24 44z" />
                                                <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.3 4.5-4.5 6l0.1-0.1 6.7 5.5c-0.5.5 7.4-5.4 7.4-15.9 0-1.2-.1-2.1-.4-3.5z" />
                                            </svg>
                                            Sign Up with Google
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-blue-500 hover:text-cyan-500 text-sm transition-colors duration-300 underline decoration-blue-400 decoration-2 underline-offset-4 flex items-center justify-center gap-2 mx-auto group"
                                >
                                    Already have an account? Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:animate-bounce" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side Image */}
                <div className="hidden lg:flex justify-center items-center w-full lg:w-1/3 px-4">
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

            {/* Enhanced Decorative Elements */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 left-5 w-32 h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
            <div className="absolute bottom-1/4 right-5 w-36 h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
            <div id="recaptcha-container" className="hidden"></div>
        </div>
    );
}