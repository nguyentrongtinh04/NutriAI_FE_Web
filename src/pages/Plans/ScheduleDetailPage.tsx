import React, { useEffect, useState } from "react";
import {
  ChefHat,
  Calendar,
  Clock,
  Flame,
  Drumstick,
  Target,
  ArrowLeft,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { planService } from "../../services/planService";

export default function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token =
    useSelector((state: RootState) => state.auth.accessToken) ||
    localStorage.getItem("accessToken");

  const [schedule, setSchedule] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [flippedMeals, setFlippedMeals] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedule detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await planService.getFullSchedule(id!);
        setSchedule(data);

        // Auto focus current day
        const todayStr = new Date().toISOString().split("T")[0];
        const todayIndex = data.fullPlan.findIndex(
          (d: any) => d.actualDate === todayStr
        );

        setSelectedDay(todayIndex !== -1 ? todayIndex : 0);
      } catch (err: any) {
        setError(err.message || "Failed to load schedule details");
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchDetail();
  }, [id, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400">
        <p className="text-white text-lg animate-pulse">Loading details...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-400">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading schedule</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!schedule)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Schedule not found.</p>
          <button
            onClick={() => navigate("/plans")}
            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to list
          </button>
        </div>
      </div>
    );

  // Current date
  const now = new Date();
  const currentDateStr = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const currentDay = schedule.fullPlan[selectedDay];

  const totalNutrition = currentDay.meals.reduce(
    (acc: any, meal: any) => ({
      calories: acc.calories + (meal.CPFCa?.[0] || 0),
      protein: acc.protein + (meal.CPFCa?.[1] || 0),
      fat: acc.fat + (meal.CPFCa?.[2] || 0),
      carbs: acc.carbs + (meal.CPFCa?.[3] || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const toggleMealFlip = (mealIndex: number) => {
    setFlippedMeals((prev) => {
      const newSet = new Set(prev);
      newSet.has(mealIndex) ? newSet.delete(mealIndex) : newSet.add(mealIndex);
      return newSet;
    });
  };

  const getMealTypeInfo = (type: string) => {
    const lower = type.toLowerCase();
    if (["breakfast", "sáng"].includes(lower))
      return {
        label: "Breakfast",
        icon: ChefHat,
        gradient: "from-orange-400 to-red-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      };
    if (["lunch", "trưa"].includes(lower))
      return {
        label: "Lunch",
        icon: Drumstick,
        gradient: "from-green-400 to-emerald-500",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      };
    if (["dinner", "chiều", "tối"].includes(lower))
      return {
        label: "Dinner",
        icon: ChefHat,
        gradient: "from-pink-400 to-rose-500",
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-600",
      };
    return {
      label: "Other",
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

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/plans")}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">{schedule.nameSchedule}</h1>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 flex justify-center items-center gap-3">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Meal Plan Details
            </span>
          </h1>
          <p className="text-blue-100 text-lg">
            Goal: {schedule.goal} – {schedule.kgGoal}kg
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">

          {/* Day list */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Select Day
              </h2>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
                {schedule.fullPlan.map((day: any, index: number) => {
                  const isToday = day.actualDate === currentDateStr;
                  const isPast = new Date(day.actualDate) < new Date(currentDateStr);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-300 border ${
                        selectedDay === index
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-transparent shadow-lg scale-[1.02]"
                          : isToday
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : isPast
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-white/80 border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`font-semibold ${
                              selectedDay === index ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Day {index + 1}
                          </div>
                          <div
                            className={`text-xs ${
                              selectedDay === index ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(day.actualDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                        </div>

                        {isPast && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {isToday && !isPast && (
                          <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Nutrition summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Daily Nutrition
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

              const mealHour = parseInt(meal.mealTime.split(":")[0]);
              const isTodayMeal = currentDay.actualDate === currentDateStr;

              let mealStatus = "upcoming";
              if (isTodayMeal) {
                if (mealHour < currentHour) mealStatus = "done";
                else if (mealHour === currentHour) mealStatus = "current";
              } else if (new Date(currentDay.actualDate) < new Date(currentDateStr)) {
                mealStatus = "done";
              }

              return (
                <div
                  key={index}
                  className={`relative h-[180px] cursor-pointer transition-all duration-500 ${
                    mealStatus === "current"
                      ? "ring-4 ring-cyan-400 animate-pulse"
                      : mealStatus === "done"
                      ? "opacity-70 grayscale"
                      : ""
                  }`}
                  style={{ perspective: "1000px" }}
                  onClick={() => toggleMealFlip(index)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front */}
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
                              {meal.mealName}
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

                    {/* Back */}
                    <div
                      className={`absolute inset-0 bg-white/25 rounded-2xl p-6 border-2 ${mealInfo.border} shadow-lg`}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="flex flex-col justify-between h-full">
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
                          {["Calories", "Protein", "Fat", "Carbs"].map((label, idx) => (
                            <div
                              key={idx}
                              className={`${mealInfo.bg} rounded-lg p-2 text-center`}
                            >
                              <Flame className={`w-4 h-4 mx-auto mb-1 ${mealInfo.text}`} />
                              <div
                                className={`flex items-baseline justify-center gap-1 text-base font-bold ${mealInfo.text}`}
                              >
                                <span>{meal.CPFCa?.[idx]}</span>
                                <span className="text-xs text-gray-600 font-normal">
                                  {["kcal", "protein", "fat", "carbs"][idx]}
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
      </div>
    </div>
  );
}
