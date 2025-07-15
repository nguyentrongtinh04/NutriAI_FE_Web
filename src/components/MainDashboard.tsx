import React from 'react';
import { Camera, ChefHat, Target, BarChart3, Calendar, Plus, Apple, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';

export default function MainDashboard() {
    // Sample data
    const nutritionData = {
        calories: { consumed: 1245, target: 1800, remaining: 555 },
        protein: { amount: 85, target: 100, percentage: 85 },
        carbs: { amount: 156, target: 200, percentage: 78 },
        fat: { amount: 42, target: 70, percentage: 60 }
    };

    const recentMeals = [
        {
            id: '1',
            name: 'Phở bò',
            type: 'Bữa sáng',
            time: '8:30 AM',
            calories: 520,
            protein: 25,
            carbs: 60,
            color: 'orange' as const
        },
        {
            id: '2',
            name: 'Salad cá hồi',
            type: 'Bữa trưa',
            time: '12:15 PM',
            calories: 380,
            protein: 35,
            carbs: 15,
            color: 'green' as const
        },
        {
            id: '3',
            name: 'Smoothie việt quất',
            type: 'Snack',
            time: '3:00 PM',
            calories: 180,
            protein: 8,
            carbs: 35,
            color: 'purple' as const
        }
    ];

    const actionCards = [
        {
            id: 'scan',
            title: 'Scan Meal',
            description: 'Chụp ảnh để phân tích',
            icon: Camera,
            gradient: 'from-green-500 to-emerald-600',
            glowColor: 'from-green-400 to-emerald-500',
            isPrimary: true
        },
        {
            id: 'menu',
            title: 'Menu Suggestions',
            description: 'Thực đơn cá nhân hóa',
            icon: ChefHat,
            gradient: 'from-orange-400/30 to-red-400/30',
            iconColor: 'text-orange-500'
        },
        {
            id: 'goals',
            title: 'Goals',
            description: 'Thiết lập mục tiêu mới',
            icon: Target,
            gradient: 'from-blue-400/30 to-cyan-400/30',
            iconColor: 'text-blue-500'
        },
        {
            id: 'reports',
            title: 'Reports',
            description: 'Xem tiến độ chi tiết',
            icon: BarChart3,
            gradient: 'from-purple-400/30 to-pink-400/30',
            iconColor: 'text-purple-500'
        }
    ];

    const getIcon = (color: string) => {
        switch (color) {
            case 'orange': return ChefHat;
            case 'green': return Apple;
            case 'purple': return Sparkles;
            default: return ChefHat;
        }
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'orange':
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    iconBg: 'from-orange-400 to-red-500',
                    textColor: 'text-orange-600'
                };
            case 'green':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    iconBg: 'from-green-400 to-emerald-500',
                    textColor: 'text-green-600'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    iconBg: 'from-purple-400 to-pink-500',
                    textColor: 'text-purple-600'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    iconBg: 'from-gray-400 to-gray-500',
                    textColor: 'text-gray-600'
                };
        }
    };

    return (
        <main className="relative z-20 w-full px-16 py-10 pt-[105px]">
            {/* Welcome Section with Enhanced Effects */}
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="animate-bounce">👋</span>
                        <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                            Welcome back, ADMIN!
                        </span>
                    </h1>
                    <p className="text-blue-200 text-lg animate-fade-in">Today is a great day to maintain a healthy diet</p>
                </div>
            </div>

            {/* Enhanced Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {actionCards.map((card, index) => {
                    const Icon = card.icon;

                    if (card.isPrimary) {
                        return (
                            <div key={card.id} className="relative md:col-span-1 group">
                                <div className={`absolute -inset-3 bg-gradient-to-r ${card.glowColor} rounded-2xl blur-xl opacity-60 animate-pulse group-hover:opacity-80 transition-all duration-500`}></div>
                                <div className={`relative bg-gradient-to-r ${card.gradient} rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <Icon className="w-12 h-12 mb-4 animate-pulse relative z-10" />
                                    <h3 className="text-xl font-bold mb-2 relative z-10">{card.title}</h3>
                                    <p className="text-green-100 text-sm relative z-10">{card.description}</p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={card.id} className="relative group">
                            <div className={`absolute -inset-2 bg-gradient-to-r ${card.gradient} rounded-2xl blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500`} style={{ animationDelay: `${index * 200}ms` }}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1">
                                <Icon className={`w-10 h-10 ${card.iconColor} mb-4 group-hover:animate-bounce`} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-gray-600 text-sm">{card.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid - 70% Left, 30% Right */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Left Column - 70% (7/10) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Today Overview with Enhanced Effects */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse group-hover:from-blue-400/30 group-hover:via-cyan-400/40 group-hover:to-blue-400/30 transition-all duration-700"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                                        <BarChart3 className="w-4 h-4 text-white" />
                                    </div>
                                    Today's Overview
                                </h2>
                                <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-4 py-2 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">Thứ 2, 20/01/2025</span>
                                </div>
                            </div>

                            {/* Enhanced Nutrition Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="text-center group/stat">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl blur-lg opacity-0 group-hover/stat:opacity-100 transition-all duration-300"></div>
                                        <div className="relative bg-orange-50 p-4 rounded-xl border border-orange-200 transform group-hover/stat:scale-105 transition-all duration-300">
                                            <div className="text-3xl font-bold text-orange-600 animate-pulse">{nutritionData.calories.consumed.toLocaleString()}</div>
                                            <div className="text-sm text-gray-600 font-medium">Calories Consumed</div>
                                            <div className="text-xs text-orange-500 mt-1">Remaining: {nutritionData.calories.remaining}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center group/stat">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur-lg opacity-0 group-hover/stat:opacity-100 transition-all duration-300"></div>
                                        <div className="relative bg-blue-50 p-4 rounded-xl border border-blue-200 transform group-hover/stat:scale-105 transition-all duration-300">
                                            <div className="text-3xl font-bold text-blue-600 animate-pulse">{nutritionData.protein.amount}g</div>
                                            <div className="text-sm text-gray-600 font-medium">Protein</div>
                                            <div className="text-xs text-blue-500 mt-1">{nutritionData.protein.percentage}% mục tiêu</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center group/stat">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur-lg opacity-0 group-hover/stat:opacity-100 transition-all duration-300"></div>
                                        <div className="relative bg-green-50 p-4 rounded-xl border border-green-200 transform group-hover/stat:scale-105 transition-all duration-300">
                                            <div className="text-3xl font-bold text-green-600 animate-pulse">{nutritionData.carbs.amount}g</div>
                                            <div className="text-sm text-gray-600 font-medium">Carbs</div>
                                            <div className="text-xs text-green-500 mt-1">{nutritionData.carbs.percentage}% mục tiêu</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center group/stat">
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-xl blur-lg opacity-0 group-hover/stat:opacity-100 transition-all duration-300"></div>
                                        <div className="relative bg-red-50 p-4 rounded-xl border border-red-200 transform group-hover/stat:scale-105 transition-all duration-300">
                                            <div className="text-3xl font-bold text-red-600 animate-pulse">{nutritionData.fat.amount}g</div>
                                            <div className="text-sm text-gray-600 font-medium">Fat</div>
                                            <div className="text-xs text-red-500 mt-1">{nutritionData.fat.percentage}% mục tiêu</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Progress Bars */}
                            <div className="space-y-6">
                                <div className="group/progress">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Calo</span>
                                        <span className="text-gray-800 font-bold">{nutritionData.calories.consumed.toLocaleString()} / {nutritionData.calories.target.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover/progress:animate-pulse"
                                            style={{ width: `${Math.min((nutritionData.calories.consumed / nutritionData.calories.target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="group/progress">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Protein</span>
                                        <span className="text-gray-800 font-bold">{nutritionData.protein.amount}g / {nutritionData.protein.target}g</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover/progress:animate-pulse"
                                            style={{ width: `${Math.min(nutritionData.protein.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Recent Meals */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-cyan-400/20 rounded-3xl blur-2xl animate-pulse group-hover:from-cyan-400/30 group-hover:via-blue-400/40 group-hover:to-cyan-400/30 transition-all duration-700"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-cyan-200/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                                        <ChefHat className="w-4 h-4 text-white" />
                                    </div>
                                    Recent Meals
                                </h2>
                                <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                                    <Plus className="w-4 h-4" />
                                    Add Meal
                                </button>
                            </div>

                            <div className="space-y-6">
                                {recentMeals.map((meal, index) => {
                                    const Icon = getIcon(meal.color);
                                    const colors = getColorClasses(meal.color);

                                    return (
                                        <div key={meal.id} className={`flex items-center justify-between p-6 ${colors.bg} rounded-xl border ${colors.border} group/meal hover:shadow-lg transition-all duration-300 transform hover:scale-102`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 bg-gradient-to-r ${colors.iconBg} rounded-xl flex items-center justify-center group-hover/meal:animate-bounce`}>
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{meal.name}</h3>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {meal.type} • {meal.time}
                                                    </p>
                                                    <p className={`text-sm font-bold ${colors.textColor} flex items-center gap-1 mt-1`}>
                                                        <Sparkles className="w-3 h-3" />
                                                        {meal.calories} calo
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                    Protein: {meal.protein}g
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                    Carbs: {meal.carbs}g
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - 30% (3/10) */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Enhanced Weekly Progress */}
                    <div className="relative group">
                        <div className="absolute -inset-3 bg-gradient-to-r from-green-400/20 via-blue-400/30 to-green-400/20 rounded-2xl blur-xl animate-pulse group-hover:from-green-400/30 group-hover:via-blue-400/40 group-hover:to-green-400/30 transition-all duration-700"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 shadow-xl hover:shadow-green-500/20 transition-all duration-500">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500 animate-pulse" />
                                This Week's Progress
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center group-hover/item:animate-spin">
                                            <BarChart3 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Calo trung bình</span>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">1,420</span>
                                </div>

                                <div className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center group-hover/item:animate-pulse">
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Goal Days Achieved</span>
                                    </div>
                                    <span className="font-bold text-gray-800 text-lg">5/7</span>
                                </div>

                                <div className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center group-hover/item:animate-bounce">
                                            <span className="text-white text-sm">❤️</span>
                                        </div>
                                        <span className="text-gray-700 font-medium">Health Score</span>
                                    </div>
                                    <span className="font-bold text-green-600 text-lg">85/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Achievements */}
                    <div className="relative group">
                        <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/20 via-orange-400/30 to-yellow-400/20 rounded-2xl blur-xl animate-pulse group-hover:from-yellow-400/30 group-hover:via-orange-400/40 group-hover:to-yellow-400/30 transition-all duration-700"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/50 shadow-xl hover:shadow-yellow-500/20 transition-all duration-500">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500 animate-pulse" />
                                Achievements
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 group/achievement hover:bg-yellow-100 transition-all duration-300 transform hover:scale-105">
                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover/achievement:animate-spin">
                                        <span className="text-white font-bold text-sm">🏆</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Streak 7 ngày</div>
                                        <div className="text-xs text-gray-600">Đạt mục tiêu protein</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 group/achievement hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center group-hover/achievement:animate-bounce">
                                        <span className="text-white font-bold text-sm">⚡</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Healthy Choice</div>
                                        <div className="text-xs text-gray-600">50 bữa ăn lành mạnh</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 group/achievement hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center group-hover/achievement:animate-pulse">
                                        <span className="text-white font-bold text-sm">🕐</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">Early Bird</div>
                                        <div className="text-xs text-gray-600">Ăn sáng đúng giờ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced AI Suggestions */}
                    <div className="relative group">
                        <div className="absolute -inset-3 bg-gradient-to-r from-purple-400/20 via-pink-400/30 to-purple-400/20 rounded-2xl blur-xl animate-pulse group-hover:from-purple-400/30 group-hover:via-pink-400/40 group-hover:to-purple-400/30 transition-all duration-700"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-xl hover:shadow-purple-500/20 transition-all duration-500">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500 animate-spin" />
                                Dinner Suggestions
                            </h2>

                            <div className="space-y-4">
                                <div className="p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 group/suggestion hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <ChefHat className="w-4 h-4 text-orange-500 group-hover/suggestion:animate-bounce" />
                                        Cơm gà nướng
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">Matches your goals</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-600 font-bold flex items-center gap-1">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                                            450 calo
                                        </span>
                                        <span className="text-blue-600 font-bold flex items-center gap-1">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                            30g protein
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 group/suggestion hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <Apple className="w-4 h-4 text-green-500 group-hover/suggestion:animate-bounce" />
                                        Canh chua cá
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">Low calorie, rich in vitamins</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-orange-600 font-bold flex items-center gap-1">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                                            320 calo
                                        </span>
                                        <span className="text-blue-600 font-bold flex items-center gap-1">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                            25g protein
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}