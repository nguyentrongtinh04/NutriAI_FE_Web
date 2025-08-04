import React, { useState } from 'react';
import { ArrowLeft, Target, Plus, Edit, Trash2, Calendar, TrendingUp, Award, CheckCircle, Circle, Star, Zap, Heart, Activity, Apple, Droplets, Moon, Clock, Trophy, Flag } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    description: string;
    category: 'fitness' | 'nutrition' | 'wellness' | 'health';
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused';
    createdAt: string;
}

interface GoalsProps {
    onBack: () => void;
}

export default function Goals({ onBack }: GoalsProps) {
    const [goals, setGoals] = useState<Goal[]>([
        {
            id: '1',
            title: 'Daily Water Intake',
            description: 'Drink at least 8 glasses of water daily to stay hydrated',
            category: 'wellness',
            targetValue: 8,
            currentValue: 5,
            unit: 'glasses',
            deadline: '2025-02-28',
            priority: 'high',
            status: 'active',
            createdAt: '2025-01-01'
        },
        {
            id: '2',
            title: 'Weekly Exercise',
            description: 'Complete 5 workout sessions per week',
            category: 'fitness',
            targetValue: 5,
            currentValue: 3,
            unit: 'sessions',
            deadline: '2025-03-31',
            priority: 'high',
            status: 'active',
            createdAt: '2025-01-01'
        },
        {
            id: '3',
            title: 'Weight Loss',
            description: 'Lose 10kg through healthy diet and exercise',
            category: 'health',
            targetValue: 10,
            currentValue: 3,
            unit: 'kg',
            deadline: '2025-06-30',
            priority: 'medium',
            status: 'active',
            createdAt: '2025-01-01'
        },
        {
            id: '4',
            title: 'Sleep Schedule',
            description: 'Get 8 hours of quality sleep every night',
            category: 'wellness',
            targetValue: 8,
            currentValue: 6,
            unit: 'hours',
            deadline: '2025-12-31',
            priority: 'medium',
            status: 'active',
            createdAt: '2025-01-01'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'fitness' | 'nutrition' | 'wellness' | 'health'>('all');

    const categoryConfig = {
        fitness: { icon: Activity, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-200/50', textColor: 'text-blue-600' },
        nutrition: { icon: Apple, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-200/50', textColor: 'text-green-600' },
        wellness: { icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'from-pink-50 to-rose-50', borderColor: 'border-pink-200/50', textColor: 'text-pink-600' },
        health: { icon: Target, color: 'from-purple-500 to-indigo-500', bgColor: 'from-purple-50 to-indigo-50', borderColor: 'border-purple-200/50', textColor: 'text-purple-600' }
    };

    const priorityConfig = {
        low: { color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Low' },
        medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Medium' },
        high: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'High' }
    };

    const filteredGoals = activeFilter === 'all' ? goals : goals.filter(goal => goal.category === activeFilter);
    const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'from-green-500 to-emerald-500';
        if (progress >= 75) return 'from-blue-500 to-cyan-500';
        if (progress >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };
    const updateGoalProgress = (goalId: string, newValue: number) => {
        setGoals(goals.map(goal => goal.id === goalId
            ? { ...goal, currentValue: newValue, status: newValue >= goal.targetValue ? 'completed' : 'active' }
            : goal));
    };

    return (
        <div className="w-full py-4 px-2">
            {/* Back to Dashboard */}
            <div className="mb-6">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-white hover:text-cyan-300 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Dashboard</span>
                </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                    Health Goals
                </h1>
                <p className="text-blue-200 text-lg mt-2">Track and achieve your health and wellness objectives</p>
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-2">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-white mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                            Health Goals
                        </span>
                    </h1>
                    <p className="text-blue-200 text-lg">Track and achieve your health and wellness objectives</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-green-200/60 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{goals.filter(g => g.status === 'completed').length}</p>
                                    <p className="text-green-600 font-medium text-sm">Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{goals.filter(g => g.status === 'active').length}</p>
                                    <p className="text-blue-600 font-medium text-sm">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-purple-200/60 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal.currentValue, goal.targetValue), 0) / goals.length)}%
                                    </p>
                                    <p className="text-purple-600 font-medium text-sm">Avg Progress</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-orange-200/60 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                    <Flag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{goals.filter(g => g.priority === 'high').length}</p>
                                    <p className="text-orange-600 font-medium text-sm">High Priority</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition">
                        <Plus className="w-5 h-5" />
                        Add Goal
                    </button>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGoals.map((goal) => {
                        const config = categoryConfig[goal.category];
                        const IconComponent = config.icon;
                        const progress = calculateProgress(goal.currentValue, goal.targetValue);
                        const progressColor = getProgressColor(progress);
                        const priorityStyle = priorityConfig[goal.priority];

                        return (
                            <div key={goal.id} className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-2xl blur-lg opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-300"></div>
                                <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-2xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                    {/* Goal Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                                                <IconComponent className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{goal.title}</h3>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityStyle.bgColor} ${priorityStyle.color}`}>
                                                    {priorityStyle.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setEditingGoal(goal)}
                                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Goal Description */}
                                    <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

                                    {/* Progress Section */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                            <span className="text-sm font-bold text-gray-800">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500 rounded-full`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">
                                                {goal.currentValue} / {goal.targetValue} {goal.unit}
                                            </span>
                                            {goal.status === 'completed' && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Update */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <button
                                            onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.currentValue - 1))}
                                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                                        >
                                            <span className="text-red-600 font-bold">-</span>
                                        </button>
                                        <div className="flex-1 text-center">
                                            <span className="text-lg font-bold text-gray-800">{goal.currentValue}</span>
                                            <span className="text-sm text-gray-500 ml-1">{goal.unit}</span>
                                        </div>
                                        <button
                                            onClick={() => updateGoalProgress(goal.id, goal.currentValue + 1)}
                                            className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors duration-300"
                                        >
                                            <span className="text-green-600 font-bold">+</span>
                                        </button>
                                    </div>

                                    {/* Goal Footer */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredGoals.length === 0 && (
                    <div className="text-center py-12">
                        <div className="relative inline-block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Goals Found</h3>
                        <p className="text-blue-200 mb-6">
                            {activeFilter === 'all'
                                ? "Start your health journey by creating your first goal!"
                                : `No ${activeFilter} goals found. Try a different category or create a new goal.`
                            }
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
                        >
                            Create Your First Goal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}