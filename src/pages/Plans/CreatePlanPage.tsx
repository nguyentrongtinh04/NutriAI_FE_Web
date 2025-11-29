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
import { useNotify } from "../../components/notifications/NotificationsProvider";

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
    const notify = useNotify();
    const [loadingNutrition, setLoadingNutrition] = useState(false);

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
        { value: 'lose', label: 'Lose weight', icon: '📉', description: 'Giảm cân an toàn và bền vững' },
        { value: 'gain', label: 'Gain weight', icon: '📈', description: 'Tăng cân và xây dựng cơ bắp' },
        { value: 'maintain', label: 'Maintain weight', icon: '⚖️', description: 'Giữ cân nặng và hình thể hiện tại' },
        { value: 'improve', label: 'Improve health', icon: '💪', description: 'Ăn uống lành mạnh để cải thiện sức khỏe' },
        { value: 'support', label: 'Support medical condition', icon: '❤️‍🩹', description: 'Điều chỉnh chế độ ăn cho tình trạng sức khỏe cụ thể' },
    ];

    const cookingStyles = [
        { value: 'homeCook', label: 'HomeCook', icon: '👨‍🍳', description: 'Home cooked meals' },
        { value: 'eatOut', label: 'EatOut', icon: '🍽️', description: 'Eat at restaurants' },
        { value: 'mixed', label: 'Mixed', icon: '🔄', description: 'Combination of both' },
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
            setLoadingNutrition(true);
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

            notify.success("🎉 Nutrition calculation successful!");
        } catch (err: any) {
            notify.error("❌ Failed to calculate nutrition. Please try again!");
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

            notify.success("🎯 Nutrition plan created successfully!");

            navigate("/plan-result", { state: { userInfo } });

        } catch (err: any) {
            notify.error("❌ Failed to create plan. Please try again!");
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
                        <span className="font-medium">Back to list</span>
                    </button>

                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-10 h-10" /> Create Nutrition Plan
                    </h1>
                    <p className="text-blue-100">Build a meal plan tailored to your goals</p>
                </div>

                <div className="mb-8 flex justify-between items-center">
                    <StepIndicator step={1} label="Personal" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={2} label="Goals" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={3} label="Diet" />
                    <div className="flex-1 h-1 bg-white/30 mx-2" />
                    <StepIndicator step={4} label="Menu" />
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-xl">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={personalInfo.height}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, height: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={personalInfo.weight}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, weight: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={personalInfo.age}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, age: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPersonalInfo({ ...personalInfo, gender: 'male' })}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${personalInfo.gender === 'male'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            Male
                                        </button>
                                        <button
                                            onClick={() => setPersonalInfo({ ...personalInfo, gender: 'female' })}
                                            className={`flex-1 py-3 rounded-xl border-2 transition-all ${personalInfo.gender === 'female'
                                                ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold'
                                                : 'border-gray-300 hover:border-pink-300'
                                                }`}
                                        >
                                            Female
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Activity Level <span className="text-red-500">*</span>
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
                                    Medical conditions (if any)
                                </label>
                                <textarea
                                    value={personalInfo.medicalConditions}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, medicalConditions: e.target.value })}
                                    placeholder="Example: diabetes, high blood pressure..."
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
                                <h2 className="text-2xl font-bold text-gray-800">Define Your Goal</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    What is your goal? <span className="text-red-500">*</span>
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
                                                Weight change {goals.goal === "lose" ? "giảm" : "tăng"} (kg)
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={goals.change || ""}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    if (val < 0) return;

                                                    const weeks = Number(goals.deadline || 0);

                                                    if (weeks > 0) {
                                                        const maxAllowed =
                                                            goals.goal === "lose" ? weeks * 1 : weeks * 0.75;

                                                        if (val > maxAllowed) {
                                                            notify.warning(
                                                                `⚠️ Với ${weeks} tuần, bạn chỉ có thể ${goals.goal === "lose" ? "giảm" : "tăng"
                                                                } tối đa ${maxAllowed.toFixed(1)} kg.`
                                                            );
                                                            setGoals({ ...goals, change: Number(maxAllowed.toFixed(1)) });
                                                            return;
                                                        }
                                                    }

                                                    setGoals({ ...goals, change: val });
                                                }}
                                                placeholder={`Enter weight to ${goals.goal === "lose" ? "giảm" : "tăng"}`}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weekly change (kg/Weekly)
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
                                    Target duration <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[1, 2, 3, 4, 5].map((w) => {
                                        const safeMax = goals.goal === "lose"
                                            ? w * 1            // giảm cân tối đa 1kg/tuần
                                            : w * 0.75;        // tăng cân tối đa 0.75kg/tuần

                                        return (
                                            <button
                                                key={w}
                                                onClick={() => {
                                                    let updatedChange = goals.change;

                                                    // Nếu người dùng nhập số kg không hợp lệ trong số tuần này → chỉnh lại
                                                    if (goals.goal === "lose" || goals.goal === "gain") {
                                                        if (updatedChange > safeMax) {
                                                            notify.warning(
                                                                `⚠️ Với ${w} tuần, bạn chỉ có thể ${goals.goal === "lose" ? "giảm" : "tăng"
                                                                } tối đa ${safeMax.toFixed(1)} kg.`
                                                            );
                                                            updatedChange = Number(safeMax.toFixed(1));
                                                        }
                                                    }

                                                    setGoals({
                                                        ...goals,
                                                        deadline: `${w}`,
                                                        change: updatedChange,
                                                    });
                                                }}
                                                className={`py-3 rounded-xl border-2 font-semibold transition-all ${goals.deadline === `${w}`
                                                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                                                    : "border-gray-300 hover:border-blue-300"
                                                    }`}
                                            >
                                                {w} weeks
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>

                            {goals.deadline && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">Goal details:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Current weight: {personalInfo.weight} kg</li>
                                        {goals.goal === "lose" || goals.goal === "gain" ? (
                                            <>
                                                <li>
                                                    • Goal: {goals.goal === "lose" ? "Lose" : "Gain"} {goals.change} kg
                                                </li>
                                                <li>
                                                    • Expected weight:{" "}
                                                    {goals.goal === "lose"
                                                        ? personalInfo.weight - goals.change
                                                        : personalInfo.weight + goals.change}
                                                    kg
                                                </li>
                                                <li>• Rate: 1 kg/week</li>
                                            </>
                                        ) : (
                                            <li>• Goal: {goalOptions.find((g) => g.value === goals.goal)?.label}</li>
                                        )}
                                        <li>• Estimated time: {goals.deadline} weeks</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <Utensils className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Diet Information</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Food allergies (if any)
                                </label>
                                <input
                                    type="text"
                                    value={dietInfo.allergies}
                                    onChange={(e) => setDietInfo({ ...dietInfo, allergies: e.target.value })}
                                    placeholder="Example: seafood, milk, peanuts..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Food preferences (if any)
                                </label>
                                <input
                                    type="text"
                                    value={dietInfo.preferences}
                                    onChange={(e) => setDietInfo({ ...dietInfo, preferences: e.target.value })}
                                    placeholder="Example: prefer vegetables, avoid red meat..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Meals per day <span className="text-red-500">*</span>
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
                                            {num} meals
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {dietInfo.mealsPerDay && dietInfo.mealsPerDay >= 3 && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Meal times
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
                                    Daily budget (VND)
                                </label>
                                <input
                                    type="number"
                                    value={dietInfo.budget || ''}
                                    onChange={(e) => setDietInfo({ ...dietInfo, budget: Number(e.target.value) })}
                                    placeholder="Example: 150000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Meal Plan Requirements</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Cooking style <span className="text-red-500">*</span>
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
                                    Number of template days <span className="text-red-500">*</span>
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
                                            {days} days
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional notes</label>
                                <textarea
                                    value={planRequirements.notes}
                                    onChange={(e) => setPlanRequirements({ ...planRequirements, notes: e.target.value })}
                                    placeholder="Example: prefer variety, avoid repetition..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="font-semibold text-green-900 mb-2">✅ Plan summary:</h3>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Goal: {goals.goal === 'lose' ? 'Lose weight' : goals.goal === 'gain' ? 'Gain weight' : 'Duy trì'}</li>
                                    <li>• Meals/day: {dietInfo.mealsPerDay} bữa</li>
                                    <li>• Cooking style: {planRequirements.cookingStyle === 'homeCook' ? 'Home cooked' : planRequirements.cookingStyle === 'eatOut' ? 'Eat out' : 'Mixed'}</li>
                                    <li>• Days planned: {planRequirements.planDays} ngày</li>
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
                        <ChevronLeft className="w-5 h-5" />Back
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
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                if (!canProceedStep4) return;   // ⛔ NGĂN BẤM KHI CHƯA CHỌN
                                handleGenerateNutrition();
                            }}
                            disabled={!canProceedStep4 || loadingNutrition}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
        ${!canProceedStep4 || loadingNutrition
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                                }`}
                        >
                            {loadingNutrition ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" /> Finish
                                </>
                            )}
                        </button>
                    )}
                </div>

                {showNutritionModal && nutritionData && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative animate-fade-in 
                    max-h-[95vh] overflow-y-auto">

                            <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-600" /> Nutrition Analysis Result
                            </h2>

                            <div className="grid grid-cols-1 gap-3 mb-4">

                                {/* Hàng 1 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
                                        <p className="text-xs text-blue-700 font-medium">BMR</p>
                                        <p className="text-xl font-extrabold text-blue-900">{nutritionData.nutrition.BMR}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 shadow-sm">
                                        <p className="text-xs text-cyan-700 font-medium">TDEE</p>
                                        <p className="text-xl font-extrabold text-cyan-900">{nutritionData.nutrition.TDEE}</p>
                                    </div>
                                </div>

                                {/* Hàng 2 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 shadow-sm">
                                        <p className="text-xs text-purple-700 font-medium">Activity</p>
                                        <p className="text-lg font-bold text-purple-900">{nutritionData.nutrition.activityFactor}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
                                        <p className="text-xs text-amber-700 font-medium">Goal</p>
                                        <p className="text-sm font-bold text-amber-900">{nutritionData.nutrition.goalType}</p>
                                    </div>
                                </div>

                                {/* Hàng 3 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 shadow-sm">
                                        <p className="text-xs text-rose-700 font-medium">Weight change</p>
                                        <p className="text-lg font-bold text-rose-900">{nutritionData.nutrition.weightChangeKg} kg</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-green-50 border border-green-200 shadow-sm">
                                        <p className="text-xs text-green-700 font-medium">Duration</p>
                                        <p className="text-lg font-bold text-green-900">{nutritionData.nutrition.durationDays} ngày</p>
                                    </div>
                                </div>

                                {/* Calories */}
                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 shadow">
                                    <p className="text-xs text-orange-700 font-medium">Calories</p>
                                    <p className="text-2xl font-extrabold text-orange-900">
                                        {nutritionData.nutrition.calories} kcal
                                    </p>
                                </div>

                                {/* Macro */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center shadow-sm">
                                        <p className="text-xs text-blue-600 font-medium">Protein</p>
                                        <p className="text-xl font-extrabold text-blue-800">{nutritionData.nutrition.protein}g</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center shadow-sm">
                                        <p className="text-xs text-amber-600 font-medium">Carbs</p>
                                        <p className="text-xl font-extrabold text-amber-800">{nutritionData.nutrition.carbs}g</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center shadow-sm">
                                        <p className="text-xs text-red-600 font-medium">Fat</p>
                                        <p className="text-xl font-extrabold text-red-800">{nutritionData.nutrition.fat}g</p>
                                    </div>
                                </div>

                            </div>

                            <p className="text-gray-700 text-xs leading-relaxed mb-4">
                                {nutritionData.nutrition.notes}
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowNutritionModal(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmMealPlan}
                                    disabled={creatingPlan}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${creatingPlan
                                            ? 'bg-gray-300 text-gray-500'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        }`}
                                >
                                    {creatingPlan
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                                        : <><Check className="w-4 h-4" /> Create plan</>
                                    }
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
