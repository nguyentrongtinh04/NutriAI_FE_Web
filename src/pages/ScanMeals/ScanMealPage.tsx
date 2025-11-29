import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2, Camera, Sparkles, Flame, Beef, Sandwich, Droplet, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { analyzeMeal, clearMeal } from "../../redux/slices/mealSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { mealService } from "../../services/mealService";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function ScanMealPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.user);
  const { loading, result, error: reduxError } = useSelector((state: RootState) => state.meal);
  const notify = useNotify();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      dispatch(clearMeal());
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Hãy chọn ảnh món ăn!");
      return;
    }

    setError("");
    dispatch(analyzeMeal(file));
  };

  const clearMealLocal = () => {
    dispatch(clearMeal());
    setError("");
  };

  const hasScannedBefore = async (userId: string, foodName: string) => {
    const history = await mealService.getScannedHistory(userId);
    return history.some((item: any) => item.food_en === foodName);
  };
  
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
          <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/45 via-cyan-400/55 to-blue-500/45 rounded-full blur-3xl animate-bounce delay-3000"></div>
        </div>

        {/* Animated Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-sky-300/40 via-transparent to-blue-400/40 animate-pulse delay-2000"></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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
          <div className="absolute top-2/3 left-1/2 w-20 h-20 border-2 border-sky-400/35 rounded-full animate-ping delay-2000"></div>
        </div>

        {/* Moving Aurora Streams */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -skew-y-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent transform -skew-y-6 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Container */}
      <main className="relative z-20 w-full h-screen flex flex-col">
        {/* Header Section - Fixed */}
        <div className="flex-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <button
                  onClick={() => {
                    const token = localStorage.getItem("accessToken");
                    navigate(token ? "/home" : "/");
                  }}
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
                    <Camera className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-300 animate-bounce drop-shadow-2xl" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                    Scan Meal
                  </span>
                </h1>
                <p className="text-blue-200 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                  Chụp ảnh món ăn để phân tích dinh dưỡng
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

              {/* Left Column - Upload & Preview */}
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

                <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-blue-200/60 shadow-2xl shadow-cyan-500/20">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-50 animate-pulse"></div>
                      <UploadCloud className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
                    </div>
                    <span className="text-base sm:text-xl lg:text-2xl">Tải ảnh món ăn</span>
                  </h2>

                  {/* Upload Area */}
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl sm:rounded-2xl p-8 sm:p-12 cursor-pointer hover:bg-blue-50/50 transition-all duration-300 hover:border-cyan-500 group/upload relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] backdrop-blur-sm">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/0 via-cyan-400/20 to-blue-400/0 blur-xl opacity-0 group-hover/upload:opacity-100 transition-all duration-500"></div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-4 sm:mb-6">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 to-cyan-500/40 rounded-full blur-xl animate-pulse"></div>
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300 shadow-2xl">
                            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white group-hover/upload:animate-bounce" />
                          </div>
                        </div>
                        <p className="text-gray-700 text-base sm:text-lg lg:text-xl font-bold mb-2">Click hoặc kéo ảnh vào đây</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Hỗ trợ JPG, PNG, WEBP</p>
                      </div>

                      <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
                    </label>
                  ) : (
                    <div className="flex flex-col items-center relative">
                      <div className="relative group/preview w-full">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover/preview:opacity-75 transition-all duration-300"></div>
                        <img
                          src={preview}
                          alt="preview"
                          className="relative rounded-xl sm:rounded-2xl w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover shadow-2xl border-4 border-white/80 transform group-hover/preview:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setPreview(null);
                          setFile(null);
                          clearMealLocal();
                        }}
                        className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 text-red-600 text-xs sm:text-sm font-semibold hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg border-2 border-red-200"
                      >
                        Chọn ảnh khác
                      </button>
                    </div>
                  )}

                  {/* Analyze Button */}
                  <div className="relative mt-4 sm:mt-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur opacity-60 animate-pulse"></div>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !file}
                      className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-sm sm:text-base lg:text-lg group"
                    >
                      <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                            <span>Đang phân tích...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                            <span>Phân tích món ăn</span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="relative mt-4 sm:mt-6">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl blur opacity-30 animate-pulse"></div>
                      <div className="relative bg-red-50/90 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 text-red-600 text-xs sm:text-sm text-center backdrop-blur-sm font-semibold">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="relative">
                {result ? (
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-400/30 rounded-3xl blur-xl animate-pulse"></div>
                    <div className="absolute -inset-2 bg-white/20 rounded-3xl blur-xl animate-pulse delay-500"></div>

                    <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-blue-200/60 shadow-2xl shadow-cyan-500/20">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-50 animate-pulse"></div>
                          <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600 animate-pulse" />
                        </div>
                        <span className="text-base sm:text-xl lg:text-2xl">Kết quả phân tích</span>
                      </h2>

                      {/* Food Name */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 transition duration-300"></div>
                        <div className="relative p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur opacity-50 animate-pulse"></div>
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center shadow-xl">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white animate-pulse" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{result.food_vi}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 font-medium">({result.food_en})</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nutrition Info */}
                      {result.nutrition && (
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                          <div className="relative group/cal">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl blur opacity-25 group-hover/cal:opacity-50 transition duration-300"></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border-2 border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative flex-shrink-0">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-50 animate-pulse"></div>
                                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center shadow-xl">
                                    <Flame className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Calories</div>
                                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">{result.nutrition.calories} kcal</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                            <div className="relative group/protein">
                              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl blur opacity-25 group-hover/protein:opacity-50 transition duration-300"></div>
                              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-5 border-2 border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="relative mb-2 sm:mb-3">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur opacity-40 animate-pulse"></div>
                                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center mx-auto shadow-lg">
                                    <Beef className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mb-1">{result.nutrition.protein}g</div>
                                  <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">Protein</div>
                                </div>
                              </div>
                            </div>

                            <div className="relative group/carbs">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-25 group-hover/carbs:opacity-50 transition duration-300"></div>
                              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-5 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="relative mb-2 sm:mb-3">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur opacity-40 animate-pulse"></div>
                                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center mx-auto shadow-lg">
                                    <Sandwich className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">{result.nutrition.carbs}g</div>
                                  <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">Carbs</div>
                                </div>
                              </div>
                            </div>

                            <div className="relative group/fat">
                              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-25 group-hover/fat:opacity-50 transition duration-300"></div>
                              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-5 border-2 border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="relative mb-2 sm:mb-3">
                                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-40 animate-pulse"></div>
                                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg">
                                    <Droplet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mb-1">{result.nutrition.fat}g</div>
                                  <div className="text-[10px] sm:text-xs text-gray-600 font-semibold">Fat</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Example/Suggestion */}
                      {result.example && (
                        <div className="relative group/suggestion mb-4 sm:mb-6">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur opacity-30 group-hover/suggestion:opacity-50 transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg backdrop-blur-sm">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="relative flex-shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur opacity-50 animate-pulse"></div>
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center shadow-xl">
                                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-blue-800 mb-2 text-base sm:text-lg">Gợi ý dinh dưỡng</h3>
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{result.example.note}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-50 animate-pulse"></div>
                          <button
                            onClick={async () => {
                              try {
                                const userId = profile?._id;
                                if (!userId) {
                                  notify.warning("⚠️ Bạn cần đăng nhập để lưu món ăn!");
                                  dispatch(clearMeal());
                                  navigate("/login?redirect=/scan-meal", { replace: true });
                                  return;
                                }
                                
                                // ❗ Check trùng trước khi lưu
                                if (await hasScannedBefore(userId, result.food_en)) {
                                  notify.info("ℹ️ Món này bạn đã lưu trước đó!");
                                  return;
                                }                              

                                const payload = {
                                  userId,
                                  food_en: result.food_en,
                                  food_vi: result.food_vi,
                                  image_url: result.image_url,
                                  nutrition: result.nutrition,
                                  confidence: result.confidence,
                                  mealType: "OTHER",
                                };

                                const res = await mealService.saveScannedMeal(payload);
                                notify.success("✅ " + res.message);
                              } catch (err: any) {
                                notify.error("❌ Lưu thất bại: " + err.message);
                              }
                            }}

                            className="relative w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                          >
                            💾 Lưu món này
                          </button>
                        </div>

                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-50 animate-pulse"></div>
                          <button
                            onClick={() => {
                              const userId = profile?._id;
                              if (!userId) {
                                notify.warning("⚠️ Bạn cần đăng nhập để xem lịch sử!");
                                navigate("/login?redirect=/scan-history", { replace: true });
                                return;
                              }
                              navigate("/scan-history");
                            }}                            
                            className="relative w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                          >
                            📜 Xem lịch sử
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-3 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-3xl blur-xl opacity-30"></div>
                    <div className="absolute -inset-2 bg-white/20 rounded-3xl blur-lg opacity-20"></div>
                    <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-blue-200/60 shadow-2xl flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
                      <div className="relative mb-6 sm:mb-8">
                        <div className="absolute -inset-3 bg-gradient-to-r from-gray-300/30 to-gray-400/30 rounded-full blur-xl"></div>
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center shadow-2xl">
                          <Camera className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-500 mb-2 sm:mb-3">Chưa có kết quả</h3>
                      <p className="text-gray-400 text-center max-w-md text-sm sm:text-base">Tải ảnh lên và phân tích để xem thông tin dinh dưỡng chi tiết</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
      <div className="absolute bottom-1/4 right-5 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
    </div>
  );
}
