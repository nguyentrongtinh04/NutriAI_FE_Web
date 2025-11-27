import { X, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function AdminListModal({ onClose }: any) {
    const notify = useNotify();

    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        try {
            const res = await adminService.getAdmins();
            setAdmins(res.admins || []);

            if (!res.admins || res.admins.length === 0) {
                notify.warning("No admin accounts found!");
            }
        } catch (e) {
            notify.error("Failed to load admin list!");
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmin = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;

        try {
            await adminService.deleteAdmin(id);

            setAdmins((prev) => prev.filter((a) => a._id !== id));
            notify.success("Admin deleted successfully!");
        } catch (e) {
            notify.error("Failed to delete admin!");
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700/60 p-8 w-[600px]
                animate-[fadeIn_0.25s_ease-out]"
            >

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin List</h2>
                    </div>

                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* LIST */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">

                    {loading && (
                        <p className="text-center text-slate-400 py-5">Loading...</p>
                    )}

                    {!loading && admins.length === 0 && (
                        <p className="text-center text-slate-400 py-5">No admins available.</p>
                    )}

                    {admins.map((ad) => (
                        <div
                            key={ad._id}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/30
                                hover:border-emerald-500/40 transition-all duration-300"
                        >
                            <div>
                                <p className="text-white font-bold">{ad.displayName}</p>
                                <p className="text-slate-400 text-sm">{ad.email}</p>
                            </div>

                            <button
                                onClick={() => deleteAdmin(ad._id)}
                                className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30
                                    hover:bg-red-500/30 hover:scale-105 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
