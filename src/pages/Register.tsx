import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Lock, Eye, EyeOff, Sparkles, UserPlus, ArrowRight, Mail, Users, Calendar } from "lucide-react";;
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { authService } from "../services/authService";
import { useNotify } from "../components/notifications/NotificationsProvider";
import "firebase/compat/auth";
import firebase, { auth } from "../firebase";
import { Ruler, Weight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

import logo from "../assets/logo.png";
import MedicalIllustration from "../assets/login_left_image.png";
declare global {
    interface Window {
        recaptchaVerifier: any;
        google: any;
    }
}

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const notify = useNotify();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [confirmation, setConfirmation] = useState<any>(null);
    const [otp, setOtp] = useState("");
    const [waitingForOtp, setWaitingForOtp] = useState(false);

    type FormFields = {
        fullName: string;
        email: string;
        phone: string;
        gender: string;
        password: string;
        DOB: string;
        height: string;
        weight: string;
    };

    const [form, setForm] = useState<FormFields>({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        DOB: "",
        height: "",
        weight: ""
    });

    const [errors, setErrors] = useState<FormFields>({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        DOB: "",
        height: "",
        weight: ""
    });

    const [submitting, setSubmitting] = useState(false);
    // Hàm reset container

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
                size: "invisible",
                callback: (response: any) => {
                    console.log("✅ reCAPTCHA solved:", response);
                },
            });
            window.recaptchaVerifier.render();
        }
    }, []);

    // Hàm gửi OTP
    const sendOtpFirebase = async (phone: string) => {
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, appVerifier);
            setConfirmation(confirmationResult);
            notify.success("📩 OTP đã được gửi!");
        } catch (err) {
            console.error("sendOtpFirebase error:", err);
            notify.error("❌ Gửi OTP thất bại");
        }
    };

    // Xác minh OTP
    const verifyOtpFirebase = async (otp: string) => {
        if (!confirmation) return;
        try {
            await confirmation.confirm(otp);
            notify.success("✅ OTP hợp lệ!");
            // 👉 tại đây gọi API /register backend
        } catch (err) {
            console.error("verifyOtpFirebase error:", err);
            notify.error("❌ OTP không đúng");
        }
    };

    // ===== Handle input =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "phone" && /[^\d]/.test(value)) return;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };
    const normalizePhone = (phone: string) => {
        let p = phone.trim();
        if (p.startsWith("0")) {
            p = "+84" + p.slice(1);
        }
        return p;
    };


    // ===== Submit Register =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: FormFields = {
            fullName: "",
            email: "",
            phone: "",
            gender: "",
            password: "",
            DOB: "",
            height: "",
            weight: ""
        };

        let isValid = true;

        if (!form.fullName.trim()) { newErrors.fullName = "Full name is required"; isValid = false; }
        if (!form.email.trim()) { newErrors.email = "Email is required"; isValid = false; }
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) { newErrors.email = "Invalid email address"; isValid = false; }
        if (!form.phone.trim()) { newErrors.phone = "Phone number is required"; isValid = false; }
        else if (!/^0\d{9,}$/.test(form.phone)) { newErrors.phone = "Phone must start with 0 and be at least 10 digits"; isValid = false; }
        if (!form.gender) { newErrors.gender = "Please select your gender"; isValid = false; }
        if (form.password.length < 6) { newErrors.password = "Password must be at least 6 characters"; isValid = false; }
        if (!form.DOB.trim()) {
            newErrors.DOB = "Date of birth is required";
            isValid = false;
        } else {
            const today = new Date();
            const dobDate = new Date(form.DOB);
            const age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();

            const realAge = m < 0 || (m === 0 && today.getDate() < dobDate.getDate())
                ? age - 1
                : age;

            if (realAge < 18) {
                newErrors.DOB = "You must be at least 18 years old";
                isValid = false;
            }
        }
        if (!form.height.trim()) { newErrors.height = "Height is required"; isValid = false; }
        else if (isNaN(Number(form.height)) || Number(form.height) <= 0) { newErrors.height = "Height must be a positive number"; isValid = false; }
        if (!form.weight.trim()) { newErrors.weight = "Weight is required"; isValid = false; }
        else if (isNaN(Number(form.weight)) || Number(form.weight) <= 0) { newErrors.weight = "Weight must be a positive number"; isValid = false; }

        setErrors(newErrors);

        if (!isValid) {
            const firstError = Object.values(newErrors).find(err => err);
            if (firstError) notify.error(`❌ ${firstError}`);
            return;
        }

        try {
            const normalizedPhone = normalizePhone(form.phone);
            console.log("Sending OTP to:", normalizedPhone);

            await sendOtpFirebase(normalizedPhone);
            setWaitingForOtp(true);
        } catch (err: any) {
            notify.error("❌ Gửi OTP thất bại");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await verifyOtpFirebase(otp); // dùng confirmation.confirm(otp)

            // OTP hợp lệ → gọi API BE /register
            const { phone, email, password, fullName, gender } = form;
            const date = new Date();

            await authService.register(
                {
                    phone,
                    email,
                    password,
                    fullname: fullName,
                    DOB: form.DOB,
                    gender: gender.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
                    height: Number(form.height),
                    weight: Number(form.weight),
                },
            );
            notify.success("🎉 Tạo tài khoản thành công!");
        } catch (err: any) {
            notify.error("❌ OTP không hợp lệ hoặc đăng ký thất bại");
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
                                <img src={logo}
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
                                </div>

                                {/* Right Column: Gender, Password, Confirm Password */}
                                <div className="space-y-6">
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

                                    {/* DOB Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="date"
                                                name="DOB"
                                                placeholder="Date of Birth"
                                                value={form.DOB}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.DOB ? "border-red-400" : "border-blue-200"
                                                    } rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-300`}
                                            />
                                            {errors.DOB && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse">
                                                        {errors.DOB}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Height Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Ruler className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="number"
                                                name="height"
                                                placeholder="Height (cm)"
                                                value={form.height}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.height ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            {errors.height && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse">
                                                        {errors.height}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Weight Field */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Weight className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors animate-pulse" />
                                            </div>
                                            <input
                                                type="number"
                                                name="weight"
                                                placeholder="Weight (kg)"
                                                value={form.weight}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 ${errors.weight ? 'border-red-400' : 'border-blue-200'} rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300 backdrop-blur-sm`}
                                            />
                                            {errors.weight && (
                                                <div className="absolute -top-2 right-4 z-10">
                                                    <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-pulse">
                                                        {errors.weight}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
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
                                                onClick={handleVerifyOtp}
                                                className="px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Verify OTP
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {/* Google Sign-In Button */}
                                <div
                                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                >
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            const idToken = credentialResponse.credential; // ✅ ID Token
                                            if (!idToken) {
                                                notify.error("Không lấy được Google ID token");
                                                return;
                                            }
                                            try {
                                                await authService.loginWithGoogle(idToken, dispatch, navigate); // ✅ Gửi idToken sang BE
                                                notify.success("🎉 Google login successful!");
                                            } catch (err: any) {
                                                notify.error("❌ Google login failed");
                                            }
                                        }}
                                        onError={() => notify.error("❌ Google login failed")}
                                        useOneTap={false} // tránh hiện popup một chạm
                                    />
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
                        <img src={MedicalIllustration}
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
        </div>
    );
}