import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Check,
  AlertCircle,
  Send,
  Shield,
  Edit3,
  Sparkles,
  Link,
  Unlink,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  sendEmailVerification,
  verifyEmail,
  requestEmailChange,
  confirmEmailChange,
  linkGoogle,
  linkPhone,
  requestUnlink,
  confirmUnlink,
} from "../../../redux/actions/authActions";
import { fetchMe } from "../../../redux/slices/userSlice";
import { useNotify } from "../../../components/notifications/NotificationsProvider";
import { GoogleLogin } from "@react-oauth/google";

export default function EmailManagement({ onBack }: { onBack: () => void }) {
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const notify = useNotify();

  const [emails, setEmails] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updateOtp, setUpdateOtp] = useState("");
  const [showUpdateOtpInput, setShowUpdateOtpInput] = useState(false);

  const [unlinkType, setUnlinkType] = useState<"google" | "phone" | null>(null);
  const [unlinkOtp, setUnlinkOtp] = useState("");
  const [showUnlinkOtpInput, setShowUnlinkOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (profile?.email) {
      setEmails([{ id: 1, email: profile.email }]);
    }
  }, [profile]);

  // === Email Change ===
  const handleRequestEmailChange = async (oldEmail: string) => {
    if (!newEmail) {
      notify.error("⚠️ Please enter a new email.");
      return;
    }
    try {
      await requestEmailChange(oldEmail, newEmail)();
      notify.success("📩 Code sent to your current email to confirm change.");
      setShowUpdateOtpInput(true);
    } catch {
      notify.error("❌ Failed to request email change.");
    }
  };

  const handleConfirmEmailChange = async (oldEmail: string) => {
    try {
      await confirmEmailChange(oldEmail, updateOtp)();
      notify.success("🎉 Email changed successfully! Please verify new email.");
      dispatch(fetchMe());
      setShowUpdateForm(false);
      setShowUpdateOtpInput(false);
      setNewEmail("");
      setUpdateOtp("");
    } catch {
      notify.error("❌ Invalid confirmation code.");
    }
  };

  // === Unlink ===
  const handleRequestUnlink = async (type: "google" | "phone") => {
    try {
      await requestUnlink(type)();
      notify.success(
        "📩 OTP sent! Please check your " +
          (type === "google" ? "email" : "phone")
      );
      setUnlinkType(type);
      setShowUnlinkOtpInput(true);
    } catch {
      notify.error("❌ Failed to send unlink OTP");
    }
  };

  const handleConfirmUnlink = async () => {
    if (!unlinkType) return;
    try {
      await confirmUnlink(unlinkType, unlinkOtp)();
      notify.success(`🎉 ${unlinkType} account unlinked successfully!`);
      setShowUnlinkOtpInput(false);
      setUnlinkOtp("");
      setUnlinkType(null);
      dispatch(fetchMe());
    } catch {
      notify.error("❌ Invalid unlink code");
    }
  };

  // === Verify Email ===
  const handleSendVerification = async (email: string) => {
    try {
      await sendEmailVerification(email)();
      notify.success("📩 Verification code sent to your email");
      setShowOtpInput(true);
    } catch {
      notify.error("❌ Failed to send verification code");
    }
  };

  const handleVerifyEmail = async (email: string) => {
    try {
      await verifyEmail(email, otp)();
      notify.success("✅ Email verified successfully!");
      dispatch(fetchMe());
      setShowOtpInput(false);
      setOtp("");
    } catch {
      notify.error("❌ Invalid verification code");
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <button
            onClick={onBack}
            className="relative inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20"
          >
            <ArrowLeft className="w-6 h-6 group-hover:animate-bounce" />
            <span className="text-lg font-semibold">Back to Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-4">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Mail className="w-10 h-10 text-cyan-400 animate-bounce" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Email Management
              </span>
            </h1>
            <p className="text-blue-200 text-lg animate-fade-in">
              Manage your email settings and account linking
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>

          {emails.map((email) => (
            <div key={email.id} className="relative">
              <div className="relative group mb-8">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl border-2 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-blue-200/50 shadow-xl">
                  {/* Email Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          {email.email}
                        </p>
                        {profile?.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                            <Check className="w-4 h-4" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 text-sm font-semibold bg-red-100 px-3 py-1 rounded-full">
                            <AlertCircle className="w-4 h-4" /> Not verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        <Edit3 className="w-4 h-4 group-hover:animate-pulse" />
                        Update Email
                      </button>

                      {!profile?.emailVerified && (
                        <>
                          {!showOtpInput ? (
                            <button
                              onClick={() => handleSendVerification(email.email)}
                              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              <Send className="w-4 h-4 group-hover:animate-pulse" />
                              Verify Email
                            </button>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Enter verification code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="border-2 border-blue-200 focus:border-blue-400 px-4 py-2 rounded-xl"
                              />
                              <button
                                onClick={() => handleVerifyEmail(email.email)}
                                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                              >
                                <Check className="w-4 h-4 group-hover:animate-bounce" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unlink OTP */}
                  {showUnlinkOtpInput && (
                    <div className="mt-6 p-4 rounded-xl bg-red-50 border-2 border-red-200">
                      <h5 className="text-md font-semibold text-red-700 mb-3">
                        Confirm Unlink
                      </h5>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter unlink OTP"
                          value={unlinkOtp}
                          onChange={(e) => setUnlinkOtp(e.target.value)}
                          className="w-full border-2 border-red-200 px-4 py-2 rounded-xl"
                        />
                        <button
                          onClick={handleConfirmUnlink}
                          className="bg-green-500 text-white px-5 py-2 rounded-xl"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Update Email Form */}
                  {showUpdateForm && (
                    <div className="mt-6 pt-6 border-t-2 border-blue-100">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                        <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Edit3 className="w-5 h-5 text-blue-600" />
                          Update Email Address
                        </h5>
                        <div className="space-y-4">
                          <input
                            type="email"
                            placeholder="Enter new email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full border-2 border-blue-200 px-4 py-3 rounded-xl"
                          />
                          {!showUpdateOtpInput ? (
                            <button
                              onClick={() =>
                                handleRequestEmailChange(email.email)
                              }
                              className="w-full bg-blue-500 text-white py-3 rounded-xl"
                            >
                              <Send className="w-5 h-5 inline mr-2" />
                              Send Verification Code
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Enter code sent to old email"
                                value={updateOtp}
                                onChange={(e) => setUpdateOtp(e.target.value)}
                                className="w-full border-2 border-green-200 px-4 py-3 rounded-xl"
                              />
                              <button
                                onClick={() =>
                                  handleConfirmEmailChange(email.email)
                                }
                                className="w-full bg-green-500 text-white py-3 rounded-xl"
                              >
                                <Check className="w-5 h-5 inline mr-2" />
                                Confirm Email Change
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Security Tips */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-2 border-blue-200 rounded-2xl shadow-xl">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                    Email Security Tips
                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 text-sm">
                    <ul className="space-y-2">
                      <li>• Your primary email is used for important notifications</li>
                      <li>• Verify your email to ensure account security</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• Update email only after confirming with old one</li>
                      <li>• Link multiple accounts for better security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
