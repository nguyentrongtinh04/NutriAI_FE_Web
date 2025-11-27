import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { searchFoods, getFoodDetail, clearFood, getRandomFoods } from "../redux/slices/foodSlice";
import { Search, Loader2, UtensilsCrossed, Flame, ArrowLeft, Bookmark, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { mealService } from "../services/mealService";
import { useNotify } from "../components/notifications/NotificationsProvider";

export default function SearchFoodPage() {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, detail, loading, loadingDetail } = useSelector((s: RootState) => s.food);
    const { profile } = useSelector((state: RootState) => state.user);
    const notify = useNotify();
    console.log("User Profile:", profile);
    useEffect(() => {
        // Gọi API random khi load trang
        dispatch(getRandomFoods(30));
    }, [dispatch]);

    const handleSearch = () => {
        if (!query.trim()) {
            dispatch(getRandomFoods(30));
            return;
        }
        dispatch(clearFood());
        dispatch(searchFoods(query));
    };

    const handleDetail = (name: string) => {
        dispatch(getFoodDetail(name));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

            <main className="relative z-20 w-full px-4 py-10 pt-[105px] max-w-7xl mx-auto">
                <div className="mb-8 relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 via-emerald-400/30 to-green-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                    <div className="relative flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                            <ArrowLeft className="w-6 h-6 text-blue-600" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <UtensilsCrossed className="w-10 h-10 text-white drop-shadow-lg" />
                                <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                                    Food Search
                                </span>
                            </h1>
                            <p className="text-green-100 text-lg">Discover nutritional information from Nutritionix database</p>
                        </div>
                    </div>
                </div>

                <div className="relative mb-8 group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-200">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    value={query}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setQuery(value);
                                        if (value.trim() === "") {
                                            // Khi xóa sạch nội dung → gọi lại random 30 món
                                            dispatch(getRandomFoods(30));
                                        }
                                    }}

                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập tên món ăn (e.g., chicken rice, pizza, salad...)"
                                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Search</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {!loading && list.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {list.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="relative group cursor-pointer"
                                onClick={() => handleDetail(item.name_en || item.name)}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100">
                                    <div className="flex gap-4">
                                        {item.photo ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-xl blur"></div>
                                                <img
                                                    src={item.photo}
                                                    alt={item.name}
                                                    className="relative w-20 h-20 rounded-xl object-cover shadow-md"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-md">
                                                <UtensilsCrossed className="text-green-500 w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h2 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                                                {item.name_vi || item.name_en || item.name}
                                            </h2>
                                            {item.brand && (
                                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    {item.brand}
                                                </p>
                                            )}
                                            {item.calories && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Flame className="w-4 h-4 text-orange-500" />
                                                    <span className="text-sm font-semibold text-orange-600">
                                                        {item.calories} kcal
                                                    </span>
                                                </div>
                                            )}
                                            {item.protein !== undefined && (
                                                <div className="flex gap-3 text-xs text-gray-600">
                                                    <span className="font-medium">💪 {item.protein}g</span>
                                                    <span className="font-medium">🌾 {item.carbs}g</span>
                                                    <span className="font-medium">🥑 {item.fat}g</span>
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-400 italic mt-2">{item.source}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && list.length === 0 && query && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-gray-200">
                            <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                            <p className="text-gray-500">Try searching for another food item</p>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {detail && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => dispatch(clearFood())}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-50"></div>

                                <div className="relative bg-white rounded-3xl overflow-hidden">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

                                        <button
                                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-300"
                                            onClick={() => dispatch(clearFood())}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        {loadingDetail ? (
                                            <div className="flex items-center justify-center h-40">
                                                <Loader2 className="animate-spin w-12 h-12 text-white" />
                                            </div>
                                        ) : (
                                            <div className="relative text-center">
                                                {detail.photo && (
                                                    <div className="relative inline-block mb-4">
                                                        <div className="absolute -inset-2 bg-white/30 rounded-full blur-lg"></div>
                                                        <img
                                                            src={detail.photo}
                                                            alt={detail.name}
                                                            className="relative w-32 h-32 object-cover rounded-full border-4 border-white shadow-2xl"
                                                        />
                                                    </div>
                                                )}
                                                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                                                    {detail.name}
                                                </h2>
                                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    <Flame className="text-orange-300 w-5 h-5" />
                                                    <span className="text-white font-bold text-lg">
                                                        {(detail.calories ?? 0).toFixed(1)} kcal
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!loadingDetail && (
                                        <div className="p-6">
                                            <div className="grid grid-cols-3 gap-4 mb-6">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-center border border-blue-200">
                                                    <p className="text-sm text-blue-600 font-medium mb-1">Protein</p>
                                                    <p className="text-2xl font-bold text-blue-700">{detail.protein}g</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-2xl text-center border border-amber-200">
                                                    <p className="text-sm text-amber-600 font-medium mb-1">Carbs</p>
                                                    <p className="text-2xl font-bold text-amber-700">{detail.carbs}g</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl text-center border border-orange-200">
                                                    <p className="text-sm text-orange-600 font-medium mb-1">Fat</p>
                                                    <p className="text-2xl font-bold text-orange-700">{detail.fat}g</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const userId = profile?._id;
                                                            if (!userId) {
                                                                notify.warning("⚠️ Bạn cần đăng nhập để lưu món ăn!");
                                                                navigate("/login?redirect=/", { replace: true });
                                                                return;
                                                            }                                                            

                                                            const normalizePhoto = (photo: string | undefined) => {
                                                                if (!photo) return "";
                                                                if (photo.startsWith("http")) return photo; // ảnh đã là URL đầy đủ rồi
                                                                // ✅ Nếu ảnh là file local, ghép thêm URL BE để backend hiểu được
                                                                return `http://localhost:5002/${photo.replace(/^\/+/, "")}`;
                                                            };

                                                            const data = {
                                                                userId,
                                                                food_en: detail.name_en || detail.name,
                                                                food_vi: detail.name_vi || detail.name,
                                                                nutrition: {
                                                                    calories: detail.calories ?? 0,
                                                                    protein: detail.protein ?? 0,
                                                                    carbs: detail.carbs ?? 0,
                                                                    fat: detail.fat ?? 0,
                                                                },
                                                                image_url: normalizePhoto(detail.photo),
                                                            };

                                                            await mealService.saveScannedMeal(data);
                                                            notify.success("✅ Món ăn đã được lưu vào lịch sử!");
                                                            dispatch(clearFood()); // đóng modal sau khi lưu
                                                            dispatch(getRandomFoods(30));
                                                        } catch (error: any) {
                                                            console.error("❌ Save meal error:", error);
                                                            notify.error("Lưu thất bại, thử lại sau!");
                                                        }
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                                >
                                                    <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    Save Meal
                                                </button>
                                                <button
                                                    onClick={() => dispatch(clearFood())}
                                                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <p className="text-xs text-gray-400 text-center mt-4 italic">
                                                Source: {detail.source}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
