import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const EyeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const EyeOffIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.045-3.368M9.88 9.88a3 3 0 004.24 4.24M3 3l18 18" />
        </svg>
    );

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Chặn nhập chữ trong input phone
        if (name === "phone" && /[^\d]/.test(value)) return;

        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Reset error khi người dùng nhập lại
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {
            fullName: "",
            phone: "",
            password: "",
            confirmPassword: "",
        };

        let isValid = true;

        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            isValid = false;
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10,}$/.test(form.phone)) {
            newErrors.phone = "Phone must be at least 10 digits";
            isValid = false;
        }

        if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        alert("✅ Registration successful!");
        // TODO: Submit form to backend
    };

    const inputStyle = (field: keyof typeof errors) =>
        `px-4 py-3 rounded-lg border ${errors[field] ? "border-red-500" : "border-[#bcdaf7]"
        } bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#2a78b8]`;

    return (
        <div className="min-h-screen w-full font-sans overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7] relative">
            {/* Left Side Form */}
            <div className="w-full md:w-1/2 px-6 sm:px-12 md:px-20">
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[8px_8px_20px_rgba(0,0,0,0.05)] p-8 sm:p-10">
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src="/src/assets/logo.png"
                            alt="NutriAI Logo"
                            className="w-25 h-20 object-contain"
                        />
                        <h1 className="text-3xl font-extrabold text-[#1c3c64]">NutriAI</h1>
                    </div>

                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                            className={inputStyle("fullName")}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            className={inputStyle("phone")}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className={`${inputStyle("password")} pr-12 w-full`} // 👈 w-full ở đây
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? EyeOffIcon : EyeIcon}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        <div className="relative w-full">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`${inputStyle("confirmPassword")} pr-12 w-full`} // 👈 w-full
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? EyeOffIcon : EyeIcon}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition mt-2"
                        >
                            Register
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-[#90c2e7] px-5 py-2 rounded-full text-sm text-[#1c3c64] hover:bg-[#e3f3fd] transition backdrop-blur-sm bg-white/40 mt-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l6-6A20 20 0 1 0 44 24c0-1.2-.1-2.1-.4-3.5z" />
                                <path fill="#e53935" d="M6.3 14.6 13 19.2c1.7-3.4 5.1-6.2 11-6.2 3 0 5.8 1.1 7.9 3l6-6C33.8 5.6 29.2 4 24 4c-7.6 0-14.1 4.3-17.7 10.6z" />
                                <path fill="#4caf50" d="M24 44c5.9 0 10.9-1.9 14.5-5.2l-6.7-5.5c-2 1.3-4.6 2.1-7.8 2.1a12 12 0 0 1-11.3-8l-6.7 5.1C9.9 39.7 16.5 44 24 44z" />
                                <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.3 4.5-4.5 6l0.1-0.1 6.7 5.5c-0.5.5 7.4-5.4 7.4-15.9 0-1.2-.1-2.1-.4-3.5z" />
                            </svg>
                            Register with Google
                        </button>

                        <p
                            onClick={() => navigate("/login")}
                            className="text-sm text-right text-[#224665] mt-4 hover:underline cursor-pointer"
                        >
                            Already have an account? Login
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
