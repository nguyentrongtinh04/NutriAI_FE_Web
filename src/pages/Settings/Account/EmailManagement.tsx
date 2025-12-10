import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Check,
  Shield,
  Edit3,
  Smartphone,
  Link2,
  Unlink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  requestEmailChange,
  confirmEmailChange,
  linkGoogle,
  linkPhone,
  sendEmailVerification,
  verifyEmail,
  requestUnlink,
  confirmUnlink
} from "../../../redux/actions/authActions";
import { fetchMe } from "../../../redux/slices/userSlice";
import { useNotify } from "../../../components/notifications/NotificationsProvider";
import { GoogleLogin } from "@react-oauth/google";

export default function EmailManagement({ onBack }: { onBack: () => void }) {
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const notify = useNotify();

  const [emails, setEmails] = useState<any[]>([]);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [showVerifyInput, setShowVerifyInput] = useState(false);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updateOtp, setUpdateOtp] = useState("");
  const [showUpdateOtpInput, setShowUpdateOtpInput] = useState(false);

  const [unlinkGoogleOtp, setUnlinkGoogleOtp] = useState("");
  const [unlinkPhoneOtp, setUnlinkPhoneOtp] = useState("");
  const [showGoogleUnlinkInput, setShowGoogleUnlinkInput] = useState(false);
  const [showPhoneUnlinkInput, setShowPhoneUnlinkInput] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePassword, setPhonePassword] = useState("");

  useEffect(() => {
    if (profile?.email) {
      setEmails([{ id: 1, email: profile.email }]);
    }
    setShowPhoneUnlinkInput(false);
    setShowGoogleUnlinkInput(false);
    setUnlinkPhoneOtp("");
    setUnlinkGoogleOtp("");
  }, [profile]);

  const handleSendVerifyEmail = async (email: string) => {
    try {
      await dispatch(sendEmailVerification(email));
      notify.success("📩 Verification code sent to your email.");
      setShowVerifyInput(true);
    } catch {
      notify.error("❌ Failed to send verification code.");
    }
  };

  const handleVerifyEmail = async (email: string) => {
    try {
      await dispatch(verifyEmail(email, verifyOtp));
      notify.success("🎉 Email verified successfully!");
      setShowVerifyInput(false);
      setVerifyOtp("");
      dispatch(fetchMe());
    } catch {
      notify.error("❌ Invalid or expired verification code.");
    }
  };

  const handleRequestEmailChange = (oldEmail: string) => {
    if (!newEmail) {
      notify.error("⚠️ Please enter a new email.");
      return;
    }
    dispatch(requestEmailChange(oldEmail, newEmail))
      .then(() => {
        notify.success("📩 Code sent to your current email.");
        setShowUpdateOtpInput(true);
      })
      .catch(() => notify.error("❌ Failed to request email change."));
  };

  const handleConfirmEmailChange = (oldEmail: string) => {
    dispatch(confirmEmailChange(oldEmail, updateOtp))
      .then(() => {
        notify.success("🎉 Email changed! Please verify new email.");
        dispatch(fetchMe());
        setShowUpdateForm(false);
        setShowUpdateOtpInput(false);
        setNewEmail("");
        setUpdateOtp("");
      })
      .catch(() => notify.error("❌ Invalid confirmation code."));
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 font-sans">
      <div className="relative z-20 p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 text-white hover:text-blue-300 transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-semibold">Back to Settings</span>
        </button>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 py-4">
        <div className="bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-3xl p-8 shadow-2xl">

          {emails.map((email) => (
            <div key={email.id}>
              <div className="p-6 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email chính</p>
                      <p className="font-bold text-gray-900 text-lg">{email.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!profile?.emailVerified && (
                      <>
                        <button
                          onClick={() => setShowUpdateForm(!showUpdateForm)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <Edit3 className="w-4 h-4" /> Cập nhật
                        </button>
                        <button
                          onClick={() => handleSendVerifyEmail(email.email)}
                          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <Check className="w-4 h-4" /> Xác thực
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {showVerifyInput && (
                  <div className="mt-4 space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <input
                      type="text"
                      placeholder="Nhập mã xác thực"
                      value={verifyOtp}
                      onChange={(e) => setVerifyOtp(e.target.value)}
                      className="border-2 border-blue-300 focus:border-blue-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                    />
                    <button
                      onClick={() => handleVerifyEmail(email.email)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Xác nhận
                    </button>
                  </div>
                )}

                {!profile?.emailVerified && showUpdateForm && (
                  <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="email"
                      placeholder="Nhập email mới"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="border-2 border-gray-300 focus:border-blue-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                    />

                    {!showUpdateOtpInput ? (
                      <button
                        onClick={() => handleRequestEmailChange(email.email)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200"
                      >
                        Gửi mã xác nhận
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Nhập mã xác nhận"
                          value={updateOtp}
                          onChange={(e) => setUpdateOtp(e.target.value)}
                          className="border-2 border-gray-300 focus:border-blue-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                        />
                        <button
                          onClick={() => handleConfirmEmailChange(email.email)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200"
                        >
                          Xác nhận thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <Link2 className="w-6 h-6 text-gray-700" />
                  <h3 className="text-2xl font-bold text-gray-900">Phương thức đăng nhập</h3>
                </div>

                {!profile?.emailVerified && (
                  <div className="p-5 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl mb-6 flex items-start gap-3">
                    <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                      Vui lòng xác thực email trước khi thêm phương thức đăng nhập bổ sung
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-500 rounded-xl shadow-md">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 text-lg mb-1">Số điện thoại</h5>
                        <p className="text-sm text-gray-600">Đăng nhập bằng SĐT và mật khẩu</p>
                      </div>
                    </div>

                    <div className={`rounded-xl p-4 mb-4 flex items-center justify-between ${
                      profile?.providers?.some(p => p.type === "local")
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-100 border-2 border-gray-300"
                    }`}>
                      <span className={`text-sm font-semibold ${
                        profile?.providers?.some(p => p.type === "local")
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}>
                        {profile?.providers?.some(p => p.type === "local")
                          ? "Đã liên kết"
                          : "Chưa liên kết"}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        profile?.providers?.some(p => p.type === "local")
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}></div>
                    </div>

                    {profile?.providers?.some(p => p.type === "local") ? (
                      <>
                        {profile?.providers?.length > 1 && (
                          <div className="space-y-3">
                            <button
                              onClick={async () => {
                                try {
                                  await dispatch(requestUnlink("phone"));
                                  setShowPhoneUnlinkInput(true);
                                  notify.info("📩 Mã xác nhận đã gửi đến email.");
                                } catch {
                                  notify.error("❌ Không thể yêu cầu gỡ liên kết SĐT");
                                }
                              }}
                              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <Unlink className="w-4 h-4" /> Gỡ liên kết
                            </button>

                            {showPhoneUnlinkInput && (
                              <div className="space-y-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                                <input
                                  type="text"
                                  placeholder="Nhập OTP gỡ liên kết SĐT"
                                  value={unlinkPhoneOtp}
                                  onChange={(e) => setUnlinkPhoneOtp(e.target.value)}
                                  className="border-2 border-gray-300 focus:border-red-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                                />
                                <button
                                  onClick={async () => {
                                    try {
                                      await dispatch(confirmUnlink("phone", unlinkPhoneOtp));
                                      notify.success("❎ Đã gỡ liên kết SĐT!");
                                      dispatch(fetchMe());
                                      setShowPhoneUnlinkInput(false);
                                      setUnlinkPhoneOtp("");
                                    } catch {
                                      notify.error("❌ Mã OTP sai hoặc hết hạn");
                                    }
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200"
                                >
                                  Xác nhận gỡ
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowPhoneForm(!showPhoneForm)}
                          className="flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <span>Thêm số điện thoại</span>
                          {showPhoneForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>

                        {showPhoneForm && (
                          <div className="space-y-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                            <input
                              type="text"
                              placeholder="Nhập số điện thoại"
                              className="border-2 border-gray-300 focus:border-blue-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <input
                              type="password"
                              placeholder="Nhập mật khẩu"
                              className="border-2 border-gray-300 focus:border-blue-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                              value={phonePassword}
                              onChange={(e) => setPhonePassword(e.target.value)}
                            />
                            <button
                              onClick={async () => {
                                try {
                                  await dispatch(linkPhone(phoneNumber, phonePassword));
                                  notify.success("📞 Đã liên kết tài khoản SĐT!");
                                  dispatch(fetchMe());
                                  setShowPhoneForm(false);
                                  setPhoneNumber("");
                                  setPhonePassword("");
                                } catch {
                                  notify.error("❌ Số điện thoại đã tồn tại hoặc sai định dạng.");
                                }
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200"
                            >
                              Xác nhận liên kết
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {profile?.emailVerified && (
                    <div className="group relative bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-md border border-gray-200">
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 text-lg mb-1">Google</h5>
                          <p className="text-sm text-gray-600">Đăng nhập nhanh với Google</p>
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 mb-4 flex items-center justify-between ${
                        profile?.providers?.some(p => p.type === "google")
                          ? "bg-green-100 border-2 border-green-300"
                          : "bg-gray-100 border-2 border-gray-300"
                      }`}>
                        <span className={`text-sm font-semibold ${
                          profile?.providers?.some(p => p.type === "google")
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}>
                          {profile?.providers?.some(p => p.type === "google")
                            ? "Đã liên kết"
                            : "Chưa liên kết"}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          profile?.providers?.some(p => p.type === "google")
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}></div>
                      </div>

                      {!profile?.providers?.some((p) => p.type === "google") && (
                        <div className="flex justify-center">
                          <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                              const idToken = credentialResponse.credential;
                              if (!idToken) {
                                notify.error("Không lấy được Google ID token");
                                return;
                              }
                              try {
                                await dispatch(linkGoogle(idToken));
                                notify.success("✅ Google linked successfully!");
                                dispatch(fetchMe());
                              } catch {
                                notify.error("❌ Tài khoản Google khác với tài khoản hiện tại.");
                              }
                            }}
                            onError={() => notify.error("❌ Google login failed")}
                            useOneTap={false}
                          />
                        </div>
                      )}

                      {profile?.providers?.some(p => p.type === "google") && profile?.providers?.length > 1 && (
                        <div className="space-y-3">
                          <button
                            onClick={async () => {
                              try {
                                await dispatch(requestUnlink("google"));
                                setShowGoogleUnlinkInput(true);
                                notify.info("📩 Mã OTP đã gửi đến số điện thoại.");
                              } catch {
                                notify.error("❌ Không thể yêu cầu gỡ Google");
                              }
                            }}
                            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <Unlink className="w-4 h-4" /> Gỡ liên kết
                          </button>

                          {showGoogleUnlinkInput && (
                            <div className="space-y-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                              <input
                                type="text"
                                placeholder="Nhập OTP gỡ Google"
                                value={unlinkGoogleOtp}
                                onChange={(e) => setUnlinkGoogleOtp(e.target.value)}
                                className="border-2 border-gray-300 focus:border-red-500 px-4 py-3 rounded-xl w-full outline-none transition-all"
                              />
                              <button
                                onClick={async () => {
                                  try {
                                    await dispatch(confirmUnlink("google", unlinkGoogleOtp));
                                    notify.success("❎ Đã gỡ liên kết Google!");
                                    dispatch(fetchMe());
                                    setShowGoogleUnlinkInput(false);
                                    setUnlinkGoogleOtp("");
                                  } catch {
                                    notify.error("❌ Mã OTP sai hoặc hết hạn");
                                  }
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl w-full font-semibold transition-all duration-200"
                              >
                                Xác nhận gỡ
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          ))}

          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500 rounded-xl h-fit">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2 text-lg">Bảo mật tài khoản</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Email chính dùng để nhận thông báo quan trọng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Xác thực email để tăng cường bảo mật tài khoản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Thêm nhiều phương thức đăng nhập để tránh mất quyền truy cập</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
