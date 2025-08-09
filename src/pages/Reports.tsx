import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Award, Clock, Target, BarChart3, Calendar, Zap, Apple, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReportsProps {
  onBack?: () => void;
}

export default function Reports({ onBack }: ReportsProps) {
  const navigate = useNavigate();
  const goBack = onBack ?? (() => navigate('/'));
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const weeklyStats = {
    calories: { avg: 1456, target: 1800, change: +12 },
    protein: { avg: 89, target: 100, change: +8 },
    carbs: { avg: 178, target: 200, change: -5 },
    fat: { avg: 58, target: 70, change: +3 },
    meals: { total: 21, avg: 3, streak: 7 }
  };

  const achievements = [
    { id: 1, title: 'Protein Champion', description: 'Đạt mục tiêu protein 7 ngày liên tiếp', icon: Award, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { id: 2, title: 'Consistency King', description: 'Ghi nhận bữa ăn đều đặn 30 ngày', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 3, title: 'Healthy Balance', description: 'Duy trì cân bằng dinh dưỡng tốt', icon: Target, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 4, title: 'Hydration Hero', description: 'Uống đủ nước 14 ngày liên tiếp', icon: Droplets, color: 'text-cyan-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' }
  ];

  const dailyProgress = [
    { day: 'Mon', calories: 1620, protein: 95, carbs: 180, fat: 62 },
    { day: 'Tue', calories: 1445, protein: 88, carbs: 165, fat: 55 },
    { day: 'Wed', calories: 1380, protein: 82, carbs: 170, fat: 58 },
    { day: 'Thu', calories: 1550, protein: 92, carbs: 185, fat: 64 },
    { day: 'Fri', calories: 1490, protein: 90, carbs: 175, fat: 60 },
    { day: 'Sat', calories: 1670, protein: 98, carbs: 195, fat: 68 },
    { day: 'Sun', calories: 1440, protein: 86, carbs: 168, fat: 56 }
  ];

  const getMaxValue = (data: any[], key: string) => Math.max(...data.map(d => d[key]));
  const getPercentage = (value: number, max: number) => (value / max) * 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
      <button onClick={goBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 via-pink-400/30 to-purple-400/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-purple-400" />
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Progress Reports
              </span>
            </h1>
            <p className="text-purple-200 text-lg">Theo dõi tiến độ và thành tích của bạn</p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 inline-flex border border-white/20">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {period === 'week' ? '7 ngày' : period === 'month' ? '30 ngày' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Tổng quan dinh dưỡng
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weeklyStats.calories.avg}</div>
                <div className="text-sm text-gray-600">Calories/ngày</div>
                <div className={`text-xs mt-1 ${weeklyStats.calories.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyStats.calories.change > 0 ? '+' : ''}{weeklyStats.calories.change}% so với tuần trước
                </div>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weeklyStats.protein.avg}g</div>
                <div className="text-sm text-gray-600">Protein</div>
                <div className={`text-xs mt-1 ${weeklyStats.protein.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyStats.protein.change > 0 ? '+' : ''}{weeklyStats.protein.change}% so với tuần trước
                </div>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Apple className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weeklyStats.carbs.avg}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
                <div className={`text-xs mt-1 ${weeklyStats.carbs.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyStats.carbs.change > 0 ? '+' : ''}{weeklyStats.carbs.change}% so với tuần trước
                </div>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weeklyStats.fat.avg}g</div>
                <div className="text-sm text-gray-600">Fat</div>
                <div className={`text-xs mt-1 ${weeklyStats.fat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyStats.fat.change > 0 ? '+' : ''}{weeklyStats.fat.change}% so với tuần trước
                </div>
              </div>
            </div>
          </div>

          {/* Daily Progress Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Tiến độ 7 ngày qua
            </h3>
            
            <div className="space-y-4">
              {dailyProgress.map((day, index) => {
                const maxCalories = getMaxValue(dailyProgress, 'calories');
                const caloriePercentage = getPercentage(day.calories, maxCalories);
                
                return (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Calories</span>
                        <span className="text-sm font-medium text-gray-800">{day.calories}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${caloriePercentage}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements & Streaks */}
        <div className="space-y-8">
          {/* Meal Streak */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Thống kê bữa ăn
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Streak hiện tại</span>
                <span className="text-2xl font-bold text-green-600">{weeklyStats.meals.streak} ngày</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng bữa ăn tuần này</span>
                <span className="text-lg font-semibold text-gray-800">{weeklyStats.meals.total} bữa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trung bình/ngày</span>
                <span className="text-lg font-semibold text-gray-800">{weeklyStats.meals.avg} bữa</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Thành tích
            </h3>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-xl border ${achievement.bgColor} ${achievement.borderColor} hover:shadow-lg transition-all duration-300 group`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-6 h-6 ${achievement.color} group-hover:scale-110 transition-transform`} />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{achievement.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Thống kê nhanh</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calories trung bình</span>
                <span className="font-medium">{weeklyStats.calories.avg} / {weeklyStats.calories.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                  style={{ width: `${(weeklyStats.calories.avg / weeklyStats.calories.target) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Protein trung bình</span>
                <span className="font-medium">{weeklyStats.protein.avg}g / {weeklyStats.protein.target}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full"
                  style={{ width: `${(weeklyStats.protein.avg / weeklyStats.protein.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}