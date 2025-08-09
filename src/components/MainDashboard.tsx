import React from 'react';
import { Camera, ChefHat, Target, BarChart3, Plus, Apple, Sparkles, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MainDashboard() {
    const navigate = useNavigate();

    const nutritionData = {
        calories: { consumed: 1245, target: 1800, remaining: 555 },
        protein: { amount: 85, target: 100, percentage: 85 },
        carbs: { amount: 156, target: 200, percentage: 78 },
        fat: { amount: 42, target: 70, percentage: 60 }
    };

    const recentMeals = [
        { id: '1', name: 'Phở bò', type: 'Bữa sáng', time: '8:30 AM', calories: 520, protein: 25, carbs: 60, color: 'orange' as const },
        { id: '2', name: 'Salad cá hồi', type: 'Bữa trưa', time: '12:15 PM', calories: 380, protein: 35, carbs: 15, color: 'green' as const },
        { id: '3', name: 'Smoothie việt quất', type: 'Snack', time: '3:00 PM', calories: 180, protein: 8, carbs: 35, color: 'purple' as const }
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
            iconColor: 'text-blue-500',
            onClick: () => navigate('/plans', { state: { from: '/home' } })
        },
        {
            id: 'reports',
            title: 'Reports',
            description: 'Xem tiến độ chi tiết',
            icon: BarChart3,
            gradient: 'from-purple-400/30 to-pink-400/30',
            iconColor: 'text-purple-500',
            onClick: () => navigate('/reports')
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
            case 'orange': return { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'from-orange-400 to-red-500', textColor: 'text-orange-600' };
            case 'green': return { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'from-green-400 to-emerald-500', textColor: 'text-green-600' };
            case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'from-purple-400 to-pink-500', textColor: 'text-purple-600' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', iconBg: 'from-gray-400 to-gray-500', textColor: 'text-gray-600' };
        }
    };

    return (
        <main className="relative z-20 w-full px-4 py-10 pt-[105px]">
            {/* Welcome Section */}
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

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {actionCards.map((card, index) => {
                    const Icon = card.icon;
                    const isClickable = !!card.onClick;

                    return (
                        <div
                            key={card.id}
                            className="relative group"
                            onClick={card.onClick}
                            style={{ cursor: isClickable ? 'pointer' : 'default' }}
                        >
                            <div className={`absolute -inset-2 bg-gradient-to-r ${card.gradient} rounded-2xl blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-all duration-500`} style={{ animationDelay: `${index * 200}ms` }}></div>
                            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                                <Icon className={`w-10 h-10 ${card.iconColor || 'text-gray-600'} mb-4 group-hover:animate-bounce`} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-gray-600 text-sm">{card.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nutrition Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        Nutrition Overview
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Calories</span>
                            <span className="text-lg font-semibold">{nutritionData.calories.consumed} / {nutritionData.calories.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${(nutritionData.calories.consumed / nutritionData.calories.target) * 100}%` }}
                            ></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center">
                                <div className="text-lg font-bold text-red-600">{nutritionData.protein.amount}g</div>
                                <div className="text-sm text-gray-600">Protein</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${nutritionData.protein.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600">{nutritionData.carbs.amount}g</div>
                                <div className="text-sm text-gray-600">Carbs</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${nutritionData.carbs.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-yellow-600">{nutritionData.fat.amount}g</div>
                                <div className="text-sm text-gray-600">Fat</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${nutritionData.fat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Recent Meals
                    </h2>
                    
                    <div className="space-y-4">
                        {recentMeals.map((meal, index) => {
                            const Icon = getIcon(meal.color);
                            const colors = getColorClasses(meal.color);
                            
                            return (
                                <div 
                                    key={meal.id} 
                                    className={`p-4 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-lg transition-all duration-300`}
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.iconBg} flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-gray-800">{meal.name}</h3>
                                                <span className="text-sm text-gray-600">{meal.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm px-2 py-1 rounded-full ${colors.bg} ${colors.textColor}`}>
                                                    {meal.type}
                                                </span>
                                                <div className="text-sm text-gray-600">
                                                    {meal.calories} cal • {meal.protein}g protein
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Add New Meal
                    </button>
                </div>
            </div>
        </main>
    );
}