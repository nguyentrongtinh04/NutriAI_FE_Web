import React, { useState } from "react";
import {
  ChefHat,
  Calendar,
  Clock,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Target,
  ArrowLeft,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export default function PlanResultPage() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [flippedMeals, setFlippedMeals] = useState<Set<number>>(new Set());
  const { mealPlan, loading, error } = useSelector((state: RootState) => state.plan);
  const currentDay = mealPlan.schedule[selectedDay];

  const toggleMealFlip = (mealIndex: number) => {
    setFlippedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealIndex)) {
        newSet.delete(mealIndex);
      } else {
        newSet.add(mealIndex);
      }
      return newSet;
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400">
        <p className="text-white text-lg animate-pulse">Đang tải kế hoạch...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-400">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <p className="text-red-600 text-lg font-semibold mb-2">Lỗi khi tải kế hoạch</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Quay lại tạo kế hoạch
          </button>
        </div>
      </div>
    );

  if (!mealPlan || !mealPlan.schedule)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Chưa có kế hoạch nào — hãy tạo kế hoạch trước.
          </p>
          <button
            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Tạo kế hoạch ngay
          </button>
        </div>
      </div>
    );

  const totalNutrition = currentDay.meals.reduce(
    (acc: any, meal: any) => ({
      calories: acc.calories + (meal.CPFCa?.[0] || 0),
      protein: acc.protein + (meal.CPFCa?.[1] || 0),
      fat: acc.fat + (meal.CPFCa?.[2] || 0),
      carbs: acc.carbs + (meal.CPFCa?.[3] || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const getMealTypeInfo = (type: string) => {
    const lower = type.toLowerCase();

    if (["breakfast", "sáng"].includes(lower)) {
      return {
        label: "Bữa sáng",
        icon: ChefHat,
        gradient: "from-orange-400 to-red-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      };
    }
    if (["lunch", "trưa"].includes(lower)) {
      return {
        label: "Bữa trưa",
        icon: Drumstick,
        gradient: "from-green-400 to-emerald-500",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      };
    }
    if (["dinner", "chiều", "tối"].includes(lower)) {
      return {
        label: "Bữa tối",
        icon: ChefHat,
        gradient: "from-pink-400 to-rose-500",
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-600",
      };
    }
    return {
      label: "Khác",
      icon: ChefHat,
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
    };
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 flex justify-center items-center gap-3">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Kế Hoạch Ăn Uống Của Bạn
            </span>
          </h1>
          <p className="text-blue-100 text-lg">
            Thực đơn được thiết kế riêng cho mục tiêu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Chọn ngày
              </h2>

              <div className="space-y-3">
                {mealPlan.schedule.map((day: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${selectedDay === index
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-white shadow-lg scale-105"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`font-semibold ${selectedDay === index
                            ? "text-white"
                            : "text-gray-800"
                            }`}
                        >
                          Ngày {index + 1}
                        </div>
                        <div
                          className={`text-sm ${selectedDay === index
                            ? "text-blue-100"
                            : "text-gray-600"
                            }`}
                        >
                          {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      {selectedDay === index && (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Tổng dinh dưỡng
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>🔥 Calories</span>
                    <span className="font-semibold text-orange-600">
                      {totalNutrition.calories} kcal
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🍗 Protein</span>
                    <span className="font-semibold text-red-600">
                      {totalNutrition.protein}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>💧 Fat</span>
                    <span className="font-semibold text-yellow-600">
                      {totalNutrition.fat}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌾 Carbs</span>
                    <span className="font-semibold text-green-600">
                      {totalNutrition.carbs}g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {currentDay.meals.map((meal: any, index: number) => {
              const mealInfo = getMealTypeInfo(meal.mealType);
              const Icon = mealInfo.icon;
              const isFlipped = flippedMeals.has(index);

              return (
                <div
                  key={index}
                  className="relative h-[180px] cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => toggleMealFlip(index)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Mặt trước */}
                    <div
                      className={`absolute inset-0 bg-white/90 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg hover:shadow-2xl transition-shadow`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-center gap-4 h-full">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${mealInfo.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* 👉 Mô tả cùng hàng với tên & giờ ăn */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-bold text-gray-800">
                                {meal.nameMeals}
                              </h3>
                              <span className="text-sm text-gray-600">
                                ({meal.description})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{meal.mealTime}</span>
                            </div>
                          </div>

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${mealInfo.bg} ${mealInfo.text}`}
                          >
                            {mealInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mặt sau */}
                    <div
                      className={`absolute inset-0 bg-white/90 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg`}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      {/* ❌ Bỏ scroll, chỉ hiển thị vừa khung */}
                      <div className="h-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${mealInfo.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              {meal.nameMeals}
                            </h3>
                            <span className="text-sm text-gray-600">{meal.mealTime}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{meal.description}</p>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div className={`${mealInfo.bg} rounded-lg p-2 text-center`}>
                            <Flame className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`} />
                            <div className={`text-base font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[0]}
                            </div>
                            <div className="text-xs text-gray-600">kcal</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-lg p-2 text-center`}>
                            <Drumstick
                              className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`}
                            />
                            <div className={`text-base font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[1]}g
                            </div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-lg p-2 text-center`}>
                            <Droplet className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`} />
                            <div className={`text-base font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[2]}g
                            </div>
                            <div className="text-xs text-gray-600">Fat</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-lg p-2 text-center`}>
                            <Wheat className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`} />
                            <div className={`text-base font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[3]}g
                            </div>
                            <div className="text-xs text-gray-600">Carbs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
