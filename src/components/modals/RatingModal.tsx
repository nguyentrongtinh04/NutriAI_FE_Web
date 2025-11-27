import React, { useState } from "react";
import { X, CheckCircle2, Calendar, TrendingUp, Activity, Star } from "lucide-react";
import { scheduleResultService } from "../../services/scheduleResultService";
import { useNotify } from "../../components/notifications/NotificationsProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  schedule: any;
  onSuccess: (scheduleId: string) => void;
}

export default function RatingModal({
  open,
  onClose,
  schedule,
  onSuccess,
}: Props) {
  const notify = useNotify();

  const [daysCompleted, setDaysCompleted] = useState(0);
  const [weightAfter, setWeightAfter] = useState(0);
  const [activitiesInput, setActivitiesInput] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [comment, setComment] = useState("");
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !schedule) return null;

  const submitResult = async () => {
    if (daysCompleted < 0 || daysCompleted > schedule.totalDays) {
      notify.warning("⚠️ Invalid completed days!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        daysCompleted,
        weightAfter,
        extraActivities: activitiesInput
          .split(",")
          .map((x) => x.trim())
          .filter((x) => x !== ""),
        feedback: { difficultyLevel, comment },
      };

      const res = await scheduleResultService.submit(schedule._id, payload);
      setSubmittedResult(res.result);

      notify.success("🎉 Rating submitted successfully!");
    } catch (err: any) {
      notify.error("❌ Failed to submit rating: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col animate-fadeIn">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Rate Your Plan</h2>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT SIDE - INPUT */}
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Rating Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Completed Days
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={schedule.totalDays}
                      value={daysCompleted}
                      onChange={(e) => setDaysCompleted(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter completed days"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Weight After (kg)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      value={weightAfter}
                      onChange={(e) => setWeightAfter(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                      placeholder="Enter weight after"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Extra Activities
                    </label>
                    <input
                      type="text"
                      value={activitiesInput}
                      onChange={(e) => setActivitiesInput(e.target.value)}
                      placeholder="e.g., walking, swimming, yoga"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Separate using commas</p>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Difficulty Level
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficultyLevel(level)}
                          className={`flex-1 h-12 rounded-xl font-semibold transition-all duration-200 ${
                            difficultyLevel >= level
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                      <span className="text-xs text-gray-500">Easy</span>
                      <span className="text-xs text-gray-500">Hard</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Your Feedback
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={submitResult}
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Submit Rating
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - RESULT */}
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 flex-1 flex flex-col">
                {!submittedResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Rating result will appear here
                    </h3>
                    <p className="text-sm text-gray-500">
                      Please enter information and click “Submit Rating”
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Rating Submitted!</h3>
                          <p className="text-sm text-white/80">Your results</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-medium text-gray-500">Completed</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">
                            {submittedResult.daysCompleted}
                            <span className="text-sm text-gray-400">/{submittedResult.totalDays}</span>
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-xs font-medium text-gray-500">Progress</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {submittedResult.progressPercent}%
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Weight</p>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Before</p>
                            <p className="text-xl font-bold text-gray-800">
                              {submittedResult.weightBefore}
                              <span className="text-sm text-gray-400"> kg</span>
                            </p>
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="h-1 bg-gray-200 rounded-full relative">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-full"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">After</p>
                            <p className="text-xl font-bold text-gray-800">
                              {submittedResult.weightAfter}
                              <span className="text-sm text-gray-400"> kg</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {submittedResult.extraActivities?.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Extra Activities</p>
                          <div className="flex flex-wrap gap-2">
                            {submittedResult.extraActivities.map((a: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Difficulty</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                                star <= submittedResult.feedback?.difficultyLevel
                                  ? "bg-yellow-400 text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Comment</p>
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                          "{submittedResult.feedback?.comment}"
                        </p>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-200">
                      <button
                        onClick={() => onSuccess(schedule._id)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm Completion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
