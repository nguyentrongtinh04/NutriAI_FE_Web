import { Phone, Lock, X, UserCheck } from "lucide-react";
import { useState } from "react";
import { adminService } from "../../services/adminService";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function AddAdminModal({ onClose }: any) {
    const notify = useNotify();

    const [form, setForm] = useState({
        phone: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, val: string) => {
        setForm({ ...form, [key]: val });
    };

    const handleSubmit = async () => {
        if (!form.phone.trim() || !form.password.trim()) {
            notify.warning("⚠️ Please fill out all fields!");
            return;
        }

        try {
            setLoading(true);

            const res = await adminService.createAdmin(form);

            notify.success("🎉 Admin created successfully!");
            setForm({ phone: "", password: "" });
            onClose();

        } catch (e: any) {
            const msg =
                e?.response?.data?.error ||
                e?.response?.data?.message ||
                e?.message ||
                "❌ Failed to create admin!";

            notify.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700/60 p-8 w-[450px]
                animate-[fadeIn_0.25s_ease-out]">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600
                            flex items-center justify-center shadow-lg">
                            <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Add Admin</h2>
                    </div>

                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-5">

                    {/* Phone */}
                    <div>
                        <label className="text-slate-300 font-medium">Phone Number</label>
                        <div className="mt-2 flex items-center gap-3 bg-slate-700/40 p-3 rounded-xl border border-slate-600/40">
                            <UserCheck className="w-5 h-5 text-slate-300" />
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="Example: 03xxxxxxxx"
                                className="bg-transparent flex-1 text-white outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-slate-300 font-medium">Password</label>
                        <div className="mt-2 flex items-center gap-3 bg-slate-700/40 p-3 rounded-xl border border-slate-600/40">
                            <Lock className="w-5 h-5 text-slate-300" />
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="••••••••"
                                className="bg-transparent flex-1 text-white outline-none"
                            />
                        </div>
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-end gap-4">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
                            text-white font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Admin"}
                    </button>
                </div>

            </div>
        </div>
    );
}
