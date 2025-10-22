import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { searchFoods, getFoodDetail, clearFood } from "../redux/slices/foodSlice";
import { Search, Loader2, UtensilsCrossed, Flame, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SearchFoodPage() {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { list, detail, loading, loadingDetail } = useSelector((s: RootState) => s.food);

    const handleSearch = () => {
        if (!query.trim()) return alert("Nhập tên món ăn!");
        dispatch(clearFood());
        dispatch(searchFoods(query));
    };

    const handleDetail = (name: string) => {
        dispatch(getFoodDetail(name));
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <UtensilsCrossed className="text-green-600" /> Tra cứu món ăn (Nutritionix)
                </h1>
            </div>

            {/* Search bar */}
            <div className="flex gap-2 mb-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập tên món ăn (vd: chicken rice)"
                    className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                    {loading ? "Đang tìm..." : "Tìm"}
                </button>
            </div>

            {/* Results */}
            {!loading && list.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                    {list.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            className="border rounded-xl shadow-sm p-4 cursor-pointer hover:bg-green-50 transition"
                           onClick={() => handleDetail(item.name_en || item.name)}
                        >
                            <div className="flex gap-3 items-center">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                        <UtensilsCrossed className="text-gray-400 w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {item.name_vi || item.name_en || item.name}
                                    </h2>
                                    {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                                    {item.calories && <p className="text-sm text-gray-700">🔥 {item.calories} kcal</p>}
                                    {item.protein !== undefined && (
                                        <p className="text-xs text-gray-500">
                                            P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 italic">{item.source}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {detail && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                            onClick={() => dispatch(clearFood())}
                        >
                            ✕
                        </button>

                        {loadingDetail ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="animate-spin w-8 h-8 text-green-600" />
                            </div>
                        ) : (
                            <>
                                {detail.photo && (
                                    <img
                                        src={detail.photo}
                                        alt={detail.name}
                                        className="w-28 h-28 object-cover mx-auto rounded-full mb-3"
                                    />
                                )}
                                <h2 className="text-xl font-bold text-center mb-2">{detail.name}</h2>
                                <div className="flex justify-center items-center gap-2 mb-3 text-gray-600">
                                    <Flame className="text-orange-500 w-5 h-5" />
                                    <span>{(detail.calories ?? 0).toFixed(1)} kcal</span>
                                </div>
                                <div className="grid grid-cols-3 text-center mb-3">
                                    <div><p className="text-sm text-gray-500">Protein</p><p className="font-semibold">{detail.protein}g</p></div>
                                    <div><p className="text-sm text-gray-500">Carbs</p><p className="font-semibold">{detail.carbs}g</p></div>
                                    <div><p className="text-sm text-gray-500">Fat</p><p className="font-semibold">{detail.fat}g</p></div>
                                </div>
                                <p className="text-center text-sm text-gray-500">
                                    {detail.serving_weight_grams}g ({detail.serving_unit})
                                </p>
                                <p className="text-xs text-gray-400 text-center mt-3 italic">
                                    Nguồn: {detail.source}
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </main>
    );
}
