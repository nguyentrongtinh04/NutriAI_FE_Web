import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Mail, Lock, Eye, EyeOff, Shield, Send, RotateCcw, Key, Check } from 'lucide-react';

interface ChangePasswordProps {
  onBack: () => void;
}

export default function ChangePassword({ onBack }: ChangePasswordProps) {
  const [step, setStep] = useState<'method' | 'verify' | 'newPassword' | 'success'>('method');
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus on first OTP input when verify step loads
  useEffect(() => {
    if (step === 'verify') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // OTP Timer countdown
  useEffect(() => {
    if (step === 'verify' && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const handleMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError(`Please enter your ${method === 'phone' ? 'phone number' : 'email'}.`);
      return;
    }

    if (method === 'phone' && !/^\d{10,}$/.test(input)) {
      setError('Phone number must be at least 10 digits.');
      return;
    }

    if (method === 'email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input)) {
      setError('Invalid email address.');
      return;
    }

    setError('');
    setStep('verify');
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setError('');
    setStep('newPassword');
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setTimer(60);
    setCanResend(false);
    setError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setStep('success');
  };

  const handleSuccess = () => {
    onBack();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur opacity-40 animate-pulse delay-500"></div>

        <div className="relative bg-white/90 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-blue-200/60 shadow-cyan-500/20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              Change Password
            </h2>
          </div>

          {/* Step 1: Method Selection */}
          {step === 'method' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-spin-slow blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-14 h-14 flex items-center justify-center">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="text-blue-600 text-sm">Choose verification method to change your password</p>
              </div>

              {error && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
                  <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleMethodSubmit} className="space-y-6">
                {/* Method Selection */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25"></div>
                  <div className="relative bg-blue-50/70 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-blue-700 font-semibold mb-3 text-center">Choose verification method:</p>
                    <div className="flex items-center justify-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          value="phone" 
                          checked={method === 'phone'} 
                          onChange={() => setMethod('phone')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Phone className="w-4 h-4 text-blue-600 group-hover:text-cyan-500" />
                        <span className="text-blue-700 font-medium">Phone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          value="email" 
                          checked={method === 'email'} 
                          onChange={() => setMethod('email')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Mail className="w-4 h-4 text-blue-600 group-hover:text-cyan-500" />
                        <span className="text-blue-700 font-medium">Email</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Input Field */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {method === 'phone' ? (
                        <Phone className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors" />
                      ) : (
                        <Mail className="h-5 w-5 text-blue-500 group-focus-within:text-cyan-500 transition-colors" />
                      )}
                    </div>
                    <input
                      type={method === 'phone' ? 'tel' : 'email'}
                      placeholder={method === 'phone' ? 'Enter your phone number' : 'Enter your email'}
                      value={input}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (method === 'phone' && /^[0-9]*$/.test(val)) {
                          setInput(val);
                          setError('');
                        } else if (method === 'email') {
                          setInput(val);
                          setError('');
                        }
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-blue-50/70 border-2 border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                  <button
                    type="submit"
                    className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Verification Code
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-spin-slow blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-14 h-14 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="text-blue-600 text-sm">
                  We sent a 6-digit code to your {method === 'phone' ? 'phone number' : 'email address'}
                </p>
              </div>

              {error && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
                  <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                </div>
              )}

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-25"></div>
                    <input
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="relative w-12 h-14 text-center text-xl font-bold border-2 border-blue-200 rounded-lg bg-blue-50/70 text-blue-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/90 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-xl blur opacity-60 animate-pulse"></div>
                <button
                  onClick={handleVerifyOtp}
                  className="relative w-full overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verify Code
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>

              {/* Timer/Resend */}
              <div className="text-center">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Resend in {timer}s</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleResend} 
                    className="text-blue-500 hover:text-cyan-500 font-semibold transition-colors duration-300 underline flex items-center justify-center gap-2 mx-auto group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:animate-spin" />
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin-slow blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-14 h-14 flex items-center justify-center">
                    <Key className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="text-blue-600 text-sm">Create a new secure password</p>
              </div>

              {error && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse"></div>
                  <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* New Password */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-purple-500 group-focus-within:text-pink-500 transition-colors" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-purple-50/70 border-2 border-purple-200 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 focus:bg-white/90 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-500 hover:text-pink-500 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-500 group-focus-within:text-pink-500 transition-colors" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-purple-50/70 border-2 border-purple-200 rounded-xl text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 focus:bg-white/90 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-500 hover:text-pink-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg blur opacity-20"></div>
                  <div className="relative bg-purple-50/80 rounded-lg p-4 space-y-2 border-2 border-purple-100">
                    <p className="text-purple-700 text-sm font-medium mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className={`text-xs flex items-center gap-2 ${newPassword.length >= 6 ? 'text-green-600' : 'text-purple-500'}`}>
                        <div className={`w-3 h-3 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-purple-300'}`}></div>
                        At least 6 characters
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : 'text-purple-500'}`}>
                        <div className={`w-3 h-3 rounded-full ${newPassword === confirmPassword && newPassword.length > 0 ? 'bg-green-500' : 'bg-purple-300'}`}></div>
                        Passwords match
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl blur opacity-60 animate-pulse"></div>
                  <button
                    type="submit"
                    className="relative w-full overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Change Password
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-ping"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Password Changed Successfully!</h3>
                <p className="text-gray-600">Your password has been updated securely.</p>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-xl blur opacity-60 animate-pulse"></div>
                <button
                  onClick={handleSuccess}
                  className="relative w-full overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Settings
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}