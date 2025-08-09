import React, { useState } from 'react';
import { ArrowLeft, Target, Plus, Edit, Trash2, Calendar, TrendingUp, Award, CheckCircle, Circle, Star, Zap, Heart, Activity, Apple, Droplets, Moon, Clock, Trophy, Flag, ChevronLeft, ChevronRight, X, User, Utensils, AlertCircle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    date: string;
    meals: Meal[];
}

interface Meal {
    time: string;
    name: string;
    description: string;
    calories: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface QuestionnaireData {
    duration: string;
    goal: string;
    dietType: string;
    mealsPerDay: string;
    mealTimes: string;
    sleepSchedule: string;
    activityLevel: string;
    allergies: string;
    healthConditions: string;
    medications: string;
    favoriteFood: string;
    dislikedFood: string;
    cuisinePreference: string;
    cookingTime: string;
    budget: string;
    cookingEquipment: string;
    specialRequirements: string;
}

interface GoalsProps {
    onBack?: () => void;
}

export default function Goals({ onBack }: GoalsProps) {
    const navigate = useNavigate();
    const goBack = onBack ?? (() => navigate('/'));  // <-- fallback
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
        duration: '',
        goal: '',
        dietType: '',
        mealsPerDay: '',
        mealTimes: '',
        sleepSchedule: '',
        activityLevel: '',
        allergies: '',
        healthConditions: '',
        medications: '',
        favoriteFood: '',
        dislikedFood: '',
        cuisinePreference: '',
        cookingTime: '',
        budget: '',
        cookingEquipment: '',
        specialRequirements: ''
    });

    const [mealPlans, setMealPlans] = useState<MealPlan[]>([
        {
            id: '1',
            title: 'Kế hoạch giảm cân 4 tuần',
            description: 'Chế độ ăn low-carb với 3 bữa chính',
            duration: '4 tuần',
            goal: 'Giảm cân',
            dietType: 'Low-carb',
            mealsPerDay: 3,
            schedule: [],
            createdAt: new Date('2025-01-01'),
            status: 'active'
        }
    ]);

    const isBeforeToday = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getWeekDates = (date: Date) => {
        const week = [];
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            week.push(currentDate);
        }
        return week;
    };

    const weekDates = getWeekDates(currentWeek);
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    const timeSlots = [
        { key: 'morning', label: 'Sáng', color: 'from-yellow-400 to-orange-400' },
        { key: 'afternoon', label: 'Chiều', color: 'from-blue-400 to-cyan-400' },
        { key: 'evening', label: 'Tối', color: 'from-purple-400 to-pink-400' }
    ];

    const questions = [
        {
            step: 1,
            title: "Mục tiêu và thời gian",
            questions: [
                {
                    key: 'duration',
                    question: 'Bạn muốn theo lịch ăn uống này trong bao lâu?',
                    options: ['2 tuần', '1 tháng', '3 tháng', '6 tháng', 'Dài hạn (1 năm+)']
                },
                {
                    key: 'goal',
                    question: 'Mục tiêu ăn uống của bạn là gì?',
                    options: ['Giảm cân', 'Tăng cơ', 'Giữ dáng', 'Cải thiện sức khỏe', 'Hỗ trợ bệnh lý']
                },
                {
                    key: 'dietType',
                    question: 'Bạn có muốn theo chế độ ăn cụ thể nào không?',
                    options: ['Keto', 'Eat Clean', 'Địa Trung Hải', 'Thuần chay', 'Low-carb', 'Không có']
                }
            ]
        },
        {
            step: 2,
            title: "Thói quen và nhu cầu ăn uống",
            questions: [
                {
                    key: 'mealsPerDay',
                    question: 'Mỗi ngày bạn muốn ăn bao nhiêu bữa?',
                    options: ['2 bữa chính', '3 bữa chính', '3 bữa chính + 1 bữa phụ', '3 bữa chính + 2 bữa phụ']
                },
                {
                    key: 'mealTimes',
                    question: 'Thời gian các bữa ăn của bạn thường vào lúc nào?',
                    options: ['6h-12h-18h', '7h-12h-19h', '8h-13h-20h', 'Linh hoạt theo công việc']
                },
                {
                    key: 'sleepSchedule',
                    question: 'Bạn thường dậy lúc mấy giờ và đi ngủ lúc mấy giờ?',
                    options: ['5h-21h', '6h-22h', '7h-23h', '8h-24h', 'Không cố định']
                },
                {
                    key: 'activityLevel',
                    question: 'Mức độ hoạt động thể chất của bạn như thế nào?',
                    options: ['Ngồi nhiều, ít vận động', 'Vận động nhẹ 1-2 lần/tuần', 'Tập gym thường xuyên', 'Vận động viên/hoạt động cao']
                }
            ]
        },
        {
            step: 3,
            title: "Tình trạng sức khỏe và dị ứng",
            questions: [
                {
                    key: 'allergies',
                    question: 'Bạn có dị ứng với thực phẩm nào không?',
                    options: ['Không có', 'Hải sản', 'Sữa và chế phẩm từ sữa', 'Đậu phộng', 'Gluten', 'Khác']
                },
                {
                    key: 'healthConditions',
                    question: 'Bạn có đang mắc các bệnh lý nào không?',
                    options: ['Không có', 'Tiểu đường', 'Cao huyết áp', 'Gan nhiễm mỡ', 'Dạ dày', 'Khác']
                },
                {
                    key: 'medications',
                    question: 'Bạn có đang dùng thuốc hay thực phẩm chức năng nào không?',
                    options: ['Không có', 'Thuốc điều trị bệnh lý', 'Vitamin tổng hợp', 'Protein powder', 'Khác']
                }
            ]
        },
        {
            step: 4,
            title: "Thực phẩm yêu thích và kiêng kỵ",
            questions: [
                {
                    key: 'favoriteFood',
                    question: 'Bạn thích ăn những loại thực phẩm nào?',
                    options: ['Thịt và hải sản', 'Rau củ quả', 'Ngũ cốc và tinh bột', 'Sữa và chế phẩm', 'Tất cả']
                },
                {
                    key: 'dislikedFood',
                    question: 'Có món nào bạn không thích hoặc không thể ăn không?',
                    options: ['Không có', 'Rau xanh', 'Hải sản', 'Thịt đỏ', 'Đồ chua cay', 'Khác']
                },
                {
                    key: 'cuisinePreference',
                    question: 'Bạn muốn chế độ ăn bao gồm món Việt hay có thể kết hợp món Tây, Nhật, Hàn,...?',
                    options: ['Chỉ món Việt', 'Chủ yếu món Việt + ít món nước ngoài', 'Kết hợp đa dạng', 'Ưu tiên món Tây/Nhật/Hàn']
                }
            ]
        },
        {
            step: 5,
            title: "Điều kiện và yêu cầu khác",
            questions: [
                {
                    key: 'cookingTime',
                    question: 'Bạn có thời gian nấu ăn không, hay cần thực đơn đơn giản/dễ mua bên ngoài?',
                    options: ['Có thời gian nấu ăn', 'Nấu đơn giản 15-30 phút', 'Chủ yếu mua ngoài', 'Kết hợp nấu và mua']
                },
                {
                    key: 'budget',
                    question: 'Bạn có ngân sách cụ thể cho mỗi ngày/tuần/tháng không?',
                    options: ['Dưới 100k/ngày', '100-200k/ngày', '200-300k/ngày', 'Trên 300k/ngày', 'Không giới hạn']
                },
                {
                    key: 'cookingEquipment',
                    question: 'Bạn có thiết bị nấu ăn nào?',
                    options: ['Bếp gas cơ bản', 'Bếp gas + lò vi sóng', 'Đầy đủ thiết bị (nồi chiên không dầu, máy xay,...)', 'Không có thiết bị nấu ăn']
                },
                {
                    key: 'specialRequirements',
                    question: 'Bạn có yêu cầu gì đặc biệt khác không?',
                    options: ['Không có', 'Ăn chay vào ngày rằm, mồng 1', 'Cần tăng cường canxi', 'Cần giảm muối', 'Khác']
                }
            ]
        }
    ];

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleQuestionnaireSubmit = () => {
        setShowQuestionnaireModal(false);
        setShowConfirmationModal(true);
    };

    const handleConfirmPlan = () => {
        // Generate meal plan based on questionnaire data
        const newPlan: MealPlan = {
            id: Date.now().toString(),
            title: `Kế hoạch ${questionnaireData.goal} - ${questionnaireData.duration}`,
            description: `Chế độ ăn ${questionnaireData.dietType} với ${questionnaireData.mealsPerDay}`,
            duration: questionnaireData.duration,
            goal: questionnaireData.goal,
            dietType: questionnaireData.dietType,
            mealsPerDay: parseInt(questionnaireData.mealsPerDay.charAt(0)),
            schedule: generateMealSchedule(questionnaireData, currentWeek),
            createdAt: new Date(),
            status: 'active'
        };

        setMealPlans([...mealPlans, newPlan]);
        setShowConfirmationModal(false);
        setQuestionnaireData({
            duration: '',
            goal: '',
            dietType: '',
            mealsPerDay: '',
            mealTimes: '',
            sleepSchedule: '',
            activityLevel: '',
            allergies: '',
            healthConditions: '',
            medications: '',
            favoriteFood: '',
            dislikedFood: '',
            cuisinePreference: '',
            cookingTime: '',
            budget: '',
            cookingEquipment: '',
            specialRequirements: ''
        });
        setCurrentStep(1);
    };

    const generateMealSchedule = (data: QuestionnaireData, baseDate: Date): MealSchedule[] => {
        const week = getWeekDates(baseDate); // Tuần đang xem

        return week.map((date, i) => ({
            day: dayNames[i],
            date: date.toISOString().split('T')[0], // 'yyyy-mm-dd' định dạng chuẩn
            meals: [
                {
                    time: '7:00',
                    name: 'Phở gà',
                    description: 'Phở gà với rau thơm',
                    calories: 350,
                    type: 'breakfast'
                },
                {
                    time: '12:00',
                    name: 'Cơm gà nướng',
                    description: 'Cơm gà nướng với salad',
                    calories: 450,
                    type: 'lunch'
                },
                {
                    time: '18:00',
                    name: 'Canh chua cá',
                    description: 'Canh chua cá với rau muống',
                    calories: 300,
                    type: 'dinner'
                }
            ]
        }));
    };

    const getMealsForDayAndTime = (date: Date, timeSlot: string) => {
        const activePlan = mealPlans.find(plan => plan.status === 'active');
        if (!activePlan) return [];

        const dateStr = date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
        const daySchedule = activePlan.schedule.find(schedule => schedule.date === dateStr);
        if (!daySchedule) return [];

        return daySchedule.meals.filter(meal => {
            if (timeSlot === 'morning') return meal.type === 'breakfast';
            if (timeSlot === 'afternoon') return meal.type === 'lunch';
            if (timeSlot === 'evening') return meal.type === 'dinner';
            return false;
        });
    };

    return (
        <div className="w-full py-4 px-2">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <button onClick={goBack} className="inline-flex items-center gap-2 text-white hover:text-cyan-300">F
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Quay lại Dashboard</span>
                </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                    Lịch trình ăn uống theo tuần
                </h1>
                <p className="text-blue-200 text-lg mt-2">Quản lý và theo dõi chế độ ăn uống khoa học</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto px-4">
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                    <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-green-200/60 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{mealPlans.filter(p => p.status === 'completed').length}</p>
                                <p className="text-green-600 font-medium text-sm">Hoàn thành</p>
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
                                <p className="text-2xl font-bold text-gray-800">{mealPlans.filter(p => p.status === 'active').length}</p>
                                <p className="text-blue-600 font-medium text-sm">Đang thực hiện</p>
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
                                <p className="text-2xl font-bold text-gray-800">25%</p>
                                <p className="text-purple-600 font-medium text-sm">Tiến độ tuần</p>
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
                                <p className="text-2xl font-bold text-gray-800">2</p>
                                <p className="text-orange-600 font-medium text-sm">Ưu tiên cao</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Goal Button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setShowQuestionnaireModal(true)}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    <Plus className="w-6 h-6" />
                    <span className="font-semibold text-lg">Thêm mục tiêu ăn uống</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-2">
                {/* Week Navigation */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        onClick={() => navigateWeek('prev')}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        Tuần {Math.ceil(weekDates[0].getDate() / 7)} - Tháng {weekDates[0].getMonth() + 1}, {weekDates[0].getFullYear()}
                    </h2>
                    <button
                        onClick={() => navigateWeek('next')}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-white/30 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-8 border-b border-gray-200">
                            <div className="p-4 bg-yellow-50 border-r border-gray-200">
                                <div className="text-sm font-medium text-gray-600 text-center">Bữa ăn</div>
                            </div>
                            {weekDates.map((date, index) => (
                                <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="text-lg font-bold text-blue-600">
                                        {dayNames[index]}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {formatDate(date)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        <div className="divide-y divide-gray-200">
                            {timeSlots.map((timeSlot) => (
                                <div key={timeSlot.key} className="grid grid-cols-8 min-h-[120px]">
                                    <div className="p-4 bg-yellow-50 border-r border-gray-200 flex items-center justify-center">
                                        <div className={`text-sm font-semibold bg-gradient-to-r ${timeSlot.color} bg-clip-text text-transparent`}>
                                            {timeSlot.label}
                                        </div>
                                    </div>
                                    {weekDates.map((date, dayIndex) => {
                                        const dayMeals = getMealsForDayAndTime(date, timeSlot.key);
                                        const shouldShow = dayMeals.length > 0 || !isBeforeToday(weekDates[dayIndex]);
                                        if (!shouldShow) return <div key={dayIndex} className="border-r border-gray-200 last:border-r-0"></div>;

                                        return (
                                            <div key={dayIndex} className="p-2 border-r border-gray-200 last:border-r-0 min-h-[120px]">
                                                <div className="space-y-2">
                                                    {dayMeals.map((meal, mealIndex) => (
                                                        <div
                                                            key={mealIndex}
                                                            className="relative p-3 rounded-lg bg-green-50 border-l-4 border-green-500 cursor-pointer transition-all duration-200 hover:shadow-lg"
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                    <Utensils className="w-3 h-3 text-white" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium text-sm leading-tight text-gray-800">
                                                                        {meal.name}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-600 mt-1 leading-tight">
                                                                        {meal.description}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 mt-2">
                                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                                        <span className="text-xs text-gray-500">{meal.time}</span>
                                                                        <span className="text-xs text-gray-500 ml-2">{meal.calories} kcal</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Questionnaire Modal */}
            {showQuestionnaireModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Tạo kế hoạch ăn uống</h2>
                                    <p className="text-gray-600 mt-1">Bước {currentStep} / {questions.length}</p>
                                </div>
                                <button
                                    onClick={() => setShowQuestionnaireModal(false)}
                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentStep / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {questions.map((section) => (
                                section.step === currentStep && (
                                    <div key={section.step}>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-6">{section.title}</h3>
                                        <div className="space-y-6">
                                            {section.questions.map((q) => (
                                                <div key={q.key}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        {q.question}
                                                    </label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {q.options.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => setQuestionnaireData({
                                                                    ...questionnaireData,
                                                                    [q.key]: option
                                                                })}
                                                                className={`p-3 text-left rounded-lg border-2 transition-all duration-200 ${questionnaireData[q.key as keyof QuestionnaireData] === option
                                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-between">
                            <button
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                disabled={currentStep === 1}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Quay lại
                            </button>

                            {currentStep < questions.length ? (
                                <button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:scale-105 transition-transform"
                                >
                                    Tiếp theo
                                </button>
                            ) : (
                                <button
                                    onClick={handleQuestionnaireSubmit}
                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform"
                                >
                                    Hoàn thành
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Xác nhận thông tin</h2>
                            <p className="text-gray-600 mt-1">Vui lòng kiểm tra lại thông tin trước khi tạo kế hoạch</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(questionnaireData).map(([key, value]) => {
                                    if (!value) return null;

                                    const questionData = questions
                                        .flatMap(section => section.questions)
                                        .find(q => q.key === key);

                                    return (
                                        <div key={key} className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-2">
                                                {questionData?.question}
                                            </h4>
                                            <p className="text-blue-600 font-semibold">{value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-between">
                            <button
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    setShowQuestionnaireModal(true);
                                }}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Chỉnh sửa
                            </button>

                            <button
                                onClick={handleConfirmPlan}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform font-semibold"
                            >
                                Tạo kế hoạch ăn uống
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}