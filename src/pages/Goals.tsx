import React, { useMemo, useState } from 'react';
import {
    ArrowLeft, ChevronRight, ChevronLeft, ChevronRight as CaretRight,
    Utensils, Calendar, Clock, Target, TrendingUp, CheckCircle,
    Timer, ChefHat, FileText, BarChart3, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MealPlan {
    id: string;
    title: string;
    description: string;
    duration: string;
    goal: string;
    dietType: string;
    mealsPerDay: number;
    schedule: MealSchedule[];
    createdAt: Date;
    status: 'active' | 'completed' | 'paused';
}

interface MealSchedule {
    day: string;
    date: string; // yyyy-mm-dd
    meals: Meal[];
}

type MealStatus = 'doing' | 'done' | 'late';

interface Meal {
    time: string;
    name: string;
    description: string;
    calories: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    status: MealStatus;
}

interface GoalsProps {
    onBack?: () => void;
    previousPageLabel?: string;
}

export default function Goals({ onBack, previousPageLabel = 'Danh sách lịch trình' }: GoalsProps) {
    const navigate = useNavigate();
    const goBack = onBack ?? (() => navigate('/'));
    const location = useLocation();
    const handleBack = () => {
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate('/plans'); // fallback
        }
    };
    const planMeta = location?.state?.planMeta as { id: string; name: string; startDate: string; endDate: string } | undefined;
    
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [dayNotes, setDayNotes] = useState<Record<string, string>>({});

    // Nếu có startDate từ danh sách, set tuần đang xem = tuần chứa startDate
    React.useEffect(() => {
        if (planMeta?.startDate) setCurrentWeek(new Date(planMeta.startDate));
    }, [planMeta]);

    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const timeSlots = [
        { key: 'morning', label: 'Sáng', icon: '🌅' },
        { key: 'afternoon', label: 'Chiều', icon: '☀️' },
        { key: 'evening', label: 'Tối', icon: '🌙' },
    ] as const;

    const getWeekDates = (date: Date) => {
        const week: Date[] = [];
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            week.push(d);
        }
        return week;
    };

    const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

    const formatDateVN = (d: Date) =>
        d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const weekNumberInMonth = (d: Date) => Math.ceil(d.getDate() / 7);

    const navigateWeek = (dir: 'prev' | 'next') => {
        const nd = new Date(currentWeek);
        nd.setDate(currentWeek.getDate() + (dir === 'next' ? 7 : -7));
        setCurrentWeek(nd);
    };

    const generateHardcodedSchedule = (baseDate: Date): MealSchedule[] => {
        const days = getWeekDates(baseDate);
        const statusCycle: MealStatus[] = ['doing', 'done', 'late', 'done', 'doing', 'late', 'done'];

        return days.map((d, idx) => ({
            day: dayNames[idx],
            date: d.toISOString().split('T')[0],
            meals: [
                {
                    time: '07:00',
                    name: 'Phở gà',
                    description: 'Phở gà + rau thơm',
                    calories: 350,
                    type: 'breakfast',
                    status: statusCycle[idx],
                },
                {
                    time: '12:00',
                    name: 'Cơm gà nướng',
                    description: 'Gà nướng + salad dầu giấm',
                    calories: 450,
                    type: 'lunch',
                    status: idx % 2 === 0 ? 'done' : 'doing',
                },
                {
                    time: '18:00',
                    name: 'Canh chua cá',
                    description: 'Cá lóc + rau muống',
                    calories: 300,
                    type: 'dinner',
                    status: idx % 3 === 0 ? 'late' : 'doing',
                },
            ],
        }));
    };

    const [mealPlans] = useState<MealPlan[]>([
        {
            id: 'plan-1',
            title: planMeta?.name || 'Kế hoạch giảm cân 4 tuần',
            description: 'Low-carb nhẹ, 3 bữa chính',
            duration: '4 tuần',
            goal: 'Giảm cân',
            dietType: 'Low-carb',
            mealsPerDay: 3,
            schedule: generateHardcodedSchedule(currentWeek),
            createdAt: new Date('2025-01-01'),
            status: 'active',
        },
    ]);

    const activePlan = mealPlans.find(p => p.status === 'active') ?? mealPlans[0];

    // Tính toán thông tin cho 4 ô
    const getWeekProgress = () => {
        if (!activePlan) return { completed: 0, total: 7, percentage: 0 };

        const today = new Date();
        const currentWeekDates = getWeekDates(today);
        let completed = 0;

        currentWeekDates.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            const daySchedule = activePlan.schedule.find(s => s.date === dateStr);
            if (daySchedule) {
                const doneMeals = daySchedule.meals.filter(m => m.status === 'done').length;
                const totalMeals = daySchedule.meals.length;
                if (doneMeals === totalMeals) completed++;
            }
        });

        return { completed, total: 7, percentage: Math.round((completed / 7) * 100) };
    };

    const getNextMealTime = () => {
        if (!activePlan) return null;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todaySchedule = activePlan.schedule.find(s => s.date === todayStr);

        if (todaySchedule) {
            const nextMeal = todaySchedule.meals.find(m => m.status === 'doing');
            return nextMeal ? { time: nextMeal.time, name: nextMeal.name } : null;
        }
        return null;
    };

    const getTodayNote = () => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        return dayNotes[todayStr] || '';
    };

    const weekProgress = getWeekProgress();
    const nextMeal = getNextMealTime();
    const todayNote = getTodayNote();

    const getMealsForDayAndSlot = (date: Date, slot: typeof timeSlots[number]['key']) => {
        if (!activePlan) return [];
        const dateStr = date.toISOString().split('T')[0];
        const s = activePlan.schedule.find(x => x.date === dateStr);
        if (!s) return [];

        return s.meals.filter(m => {
            if (slot === 'morning') return m.type === 'breakfast';
            if (slot === 'afternoon') return m.type === 'lunch';
            if (slot === 'evening') return m.type === 'dinner';
            return false;
        });
    };

    const statusStyles: Record<MealStatus, { wrap: string; dot: string; label: string; glow: string }> = {
        doing: {
            wrap: 'bg-blue-50/90 border-blue-200 hover:bg-blue-100/90',
            dot: 'bg-blue-500',
            label: 'Đang làm',
            glow: 'from-blue-400/30 to-cyan-400/30'
        },
        done: {
            wrap: 'bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100/90',
            dot: 'bg-emerald-500',
            label: 'Đã làm',
            glow: 'from-emerald-400/30 to-green-400/30'
        },
        late: {
            wrap: 'bg-rose-50/90 border-rose-200 hover:bg-rose-100/90',
            dot: 'bg-rose-500',
            label: 'Trễ lịch',
            glow: 'from-rose-400/30 to-pink-400/30'
        },
    };

    return (
        <main className="relative z-20 w-full px-4 py-10 pt-[10px]">
            {/* Background Gradient Effect */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 -z-10"></div>

            {/* ===== Header / Breadcrumb ===== */}
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative">
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center gap-3 text-gray-600">
                            <button 
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 hover:text-blue-600 transition-all duration-300 group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span className="font-medium">{previousPageLabel}</span>
                            </button>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-blue-600">{activePlan?.title ?? 'Lịch trình'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Title Section ===== */}
            <div className="text-center mb-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-cyan-400/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative">
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl p-8 shadow-xl">
                        {/* Main Title with Icon */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-8 h-8 text-white animate-pulse" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                                    {activePlan?.title ?? 'Lịch trình ăn uống'}
                                </span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-lg mb-6">{activePlan?.description}</p>

                        {/* Info Tags */}
                        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-700 font-medium">{activePlan?.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-green-700 font-medium">{activePlan?.goal}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <Utensils className="w-4 h-4 text-orange-600" />
                                <span className="text-orange-700 font-medium">{activePlan?.dietType}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Info Cards Row ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Tiến độ tuần */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Tiến độ tuần</h3>
                                <p className="text-xs text-gray-600">Hoàn thành theo ngày</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span className="font-medium">{weekProgress.completed}/{weekProgress.total} ngày</span>
                                    <span className="font-bold text-green-600">{weekProgress.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                                        style={{ width: `${weekProgress.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thời gian tiếp theo */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                                <Timer className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Thời gian tiếp theo</h3>
                                <p className="text-xs text-gray-600">Bữa ăn sắp tới</p>
                            </div>
                        </div>
                        {nextMeal ? (
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-1">{nextMeal.time}</div>
                                <div className="text-sm text-gray-600 truncate bg-blue-50 px-3 py-1 rounded-full">{nextMeal.name}</div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                <div className="text-sm font-medium">Hoàn thành hôm nay</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Món ăn tiếp theo */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Món ăn tiếp theo</h3>
                                <p className="text-xs text-gray-600">Chuẩn bị sẵn sàng</p>
                            </div>
                        </div>
                        {nextMeal ? (
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-800 truncate mb-2">{nextMeal.name}</div>
                                <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Sắp đến giờ
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <div className="text-sm">Không có món tiếp theo</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ghi chú hôm nay */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:animate-bounce">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Ghi chú hôm nay</h3>
                                <p className="text-xs text-gray-600">Nhật ký cá nhân</p>
                            </div>
                        </div>
                        <div className="text-center">
                            {todayNote ? (
                                <div className="text-sm text-gray-700 line-clamp-3 bg-purple-50 p-3 rounded-xl border border-purple-200">
                                    {todayNote}
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <div className="text-sm">Chưa có ghi chú</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Week Navigation ===== */}
            <div className="flex items-center justify-center gap-6 mb-8">
                <button
                    onClick={() => navigateWeek('prev')}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    <div className="relative w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-gray-50 border border-gray-300 rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                        <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                    </div>
                </button>

                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-xl"></div>
                    <div className="relative text-center bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl px-8 py-4 shadow-xl">
                        <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-2">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Tuần {weekNumberInMonth(weekDates[0])} - Tháng {weekDates[0].getMonth() + 1}, {weekDates[0].getFullYear()}
                            </span>
                        </div>
                        <div className="text-gray-600 font-medium">
                            {formatDateVN(weekDates[0])} – {formatDateVN(weekDates[6])}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigateWeek('next')}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    <div className="relative w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-gray-50 border border-gray-300 rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                        <CaretRight className="w-6 h-6 text-gray-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </button>
            </div>

            {/* ===== Status Legend ===== */}
            <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-2xl blur"></div>
                    <div className="relative flex items-center gap-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-3 shadow-lg">
                        <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                            Đã làm
                        </span>
                        <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
                            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                            Đang làm
                        </span>
                        <span className="inline-flex items-center gap-2 text-gray-700 font-medium">
                            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                            Trễ lịch
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== Main Schedule Grid ===== */}
            <div className="relative mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 via-cyan-400/20 to-blue-400/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200 rounded-3xl overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="p-4 border-r border-gray-200">
                            <div className="text-sm font-bold text-gray-700 text-center flex items-center justify-center gap-2">
                                <Utensils className="w-5 h-5 text-blue-600" />
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Bữa ăn
                                </span>
                            </div>
                        </div>
                        {weekDates.map((date, index) => (
                            <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-lg font-bold text-gray-800">{dayNames[index]}</div>
                                <div className="text-sm text-gray-600 mt-1 bg-white/50 px-2 py-1 rounded-full">
                                    {formatDateVN(date)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Body */}
                    <div className="divide-y divide-gray-200">
                        {timeSlots.map((slot, slotIndex) => (
                            <div key={slot.key} className="grid grid-cols-8 min-h-[140px]">
                                {/* Time Slot Label */}
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-r border-gray-200 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2 animate-bounce" style={{ animationDelay: `${slotIndex * 200}ms` }}>
                                            {slot.icon}
                                        </div>
                                        <div className="text-sm font-bold text-gray-700 bg-white/70 px-3 py-1 rounded-full">
                                            {slot.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Days */}
                                {weekDates.map((date, dayIndex) => {
                                    const meals = getMealsForDayAndSlot(date, slot.key);
                                    return (
                                        <div key={dayIndex} className="p-3 border-r border-gray-200 last:border-r-0">
                                            <div className="space-y-3 h-full">
                                                {meals.map((meal, i) => {
                                                    const st = statusStyles[meal.status];
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="relative group"
                                                            style={{ animationDelay: `${(dayIndex * 100) + (i * 50)}ms` }}
                                                        >
                                                            <div className={`absolute -inset-1 bg-gradient-to-r ${st.glow} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`}></div>
                                                            <div className={`relative p-4 rounded-2xl border ${st.wrap} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 shadow-sm hover:shadow-lg`}>
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                                                                        <Utensils className="w-4 h-4 text-gray-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className={`w-3 h-3 rounded-full ${st.dot} animate-pulse`} />
                                                                            <h4 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-300">
                                                                                {meal.name}
                                                                            </h4>
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>
                                                                        <div className="flex items-center justify-between text-sm">
                                                                            <div className="flex items-center gap-2 text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                                                                                <Clock className="w-3 h-3" />
                                                                                <span className="font-medium">{meal.time}</span>
                                                                            </div>
                                                                            <div className="text-gray-500 bg-white/70 px-2 py-1 rounded-full font-medium">
                                                                                {meal.calories} kcal
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Notes Row */}
                        <div className="grid grid-cols-8 bg-gradient-to-r from-gray-50 to-blue-50">
                            <div className="p-4 border-r border-gray-200 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Ghi chú
                                    </span>
                                </span>
                            </div>
                            {weekDates.map((date, idx) => {
                                const key = date.toISOString().split('T')[0];
                                return (
                                    <div key={idx} className="p-3 border-r border-gray-200 last:border-r-0">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl opacity-0 focus-within:opacity-100 blur transition-opacity duration-300"></div>
                                            <textarea
                                                value={dayNotes[key] ?? ''}
                                                onChange={(e) =>
                                                    setDayNotes((prev) => ({ ...prev, [key]: e.target.value }))
                                                }
                                                placeholder="Viết ghi chú..."
                                                className="relative w-full min-h-[80px] text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-3 resize-y bg-white/90 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 shadow-sm focus:shadow-lg"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-16"></div>
        </main>
    );
}