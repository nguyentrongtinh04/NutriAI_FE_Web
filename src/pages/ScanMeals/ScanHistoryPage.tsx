import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mealService } from "../../services/mealService";
import { useDispatch, useSelector } from "react-redux";
import { getAiAdviceThunk, clearAdvice } from "../../redux/slices/aiSlice";
import { RootState, AppDispatch } from "../../redux/store";
import {
    Loader2,
    ArrowLeft,
    History,
    Sparkles,
    Calendar,
    Search,
    Brain,
    CheckCircle2,
    AlertTriangle,
    PlusCircle,
    X,
} from "lucide-react";
import { planService } from "../../services/planService";
import { createScheduleThunk } from "../../redux/slices/planSlice";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function ScanHistoryPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const notify = useNotify();

    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<any[]>([]);
    const [categorizedMeals, setCategorizedMeals] = useState<Record<string, any[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { profile } = useSelector((s: RootState) => s.user);
    useEffect(() => {
        (async () => {
            try {
                const userId =
                    profile?._id ||
                    localStorage.getItem("userId") ||
                    JSON.parse(localStorage.getItem("persist:root") || "{}")?.user?.profile?._id;

                const data = await mealService.getScannedHistory(userId);
                setMeals(data);
            } catch (err) {
                console.error("Error fetching scan history:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [profile]);

    const categorizeMeals = (list: any[]) => {
        const categories: Record<string, any[]> = {
            "🥩 High Protein": [],
            "🍚 High Carbs": [],
            "🥑 High Fat": [],
            "🍰 Desserts": [],
            "🍿 Snacks": [],
            "🍱 Others": [],
        };

        const proteinKeywords = /(thịt|gà|bò|heo|cá|trứng|tôm|đậu|nem|sườn)/i;
        const carbKeywords = /(cơm|bún|phở|mì|nui|bánh mì|cháo|khoai|bánh)/i;
        const fatKeywords = /(chiên|rán|xào|mỡ|kho|da gà|ram)/i;
        const dessertKeywords = /(chè|kem|bánh|tráng miệng|dessert|pudding)/i;
        const snackKeywords = /(trái cây|hoa quả|sinh tố|nước|trà|ăn vặt|snack|juice)/i;

        list.forEach((m) => {
            const name = (m.food_vi || "").toLowerCase();

            if (dessertKeywords.test(name)) return categories["🍰 Desserts"].push(m);
            if (snackKeywords.test(name)) return categories["🍿 Snacks"].push(m);
            if (proteinKeywords.test(name)) return categories["🥩 High Protein"].push(m);
            if (carbKeywords.test(name)) return categories["🍚 High Carbs"].push(m);
            if (fatKeywords.test(name)) return categories["🥑 High Fat"].push(m);

            categories["🍱 Others"].push(m);
        });

        return categories;
    };


    useEffect(() => {
        if (meals.length > 0) setCategorizedMeals(categorizeMeals(meals));
    }, [meals]);

    const filteredMeals = useMemo(() => {
        if (!searchTerm.trim()) return categorizedMeals;
        const term = searchTerm.toLowerCase().trim();
        const filtered: Record<string, any[]> = {};
        Object.entries(categorizedMeals).forEach(([cat, items]) => {
            const match = items.filter((m) =>
                (m.food_vi || "").toLowerCase().includes(term) ||
                (m.food_en || "").toLowerCase().includes(term)
            );
            if (match.length > 0) filtered[cat] = match;
        });
        return filtered;
    }, [searchTerm, categorizedMeals]);

    const [userInfo, setUserInfo] = useState({
        gender: profile?.gender || "nữ",
        age: profile?.DOB || 25,
        weight: profile?.weight || 58,
        height: profile?.height || 160,
        goal: "giảm cân",
        activity: "vừa",
    });
    const [mealCount, setMealCount] = useState<number>(3);
    const [mealSelections, setMealSelections] = useState<string[][]>(Array(3).fill([]));

    const handleAddMeal = (index: number, value: string) => {
        const newMeals = [...mealSelections];
        if (!newMeals[index].includes(value)) {
            newMeals[index] = [...newMeals[index], value];
            setMealSelections(newMeals);
        }
    };
    const handleRemoveMeal = (index: number, name: string) => {
        const newMeals = [...mealSelections];
        newMeals[index] = newMeals[index].filter((m) => m !== name);
        setMealSelections(newMeals);
    };
    const mealTypes = ["sáng", "trưa", "chiều", "tối", "phụ tối"];

    const handleCreateSchedule = async () => {
        try {
            // 1️⃣ Gọi BE để chuẩn hóa
            const enriched = await planService.enrichSchedule({
                userId: profile?._id,

                age: "18",
                gender: profile?.gender?.toLowerCase() === "male" ? "nam" : "nữ",
                weight: Number(profile?.weight),
                height: Number(profile?.height),

                goal: userInfo.goal,
                activity: userInfo.activity,
                kgGoal: 1,
                duration: 10,
                startDate: new Date().toISOString().slice(0, 10),
                nameSchedule: "new schedule",
                private: true,

                schedule: [
                    {
                        dateID: "Day 1",
                        meals: mealSelections.map((items, idx) => ({
                            name: items.join(", "),
                            type: mealTypes[idx] || "sáng",
                            time: `${7 + idx * 5}:00`,
                            description: "User suggested meal",
                        })),
                    },
                ],
            });

            // 2️⃣ Dữ liệu cuối để tạo schedule
            const scheduleData = enriched.scheduleReady;

            // 3️⃣ Gọi API tạo lịch + token đã có trong interceptor
            await dispatch(createScheduleThunk(scheduleData));

            dispatch(clearAdvice());

        } catch (err) {
            console.error("❌ Error creating schedule:", err);
            notify.warning("Unable to create schedule!");
        }
    };


    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <Loader2 className="animate-spin w-10 h-10 text-cyan-300" />
                <p className="ml-3">Loading data...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative">
            <div className="max-w-7xl mx-auto px-4 py-6 relative">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 text-blue-700 rounded-lg shadow"
                    >
                        <ArrowLeft /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-cyan-200 flex items-center gap-2">
                        <History className="text-cyan-300 w-8 h-8 animate-bounce" />
                        Scan History
                    </h1>
                    <button
                        onClick={() => navigate("/create-smart-schedule", { state: { meals } })}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-400"
                    >
                        <PlusCircle /> Create Smart Schedule
                    </button>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="relative w-full sm:w-2/3 lg:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm món ăn..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 bg-white/90 text-gray-700 text-center"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {Object.entries(filteredMeals).map(([cat, items]) => (
                    <div key={cat} className="mb-12">
                        <h2 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                            <Sparkles /> {cat}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((m) => (
                                <div
                                    key={m._id}
                                    className="bg-white/90 text-gray-800 rounded-xl overflow-hidden shadow hover:scale-[1.02] transition"
                                >
                                    <img src={m.image_url} alt={m.food_vi} className="h-40 w-full object-cover" />
                                    <div className="p-3">
                                        <h3 className="font-bold text-lg">{m.food_vi}</h3>
                                        <p className="text-sm text-gray-500">{m.food_en}</p>
                                        <p className="text-xs text-gray-400 mt-1">{m.nutrition.calories} kcal</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
