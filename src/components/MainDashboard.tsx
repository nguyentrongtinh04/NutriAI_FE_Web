import React from 'react';
import { Camera, ChefHat, Target, BarChart3, Plus, Apple, Sparkles, Clock, Calendar, Utensils, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchNextMealThunk, fetchSchedulesThunk } from "../redux/slices/planSlice";
import { useEffect } from "react";
import { fetchRecentMealsThunk } from "../redux/slices/mealSlice";

export default function MainDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { profile } = useSelector((state: RootState) => state.user);
    const displayName =
    profile?.fullname ||
    profile?.email?.split("@")[0] ||
    profile?.phone ||
    "User";
  
    const token =
        useSelector((state: RootState) => state.auth.accessToken) ||
        localStorage.getItem("accessToken");

    const { nextMeal, loading, error,schedules } = useSelector((state: RootState) => state.plan);

    useEffect(() => {
        if (token) {
            dispatch(fetchNextMealThunk());
            dispatch(fetchRecentMealsThunk());
            dispatch(fetchSchedulesThunk());
        }
    }, [dispatch, token]);
    const navigate = useNavigate();
    const { recentMeals } = useSelector((state: RootState) => state.meal);

    const actionCards = [
        {
            id: 'scan',
            title: 'Scan Meal',
            description: 'Chụp ảnh để phân tích',
            icon: Camera,
            gradient: 'from-green-500 to-emerald-600',
            glowColor: 'from-green-400 to-emerald-500',
            isPrimary: true,
            onClick: () => navigate('/scan-meal')
        },
        {
            id: 'searchFood',
            title: 'Search Food',
            description: 'Tìm món ăn theo Nutritionix',
            icon: Apple,
            gradient: 'from-green-400/30 to-emerald-400/30',
            iconColor: 'text-green-500',
            onClick: () => navigate('/search-food') // ✅ điều hướng
        },
        {
            id: 'goals',
            title: 'Goals',
            description: 'Thiết lập mục tiêu mới',
            icon: Target,
            gradient: 'from-blue-400/30 to-cyan-400/30',
            iconColor: 'text-blue-500',
            onClick: () => navigate('/plans', { state: { from: '/home' } })
        },
        {
            id: 'viewPlan',
            title: 'ListMealsScan',
            description: 'Xem danh sách món ăn đã scan',
            icon: Calendar,
            gradient: 'from-teal-400/30 to-green-400/30',
            iconColor: 'text-teal-500',
            onClick: () => navigate('/scan-history')
        },
    ];

    const getIcon = (color: string) => {
        switch (color) {
            case 'orange': return ChefHat;
            case 'green': return Apple;
            case 'purple': return Sparkles;
            default: return ChefHat;
        }
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'orange': return { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'from-orange-400 to-red-500', textColor: 'text-orange-600' };
            case 'green': return { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'from-green-400 to-emerald-500', textColor: 'text-green-600' };
            case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'from-purple-400 to-pink-500', textColor: 'text-purple-600' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', iconBg: 'from-gray-400 to-gray-500', textColor: 'text-gray-600' };
        }
    };

    return (
        <main className="relative z-20 w-full px-4 py-10 pt-[105px]">
            {/* Welcome Section */}
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="animate-bounce">👋</span>
                        <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                            Welcome back, {displayName}!
                        </span>
                    </h1>
                    <p className="text-blue-200 text-lg animate-fade-in">Today is a great day to maintain a healthy diet</p>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {actionCards.map((card, index) => {
                    const Icon = card.icon;
                    const isClickable = !!card.onClick;

                    return (
                        <div
                            key={card.id}
                            className="relative group"
                            onClick={card.onClick}
                            style={{ cursor: isClickable ? 'pointer' : 'default' }}
                        >
                            <div className={`absolute -inset-2 bg-gradient-to-r ${card.gradient} rounded-2xl blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500`} style={{ animationDelay: `${index * 200}ms` }}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                                <Icon className={`w-10 h-10 ${card.iconColor || 'text-gray-600'} mb-4 group-hover:animate-bounce`} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-gray-600 text-sm">{card.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nutrition Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Meal Schedule Overview */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        Meal Schedule Overview
                    </h2>

                    {loading ? (
                        <p className="text-gray-500 italic">Đang tải dữ liệu...</p>
                    ) : error ? (
                        <div className="text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    ) : nextMeal ? (
                        <>
                            {/* 🧠 Thông báo tổng quan */}
                            <p className="text-gray-700 text-lg font-medium">{nextMeal.message}</p>

                            {/* 📋 Có thông tin lịch trình */}
                            {nextMeal.scheduleInfo && (
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mt-4">
                                    <p className="font-semibold text-blue-700">
                                        📋 Kế hoạch: {nextMeal.scheduleInfo.nameSchedule}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        🎯 Mục tiêu: {nextMeal.scheduleInfo.goal}
                                        {nextMeal.scheduleInfo.kgGoal
                                            ? ` (${nextMeal.scheduleInfo.kgGoal} kg)`
                                            : ""}
                                    </p>
                                </div>
                            )}

                            {/* 🍽️ Có bữa ăn sắp tới */}
                            {nextMeal.meal && (
                                <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mt-5 shadow-md hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center gap-6">
                                        {/* 🕒 Thời gian & loại bữa */}
                                        <div className="text-center min-w-[90px]">
                                            <div className="text-3xl font-extrabold text-green-700 leading-tight drop-shadow-sm">
                                                {nextMeal.meal.mealTime || "--:--"}
                                            </div>
                                            <div
                                                className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm"
                                            >
                                                {nextMeal.meal.mealType
                                                    ? nextMeal.meal.mealType.charAt(0).toUpperCase() +
                                                    nextMeal.meal.mealType.slice(1)
                                                    : "Không rõ"}
                                            </div>
                                        </div>

                                        {/* 🍽️ Món ăn */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-green-800">
                                                {nextMeal.meal.mealName || nextMeal.meal.nameMeals || "Chưa có tên món"}
                                            </h3>
                                            {nextMeal.meal.description && (
                                                <p className="text-gray-600 text-sm mt-1">{nextMeal.meal.description}</p>
                                            )}

                                            {/* 🔹 Nutrition info */}
                                            {nextMeal.meal.CPFCa && (
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-3">
                                                    <span className="font-medium text-green-600">
                                                        🔥 {nextMeal.meal.CPFCa[0]} kcal
                                                    </span>
                                                    <span>💪 Protein: {nextMeal.meal.CPFCa[1]}g</span>
                                                    <span>🥑 Fat: {nextMeal.meal.CPFCa[2]}g</span>
                                                    <span>🌾 Carbs: {nextMeal.meal.CPFCa[3]}g</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* 📅 Ngày thực hiện */}
                            {nextMeal.actualDate && (
                                <p className="text-gray-600 text-sm mt-2">
                                    📅 Ngày thực hiện: {nextMeal.actualDate} (Ngày {nextMeal.dayOrder})
                                </p>
                            )}

                            {/* 🎉 Hoàn thành lịch */}
                            {nextMeal.done && (
                                <div className="text-green-600 font-semibold mt-3">
                                    🎉 Bạn đã hoàn thành lịch trình ăn uống!
                                </div>
                            )}

                            {/* 🔘 Nút điều hướng */}
                            <div className="mt-6 text-center">
                                {nextMeal.hasSchedule === false ? (
                                    <button
                                        onClick={() => navigate("/plans")}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Tạo lịch trình mới
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const name = nextMeal?.scheduleInfo?.nameSchedule;

                                            // ✅ Dò kế hoạch trong Redux (đã lấy ở trên)
                                            const foundSchedule = schedules.find(
                                                (s) => s.nameSchedule === name || s.status === "active"
                                            );

                                            if (foundSchedule?._id) {
                                                navigate(`/plan/${foundSchedule._id}`);
                                            } else {
                                                alert(
                                                    "Không tìm thấy kế hoạch phù hợp, vui lòng vào trang 'My Plan' để xem chi tiết!"
                                                );
                                            }
                                        }}
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Xem chi tiết kế hoạch
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 italic">Không có dữ liệu lịch trình</p>
                    )}
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Recent Meals
                    </h2>

                    <div className="space-y-4">
                        {recentMeals && recentMeals.length > 0 ? (
                            recentMeals.map((meal: any, index: number) => {
                                const colors = ["orange", "green", "purple"];
                                const color = colors[index % colors.length];
                                const Icon = getIcon(color);
                                const style = getColorClasses(color);

                                const nutrition = meal.nutrition || {};
                                const mealTime = new Date(meal.time).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-xl border ${style.bg} ${style.border} hover:shadow-lg transition-all duration-300`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${style.iconBg} flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-semibold text-gray-800">{meal.name}</h3>
                                                    <span className="text-sm text-gray-600">{mealTime}</span>
                                                </div>

                                                <div className="text-sm text-gray-600">
                                                    {nutrition.calories || 0} kcal • {nutrition.protein || 0}g protein •{" "}
                                                    {nutrition.carbs || 0}g carbs
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 italic">Chưa có món ăn nào được quét gần đây</p>
                        )}
                    </div>

                    <button
                        onClick={() => navigate("/scan-meal")}
                        className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Scan Meal
                    </button>
                </div>
            </div>
        </main>
    );
}