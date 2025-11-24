import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    User,
    Activity,
    Heart,
    Target,
    Calendar,
    Utensils,
    DollarSign,
    FileText,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
    generateNutritionThunk,
    generateMealPlanThunk,
} from '../../redux/slices/planSlice';
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3 | 4;

export default function CreatePlanPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.plan);
    const navigate = useNavigate();
    const [creatingPlan, setCreatingPlan] = useState(false);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [nutritionData, setNutritionData] = useState<any>(null);
    const { profile } = useSelector((state: RootState) => state.user);

    const [personalInfo, setPersonalInfo] = useState({
        height: Number(profile?.height) || 170,
        weight: Number(profile?.weight) || 70,
        age: profile?.DOB ? new Date().getFullYear() - new Date(profile.DOB).getFullYear() : 25,
        gender: profile?.gender === "MALE" ? "male" :
            profile?.gender === "FEMALE" ? "female" : "",
        activityLevel: '',
        medicalConditions: '',
    });

    const [goals, setGoals] = useState({
        goal: '',
        change: 0,
        targetWeight: 0,
        weeklyChange: 0.5,
        deadline: '',
    });

    const [dietInfo, setDietInfo] = useState({
        allergies: '',
        preferences: '',
        mealsPerDay: null as 1 | 2 | 3 | 4 | 5 | null,
        mealTimes: {} as Record<string, string>,
        budget: 0,
    });

    const [planRequirements, setPlanRequirements] = useState({
        cookingStyle: '',
        planDays: null as 2 | 3 | 4 | 5 | null,
        notes: '',
    });

    const activityLevels = [
        { value: 'sedentary', label: 'Ít vận động', description: 'Ngồi nhiều, ít hoạt động thể chất' },
        { value: 'light', label: 'Nhẹ', description: 'Tập nhẹ 1-3 ngày/tuần' },
        { value: 'moderate', label: 'Vừa phải', description: 'Tập vừa 3-5 ngày/tuần' },
        { value: 'high', label: 'Cao', description: 'Tập nặng 6-7 ngày/tuần' },
        { value: 'veryHigh', label: 'Rất cao', description: 'Vận động viên, tập 2 lần/ngày' },
    ];

    const goalOptions = [
        { value: 'lose', label: 'Giảm cân', icon: '📉', description: 'Giảm cân an toàn và bền vững' },
        { value: 'gain', label: 'Tăng cân', icon: '📈', description: 'Tăng cân và xây dựng cơ bắp' },
        { value: 'maintain', label: 'Duy trì vóc dáng', icon: '⚖️', description: 'Giữ cân nặng và hình thể hiện tại' },
        { value: 'improve', label: 'Cải thiện sức khỏe', icon: '💪', description: 'Ăn uống lành mạnh để cải thiện sức khỏe' },
        { value: 'support', label: 'Hỗ trợ bệnh lý', icon: '❤️‍🩹', description: 'Điều chỉnh chế độ ăn cho tình trạng sức khỏe cụ thể' },
    ];

    const cookingStyles = [
        { value: 'homeCook', label: 'Tự nấu', icon: '👨‍🍳', description: 'Tự chuẩn bị món ăn tại nhà' },
        { value: 'eatOut', label: 'Ăn ngoài', icon: '🍽️', description: 'Ăn tại nhà hàng/quán ăn' },
        { value: 'mixed', label: 'Kết hợp', icon: '🔄', description: 'Kết hợp cả hai phương án' },
    ];

    const mealTimePresets: Record<string, string[]> = {
        '3 meals': ['Morning', 'Noon', 'Evening'],
        '4 meals': ['Morning', 'Noon', 'Afternoon', 'Evening'],
        '5 meals': ['Morning', 'Mid-morning', 'Noon', 'Afternoon', 'Evening'],
    };

    const defaultMealTimes: Record<string, Record<string, string>> = {
        '3 meals': { Morning: '07:00', Noon: '12:00', Evening: '19:00' },
        '4 meals': { Morning: '07:00', Noon: '12:00', Afternoon: '15:00', Evening: '19:00' },
        '5 meals': {
            Morning: '07:00',
            'Mid-morning': '10:00',
            Noon: '12:00',
            Afternoon: '15:00',
            Evening: '19:00',
        },
    };

    const canProceedStep1 = personalInfo.gender && personalInfo.activityLevel;
    const canProceedStep2 =
        goals.goal &&
        goals.deadline &&
        (
            goals.goal === 'maintain' ||
            goals.goal === 'improve' ||
            goals.goal === 'support' ||
            (goals.goal !== 'maintain' && goals.goal !== 'improve' && goals.goal !== 'support' && goals.change > 0)
        );
    const canProceedStep3 = dietInfo.mealsPerDay !== null;
    const canProceedStep4 = planRequirements.cookingStyle && planRequirements.planDays;

    const mapGender = (g: string) => (g === 'male' ? 'nam' : g === 'female' ? 'nữ' : '');
    const mapActivity = (a: string) => {
        switch (a) {
            case 'sedentary': return 'ít';
            case 'light': return 'nhẹ';
            case 'moderate': return 'vừa';
            case 'high': return 'cao';
            case 'veryHigh': return 'rất cao';
            default: return a;
        }
    };
    const mapGoal = (g: string) => {
        switch (g) {
            case 'lose': return 'giảm cân';
            case 'gain': return 'tăng cân';
            case 'maintain': return 'duy trì';
            default: return g;
        }
    };

    const buildUserInfo = () => ({
        goal: mapGoal(goals.goal),
        age: personalInfo.age,
        gender: mapGender(personalInfo.gender),
        height: personalInfo.height,
        weight: personalInfo.weight,
        activity: mapActivity(personalInfo.activityLevel),
        mealsPerDay: dietInfo.mealsPerDay,
        mealTimes: Object.values(dietInfo.mealTimes).length > 0
            ? Object.values(dietInfo.mealTimes)
            : ['07:00', '12:00', '18:00'],
        dietaryRestrictions: dietInfo.allergies ? [dietInfo.allergies] : [],
        budget:
            dietInfo.budget <= 80000 ? 'thấp'
                : dietInfo.budget >= 200000 ? 'cao'
                    : 'vừa phải',
        cookingPreference: planRequirements.cookingStyle,
        healthConditions: personalInfo.medicalConditions
            ? [personalInfo.medicalConditions]
            : [],
        extraNotes: planRequirements.notes,
        dateTemplate: planRequirements.planDays,
    });

    const handleGenerateNutrition = async () => {
        try {
            const baseInfo = buildUserInfo();

            const detailedGoal =
                goals.goal === "lose"
                    ? `giảm ${goals.change || 0} kg`
                    : goals.goal === "gain"
                        ? `tăng ${goals.change || 0} kg`
                        : goals.goal === "maintain"
                            ? "duy trì"
                            : goals.goal === "improve"
                                ? "cải thiện sức khỏe"
                                : "hỗ trợ bệnh lý";

            const userInfo = {
                ...baseInfo,
                goal: detailedGoal,
                day: goals.deadline ? Number(goals.deadline) * 7 : 30,
            };

            const result = await dispatch(generateNutritionThunk(userInfo)).unwrap();
            setNutritionData(result);
            setShowNutritionModal(true);
        } catch (err) {
            alert("❌ Không thể tính dinh dưỡng: " + err);
        }
    };

    const handleConfirmMealPlan = async () => {
        try {
            setCreatingPlan(true);

            const baseInfo = buildUserInfo();

            const detailedGoal =
                goals.goal === "lose"
                    ? `giảm ${goals.change || 0} kg`
                    : goals.goal === "gain"
                        ? `tăng ${goals.change || 0} kg`
                        : goals.goal === "maintain"
                            ? "duy trì"
                            : goals.goal === "improve"
                                ? "cải thiện sức khỏe"
                                : "hỗ trợ bệnh lý";

            const userInfo = {
                ...baseInfo,
                goal: detailedGoal,
                day: goals.deadline ? Number(goals.deadline) * 7 : 30,
            };

            await dispatch(
                generateMealPlanThunk({ userInfo, nutrition: nutritionData })
            ).unwrap();

            navigate("/plan-result", { state: { userInfo } });

        } catch (err) {
            alert("❌ Lỗi khi tạo lịch: " + err);
        } finally {
            setCreatingPlan(false);
        }
    };

    const StepIndicator = ({ step, label }: { step: number; label: string }) => {
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;
        return (
            <div className="flex flex-col items-center gap-2 relative">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg scale-110' : ''}
          ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : ''}
          ${!isActive && !isCompleted ? 'bg-gray-300' : ''}`}
                >
                    {isCompleted ? <Check className="w-6 h-6 text-white" /> : <span className="text-white font-bold">{step}</span>}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-blue-200'}`}>{label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            <main className="relative z-20 w-full px-4 py-10 max-w-4xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/plans')}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Quay lại danh sách</span>
                    </button>

                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-10 h-10" /> Tạo Kế Hoạch Dinh Dưỡng
                    </h1>
                    <p className="text-blue-100">Xây dựng thực đơn phù hợp với mục tiêu của bạn</p>
                </div>

                <div className="mb-8 flex justify-between items-center">
                    <StepIndicator step={1} label="Cá nhân" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={2} label="Mục tiêu" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={3} label="Ăn uống" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={4} label="Thực đơn" />
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-xl">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Thông Tin Cá Nhân</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chiều cao (cm)</label>
                                    <input
                                        type="number"
                                        value={personalInfo.height}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, height: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cân nặng (kg)</label>
                                    <input
                                        type="number"
                                        value={personalInfo.weight}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, weight: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi</label>
                                    <input
                                        type="number"
                                        value={personalInfo.age}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, age: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính <span className="text-red-500">*</span></label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPersonalInfo({ ...personalInfo, gender: 'male' })}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${personalInfo.gender === 'male'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            Nam
                                        </button>
                                        <button
                                            onClick={() => setPersonalInfo({ ...personalInfo, gender: 'female' })}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${personalInfo.gender === 'female'
                                                ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold'
                                                : 'border-gray-300 hover:border-pink-300'
                                                }`}
                                        >
                                            Nữ
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Mức độ hoạt động <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {activityLevels.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => setPersonalInfo({ ...personalInfo, activityLevel: level.value as any })}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${personalInfo.activityLevel === level.value
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="font-semibold text-gray-800">{level.label}</div>
                                            <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    Các bệnh lý (nếu có)
                                </label>
                                <textarea
                                    value={personalInfo.medicalConditions}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, medicalConditions: e.target.value })}
                                    placeholder="Ví dụ: Tiểu đường, cao huyết áp..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Xác Định Yêu Cầu Đầu Vào</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Mục tiêu của bạn là gì? <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {goalOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setGoals({
                                                    goal: option.value as any,
                                                    change: 0,
                                                    targetWeight: 0,
                                                    weeklyChange: 1,
                                                    deadline: "",
                                                });
                                            }}
                                            className={`p-6 rounded-xl border-2 text-center transition-all ${goals.goal === option.value
                                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                                : "border-gray-300 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">{option.icon}</div>
                                            <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                                            <div className="text-xs text-gray-600">{option.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(goals.goal === "lose" || goals.goal === "gain") && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số cân muốn {goals.goal === "lose" ? "giảm" : "tăng"} (kg)
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={goals.change || ""}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    if (val < 0) return;
                                                    if (val > 15) {
                                                        alert("⚠️ Mục tiêu thay đổi không nên quá 15 kg để đảm bảo an toàn!");
                                                        return;
                                                    }
                                                    setGoals({ ...goals, change: val });
                                                }}
                                                placeholder={`Nhập số kg muốn ${goals.goal === "lose" ? "giảm" : "tăng"}`}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tốc độ thay đổi (kg/tuần)
                                            </label>
                                            <input
                                                type="number"
                                                value={1}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Thời gian đạt mục tiêu <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5].map((w) => (
                                        <button
                                            key={w}
                                            onClick={() => setGoals({ ...goals, deadline: `${w}` })}
                                            className={`py-3 rounded-xl border-2 font-semibold transition-all ${goals.deadline === `${w}`
                                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                                : "border-gray-300 hover:border-blue-300"
                                                }`}
                                        >
                                            {w} tuần
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {goals.deadline && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">Chi tiết mục tiêu:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Cân nặng hiện tại: {personalInfo.weight} kg</li>
                                        {goals.goal === "lose" || goals.goal === "gain" ? (
                                            <>
                                                <li>
                                                    • Mục tiêu: {goals.goal === "lose" ? "Giảm" : "Tăng"} {goals.change} kg
                                                </li>
                                                <li>
                                                    • Cân nặng dự kiến:{" "}
                                                    {goals.goal === "lose"
                                                        ? personalInfo.weight - goals.change
                                                        : personalInfo.weight + goals.change}
                                                    kg
                                                </li>
                                                <li>• Tốc độ: 1 kg/tuần</li>
                                            </>
                                        ) : (
                                            <li>• Mục tiêu: {goalOptions.find((g) => g.value === goals.goal)?.label}</li>
                                        )}
                                        <li>• Thời gian ước tính: {goals.deadline} tuần</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <Utensils className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Thông Tin Ăn Uống</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dị ứng thực phẩm (nếu có)
                                </label>
                                <input
                                    type="text"
                                    value={dietInfo.allergies}
                                    onChange={(e) => setDietInfo({ ...dietInfo, allergies: e.target.value })}
                                    placeholder="Ví dụ: Hải sản, sữa, đậu phộng..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sở thích ăn uống (nếu có)
                                </label>
                                <input
                                    type="text"
                                    value={dietInfo.preferences}
                                    onChange={(e) => setDietInfo({ ...dietInfo, preferences: e.target.value })}
                                    placeholder="Ví dụ: Ưa thích rau củ, không ăn thịt đỏ..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Số bữa ăn trong ngày <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => {
                                                const key = `${num} meals`;
                                                setDietInfo({
                                                    ...dietInfo,
                                                    mealsPerDay: num as any,
                                                    mealTimes: defaultMealTimes[key],
                                                });
                                            }}
                                            className={`py-4 rounded-xl border-2 font-semibold transition-all ${dietInfo.mealsPerDay === num
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            {num} bữa
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {dietInfo.mealsPerDay && dietInfo.mealsPerDay >= 3 && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Giờ ăn cụ thể
                                    </label>

                                    <div className="space-y-3">
                                        {mealTimePresets[`${dietInfo.mealsPerDay} meals`].map((mealKey) => (
                                            <div key={mealKey} className="flex items-center justify-between gap-4">
                                                <span className="font-medium text-gray-700 w-32">
                                                    {mealKey === 'Morning'
                                                        ? 'Buổi sáng'
                                                        : mealKey === 'Mid-morning'
                                                            ? 'Giữa sáng'
                                                            : mealKey === 'Noon'
                                                                ? 'Buổi trưa'
                                                                : mealKey === 'Afternoon'
                                                                    ? 'Buổi chiều'
                                                                    : 'Buổi tối'}
                                                </span>
                                                <input
                                                    type="time"
                                                    value={dietInfo.mealTimes?.[mealKey]?.replace(' AM', '').replace(' PM', '') || ''}
                                                    onChange={(e) => {
                                                        const updated = {
                                                            ...dietInfo.mealTimes,
                                                            [mealKey]: e.target.value,
                                                        };
                                                        setDietInfo({ ...dietInfo, mealTimes: updated });
                                                    }}
                                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    Ngân sách mỗi ngày (VNĐ - nếu có)
                                </label>
                                <input
                                    type="number"
                                    value={dietInfo.budget || ''}
                                    onChange={(e) => setDietInfo({ ...dietInfo, budget: Number(e.target.value) })}
                                    placeholder="Ví dụ: 150000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Yêu Cầu Về Thực Đơn</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Loại hình thức <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {cookingStyles.map((style) => (
                                        <button
                                            key={style.value}
                                            onClick={() => setPlanRequirements({ ...planRequirements, cookingStyle: style.value as any })}
                                            className={`p-6 rounded-xl border-2 text-center transition-all ${planRequirements.cookingStyle === style.value
                                                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">{style.icon}</div>
                                            <div className="font-semibold text-gray-800 mb-1">{style.label}</div>
                                            <div className="text-xs text-gray-600">{style.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Số ngày muốn lên kế hoạch mẫu <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-4">
                                    {[2, 3, 4, 5].map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => setPlanRequirements({ ...planRequirements, planDays: days as any })}
                                            className={`py-4 rounded-xl border-2 font-semibold transition-all ${planRequirements.planDays === days
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            {days} ngày
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm (nếu có)</label>
                                <textarea
                                    value={planRequirements.notes}
                                    onChange={(e) => setPlanRequirements({ ...planRequirements, notes: e.target.value })}
                                    placeholder="Ví dụ: Muốn món ăn đa dạng, không lặp lại..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="font-semibold text-green-900 mb-2">✅ Tóm tắt kế hoạch:</h3>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Mục tiêu: {goals.goal === 'lose' ? 'Giảm cân' : goals.goal === 'gain' ? 'Tăng cân' : 'Duy trì'}</li>
                                    <li>• Số bữa/ngày: {dietInfo.mealsPerDay} bữa</li>
                                    <li>• Hình thức: {planRequirements.cookingStyle === 'homeCook' ? 'Tự nấu' : planRequirements.cookingStyle === 'eatOut' ? 'Ăn ngoài' : 'Kết hợp'}</li>
                                    <li>• Kế hoạch: {planRequirements.planDays} ngày</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t">
                    <button
                        onClick={() => setCurrentStep((p) => (p > 1 ? (p - 1) as Step : p))}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" /> Quay lại
                    </button>
                    {currentStep < 4 ? (
                        <button
                            onClick={() => {
                                if (currentStep === 1 && !canProceedStep1) return;
                                if (currentStep === 2 && !canProceedStep2) return;
                                if (currentStep === 3 && !canProceedStep3) return;
                                setCurrentStep((p) => (p < 4 ? (p + 1) as Step : p));
                            }}
                            disabled={
                                (currentStep === 1 && !canProceedStep1) ||
                                (currentStep === 2 && !canProceedStep2) ||
                                (currentStep === 3 && !canProceedStep3)
                            }
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold 
        ${((currentStep === 1 && !canProceedStep1) ||
                                    (currentStep === 2 && !canProceedStep2) ||
                                    (currentStep === 3 && !canProceedStep3))
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg'
                                }`}
                        >
                            Tiếp tục <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (!canProceedStep4) return;   // ⛔ NGĂN BẤM KHI CHƯA CHỌN
                                handleGenerateNutrition();
                            }}
                            disabled={!canProceedStep4 || loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
            ${!canProceedStep4 || loading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Đang tính...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" /> Hoàn thành
                                </>
                            )}
                        </button>
                    )}
                </div>

                {showNutritionModal && nutritionData && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                                <Check className="w-6 h-6 text-green-600" /> Kết quả phân tích dinh dưỡng
                            </h2>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• BMR: {nutritionData.nutrition.BMR}</li>
                                    <li>• TDEE: {nutritionData.nutrition.TDEE}</li>
                                    <li>• Hệ số hoạt động: {nutritionData.nutrition.activityFactor}</li>
                                    <li>• Mục tiêu: {nutritionData.nutrition.goalType}</li>
                                    <li>• Thay đổi cân nặng: {nutritionData.nutrition.weightChangeKg} kg</li>
                                    <li>• Thời gian: {nutritionData.nutrition.durationDays} ngày</li>
                                    <li>• Chênh lệch calo mỗi ngày: {nutritionData.nutrition.dailyCalorieChange}</li>
                                    <li>• Lượng calo đề xuất: {nutritionData.nutrition.calories}</li>
                                    <li>• Protein: {nutritionData.nutrition.protein}g</li>
                                    <li>• Fat: {nutritionData.nutrition.fat}g</li>
                                    <li>• Carbs: {nutritionData.nutrition.carbs}g</li>
                                </ul>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-6">{nutritionData.nutrition.notes}</p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowNutritionModal(false)}
                                    className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleConfirmMealPlan}
                                    disabled={creatingPlan}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all ${creatingPlan
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-md'
                                        }`}
                                >
                                    {creatingPlan ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Đang tạo lịch mẫu...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" /> Tạo lịch mẫu
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
