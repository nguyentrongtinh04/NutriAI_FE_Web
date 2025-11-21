import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchSchedulesThunk } from "../../redux/slices/planSlice";
import { Calendar, Target, Loader2, Plus, TrendingUp, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { scheduleResultService } from "../../services/scheduleResultService";
import RatingModal from "../../components/modals/RatingModal";
import ReviewListModal from "../../components/modals/ReviewListModal";

export default function PlansPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { schedules, loading, error } = useSelector((state: RootState) => state.plan);
    const token = useSelector((state: RootState) => state.auth.accessToken) || localStorage.getItem("accessToken");
    const [showRateModal, setShowRateModal] = useState(false);
    const [scheduleToRate, setScheduleToRate] = useState<any>(null);
    const [showReviewList, setShowReviewList] = useState(false);
    const handleOpenReviewList = () => setShowReviewList(true);
    
    const handleCreate = () => {
        const active = schedules.find(s => s.status === "active");
        if (active) {
            alert("⚠️ Bạn đang có một lịch ăn uống đang hoạt động. Hãy hoàn thành lịch hiện tại trước khi tạo mới!");
            return;
        }
        navigate("/create-plan");
    };

    const onScheduleClick = async (schedule: any) => {
        // Nếu lịch đang active → mở chi tiết luôn
        if (schedule.status === "active") {
            navigate(`/plan/${schedule._id}`);
            return;
        }

        // Nếu completed → kiểm tra đánh giá
        try {
            await scheduleResultService.check(schedule._id);
            // Đã đánh giá → vào chi tiết
            navigate(`/plan/${schedule._id}`);
        } catch (err: any) {
            if (err.response?.status === 404) {
                // Chưa đánh giá → chuyển sang PlanResultPage với trạng thái đánh giá
                setScheduleToRate(schedule);
                setShowRateModal(true);
            } else {
                alert("Không thể kiểm tra đánh giá của lịch này!");
            }
        }
    };

    useEffect(() => {
        if (token) dispatch(fetchSchedulesThunk());
    }, [dispatch, token]);

    const getGoalInfo = (goal: string) => {
        const normalized = goal?.toLowerCase();

        if (normalized.includes("giảm")) {
            return { icon: "📉", color: "text-red-500", label: "Giảm cân" };
        }
        if (normalized.includes("tăng")) {
            return { icon: "💪", color: "text-green-500", label: "Tăng cân" };
        }
        if (normalized.includes("duy trì")) {
            return { icon: "⚖️", color: "text-blue-500", label: "Duy trì vóc dáng" };
        }
        if (normalized.includes("sức khỏe")) {
            return { icon: "🩺", color: "text-cyan-500", label: "Cải thiện sức khỏe" };
        }
        if (normalized.includes("bệnh lý") || normalized.includes("hỗ trợ")) {
            return { icon: "❤️‍🩹", color: "text-pink-500", label: "Hỗ trợ bệnh lý" };
        }

        return { icon: "🎯", color: "text-gray-500", label: goal || "Không xác định" };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-lg text-blue-600 font-medium">Đang tải danh sách lịch trình...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-red-200 shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <p className="text-center text-red-600 font-semibold text-lg">{error}</p>
                </div>
            </div>
        );
    }

    if (!schedules.length) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center px-4 py-10">
                <div className="max-w-4xl w-full">
                    <div className="mb-8 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>

                        {/* ✅ Flex ngoài: nút trái - tiêu đề giữa */}
                        <div className="relative flex items-center justify-between px-6">
                            {/* 🔙 Nút quay lại */}
                            <button
                                onClick={() => navigate("/home")}
                                className="group flex items-center gap-2 text-white font-semibold bg-white/10 hover:bg-white/20 rounded-xl px-5 py-2 transition-all duration-300 border border-white/30 backdrop-blur-sm"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại
                            </button>

                            {/* 🎯 Tiêu đề giữa */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                                <h1 className="text-4xl font-bold text-white flex items-center gap-3 justify-center">
                                    <Target className="w-10 h-10 text-cyan-300 animate-bounce" />
                                    <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                                        Mục tiêu của bạn
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-green-400/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-blue-200 shadow-2xl text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Chưa có lịch trình nào
                            </h2>

                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                Hãy tạo lịch trình đầu tiên để bắt đầu theo dõi mục tiêu sức khỏe của bạn
                            </p>

                            <button
                                onClick={handleCreate}
                                className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-0 group-hover/btn:opacity-100 transition-all duration-500"></div>
                                <Plus className="w-6 h-6 relative group-hover/btn:rotate-90 transition-transform duration-300" />
                                <span className="relative">Tạo lịch trình mới</span>
                            </button>

                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600">Đặt mục tiêu</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600">Theo dõi tiến độ</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm text-gray-600">Đạt thành công</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                    <div className="relative flex justify-between items-center">
                        <button
                            onClick={() => navigate('/home')}
                            className="group flex items-center gap-2 mb-6 text-white font-semibold bg-white/10 hover:bg-white/20 rounded-xl px-5 py-2 transition-all duration-300 border border-white/30 backdrop-blur-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay lại
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <Target className="w-10 h-10 text-cyan-300 animate-bounce" />
                                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                                    Danh sách mục tiêu
                                </span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleOpenReviewList}
                                className="group relative flex items-center gap-2 px-6 py-3 
            bg-gradient-to-r from-purple-500 to-pink-500 text-white 
            font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
                            >
                                📋 Danh sách đánh giá
                            </button>

                            <button
                                onClick={handleCreate}
                                className="group relative flex items-center gap-2 px-6 py-3 
            bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo mới
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.map((plan, index) => {
                        const isActive = plan.status === "active";
                        const startDate = new Date(plan.startDate);
                        const endDate = new Date(plan.endDate);
                        const today = new Date();
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);

                        return (
                            <div
                                key={plan._id}
                                onClick={() => onScheduleClick(plan)}
                                className="relative group cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`absolute -inset-2 bg-gradient-to-r ${isActive
                                    ? 'from-green-400/30 via-emerald-400/30 to-green-400/30'
                                    : 'from-gray-400/20 via-gray-400/30 to-gray-400/20'
                                    } rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>

                                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${isActive
                                            ? 'from-green-400 to-emerald-600'
                                            : 'from-gray-400 to-gray-600'
                                            } flex items-center justify-center`}>
                                            <Target className="w-6 h-6 text-white" />
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isActive
                                            ? 'bg-green-100 text-green-600 border border-green-200'
                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                            {isActive ? '🟢 Đang thực hiện' : '⚪ Đã hoàn thành'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                        {plan.nameSchedule}
                                    </h3>

                                    {(() => {
                                        const goalInfo = getGoalInfo(plan.goal);
                                        return (
                                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                <span className={`text-lg ${goalInfo.color}`}>{goalInfo.icon}</span>
                                                <span className="text-sm font-medium">{goalInfo.label}</span>
                                                <span className="text-sm">•</span>
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {plan.kgGoal > 0 ? `${plan.kgGoal} kg` : ""}
                                                </span>
                                            </div>
                                        );
                                    })()}

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-cyan-500" />
                                            <span>{startDate.toLocaleDateString('vi-VN')}</span>
                                            <span>→</span>
                                            <span>{endDate.toLocaleDateString('vi-VN')}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-purple-500" />
                                            <span>{totalDays} ngày</span>
                                            {isActive && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-semibold text-purple-600">
                                                        {Math.max(totalDays - daysElapsed, 0)} ngày còn lại
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>Tiến độ</span>
                                                <span className="font-semibold">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <RatingModal
                open={showRateModal}
                schedule={scheduleToRate}
                onClose={() => setShowRateModal(false)}
                onSuccess={(scheduleId: string) => {
                    setShowRateModal(false);
                    navigate(`/plan/${scheduleId}`);
                }}
            />
            <ReviewListModal open={showReviewList} onClose={() => setShowReviewList(false)} />
        </div>
    );
}
