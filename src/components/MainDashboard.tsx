import React, { useState } from 'react';
import { Camera, ChefHat, Target, BarChart3, Calendar, Plus, Apple, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import Goals from './../pages/Goals';

export default function MainDashboard() {
    const [activeView, setActiveView] = useState<'dashboard' | 'goals'>('dashboard');

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
            onClick: () => setActiveView('goals')
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
            case 'orange': return { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'from-orange-400 to-red-500', textColor: 'text-orange-600' };
            case 'green': return { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'from-green-400 to-emerald-500', textColor: 'text-green-600' };
            case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'from-purple-400 to-pink-500', textColor: 'text-purple-600' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', iconBg: 'from-gray-400 to-gray-500', textColor: 'text-gray-600' };
        }
    };

    return (
        <main className="relative z-20 w-full px-4 py-10 pt-[105px]">
            {activeView === 'dashboard' && (
                <>
                    {/* Welcome Section and Dashboard Content Here */}
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
                </>
            )}

            {activeView === 'goals' && (
                <Goals onBack={() => setActiveView('dashboard')} />
            )}
        </main>
    );
}
