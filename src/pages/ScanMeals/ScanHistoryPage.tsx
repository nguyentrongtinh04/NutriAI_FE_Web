import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mealService } from "../../services/mealService";
import { Loader2, Flame, Beef, Sandwich, Droplet, ArrowLeft, History, Sparkles, Calendar, TrendingUp } from "lucide-react";

export default function ScanHistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<any[]>([]);

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

  if (loading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        {/* Aurora Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-75 animate-pulse"></div>
            <Loader2 className="relative animate-spin w-16 h-16 text-cyan-300" />
          </div>
          <p className="text-cyan-100 text-lg font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Aurora Waves */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Aurora Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
        </div>

        {/* Animated Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-300 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        {/* Ripple Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-blue-400/40 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 w-full min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <button
                  onClick={() => navigate(-1)}
                  className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-700 hover:text-cyan-600 rounded-lg transition-all duration-300 group border border-blue-200 shadow-lg text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-semibold">Quay lại</span>
                </button>
              </div>
            </div>

            {/* Title Section */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-cyan-400/40 to-blue-400/30 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="absolute -inset-2 bg-white/20 rounded-3xl blur-xl animate-pulse delay-500"></div>
              <div className="relative text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 flex items-center justify-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-500/40 rounded-full blur-xl animate-pulse"></div>
                    <History className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-300 animate-bounce drop-shadow-2xl" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                    Lịch sử Scan
                  </span>
                </h1>
                <p className="text-blue-200 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  {meals.length} món ăn đã được phân tích
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {meals.length === 0 ? (
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-12 sm:p-16 border border-blue-200/60 shadow-2xl flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-3 bg-gradient-to-r from-gray-300/30 to-gray-400/30 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center shadow-2xl">
                    <History className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-500 mb-3">Chưa có lịch sử</h3>
                <p className="text-gray-400 text-center max-w-md text-base sm:text-lg mb-6">
                  Bạn chưa lưu món ăn nào. Hãy quét món ăn đầu tiên của bạn!
                </p>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-60 animate-pulse"></div>
                  <button
                    onClick={() => navigate('/scan-meal')}
                    className="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Bắt đầu quét món ăn
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Meals Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {meals.map((m, index) => (
                <div
                  key={m._id}
                  className="relative group"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 via-cyan-400/50 to-blue-400/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-blue-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <img 
                        src={`http://localhost:5007${m.image_url}`} 
                        alt={m.food_vi} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-75 animate-pulse"></div>
                          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Flame className="w-3 h-3" />
                            {m.nutrition.calories} kcal
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      {/* Food Name */}
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                          {m.food_vi}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{m.food_en}</p>
                      </div>

                      {/* Nutrition Grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="relative group/protein">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg blur opacity-0 group-hover/protein:opacity-50 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-lg p-2 sm:p-3 text-center">
                            <div className="flex justify-center mb-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
                                <Beef className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                            <div className="text-base sm:text-lg font-bold text-red-600">{m.nutrition.protein}g</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Protein</div>
                          </div>
                        </div>

                        <div className="relative group/carbs">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-0 group-hover/carbs:opacity-50 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                            <div className="flex justify-center mb-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                                <Sandwich className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                            <div className="text-base sm:text-lg font-bold text-blue-600">{m.nutrition.carbs}g</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Carbs</div>
                          </div>
                        </div>

                        <div className="relative group/fat">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-0 group-hover/fat:opacity-50 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2 sm:p-3 text-center">
                            <div className="flex justify-center mb-1">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Droplet className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                            <div className="text-base sm:text-lg font-bold text-yellow-600">{m.nutrition.fat}g</div>
                            <div className="text-[10px] sm:text-xs text-gray-600">Fat</div>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg blur"></div>
                        <div className="relative flex items-center gap-2 text-xs text-gray-500 bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span>{new Date(m.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats Card (if meals exist) */}
          {meals.length > 0 && (
            <div className="mt-8 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-400/30 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200/60 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-50 animate-pulse"></div>
                    <TrendingUp className="relative w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  Thống kê tổng quan
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                      {meals.reduce((sum, m) => sum + m.nutrition.calories, 0).toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Tổng Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
                      {meals.reduce((sum, m) => sum + m.nutrition.protein, 0).toFixed(1)}g
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Tổng Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1">
                      {meals.reduce((sum, m) => sum + m.nutrition.carbs, 0).toFixed(1)}g
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Tổng Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                      {meals.reduce((sum, m) => sum + m.nutrition.fat, 0).toFixed(1)}g
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Tổng Fat</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
    </div>
  );
}
