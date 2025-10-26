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
    Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { generatePlanThunk } from "../../redux/slices/planSlice";
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3 | 4;

export default function CreatePlanPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, mealPlan } = useSelector((state: RootState) => state.plan);
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState({
        height: 170,
        weight: 70,
        age: 25,
        gender: '',
        activityLevel: '',
        medicalConditions: ''
    });

    const [goals, setGoals] = useState({
        goal: '',
        targetWeight: 0,
        weeklyChange: 0.5,
        deadline: ''
    });

    const [dietInfo, setDietInfo] = useState({
        allergies: '',
        preferences: '',
        mealsPerDay: null as 1 | 2 | 3 | null,
        mealTimes: '',
        budget: 0
    });

    const [planRequirements, setPlanRequirements] = useState({
        cookingStyle: '',
        planDays: null as 2 | 3 | 4 | 5 | null,
        notes: ''
    });

    const activityLevels = [
        { value: 'sedentary', label: 'Ít vận động', description: 'Ngồi nhiều, ít hoạt động thể chất' },
        { value: 'light', label: 'Nhẹ', description: 'Tập nhẹ 1-3 ngày/tuần' },
        { value: 'moderate', label: 'Vừa phải', description: 'Tập vừa 3-5 ngày/tuần' },
        { value: 'high', label: 'Cao', description: 'Tập nặng 6-7 ngày/tuần' },
        { value: 'veryHigh', label: 'Rất cao', description: 'Vận động viên, tập 2 lần/ngày' }
    ];

    const goalOptions = [
        { value: 'lose', label: 'Giảm cân', icon: '📉', description: 'Giảm cân an toàn và bền vững' },
        { value: 'maintain', label: 'Duy trì', icon: '⚖️', description: 'Giữ cân nặng hiện tại' },
        { value: 'gain', label: 'Tăng cân', icon: '📈', description: 'Tăng cân và xây dựng cơ bắp' }
    ];

    const cookingStyles = [
        { value: 'homeCook', label: 'Tự nấu', icon: '👨‍🍳', description: 'Tự chuẩn bị món ăn tại nhà' },
        { value: 'eatOut', label: 'Ăn ngoài', icon: '🍽️', description: 'Ăn tại nhà hàng/quán ăn' },
        { value: 'mixed', label: 'Kết hợp', icon: '🔄', description: 'Kết hợp cả hai phương án' }
    ];

    const canProceedStep1 = personalInfo.gender && personalInfo.activityLevel;
    const canProceedStep2 = goals.goal && goals.targetWeight > 0 && goals.deadline;
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
    
    const handleSubmit = async () => {
        const userInfo = {
          goal: mapGoal(goals.goal),
          age: personalInfo.age,
          gender: mapGender(personalInfo.gender),
          height: personalInfo.height,
          weight: personalInfo.weight,
          activity: mapActivity(personalInfo.activityLevel),
          mealsPerDay: dietInfo.mealsPerDay,
          mealTimes: dietInfo.mealTimes
            ? dietInfo.mealTimes.split(",").map((t) => t.trim())
            : ["07:00", "12:00", "18:00"],
          dietaryRestrictions: dietInfo.allergies ? [dietInfo.allergies] : [],
          budget:
            dietInfo.budget <= 80000
              ? "thấp"
              : dietInfo.budget >= 200000
              ? "cao"
              : "vừa phải",
          cookingPreference: planRequirements.cookingStyle,
          healthConditions: personalInfo.medicalConditions
            ? [personalInfo.medicalConditions]
            : [],
          extraNotes: planRequirements.notes,
          dateTemplate: planRequirements.planDays,
        };
      
        const resultAction = await dispatch(generatePlanThunk(userInfo));
      
        if (generatePlanThunk.fulfilled.match(resultAction)) {
          navigate("/plan-result");
        } else {
          alert("❌ " + (resultAction.payload as string));
        }
      };
      
    const handleNext = () => {
        if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
    };
    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
    };

    const StepIndicator = ({ step, label }: { step: number; label: string }) => {
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
            <div className="flex flex-col items-center gap-2 relative">
                <div
                    className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg scale-110' : ''}
          ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : ''}
          ${!isActive && !isCompleted ? 'bg-gray-300' : ''}
        `}
                >
                    {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                    ) : (
                        <span className="text-white font-bold">{step}</span>
                    )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-blue-200'}`}>
                    {label}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

            <main className="relative z-20 w-full px-4 py-10 pt-[105px] max-w-4xl mx-auto">
                <div className="mb-8">
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
                                <div className="grid grid-cols-3 gap-4">
                                    {goalOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setGoals({ ...goals, goal: option.value as any })}
                                            className={`p-6 rounded-xl border-2 text-center transition-all ${goals.goal === option.value
                                                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                                : 'border-gray-300 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">{option.icon}</div>
                                            <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                                            <div className="text-xs text-gray-600">{option.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cân nặng mục tiêu (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={goals.targetWeight || ''}
                                        onChange={(e) => setGoals({ ...goals, targetWeight: Number(e.target.value) })}
                                        placeholder="Nhập cân nặng mục tiêu"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thay đổi mỗi tuần (kg)
                                    </label>
                                    <select
                                        value={goals.weeklyChange}
                                        onChange={(e) => setGoals({ ...goals, weeklyChange: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value={0.5}>0.5 kg/tuần</option>
                                        <option value={0.75}>0.75 kg/tuần</option>
                                        <option value={1}>1 kg/tuần</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Thời gian đạt mục tiêu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={goals.deadline}
                                    onChange={(e) => setGoals({ ...goals, deadline: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {goals.goal && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">Chi tiết mục tiêu:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Cân nặng hiện tại: {personalInfo.weight} kg</li>
                                        <li>• Cân nặng mục tiêu: {goals.targetWeight} kg</li>
                                        <li>• Chênh lệch: {Math.abs(personalInfo.weight - goals.targetWeight).toFixed(1)} kg</li>
                                        <li>• Tốc độ: {goals.weeklyChange} kg/tuần</li>
                                        {goals.targetWeight > 0 && (
                                            <li>• Thời gian ước tính: {Math.ceil(Math.abs(personalInfo.weight - goals.targetWeight) / goals.weeklyChange)} tuần</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <Utensils className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Thông Tin Ăn Uống</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dị ứng thực phẩm (nếu có)</label>
                            <input
                                type="text"
                                value={dietInfo.allergies}
                                onChange={(e) => setDietInfo({ ...dietInfo, allergies: e.target.value })}
                                placeholder="Ví dụ: Hải sản, sữa, đậu phộng..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sở thích ăn uống (nếu có)</label>
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
                                {[1, 2, 3].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setDietInfo({ ...dietInfo, mealsPerDay: num as any })}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giờ ăn cụ thể (nếu có)</label>
                            <input
                                type="text"
                                placeholder="Ví dụ: 7:00, 12:00, 18:00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

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

                <div className="flex justify-between mt-8 pt-6 border-t">
                    <button
                        onClick={handleBack}
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
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !canProceedStep1) ||
                                (currentStep === 2 && !canProceedStep2) ||
                                (currentStep === 3 && !canProceedStep3)
                            }
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${((currentStep === 1 && !canProceedStep1) ||
                                (currentStep === 2 && !canProceedStep2) ||
                                (currentStep === 3 && !canProceedStep3))
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg'
                                }`}
                        >
                            Tiếp tục <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!canProceedStep4 || loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${!canProceedStep4 || loading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Đang tạo kế hoạch...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" /> Hoàn thành
                                </>
                            )}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}