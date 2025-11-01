import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mealService } from "../../services/mealService";
import {
    Loader2,
    Flame,
    Beef,
    Sandwich,
    Droplet,
    ArrowLeft,
    History,
    Sparkles,
    Calendar,
    Search,
} from "lucide-react";

export default function ScanHistoryPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [meals, setMeals] = useState<any[]>([]);
    const [categorizedMeals, setCategorizedMeals] = useState<Record<string, any[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const data = await mealService.getScannedHistory();
                setMeals(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 🧠 Phân loại món ăn theo 6 nhóm
    const categorizeMeals = (list: any[]) => {
        const categories: Record<string, any[]> = {
            "🥩 Món chính – Giàu đạm": [],
            "🍚 Món chính – Giàu tinh bột": [],
            "🥑 Món chính – Giàu chất béo": [],
            "🍰 Tráng miệng": [],
            "🍿 Ăn nhẹ": [],
            "🍱 Món khác": [],
        };

        list.forEach((m) => {
            const { protein = 0, fat = 0, carbs = 0, calories = 0 } = m.nutrition || {};
            const name = (m.food_vi || "").toLowerCase();

            if (/(bánh|kem|chè|dessert)/i.test(name)) {
                categories["🍰 Tráng miệng"].push(m);
                return;
            }

            if (/(salad|trái cây|snack|sinh tố|ăn vặt)/i.test(name)) {
                categories["🍿 Ăn nhẹ"].push(m);
                return;
            }

            if (calories > 400 || protein > 15) {
                if (protein > fat && protein > carbs)
                    categories["🥩 Món chính – Giàu đạm"].push(m);
                else if (carbs > protein && carbs > fat)
                    categories["🍚 Món chính – Giàu tinh bột"].push(m);
                else if (fat > protein && fat > carbs)
                    categories["🥑 Món chính – Giàu chất béo"].push(m);
                else
                    categories["🍱 Món khác"].push(m);
            } else {
                categories["🍱 Món khác"].push(m);
            }
        });

        return categories;
    };

    useEffect(() => {
        if (meals.length > 0) {
            setCategorizedMeals(categorizeMeals(meals));
        }
    }, [meals]);

    // 🔍 Bộ lọc tìm kiếm thông minh
    const filteredMeals = useMemo(() => {
        if (!searchTerm.trim()) return categorizedMeals;

        const term = searchTerm.toLowerCase().trim();
        const isNumeric = !isNaN(Number(term));

        const filtered: Record<string, any[]> = {};
        Object.entries(categorizedMeals).forEach(([cat, items]) => {
            const match = items.filter((m) => {
                const { protein = 0, carbs = 0, fat = 0, calories = 0 } = m.nutrition || {};
                const nameVi = (m.food_vi || "").toLowerCase();
                const nameEn = (m.food_en || "").toLowerCase();
                const date = new Date(m.createdAt).toLocaleDateString("vi-VN").toLowerCase();

                return (
                    nameVi.includes(term) ||
                    nameEn.includes(term) ||
                    cat.toLowerCase().includes(term) ||
                    date.includes(term) ||
                    // Cho phép nhập số để tìm theo dinh dưỡng
                    (isNumeric &&
                        (protein === Number(term) ||
                            carbs === Number(term) ||
                            fat === Number(term) ||
                            Math.round(calories) === Number(term)))
                );
            });
            if (match.length > 0) filtered[cat] = match;
        });
        return filtered;
    }, [searchTerm, categorizedMeals]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                <Loader2 className="animate-spin w-12 h-12 text-cyan-300" />
                <p className="absolute bottom-20 text-cyan-100 text-lg font-semibold">
                    Đang tải dữ liệu...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-20">
                <div className="flex items-center justify-between relative mb-6 sm:mb-8">
                    {/* Nút quay lại - nằm sát trái */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-700 hover:text-cyan-600 rounded-lg border border-blue-200 shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" /> Quay lại
                    </button>

                    {/* Tiêu đề ở giữa */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-200 flex items-center justify-center gap-3">
                            <History className="text-cyan-300 w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                            Lịch sử Scan
                        </h1>
                        <p className="text-blue-200 text-sm sm:text-base mt-1">
                            {meals.length} món ăn đã được phân tích và phân loại
                        </p>
                    </div>
                </div>

                {/* Thanh tìm kiếm - nằm giữa, bên dưới tiêu đề */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-full sm:w-2/3 lg:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm món ăn, nhóm, dinh dưỡng hoặc ngày..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 bg-white/90 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* 🧩 Hiển thị kết quả tìm kiếm */}
                {Object.keys(filteredMeals).length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                        {/* Hiệu ứng nền sáng mờ */}
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-indigo-400/30 rounded-full blur-2xl animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl">
                                <History className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
                            </div>
                        </div>

                        {/* Tiêu đề */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-cyan-200 mb-2">
                            Không tìm thấy kết quả nào 😢
                        </h3>

                        {/* Mô tả */}
                        <p className="text-blue-100 text-base sm:text-lg max-w-md mb-6">
                            Không có món ăn nào khớp với từ khóa{" "}
                            <span className="font-semibold text-cyan-300">
                                “{searchTerm}”
                            </span>
                            . Hãy thử tìm với tên khác, ví dụ:{" "}
                            <span className="italic text-blue-200">“phở”, “salad”, “protein”</span>.
                        </p>

                        {/* Nút reset tìm kiếm */}
                        <button
                            onClick={() => setSearchTerm("")}
                            className="relative inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                        >
                            <Search className="w-4 h-4" /> Thử lại tìm kiếm
                        </button>
                    </div>
                ) : (
                    Object.entries(filteredMeals).map(([category, items]) =>
                        items.length > 0 ? (
                            <div key={category} className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-200 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-cyan-300" /> {category}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((m, index) => (
                                        <div
                                            key={m._id || index}
                                            className="relative group bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-blue-200/60 shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                                        >
                                            <div className="relative h-48 sm:h-56 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                                                <img
                                                    src={`http://localhost:5002${m.image_url}`}
                                                    alt={m.food_vi}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 z-20">
                                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                        <Flame className="w-3 h-3" />
                                                        {m.nutrition.calories} kcal
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                                                    {m.food_vi}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{m.food_en}</p>

                                                <div className="grid grid-cols-3 gap-3 my-3">
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                                                        <Beef className="w-4 h-4 mx-auto text-red-500 mb-1" />
                                                        <div className="font-bold text-red-600 text-sm">
                                                            {m.nutrition.protein}g
                                                        </div>
                                                        <div className="text-[10px] text-gray-600">Protein</div>
                                                    </div>

                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                                                        <Sandwich className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                                                        <div className="font-bold text-blue-600 text-sm">
                                                            {m.nutrition.carbs}g
                                                        </div>
                                                        <div className="text-[10px] text-gray-600">Carbs</div>
                                                    </div>

                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                                                        <Droplet className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                                                        <div className="font-bold text-yellow-600 text-sm">
                                                            {m.nutrition.fat}g
                                                        </div>
                                                        <div className="text-[10px] text-gray-600">Fat</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                                    <Calendar className="w-3 h-3 text-blue-500" />
                                                    <span>
                                                        {new Date(m.createdAt).toLocaleString("vi-VN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )
                )}
            </div>
        </div>
    );
}
