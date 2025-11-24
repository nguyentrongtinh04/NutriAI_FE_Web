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
  CalendarPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createScheduleThunk } from "../../redux/slices/planSlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function PlanResultPage() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [flippedMeals, setFlippedMeals] = useState<Set<number>>(new Set());
  const { mealPlan, loading, error } = useSelector((state: RootState) => state.plan);
  const profile = useSelector((state: RootState) => state.user.profile);
  const currentDay = mealPlan.schedule[selectedDay];
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token =
    useSelector((state: RootState) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

  // 🟢 State modal
  const [showModal, setShowModal] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  const toggleMealFlip = (mealIndex: number) => {
    setFlippedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealIndex)) newSet.delete(mealIndex);
      else newSet.add(mealIndex);
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
            onClick={() => navigate("/create-plan")}
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
          <button className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
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

  const getMealTypeInfo = (type?: string) => {
    const lower = (type || "").toLowerCase();

    if (["breakfast", "sáng"].includes(lower))
      return {
        label: "Bữa sáng",
        icon: ChefHat,
        gradient: "from-orange-400 to-red-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      };

    if (["lunch", "trưa"].includes(lower))
      return {
        label: "Bữa trưa",
        icon: Drumstick,
        gradient: "from-green-400 to-emerald-500",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      };

    if (["dinner", "chiều", "tối"].includes(lower))
      return {
        label: "Bữa tối",
        icon: ChefHat,
        gradient: "from-pink-400 to-rose-500",
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-600",
      };

    return {
      label: "Khác",
      icon: ChefHat,
      gradient: "from-blue-400 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
    };
  };


  function convertToTemplateFormat(schedule: any[]) {
    return schedule.map((day: any) => {
      const obj: any = {};

      day.meals.forEach((m: any) => {
        const type = m.mealType?.toLowerCase?.() || "";

        if (type.includes("sáng") || type.includes("breakfast")) {
          obj.breakfast = {
            name: m.mealName || m.nameMeals,
            description: m.description,
            mealTime: m.mealTime,
            CPFCa: m.CPFCa
          };
        }

        if (type.includes("trưa") || type.includes("lunch")) {
          obj.lunch = {
            name: m.mealName || m.nameMeals,
            description: m.description,
            mealTime: m.mealTime,
            CPFCa: m.CPFCa
          };
        }

        if (type.includes("tối") || type.includes("chiều") || type.includes("dinner")) {
          obj.dinner = {
            name: m.mealName || m.nameMeals,
            description: m.description,
            mealTime: m.mealTime,
            CPFCa: m.CPFCa
          };
        }
      });

      return obj;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <button
            onClick={() => {
              if (!token) {
                alert("Bạn cần đăng nhập để tạo lịch!");
                return;
              }
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:shadow-xl transition-all duration-300 border-2 border-white/50 hover:scale-105"
          >
            <CalendarPlus className="w-5 h-5" />
            <span>Tạo lịch</span>
          </button>
        </div>

        {/* Title */}
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

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sidebar */}
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
                          className={`font-semibold ${selectedDay === index ? "text-white" : "text-gray-800"
                            }`}
                        >
                          Ngày {index + 1}
                        </div>
                        <div
                          className={`text-sm ${selectedDay === index ? "text-blue-100" : "text-gray-600"
                            }`}
                        >
                          {new Date(
                            Date.now() + index * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("vi-VN", {
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

          {/* Meals */}
          <div className="lg:col-span-2 space-y-6">
            {currentDay.meals.map((meal: any, index: number) => {
              const mealInfo = getMealTypeInfo(meal.mealType);
              const Icon = mealInfo.icon;
              const isFlipped = flippedMeals.has(index);
              return (
                <div
                  key={index}
                  className="relative h-[180px] cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={() => toggleMealFlip(index)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""
                      }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Mặt trước */}
                    <div
                      className={`absolute inset-0 bg-white/90 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg hover:shadow-2xl transition-shadow`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="flex items-center gap-4 h-full">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${mealInfo.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {meal.nameMeals}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {meal.mealTime}
                              </span>
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
                      className={`absolute inset-0 bg-white/25 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg`}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="h-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${mealInfo.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-600 text-lg mb-4 font-bold">
                            {meal.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {["kcal", "protein", "fat", "carbs"].map((label, i) => (
                            <div
                              key={i}
                              className={`${mealInfo.bg} rounded-lg p-2 text-center`}
                            >
                              {i === 0 && (
                                <Flame
                                  className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`}
                                />
                              )}
                              {i === 1 && (
                                <Drumstick
                                  className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`}
                                />
                              )}
                              {i === 2 && (
                                <Droplet
                                  className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`}
                                />
                              )}
                              {i === 3 && (
                                <Wheat
                                  className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`}
                                />
                              )}
                              <div
                                className={`flex items-baseline justify-center gap-1 text-base font-bold ${mealInfo.text}`}
                              >
                                <span>{meal.CPFCa?.[i]}</span>
                                <span className="text-xs text-gray-600 font-normal">
                                  {label}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🟢 Modal tạo lịch */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl animate-fadeIn">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                🗓️ Tạo lịch ăn uống
              </h2>
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700">
                <p>
                  🎯 <span className="font-semibold">Mục tiêu:</span>{" "}
                  {userInfo?.goal || "Không xác định"}
                </p>
                <p>
                  ⚖️ Cân nặng: {userInfo?.weight || "-"} kg | Chiều cao:{" "}
                  {userInfo?.height || "-"} cm
                </p>
                <p>
                  👤 Giới tính:{" "}
                  {userInfo?.gender === "male"
                    ? "Nam"
                    : userInfo?.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                </p>
              </div>

              {/* Nhập tên lịch */}
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Tên lịch
              </label>
              <input
                type="text"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="Nhập tên kế hoạch..."
                className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {/* Chọn ngày bắt đầu */}
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                max={new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                >
                  Hủy
                </button>

                <button
                  onClick={async () => {
                    if (!scheduleName.trim()) {
                      alert("Vui lòng nhập tên kế hoạch!");
                      return;
                    }
                    if (!startDate) {
                      alert("Vui lòng chọn ngày bắt đầu!");
                      return;
                    }

                    function mapMealType(type: string) {
                      const t = type.toLowerCase();

                      if (t.includes("breakfast") || t.includes("sáng")) return "sáng";
                      if (t.includes("lunch") || t.includes("trưa")) return "trưa";
                      if (t.includes("dinner") || t.includes("tối")) return "tối";
                      if (t.includes("chiều") || t.includes("evening")) return "chiều";
                      if (t.includes("phu") || t.includes("snack") || t.includes("phụ")) return "phụ sáng";

                      return "sáng"; // fallback
                    }

                    // format schedule chuẩn BE
                    const formattedSchedule = mealPlan.schedule.map((day: any, i: number) => ({
                      dateID: `Day ${i + 1}`,
                      meals: day.meals.map((m: any) => ({
                        mealName: m.mealName ?? m.nameMeals,
                        mealType: mapMealType(m.mealType),
                        mealTime: m.mealTime,
                        description: m.description || "",
                        CPFCa: [
                          Number(m.CPFCa?.[0] || 0),
                          Number(m.CPFCa?.[1] || 0),
                          Number(m.CPFCa?.[2] || 0),
                          Number(m.CPFCa?.[3] || 0),
                        ],
                      })),
                    }));

                    const finalData = {
                      userId: profile?._id,
                      height: Number(userInfo?.height),
                      weight: Number(userInfo?.weight),
                      gender: mealPlan.userInfo?.gender === "male" ? "nam" : "nữ",
                      age: Number(userInfo?.age),
                      goal: userInfo?.goal,
                      kgGoal: userInfo?.kgGoal ?? 0,
                      duration: Number(userInfo?.day),
                      startDate: new Date(startDate).toISOString(),
                      schedule: formattedSchedule,   // ⭐ FIX CHÍNH Ở ĐÂY
                      idTemplate: mealPlan.userInfo?.dateTemplate ?? null,
                      nameSchedule: scheduleName,
                      private: true,
                    };

                    try {
                      await dispatch(createScheduleThunk(finalData)).unwrap();

                      alert("✅ Tạo lịch thành công!");
                      setShowModal(false);
                      navigate("/plans");
                    } catch (err: any) {
                      alert("❌ Lỗi khi lưu lịch: " + err);
                    }
                  }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Tạo lịch
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
