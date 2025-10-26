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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export default function PlanResultPage() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  // ✅ Lấy mealPlan từ Redux store
  const { mealPlan, loading, error } = useSelector(
    (state: RootState) => state.plan
  );

  // 🔄 Nếu đang load
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400">
        <p className="text-white text-lg animate-pulse">⏳ Đang tải kế hoạch...</p>
      </div>
    );

  // ❌ Nếu lỗi
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-400">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <p className="text-red-600 text-lg font-semibold mb-2">Lỗi khi tải kế hoạch</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/create-plan")}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Quay lại tạo kế hoạch
          </button>
        </div>
      </div>
    );

  // ⚠️ Nếu chưa có kế hoạch nào
  if (!mealPlan || !mealPlan.schedule)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            ❌ Chưa có kế hoạch nào — hãy tạo kế hoạch trước.
          </p>
          <button
            onClick={() => navigate("/create-plan")}
            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Tạo kế hoạch ngay
          </button>
        </div>
      </div>
    );

  const currentDay = mealPlan.schedule[selectedDay];

  // ✅ Tính tổng dinh dưỡng trong ngày
  const totalNutrition = currentDay.meals.reduce(
    (acc: any, meal: any) => ({
      calories: acc.calories + (meal.CPFCa?.[0] || 0),
      protein: acc.protein + (meal.CPFCa?.[1] || 0),
      fat: acc.fat + (meal.CPFCa?.[2] || 0),
      carbs: acc.carbs + (meal.CPFCa?.[3] || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // ✅ Mapping loại bữa
  const getMealTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "breakfast":
        return {
          label: "Bữa sáng",
          icon: ChefHat,
          gradient: "from-orange-400 to-red-500",
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-600",
        };
      case "lunch":
        return {
          label: "Bữa trưa",
          icon: Drumstick,
          gradient: "from-green-400 to-emerald-500",
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-600",
        };
      case "dinner":
        return {
          label: "Bữa tối",
          icon: ChefHat,
          gradient: "from-purple-400 to-pink-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-600",
        };
      default:
        return {
          label: "Khác",
          icon: ChefHat,
          gradient: "from-blue-400 to-cyan-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-600",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 🔙 Quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Tiêu đề */}
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
          {/* 📅 Chọn ngày */}
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
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      selectedDay === index
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-white shadow-lg scale-105"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`font-semibold ${
                            selectedDay === index
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          Ngày {index + 1}
                        </div>
                        <div
                          className={`text-sm ${
                            selectedDay === index
                              ? "text-blue-100"
                              : "text-gray-600"
                          }`}
                        >
                          {new Date(day.dateID).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
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

              {/* Tổng dinh dưỡng */}
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

          {/* 🍽️ Danh sách bữa ăn */}
          <div className="lg:col-span-2 space-y-6">
            {currentDay.meals.map((meal: any, index: number) => {
              const mealInfo = getMealTypeInfo(meal.mealType);
              const Icon = mealInfo.icon;
              return (
                <div key={index} className="relative group">
                  <div
                    className={`absolute -inset-2 bg-gradient-to-r ${mealInfo.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  ></div>
                  <div
                    className={`relative bg-white/90 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg hover:shadow-2xl transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${mealInfo.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${mealInfo.bg} ${mealInfo.text}`}
                            >
                              {mealInfo.label}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800">
                              {meal.nameMeals}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{meal.mealTime}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {meal.description}
                        </p>

                        {/* Thông tin dinh dưỡng từng bữa */}
                        <div className="grid grid-cols-4 gap-3 text-center">
                          <div className={`${mealInfo.bg} rounded-xl p-3`}>
                            <Flame
                              className={`w-5 h-5 mx-auto mb-1 ${mealInfo.text}`}
                            />
                            <div className={`text-lg font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[0]}
                            </div>
                            <div className="text-xs text-gray-600">kcal</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-xl p-3`}>
                            <Drumstick
                              className={`w-5 h-5 mx-auto mb-1 ${mealInfo.text}`}
                            />
                            <div className={`text-lg font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[1]}g
                            </div>
                            <div className="text-xs text-gray-600">Protein</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-xl p-3`}>
                            <Droplet
                              className={`w-5 h-5 mx-auto mb-1 ${mealInfo.text}`}
                            />
                            <div className={`text-lg font-bold ${mealInfo.text}`}>
                              {meal.CPFCa?.[2]}g
                            </div>
                            <div className="text-xs text-gray-600">Fat</div>
                          </div>
                          <div className={`${mealInfo.bg} rounded-xl p-3`}>
                            <Wheat
                              className={`w-5 h-5 mx-auto mb-1 ${mealInfo.text}`}
                            />
                            <div className={`text-lg font-bold ${mealInfo.text}`}>
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

        {/* Gợi ý */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Lưu ý quan trọng</h3>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Uống đủ nước mỗi ngày (ít nhất 2 lít)</li>
            <li>✓ Ăn đúng giờ và không bỏ bữa</li>
            <li>✓ Kết hợp với vận động thể chất phù hợp</li>
            <li>✓ Theo dõi sức khỏe và điều chỉnh kế hoạch nếu cần</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
