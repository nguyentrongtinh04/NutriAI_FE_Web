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
  EyeOff
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
  requestUnlink, confirmUnlink
} from "../../../redux/slices/authSlice";
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

  // update email
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

  // request change email
  const handleRequestEmailChange = (oldEmail: string) => {
    if (!newEmail) {
      notify.error("⚠️ Please enter a new email.");
      return;
    }
    dispatch(requestEmailChange({ oldEmail, newEmail }))
      .unwrap()
      .then(() => {
        notify.success("📩 Code sent to your current email to confirm change.");
        setShowUpdateOtpInput(true);
      })
      .catch(() => {
        notify.error("❌ Failed to request email change.");
      });
  };

  const handleConfirmEmailChange = (oldEmail: string) => {
    dispatch(confirmEmailChange({ oldEmail, code: updateOtp }))
      .unwrap()
      .then(() => {
        notify.success("🎉 Email changed successfully! Please verify new email.");
        dispatch(fetchMe());
        setShowUpdateForm(false);
        setShowUpdateOtpInput(false);
        setNewEmail("");
        setUpdateOtp("");
      })
      .catch(() => {
        notify.error("❌ Invalid confirmation code.");
      });
  };

  const handleRequestUnlink = (type: "google" | "phone") => {
    dispatch(requestUnlink(type))
      .unwrap()
      .then(() => {
        notify.success("📩 OTP sent! Please check your " + (type === "google" ? "email" : "phone"));
        setUnlinkType(type);
        setShowUnlinkOtpInput(true);
      })
      .catch(() => notify.error("❌ Failed to send unlink OTP"));
  };

  const handleConfirmUnlink = () => {
    if (!unlinkType) return;
    dispatch(confirmUnlink({ type: unlinkType, code: unlinkOtp }))
      .unwrap()
      .then(() => {
        notify.success("🎉 " + unlinkType + " account unlinked successfully!");
        setShowUnlinkOtpInput(false);
        setUnlinkOtp("");
        setUnlinkType(null);
        dispatch(fetchMe());
      })
      .catch(() => notify.error("❌ Invalid unlink code"));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
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
        {/* Welcome Section */}
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Mail className="w-10 h-10 text-cyan-400 animate-bounce" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Email Management
              </span>
            </h1>
            <p className="text-blue-200 text-lg animate-fade-in">Manage your email settings and account linking</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Animated background for the main card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
          
          {emails.map((email, index) => (
            <div key={email.id} className="relative">
              {/* Main Email Card */}
              <div className="relative group mb-8">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl border-2 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-blue-200/50 shadow-xl">
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

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Edit3 className="w-4 h-4 group-hover:animate-pulse" /> 
                        Update Email
                      </button>

                      {/* Email Verification */}
                      {!profile?.emailVerified && (
                        <>
                          {!showOtpInput ? (
                            <button
                              onClick={() => {
                                dispatch(sendEmailVerification(profile!.email!))
                                  .unwrap()
                                  .then(() => {
                                    notify.success("📩 Verification code sent to your email");
                                    setShowOtpInput(true);
                                  })
                                  .catch(() => notify.error("❌ Failed to send verification code"));
                              }}
                              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <Send className="w-4 h-4 group-hover:animate-pulse" />
                              Verify Email
                            </button>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Enter verification code"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  className="border-2 border-blue-200 focus:border-blue-400 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm focus:shadow-lg"
                                />
                                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 animate-pulse" />
                              </div>
                              <button
                                onClick={() => {
                                  dispatch(verifyEmail({ email: profile!.email!, code: otp }))
                                    .unwrap()
                                    .then(() => {
                                      notify.success("✅ Email verified successfully!");
                                      dispatch(fetchMe());
                                      setShowOtpInput(false);
                                      setOtp("");
                                    })
                                    .catch(() => notify.error("❌ Invalid verification code"));
                                }}
                                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <Check className="w-4 h-4 group-hover:animate-bounce" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Account Linking Section */}
                  <div className="mt-6 pt-6 border-t-2 border-blue-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Link className="w-5 h-5 text-blue-600" />
                      Account Linking
                    </h4>
                    
                    {/* Provider Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Google Status */}
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">G</span>
                              </div>
                              <span className="font-semibold text-gray-700">Google Account</span>
                            </div>
                            {profile?.providers?.some((p: any) => p.type === "google") ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                                <Check className="w-3 h-3" /> Linked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 text-sm font-semibold bg-red-100 px-3 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Not linked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Phone Status */}
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">📱</span>
                              </div>
                              <span className="font-semibold text-gray-700">Phone & Password</span>
                            </div>
                            {profile?.providers?.some((p: any) => p.type === "local") ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                                <Check className="w-3 h-3" /> Linked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 text-sm font-semibold bg-red-100 px-3 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Not linked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unlink Options */}
                    {profile?.providers && profile.providers.length > 1 && (
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Unlink className="w-4 h-4 text-red-500" />
                          Unlink Accounts
                        </h5>
                        <div className="flex gap-3">
                          {profile.providers[0]?.type === "local" &&
                            profile.providers.some((p: any) => p.type === "google") && (
                              <button
                                onClick={() => handleRequestUnlink("google")}
                                className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <Unlink className="w-4 h-4 group-hover:animate-pulse" />
                                Unlink Google
                              </button>
                            )}

                          {profile.providers[0]?.type === "google" &&
                            profile.providers.some((p: any) => p.type === "local") && (
                              <button
                                onClick={() => handleRequestUnlink("phone")}
                                className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <Unlink className="w-4 h-4 group-hover:animate-pulse" />
                                Unlink Phone
                              </button>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Unlink OTP Input */}
                    {showUnlinkOtpInput && (
                      <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200">
                        <h5 className="text-md font-semibold text-red-700 mb-3">Confirm Unlink</h5>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Enter unlink OTP"
                              value={unlinkOtp}
                              onChange={(e) => setUnlinkOtp(e.target.value)}
                              className="w-full border-2 border-red-200 focus:border-red-400 px-4 py-2 rounded-xl bg-white transition-all duration-300 shadow-sm focus:shadow-lg"
                            />
                            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                          </div>
                          <button
                            onClick={handleConfirmUnlink}
                            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Check className="w-4 h-4 group-hover:animate-bounce" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Link New Accounts */}
                    <div className="space-y-4">
                      {profile?.phone ? (
                        // user đang dùng phone => cho link Google
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-orange-200">
                          <h5 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 text-red-500">🔗</span>
                            Link Google Account
                          </h5>
                          <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                              const idToken = credentialResponse.credential;
                              if (!idToken) {
                                notify.error("Không lấy được Google ID token");
                                return;
                              }
                              try {
                                await dispatch(linkGoogle(idToken)).unwrap();
                                notify.success("✅ Google account linked successfully!");
                                dispatch(fetchMe());
                              } catch {
                                notify.error("❌ Tài khoản Google khác với tài khoản hiện tại.");
                              }
                            }}
                            onError={() => notify.error("❌ Google login failed")}
                            useOneTap={false}
                          />
                        </div>
                      ) : (
                        // user đang dùng Google => cho link phone/password
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                          <h5 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 text-blue-500">📱</span>
                            Link Phone Account
                          </h5>
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Enter phone number"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full border-2 border-blue-200 focus:border-blue-400 px-4 py-3 rounded-xl bg-white transition-all duration-300 shadow-sm focus:shadow-lg"
                              />
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={updateOtp}
                                onChange={(e) => setUpdateOtp(e.target.value)}
                                className="w-full border-2 border-blue-200 focus:border-blue-400 px-4 py-3 rounded-xl bg-white transition-all duration-300 shadow-sm focus:shadow-lg pr-12"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  await dispatch(linkPhone({ phone: newEmail, password: updateOtp })).unwrap();
                                  notify.success("✅ Phone account linked successfully!");
                                  dispatch(fetchMe());
                                } catch {
                                  notify.error("❌ Failed to link phone account.");
                                }
                              }}
                              className="group w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <Link className="w-5 h-5 group-hover:animate-pulse" />
                              Link Phone Account
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Update Email Form */}
                  {showUpdateForm && (
                    <div className="mt-6 pt-6 border-t-2 border-blue-100">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                        <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Edit3 className="w-5 h-5 text-blue-600" />
                          Update Email Address
                        </h5>
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="Enter new email address"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="w-full border-2 border-blue-200 focus:border-blue-400 px-4 py-3 rounded-xl bg-white transition-all duration-300 shadow-sm focus:shadow-lg"
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          </div>
                          {!showUpdateOtpInput ? (
                            <button
                              onClick={() => handleRequestEmailChange(email.email)}
                              className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                              <Send className="w-5 h-5 group-hover:animate-pulse" />
                              Send Verification Code
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Enter code sent to old email"
                                  value={updateOtp}
                                  onChange={(e) => setUpdateOtp(e.target.value)}
                                  className="w-full border-2 border-green-200 focus:border-green-400 px-4 py-3 rounded-xl bg-white transition-all duration-300 shadow-sm focus:shadow-lg"
                                />
                                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 animate-pulse" />
                              </div>
                              <button
                                onClick={() => handleConfirmEmailChange(email.email)}
                                className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                              >
                                <Check className="w-5 h-5 group-hover:animate-bounce" />
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
            <div className="relative p-6 bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-sm border-2 border-blue-200 rounded-2xl shadow-xl">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                    Email Security Tips
                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                        <span>Your primary email is used for important notifications</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></span>
                        <span>Verify your email to ensure account security</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                        <span>Update email only after confirming with old one</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                        <span>Link multiple accounts for better security</span>
                      </div>
                    </div>
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