import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Check,
  AlertCircle,
  Send,
  Shield,
  Edit3,
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
} from "../../../redux/slices/authSlice";
import { fetchMe } from "../../../redux/slices/userSlice";
import { useNotify } from "../../../components/notifications/NotificationsProvider"; // 👈 thêm
import { GoogleLogin } from "@react-oauth/google";

export default function EmailManagement({ onBack }: { onBack: () => void }) {
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const notify = useNotify(); // 👈 hook notify

  const [emails, setEmails] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // update email
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updateOtp, setUpdateOtp] = useState("");
  const [showUpdateOtpInput, setShowUpdateOtpInput] = useState(false);

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

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Header */}
      <div className="relative z-20 p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-semibold">Back to Settings</span>
        </button>
      </div>

      {/* Main */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-4">
        <div className="bg-white/95 backdrop-blur-3xl border-2 border-green-200/60 rounded-3xl p-8 shadow-2xl">
          {emails.map((email) => (
            <div key={email.id} className="p-4 rounded-xl border-2 bg-gray-50 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-800">{email.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <Edit3 className="w-3 h-3" /> Update
                  </button>
                </div>
              </div>
              {/* Nếu chưa link thì hiển thị UI link account */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Thêm phương thức đăng nhập
                  </h4>
                  {/* Trạng thái liên kết Google */}
                  {profile?.providers?.some((p: any) => p.type === "google") ? (
                    <p className="text-sm text-green-600 mb-2">
                      ✅ Đã liên kết với Google
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 mb-2">
                      ❌ Chưa liên kết với Google
                    </p>
                  )}

                  {/* Trạng thái liên kết Phone */}
                  {profile?.providers?.some((p: any) => p.type === "local") ? (
                    <p className="text-sm text-green-600 mb-2">
                      ✅ Đã liên kết với SĐT / mật khẩu
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 mb-2">
                      ❌ Chưa liên kết với SĐT / mật khẩu
                    </p>
                  )}

                  {profile?.phone ? (
                    // user đang dùng phone => cho link Google
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
                  ) : (
                    // user đang dùng Google => cho link phone/password
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter phone"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-full"
                      />
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={updateOtp}
                        onChange={(e) => setUpdateOtp(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-full"
                      />
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
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full"
                      >
                        Link Phone Account
                      </button>
                    </div>
                  )}
                </div>

              {/* update email */}
              {showUpdateForm && (
                <div className="mt-4 space-y-2">
                  <input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full"
                  />
                  {!showUpdateOtpInput ? (
                    <button
                      onClick={() => handleRequestEmailChange(email.email)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Send Code
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code sent to old email"
                        value={updateOtp}
                        onChange={(e) => setUpdateOtp(e.target.value)}
                        className="border px-3 py-2 rounded-lg flex-1"
                      />
                      <button
                        onClick={() => handleConfirmEmailChange(email.email)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Email Security Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your primary email is used for important notifications</li>
                  <li>• Verify your email to ensure account security</li>
                  <li>• Update email only after confirming with old one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
