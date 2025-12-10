import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Calendar, Loader2, Brain, ChevronLeft, ChevronRight, Sparkles, Target, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getAiAdviceThunk } from "../../redux/slices/aiSlice";
import { planApi } from "../../services/api";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function CreateSmartSchedulePage() {
    const { state } = useLocation();
    const meals = state?.meals || [];
    const [aiResult, setAiResult] = useState<any>(null);
    const notify = useNotify();

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { profile } = useSelector((s: RootState) => s.user);
    const { loading: aiLoading } = useSelector((s: RootState) => s.ai);

    const [userInfo, setUserInfo] = useState({
        height: Number(profile?.height) || 170,
        weight: Number(profile?.weight) || 70,
        age: profile?.DOB ? new Date().getFullYear() - new Date(profile.DOB).getFullYear() : 25,
        gender: profile?.gender === "MALE" ? "nam" :
            profile?.gender === "FEMALE" ? "nữ" : "nam",
        goal: "",
        activity: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [scheduleName, setScheduleName] = useState("");
    const [startDateSelect, setStartDateSelect] = useState("");

    const [scheduleDays, setScheduleDays] = useState<number>(1);
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

    const [mealCount, setMealCount] = useState<number>(3);
    const [kgChange, setKgChange] = useState<number>(1);
    const [weeks, setWeeks] = useState<number>(1);

    const [targetWeeks, setTargetWeeks] = useState<number>(1);
    const [timeWarning, setTimeWarning] = useState<string>("");

    const [timeError, setTimeError] = useState("");
    const [bmiWarning, setBmiWarning] = useState("");
    const [mealSelections, setMealSelections] = useState<string[][][]>([
        Array(mealCount).fill([])
    ]);

    const mealTypes = ["sáng", "trưa", "chiều", "tối", "phụ tối"];

    const [goalWarning, setGoalWarning] = useState<string>("");
    const heightM = Number(userInfo.height) / 100;

    const minWeight = 18.5 * heightM * heightM;
    const maxWeight = 24.9 * heightM * heightM;

    const maxKgLose = Math.max(0, Number(userInfo.weight) - minWeight);
    const maxKgGain = Math.max(0, maxWeight - Number(userInfo.weight));

    const checkActiveSchedule = async () => {
        try {
            const res = await planApi.get("/get-me");
            const schedules = res.data.schedules || [];
            return schedules.some((s: any) => s.status === "active");
        } catch (err) {
            console.error("Lỗi khi kiểm tra lịch active:", err);
            return false;
        }
    };

    const handleAddMeal = (dayIdx: number, mealIdx: number, value: string) => {
        if (!value.trim()) return;

        const updated = mealSelections.map((day) =>
            day.map((meal) => [...meal])
        );

        if (!updated[dayIdx][mealIdx].includes(value)) {
            updated[dayIdx][mealIdx].push(value.trim());
        }

        setMealSelections(updated);
    };

    const handleRemoveMeal = (dayIdx: number, mealIdx: number, name: string) => {
        const updated = mealSelections.map((day) =>
            day.map((meal) => [...meal])
        );

        updated[dayIdx][mealIdx] = updated[dayIdx][mealIdx].filter(
            (m: string) => m !== name
        );

        setMealSelections(updated);
    };

    const getAgeFromDOB = (dob: string | number) => {
        if (!dob) return 25;
        const d = new Date(dob);
        const now = new Date();
        return now.getFullYear() - d.getFullYear();
    };

    const handleSubmitSchedule = async () => {
        if (!isFormValid()) {
            notify.warning("⚠️ Vui lòng điền đầy đủ thông tin trước khi phân tích bằng AI!");
            return;
        }

        try {
            const weeksNum = Number(targetWeeks || 0);
            const totalDays = weeksNum * 7;

            let mergedGoal = "";

            if (userInfo.goal === "giảm cân") {
                mergedGoal = `giảm ${kgChange}kg trong ${totalDays} ngày`;
            }
            else if (userInfo.goal === "tăng cân") {
                mergedGoal = `tăng ${kgChange}kg trong ${totalDays} ngày`;
            }
            else if (userInfo.goal === "duy trì") {
                mergedGoal = "duy trì cân nặng hiện tại";
            }

            const cleanUserInfo = {
                userId: profile?._id,
                gender: userInfo.gender,
                age: typeof userInfo.age === "string" ? getAgeFromDOB(userInfo.age) : Number(userInfo.age),
                weight: Number(userInfo.weight),
                height: Number(userInfo.height),
                activity: userInfo.activity,
                goal: mergedGoal,
            };

            const userSchedule = mealSelections.map((day, dayIndex) => ({
                dateID: `Day ${dayIndex + 1}`,
                meals: day.map((mealItems, mealIndex) => ({
                    name: mealItems.join(", "),
                    type: mealTypes[mealIndex] ?? "khác",
                    time: `${7 + mealIndex * 5}:00`,
                })),
            }));

            const result = await dispatch(
                getAiAdviceThunk({
                    userId: cleanUserInfo.userId,
                    userInfo: cleanUserInfo,
                    userSchedule,
                })
            ).unwrap();

            setAiResult(result);
            notify.success("🎉 AI đã phân tích dữ liệu của bạn!");
        } catch (err) {
            notify.error("❌ Lỗi khi phân tích bằng AI. Vui lòng thử lại!");
        }
    };

    const mealTypeMap = ["sáng", "trưa", "chiều", "tối", "phụ tối"];
    const handleCreateSchedule = async (customName: string, customDate: string) => {
        try {
            const totalDays = scheduleDays;

            const schedule = mealSelections.map((dayMeals, dayIdx) => ({
                dateID: `Day ${dayIdx + 1}`,
                meals: dayMeals.map((mealItems, mealIdx) => {
                    const foodNutritions = mealItems
                        .map(name => {
                            const f = meals.find((m: any) => m.food_vi === name);
                            return f ? f.nutrition : null;
                        })
                        .filter(Boolean);

                    const total = foodNutritions.reduce(
                        (acc, n) => ({
                            calories: acc.calories + n.calories,
                            protein: acc.protein + n.protein,
                            fat: acc.fat + n.fat,
                            carbs: acc.carbs + n.carbs,
                        }),
                        { calories: 0, protein: 0, fat: 0, carbs: 0 }
                    );

                    return {
                        mealName: mealItems.join(", "),
                        mealType: mealTypeMap[mealIdx] ?? "khác",
                        mealTime: `${7 + mealIdx * 5}:00`,
                        CPFCa: [
                            total.calories,
                            total.protein,
                            total.fat,
                            total.carbs
                        ]
                    };
                }),
            }));

            await planApi.post("/create-schedule", {
                height: Number(userInfo.height),
                weight: Number(userInfo.weight),
                gender: userInfo.gender,
                age: typeof userInfo.age === "string" ? getAgeFromDOB(userInfo.age) : Number(userInfo.age),

                goal: userInfo.goal,
                kgGoal: kgChange,
                duration: targetWeeks! * 7,

                startDate: new Date(customDate).toISOString(),
                schedule,

                nameSchedule: customName,
                private: true,
            });

            navigate("/plans");
        } catch (err: any) {
            console.log("❌ Lỗi tạo lịch:", err);
            notify.error(err.response?.data?.message || "❌ Không thể tạo lịch!");
        }
    };

    const isGoalAchieved =
        aiResult?.advice?.advice?.goalCheck?.toLowerCase() === "đạt";

    const dateOptions = Array.from({ length: 3 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            value: d.toISOString().split("T")[0],
            label: d.toLocaleDateString("vi-VN"),
        };
    });

    const isFormValid = () => {
        if (!userInfo.gender) return false;
        if (!userInfo.age || userInfo.age < 10 || userInfo.age > 80) return false;
        if (!userInfo.weight || userInfo.weight < 20 || userInfo.weight > 300) return false;
        if (!userInfo.height || userInfo.height < 100 || userInfo.height > 250) return false;
        if (!userInfo.goal) return false;
        if (userInfo.goal !== "duy trì vóc dáng" && !kgChange) return false;
        if (!targetWeeks) return false;
        if (!userInfo.activity) return false;

        if (!mealCount || mealCount < 3 || mealCount > 5) return false;
        if (!scheduleDays || scheduleDays < 1) return false;

        // Phải có ít nhất 1 món ăn trong ngày đầu tiên
        for (let d = 0; d < mealSelections.length; d++) {
            for (let m = 0; m < mealSelections[d].length; m++) {
                if (mealSelections[d][m].length === 0) {
                    console.warn(`Ngày ${d + 1}, bữa ${m + 1} trống`);
                    return false;
                }
            }
        }

        return true;
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>

            <div className="h-full flex flex-col relative z-10">
                <div className="bg-white/95 backdrop-blur-xl shadow-2xl border-b border-blue-200/50 px-8 py-5 flex items-center justify-between">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-blue-400/30 rounded-2xl blur-xl animate-pulse"></div>
                        <h2 className="relative text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                            <div className="relative">
                                <Calendar className="w-8 h-8 text-blue-600 animate-bounce" />
                                <Sparkles className="w-4 h-4 text-cyan-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            Create Smart Meal Schedule
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-full p-2 transition-all duration-300 hover:rotate-90 hover:scale-110"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="grid grid-cols-12 gap-6 h-full">
                        <div className="col-span-3 space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 animate-pulse transition-all duration-500"></div>
                                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-blue-200/50 hover:shadow-3xl transition-all duration-500">
                                    <div className="flex items-center gap-3 border-b border-blue-100 pb-4 mb-5">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-bold text-xl bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="group/input">
                                                <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                                    Gender
                                                </label>
                                                <select
                                                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white"
                                                    value={userInfo.gender}
                                                    onChange={(e) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            gender: e.target.value.toLowerCase(),
                                                        })
                                                    }
                                                >
                                                    <option value="nam">Male</option>
                                                    <option value="nữ">Female</option>
                                                </select>
                                            </div>

                                            <div className="group/input">
                                                <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                                                    Age
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 hover:border-cyan-300"
                                                    value={
                                                        typeof userInfo.age === "string"
                                                            ? getAgeFromDOB(userInfo.age)
                                                            : userInfo.age
                                                    }
                                                    onChange={(e) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            age: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="group/input">
                                                <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                                                    Weight (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-300"
                                                    value={userInfo.weight}
                                                    onChange={(e) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            weight: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="group/input">
                                                <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    Height (cm)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                                                    value={userInfo.height}
                                                    onChange={(e) =>
                                                        setUserInfo({
                                                            ...userInfo,
                                                            height: Number(e.target.value),
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="group/input">
                                            <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-teal-600" />
                                                Activity Level
                                            </label>
                                            <select
                                                className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:border-teal-300 bg-white"
                                                value={userInfo.activity}
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        activity: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="" disabled hidden>-- Select your Activity Level --</option>
                                                <option>low</option>
                                                <option>light</option>
                                                <option>moderate</option>
                                                <option>high</option>
                                                <option>very high</option>
                                            </select>
                                        </div>

                                        <div className="group/input">
                                            <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-blue-600" />
                                                Goal
                                            </label>
                                            <select
                                                className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white"
                                                value={userInfo.goal}
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        goal: e.target.value.toLowerCase(),
                                                    })
                                                }
                                            >
                                                <option value="" disabled hidden>-- Select your goal --</option>
                                                <option>giảm cân</option>
                                                <option>tăng cân</option>
                                                <option>duy trì</option>
                                            </select>
                                        </div>

                                        {(userInfo.goal === "giảm cân" || userInfo.goal === "tâng cân") && (
                                            <div className="group/input">
                                                <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                    {userInfo.goal === "giảm cân" ? (
                                                        <TrendingDown className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                    )}
                                                    {userInfo.goal === "giảm cân"
                                                        ? "How many kg do you want to lose?"
                                                        : "How many kg do you want to gain?"}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                                                    value={kgChange}
                                                    placeholder="Enter number kg change"
                                                    onChange={(e) => {
                                                        let val = Number(e.target.value);
                                                        if (isNaN(val) || val <= 0) val = 1;
                                                        val = Math.floor(val);

                                                        setBmiWarning("");
                                                        setTimeError("");

                                                        const bmiLimit = userInfo.goal === "giảm cân" ? maxKgLose : maxKgGain;

                                                        if (val > bmiLimit) {
                                                            setBmiWarning(
                                                                `⚠ Cảnh báo: Số kg bạn nhập vượt ngưỡng an toàn theo BMI (tối đa ${bmiLimit.toFixed(1)} kg).`
                                                            );
                                                        }

                                                        setKgChange(val);
                                                    }}
                                                />

                                                {bmiWarning && (
                                                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg animate-fadeIn">
                                                        <p className="text-orange-600 text-xs font-medium">{bmiWarning}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="group/input">
                                            <label className="font-semibold mb-2 flex items-center gap-2 text-sm text-gray-700">
                                                <Calendar className="w-4 h-4 text-cyan-600" />
                                                Target duration
                                            </label>

                                            <select
                                                className="w-full border-2 border-gray-200 rounded-xl p-2.5"
                                                value={targetWeeks}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setTargetWeeks(val);

                                                    setTimeWarning("");
                                                    setTimeError("");

                                                    const goalWeeks = val;
                                                    const timeLimit =
                                                        userInfo.goal === "giảm cân"
                                                            ? goalWeeks * 1
                                                            : goalWeeks * 0.75;

                                                    if (kgChange > timeLimit) {
                                                        setTimeError(
                                                            `Với ${val} tuần, bạn chỉ có thể ${userInfo.goal === "giảm cân" ? "giảm" : "tăng"
                                                            } tối đa ${timeLimit.toFixed(1)} kg.`
                                                        );
                                                    }
                                                }}
                                            >
                                                <option value={1}>1 weeks</option>
                                                <option value={2}>2 weeks</option>
                                                <option value={3}>3 weeks</option>
                                                <option value={4}>4 weeks</option>
                                            </select>

                                            {timeWarning && (
                                                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                                                    <p className="text-red-600 text-xs font-medium">{timeWarning}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="group/input">
                                            <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                Số bữa ăn
                                            </label>
                                            <input
                                                type="number"
                                                min={3}
                                                max={5}
                                                className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-300"
                                                value={mealCount}
                                                onChange={(e) => {
                                                    const val = Math.max(3, Math.min(5, Number(e.target.value)));
                                                    setMealCount(val);
                                                    setMealSelections(Array(val).fill([]));
                                                }}
                                            />
                                        </div>

                                        <div className="group/input">
                                            <label className="block font-semibold mb-2 text-sm text-gray-700 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                                Số ngày tạo lịch
                                            </label>
                                            <select
                                                className="w-full border-2 border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 bg-white"
                                                value={scheduleDays}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setScheduleDays(val);
                                                    setCurrentDayIndex(0);

                                                    setMealSelections(
                                                        Array(val).fill(null).map(() =>
                                                            Array(mealCount).fill(null).map(() => [])
                                                        )
                                                    );
                                                }}
                                            >
                                                <option value={1}>1 ngày</option>
                                                <option value={2}>2 ngày</option>
                                                <option value={3}>3 ngày</option>
                                                <option value={4}>4 ngày</option>
                                                <option value={5}>5 ngày</option>
                                                <option value={6}>6 ngày</option>
                                                <option value={7}>7 ngày</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 space-y-4">
                            <div className="relative group h-full">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 animate-pulse transition-all duration-500"></div>
                                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-green-200/50 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-4 border-b border-green-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-xl bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                                Meal Selection
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
                                                disabled={currentDayIndex === 0}
                                                className="p-2 rounded-xl bg-gradien-to-br from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            <div className="relative group/day">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-50 group-hover/day:opacity-75 transition-opacity"></div>
                                                <div className="relative px-6 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg whitespace-nowrap">
                                                    Day {currentDayIndex + 1} / {scheduleDays}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setCurrentDayIndex(Math.min(scheduleDays - 1, currentDayIndex + 1))}
                                                disabled={currentDayIndex === scheduleDays - 1}
                                                className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {Array.from({ length: mealCount }).map((_, mealIndex) => (
                                            <div key={mealIndex} className="relative group/meal">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 rounded-xl blur opacity-0 group-hover/meal:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative border-2 border-green-200 p-5 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                                                    <label className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm">
                                                            {mealIndex + 1}
                                                        </span>
                                                        <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                                            Bữa {mealTypes[mealIndex]}
                                                        </span>
                                                    </label>

                                                    <select
                                                        className="w-full border-2 border-green-200 rounded-xl p-3 text-sm mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-300 bg-white/80 backdrop-blur-sm"
                                                        value=""
                                                        onChange={(e) => handleAddMeal(currentDayIndex, mealIndex, e.target.value)}
                                                    >
                                                        <option value="">-- Choose from scanned meals --</option>
                                                        {meals.map((m: any) => (
                                                            <option key={m._id} value={m.food_vi}>
                                                                {m.food_vi} ({m.nutrition.calories} kcal)
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter custom food and press Enter..."
                                                        className="w-full border-2 border-green-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-300 bg-white/80 backdrop-blur-sm"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                                                                handleAddMeal(currentDayIndex, mealIndex, e.currentTarget.value.trim());
                                                                e.currentTarget.value = "";
                                                            }
                                                        }}
                                                    />

                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {mealSelections[currentDayIndex]?.[mealIndex]?.map((m: string) => (
                                                            <span key={m} className="group/tag px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md">
                                                                {m}
                                                                <button
                                                                    onClick={() => handleRemoveMeal(currentDayIndex, mealIndex, m)}
                                                                    className="text-green-900 hover:text-red-600 font-bold transition-colors duration-300 hover:scale-125"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-green-100 flex justify-center gap-2">
                                        {Array.from({ length: scheduleDays }).map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentDayIndex(idx)}
                                                className={`relative w-10 h-10 rounded-full font-semibold transition-all duration-300 ${idx === currentDayIndex
                                                    ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-xl scale-110"
                                                    : "bg-gray-200 text-gray-600 hover:bg-gradient-to-br hover:from-gray-300 hover:to-gray-400 hover:scale-105"
                                                    }`}
                                            >
                                                {idx === currentDayIndex && (
                                                    <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
                                                )}
                                                <span className="relative">{idx + 1}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-5">
                            <div className="relative group h-full">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 animate-pulse transition-all duration-500"></div>
                                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-pink-200/50 h-full flex flex-col">
                                    <div className="border-b border-pink-100 pb-4 mb-5">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
                                                <Brain className="w-6 h-6 text-white animate-pulse" />
                                            </div>
                                            <h3 className="font-bold text-xl bg-gradient-to-r from-pink-700 to-rose-700 bg-clip-text text-transparent">
                                                AI Analysis Result
                                            </h3>
                                        </div>

                                        <p className="text-sm text-red-500 italic">
                                            AI-generated results may contain inaccuracies. Please use discretion and verify before following any recommendations.
                                        </p>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        {!aiResult ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center space-y-4 animate-fadeIn">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                                        <Brain className="w-16 h-16 text-gray-300 mx-auto relative" />
                                                    </div>
                                                    <p className="text-gray-500 italic px-4">
                                                        Enter information & choose meals then click "Analyze with AI"
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 animate-fadeIn">
                                                <div className="relative group/card">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                                                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                            <Target className="w-4 h-4 text-blue-600" />
                                                            Goal Achievement:
                                                        </p>
                                                        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                            {aiResult?.advice?.advice?.goalCheck}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative group/card">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-300 to-emerald-300 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                                                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-green-600" />
                                                            Completion rate:
                                                        </p>
                                                        <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                            {aiResult?.advice?.advice?.percentFinish}%
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative group/card">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-slate-300 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                                                        <p className="text-sm font-semibold text-gray-700 mb-2">Reason:</p>
                                                        <p className="text-gray-800 text-sm leading-relaxed">{aiResult?.advice?.advice?.reason}</p>
                                                    </div>
                                                </div>

                                                <div className="relative group/card">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-300 to-amber-300 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all duration-300">
                                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-orange-600" />
                                                            Suggestions:
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {aiResult?.advice?.advice?.mealSuggestion?.map(
                                                                (s: string, i: number) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                                                        <span className="flex-1">{s}</span>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-xl shadow-2xl border-t border-blue-200/50 px-8 py-4 flex justify-end gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmitSchedule}
                        disabled={aiLoading || !isFormValid()}
                        className="relative group/btn px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 hover:from-blue-700 hover:to-cyan-700 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:hover:scale-100 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity blur"></div>
                        {aiLoading ? (
                            <Loader2 className="animate-spin w-5 h-5 relative z-10" />
                        ) : (
                            <Brain className="w-5 h-5 relative z-10 group-hover/btn:animate-pulse" />
                        )}
                        <span className="relative z-10">Analyze with AI</span>
                    </button>

                    <button
                        onClick={async () => {
                            if (!isGoalAchieved) return;

                            const hasActive = await checkActiveSchedule();
                            if (hasActive) {
                                notify.warning("⚠️ Bạn đã có lịch đang hoạt động. Hãy hoàn thành trước khi tạo lịch mới!");
                                return;
                            }

                            setShowModal(true);
                        }}
                        disabled={!isGoalAchieved}
                        className={`relative group/btn px-6 py-2.5 rounded-xl text-white flex items-center gap-2 transition-all duration-300 font-medium shadow-lg hover:shadow-xl overflow-hidden ${isGoalAchieved
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isGoalAchieved && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity blur"></div>
                        )}
                        <span className="relative z-10 text-xl">✓</span>
                        <span className="relative z-10">Create Schedule</span>
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="relative group/modal">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scaleIn">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                                    Confirm Meal Schedule
                                </h3>
                            </div>

                            <div className="mb-5">
                                <label className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    Schedule name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-blue-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                                    placeholder="Enter schedule name..."
                                    value={scheduleName}
                                    onChange={(e) => setScheduleName(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                                    Start date
                                </label>
                                <select
                                    className="w-full border-2 border-cyan-200 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 hover:border-cyan-300 bg-white"
                                    value={startDateSelect}
                                    onChange={(e) => setStartDateSelect(e.target.value)}
                                >
                                    <option value="">-- Select date --</option>
                                    {dateOptions.map((opt, i) => (
                                        <option key={i} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl hover:from-gray-300 hover:to-gray-400 font-medium transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        if (!scheduleName.trim()) return notify.warning("Tên lịch không được bỏ trống!");
                                        if (!startDateSelect) return notify.warning("Vui lòng chọn ngày bắt đầu!");

                                        handleCreateSchedule(scheduleName, startDateSelect);
                                        setShowModal(false);
                                    }}
                                    className="relative group/confirm px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover/confirm:opacity-100 transition-opacity blur"></div>
                                    <span className="relative z-10">Confirm</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
