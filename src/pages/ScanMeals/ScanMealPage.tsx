import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Loader2, Camera, Sparkles, Flame, Beef, Sandwich, Droplet, ArrowLeft, History } from "lucide-react";
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

  useEffect(() => {
    // Xóa kết quả cũ mỗi khi vào lại trang
    dispatch(clearMeal());
    setPreview(null);
    setFile(null);
    setError("");
  }, []);

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
      setError("Please select a meal image!");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-blue-600/20 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Subtle particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-300/60 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => {
                const token = localStorage.getItem("accessToken");
                navigate(token ? "/home" : "/");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            {/* Title */}
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  Scan Meal
                </h1>
              </div>
              <p className="text-blue-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                <Sparkles className="w-4 h-4" />
                Take a photo of your meal to analyze its nutrition
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

              {/* Left Panel - Upload */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Upload Meal Image</h2>
                </div>

                {/* Upload Area */}
                {!preview ? (
                  <label className="block border-2 border-dashed border-blue-300 rounded-xl p-12 cursor-pointer hover:border-cyan-400 hover:bg-blue-50/50 transition-all duration-300 group">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Click or drag an image here
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, WEBP
                      </p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative group rounded-xl overflow-hidden">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                        clearMealLocal();
                      }}
                      className="w-full px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-all border border-red-200"
                    >
                      Choose another image
                    </button>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Meal</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* History Button */}
                {profile?._id && (
                  <button
                    onClick={() => navigate("/scan-history")}
                    className="w-full mt-4 bg-white/80 backdrop-blur-sm text-blue-600 py-3 rounded-xl font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-blue-200"
                  >
                    <History className="w-5 h-5" />
                    <span>View History</span>
                  </button>
                )}
              </div>

              {/* Right Panel - Results */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl border border-white/20">
                {result ? (
                  <div className="space-y-6">
                    {/* AI Warning */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Analysis Result</h2>
                    </div>
                    <div className="flex items-start gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-3">
                      <span className="text-yellow-500 text-xl">⚠️</span>
                      <p className="text-base font-bold text-yellow-900 animate-glow">
                        AI-generated results may contain inaccuracies. Please use discretion and verify before following any recommendations.
                      </p>
                    </div>

                    {/* Food Name */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{result.food_vi}</h3>
                          <p className="text-sm text-gray-600">({result.food_en})</p>
                        </div>
                      </div>
                    </div>

                    {/* Nutrition Info */}
                    {result.nutrition && (
                      <div className="space-y-4">
                        {/* Calories - Large Card */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                              <Flame className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 font-medium">Calories</div>
                              <div className="text-3xl font-bold text-orange-600">{result.nutrition.calories} kcal</div>
                            </div>
                          </div>
                        </div>

                        {/* Macros - Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-200 text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center mx-auto mb-3">
                              <Beef className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-red-600 mb-1">{result.nutrition.protein}g</div>
                            <div className="text-xs text-gray-600 font-medium">Protein</div>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                              <Sandwich className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">{result.nutrition.carbs}g</div>
                            <div className="text-xs text-gray-600 font-medium">Carbs</div>
                          </div>

                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200 text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3">
                              <Droplet className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-600 mb-1">{result.nutrition.fat}g</div>
                            <div className="text-xs text-gray-600 font-medium">Fat</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suggestion */}
                    {result.example && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-blue-800 mb-2">Nutrition Suggestion</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{result.example.note}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={async () => {
                        try {
                          const userId = profile?._id;
                          if (!userId) {
                            notify.warning("⚠️ You need to log in to save this meal!");
                            dispatch(clearMeal());
                            navigate("/login?redirect=/scan-meal", { replace: true });
                            return;
                          }

                          if (await hasScannedBefore(userId, result.food_en)) {
                            notify.info("ℹ️ This meal has already been saved!");
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
                          notify.success("Meal saved successfully!");
                        } catch (err: any) {
                          notify.error("Failed to save meal. Please try again.");
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      💾 Save This Meal
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mb-6">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">No Results Yet</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Upload a meal image and analyze it to see detailed nutrition information
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
