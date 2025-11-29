import React, { useEffect, useState } from "react";
import { X, Calendar, Target, TrendingUp, Flame, Activity } from "lucide-react";
import { scheduleResultService } from "../../services/scheduleResultService";
import { useNotify } from "../../components/notifications/NotificationsProvider";

export default function ReviewListModal({ open, onClose }: any) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotify();

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await scheduleResultService.list();
        setResults(res.results);

        notify.success("📊 Review list loaded successfully!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Review List</h2>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Complete a schedule to add your first review</p>
            </div>
          ) : (
            <div className="space-y-5">
              {results.map((item: any) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">

                    {/* TITLE & PROGRESS */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-xl text-gray-800 flex-1">
                        {item.nameSchedule}
                      </h3>
                      <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {item.progressPercent}% completed
                      </span>
                    </div>

                    {/* GRID INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                      {/* GOAL */}
                      <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Goal</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.goal} – {item.kgGoal}kg
                          </p>
                        </div>
                      </div>

                      {/* DATE RANGE */}
                      <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Duration</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(item.startDate).toLocaleDateString("en-US")} →{" "}
                            {new Date(item.endDate).toLocaleDateString("en-US")}
                          </p>
                        </div>
                      </div>

                      {/* WEIGHT */}
                      <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Weight</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.weightBefore}kg → {item.weightAfter}kg
                          </p>
                        </div>
                      </div>

                      {/* COMPLETED DAYS */}
                      <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Flame className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Completed Days</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.daysCompleted}/{item.totalDays} days
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* EXTRA ACTIVITIES */}
                    {item.extraActivities && item.extraActivities.length > 0 && (
                      <div className="mb-4 bg-white/60 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Extra Activities:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.extraActivities.map((a: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FEEDBACK */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* DIFFICULTY */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Difficulty:</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  star <= item.feedback.difficultyLevel
                                    ? "bg-yellow-400 text-white"
                                    : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COMMENT */}
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Comment:</p>
                          <p className="text-sm text-gray-600 italic">
                            "{item.feedback.comment}"
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-gray-50 rounded-b-3xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
