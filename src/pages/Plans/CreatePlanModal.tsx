import React, { useState } from 'react';
import {
  X, ChevronLeft, ChevronRight, Target, Clock, Calendar, 
  User, Heart, ShieldCheck, UtensilsCrossed, Settings,
  CheckCircle, Plus, Sparkles
} from 'lucide-react';

type PlanType = 'Giảm cân' | 'Tăng cơ' | 'Giữ dáng' | 'Cải thiện sức khỏe';

interface PlanData {
  name: string;
  type: PlanType;
  startDate: string;
  endDate: string;
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: PlanData) => void;
}

interface FormData {
  // Bước 1: Mục tiêu và thời gian
  duration: string;
  goal: PlanType;
  dietType: string;
  
  // Bước 2: Thói quen ăn uống
  mealsPerDay: string;
  mealTimes: string;
  wakeTime: string;
  sleepTime: string;
  activityLevel: string;
  
  // Bước 3: Sức khỏe
  allergies: string;
  diseases: string;
  medications: string;
  
  // Bước 4: Thực phẩm
  favoriteFoods: string;
  avoidFoods: string;
  cuisineStyle: string;
  
  // Bước 5: Điều kiện
  cookingTime: string;
  budget: string;
  equipment: string;
  specialRequests: string;
  
  // Tên lịch trình và thời gian
  planName: string;
  startDate: string;
  endDate: string;
}

const TOTAL_STEPS = 6;

export default function CreatePlanModal({ isOpen, onClose, onSubmit }: CreatePlanModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    duration: '',
    goal: 'Giảm cân',
    dietType: '',
    mealsPerDay: '',
    mealTimes: '',
    wakeTime: '',
    sleepTime: '',
    activityLevel: '',
    allergies: '',
    diseases: '',
    medications: '',
    favoriteFoods: '',
    avoidFoods: '',
    cuisineStyle: '',
    cookingTime: '',
    budget: '',
    equipment: '',
    specialRequests: '',
    planName: '',
    startDate: '',
    endDate: ''
  });

  if (!isOpen) return null;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = () => {
    // Tạo tên lịch trình tự động nếu chưa có
    let planName = formData.planName;
    if (!planName) {
      const goalMap = {
        'Giảm cân': 'Giảm cân',
        'Tăng cơ': 'Tăng cơ',
        'Giữ dáng': 'Giữ dáng',
        'Cải thiện sức khỏe': 'Cải thiện sức khỏe'
      };
      planName = `Lịch trình ${goalMap[formData.goal]} - ${formData.duration}`;
    }

    // Tính toán ngày bắt đầu/kết thúc nếu chưa có
    let startDate = formData.startDate;
    let endDate = formData.endDate;
    
    if (!startDate) {
      startDate = new Date().toISOString().split('T')[0];
    }
    
    if (!endDate) {
      const start = new Date(startDate);
      const durationDays = formData.duration.includes('tuần') 
        ? parseInt(formData.duration) * 7
        : formData.duration.includes('tháng')
        ? parseInt(formData.duration) * 30
        : 30; // default 1 tháng
      
      const end = new Date(start);
      end.setDate(end.getDate() + durationDays);
      endDate = end.toISOString().split('T')[0];
    }

    const planData: PlanData = {
      name: planName,
      type: formData.goal,
      startDate,
      endDate
    };

    onSubmit(planData);
    // Reset form
    setCurrentStep(1);
    setFormData({
      duration: '',
      goal: 'Giảm cân',
      dietType: '',
      mealsPerDay: '',
      mealTimes: '',
      wakeTime: '',
      sleepTime: '',
      activityLevel: '',
      allergies: '',
      diseases: '',
      medications: '',
      favoriteFoods: '',
      avoidFoods: '',
      cuisineStyle: '',
      cookingTime: '',
      budget: '',
      equipment: '',
      specialRequests: '',
      planName: '',
      startDate: '',
      endDate: ''
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateField={updateField} />;
      case 2:
        return <Step2 formData={formData} updateField={updateField} />;
      case 3:
        return <Step3 formData={formData} updateField={updateField} />;
      case 4:
        return <Step4 formData={formData} updateField={updateField} />;
      case 5:
        return <Step5 formData={formData} updateField={updateField} />;
      case 6:
        return <Step6 formData={formData} updateField={updateField} />;
      case 7:
        return <Step7 formData={formData} />;
      default:
        return <Step1 formData={formData} updateField={updateField} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-cyan-400/40 to-blue-400/30 rounded-3xl blur-2xl animate-pulse" />
          
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Sparkles className="w-7 h-7" />
                    Tạo lịch trình dinh dưỡng mới
                  </h2>
                  <p className="text-blue-100">Hoàn thiện thông tin để tạo lịch trình phù hợp nhất</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 group"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Bước {currentStep} / {TOTAL_STEPS}</span>
                  <span className="text-sm text-blue-100">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {renderStep()}
            </div>

            {/* Footer */}
            <div className="bg-gray-50/80 border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                  Quay lại
                </button>

                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={nextStep}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Tiếp theo
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                      Tạo lịch trình
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Các component Step =====

function Step1({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Mục tiêu và thời gian</h3>
        <p className="text-gray-600">Hãy chia sẻ về mục tiêu dinh dưỡng của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn muốn theo lịch ăn uống này trong bao lâu? *</label>
          <select
            value={formData.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="">-- Chọn thời gian --</option>
            <option value="2 tuần">2 tuần</option>
            <option value="1 tháng">1 tháng</option>
            <option value="2 tháng">2 tháng</option>
            <option value="3 tháng">3 tháng</option>
            <option value="6 tháng">6 tháng</option>
            <option value="dài hạn">Dài hạn ({'>'}6 tháng)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Mục tiêu ăn uống của bạn là gì? *</label>
          <select
            value={formData.goal}
            onChange={(e) => updateField('goal', e.target.value as PlanType)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="Giảm cân">Giảm cân</option>
            <option value="Tăng cơ">Tăng cơ</option>
            <option value="Giữ dáng">Giữ dáng</option>
            <option value="Cải thiện sức khỏe">Cải thiện sức khỏe</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Bạn có muốn theo chế độ ăn cụ thể nào không?</label>
        <select
          value={formData.dietType}
          onChange={(e) => updateField('dietType', e.target.value)}
          className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
        >
          <option value="">-- Chọn chế độ ăn (tùy chọn) --</option>
          <option value="Keto">Keto</option>
          <option value="Eat Clean">Eat Clean</option>
          <option value="Địa Trung Hải">Địa Trung Hải</option>
          <option value="Thuần chay">Thuần chay</option>
          <option value="Low-carb">Low-carb</option>
          <option value="Intermittent Fasting">Intermittent Fasting</option>
          <option value="DASH">DASH</option>
        </select>
      </div>
    </div>
  );
}

function Step2({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thói quen và nhu cầu ăn uống</h3>
        <p className="text-gray-600">Chia sẻ về lịch trình sinh hoạt hằng ngày của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Mỗi ngày bạn muốn ăn bao nhiêu bữa?</label>
          <select
            value={formData.mealsPerDay}
            onChange={(e) => updateField('mealsPerDay', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="">-- Chọn số bữa ăn --</option>
            <option value="2 bữa chính">2 bữa chính</option>
            <option value="3 bữa chính">3 bữa chính</option>
            <option value="3 bữa chính + 1 bữa phụ">3 bữa chính + 1 bữa phụ</option>
            <option value="3 bữa chính + 2 bữa phụ">3 bữa chính + 2 bữa phụ</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Thời gian các bữa ăn thường vào lúc nào?</label>
          <input
            type="text"
            value={formData.mealTimes}
            onChange={(e) => updateField('mealTimes', e.target.value)}
            placeholder="VD: 7h, 12h, 18h"
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn thường dậy lúc mấy giờ?</label>
          <input
            type="time"
            value={formData.wakeTime}
            onChange={(e) => updateField('wakeTime', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn thường đi ngủ lúc mấy giờ?</label>
          <input
            type="time"
            value={formData.sleepTime}
            onChange={(e) => updateField('sleepTime', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Mức độ hoạt động thể chất của bạn như thế nào?</label>
        <select
          value={formData.activityLevel}
          onChange={(e) => updateField('activityLevel', e.target.value)}
          className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
        >
          <option value="">-- Chọn mức độ hoạt động --</option>
          <option value="Ngồi nhiều, ít vận động">Ngồi nhiều, ít vận động</option>
          <option value="Hoạt động nhẹ (đi bộ)">Hoạt động nhẹ (đi bộ)</option>
          <option value="Tập gym 2-3 lần/tuần">Tập gym 2-3 lần/tuần</option>
          <option value="Chạy bộ thường xuyên">Chạy bộ thường xuyên</option>
          <option value="Vận động viên">Vận động viên</option>
        </select>
      </div>
    </div>
  );
}

function Step3({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Tình trạng sức khỏe và dị ứng</h3>
        <p className="text-gray-600">Thông tin về sức khỏe giúp chúng tôi tạo lịch trình phù hợp</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có dị ứng với thực phẩm nào không?</label>
          <textarea
            value={formData.allergies}
            onChange={(e) => updateField('allergies', e.target.value)}
            placeholder="VD: Tôm, cua, sữa bò, đậu phộng... (để trống nếu không có)"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có đang mắc các bệnh lý nào không?</label>
          <textarea
            value={formData.diseases}
            onChange={(e) => updateField('diseases', e.target.value)}
            placeholder="VD: Tiểu đường, cao huyết áp, gan nhiễm mỡ, dạ dày... (để trống nếu không có)"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có đang dùng thuốc hay thực phẩm chức năng nào không?</label>
          <textarea
            value={formData.medications}
            onChange={(e) => updateField('medications', e.target.value)}
            placeholder="Liệt kê các loại thuốc hoặc thực phẩm chức năng đang sử dụng (để trống nếu không có)"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thực phẩm yêu thích và kiêng kỵ</h3>
        <p className="text-gray-600">Chia sẻ về sở thích ẩm thực của bạn</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn thích ăn những loại thực phẩm nào?</label>
          <textarea
            value={formData.favoriteFoods}
            onChange={(e) => updateField('favoriteFoods', e.target.value)}
            placeholder="VD: Cá, thịt gà, rau xanh, trái cây, bánh mì..."
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Có món nào bạn không thích hoặc không thể ăn không?</label>
          <textarea
            value={formData.avoidFoods}
            onChange={(e) => updateField('avoidFoods', e.target.value)}
            placeholder="VD: Đồ cay, nội tạng, rau xanh... (để trống nếu không có)"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn muốn chế độ ăn bao gồm món gì?</label>
          <select
            value={formData.cuisineStyle}
            onChange={(e) => updateField('cuisineStyle', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="">-- Chọn phong cách ẩm thực --</option>
            <option value="Chủ yếu món Việt">Chủ yếu món Việt</option>
            <option value="Kết hợp món Việt + Á">Kết hợp món Việt + Á</option>
            <option value="Kết hợp món Việt + Tây">Kết hợp món Việt + Tây</option>
            <option value="Đa dạng (Việt + Tây + Nhật + Hàn)">Đa dạng (Việt + Tây + Nhật + Hàn)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step5({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white mb-4">
          <Settings className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Điều kiện và yêu cầu khác</h3>
        <p className="text-gray-600">Thông tin về điều kiện thực tế của bạn</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có thời gian nấu ăn không?</label>
          <select
            value={formData.cookingTime}
            onChange={(e) => updateField('cookingTime', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="">-- Chọn mức độ nấu ăn --</option>
            <option value="Rất ít thời gian, cần món đơn giản">Rất ít thời gian, cần món đơn giản</option>
            <option value="Có thể nấu ăn cơ bản">Có thể nấu ăn cơ bản</option>
            <option value="Thích tự nấu, có thời gian">Thích tự nấu, có thời gian</option>
            <option value="Chủ yếu mua bên ngoài">Chủ yếu mua bên ngoài</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có ngân sách cụ thể không?</label>
          <select
            value={formData.budget}
            onChange={(e) => updateField('budget', e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          >
            <option value="">-- Chọn mức ngân sách --</option>
            <option value="Tiết kiệm (<200k/tuần)">Tiết kiệm (&lt;200k/tuần)</option>
            <option value="Bình thường (200k-400k/tuần)">Bình thường (200k-400k/tuần)</option>
            <option value="Thoải mái (400k-600k/tuần)">Thoải mái (400k-600k/tuần)</option>
            <option value="Không giới hạn">Không giới hạn</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có những thiết bị nấu ăn nào?</label>
          <textarea
            value={formData.equipment}
            onChange={(e) => updateField('equipment', e.target.value)}
            placeholder="VD: Bếp gas, nồi chiên không dầu, lò vi sóng, máy xay sinh tố..."
            rows={2}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Bạn có yêu cầu gì đặc biệt khác không?</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => updateField('specialRequests', e.target.value)}
            placeholder="Chia sẻ thêm về nhu cầu đặc biệt của bạn..."
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}

function Step6({ formData, updateField }: { formData: FormData; updateField: (field: keyof FormData, value: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thông tin lịch trình</h3>
        <p className="text-gray-600">Đặt tên và chọn thời gian cho lịch trình của bạn</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Tên lịch trình (tùy chọn)</label>
          <input
            type="text"
            value={formData.planName}
            onChange={(e) => updateField('planName', e.target.value)}
            placeholder={`Để trống để tự động tạo tên: "Lịch trình ${formData.goal} - ${formData.duration}"`}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Ngày bắt đầu (tùy chọn)</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
            <p className="text-xs text-gray-500">Để trống để bắt đầu từ hôm nay</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Ngày kết thúc (tùy chọn)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
            <p className="text-xs text-gray-500">Để trống để tự động tính theo thời lượng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step7({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Xem lại thông tin</h3>
        <p className="text-gray-600">Kiểm tra lại tất cả thông tin trước khi tạo lịch trình</p>
      </div>

      <div className="space-y-6">
        {/* Mục tiêu và thời gian */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            1. Mục tiêu và thời gian
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Thời lượng:</span>
              <div className="text-gray-800">{formData.duration || 'Chưa chọn'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mục tiêu:</span>
              <div className="text-gray-800">{formData.goal}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Chế độ ăn:</span>
              <div className="text-gray-800">{formData.dietType || 'Linh hoạt'}</div>
            </div>
          </div>
        </div>

        {/* Thói quen ăn uống */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-green-600" />
            2. Thói quen ăn uống
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Số bữa ăn:</span>
              <div className="text-gray-800">{formData.mealsPerDay || 'Chưa chọn'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Thời gian ăn:</span>
              <div className="text-gray-800">{formData.mealTimes || 'Chưa điền'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Giờ dậy:</span>
              <div className="text-gray-800">{formData.wakeTime || 'Chưa chọn'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Giờ ngủ:</span>
              <div className="text-gray-800">{formData.sleepTime || 'Chưa chọn'}</div>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Mức độ vận động:</span>
              <div className="text-gray-800">{formData.activityLevel || 'Chưa chọn'}</div>
            </div>
          </div>
        </div>

        {/* Sức khỏe */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            3. Tình trạng sức khỏe
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Dị ứng:</span>
              <div className="text-gray-800">{formData.allergies || 'Không có'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Bệnh lý:</span>
              <div className="text-gray-800">{formData.diseases || 'Không có'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Thuốc/TPCN:</span>
              <div className="text-gray-800">{formData.medications || 'Không có'}</div>
            </div>
          </div>
        </div>

        {/* Thực phẩm */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            4. Sở thích thực phẩm
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Thực phẩm yêu thích:</span>
              <div className="text-gray-800">{formData.favoriteFoods || 'Chưa điền'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Thực phẩm tránh:</span>
              <div className="text-gray-800">{formData.avoidFoods || 'Không có'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phong cách ẩm thực:</span>
              <div className="text-gray-800">{formData.cuisineStyle || 'Chưa chọn'}</div>
            </div>
          </div>
        </div>

        {/* Điều kiện */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" />
            5. Điều kiện thực tế
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Thời gian nấu ăn:</span>
              <div className="text-gray-800">{formData.cookingTime || 'Chưa chọn'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Ngân sách:</span>
              <div className="text-gray-800">{formData.budget || 'Chưa chọn'}</div>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Thiết bị nấu ăn:</span>
              <div className="text-gray-800">{formData.equipment || 'Chưa điền'}</div>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Yêu cầu đặc biệt:</span>
              <div className="text-gray-800">{formData.specialRequests || 'Không có'}</div>
            </div>
          </div>
        </div>

        {/* Thông tin lịch trình */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" />
            6. Thông tin lịch trình
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Tên lịch trình:</span>
              <div className="text-gray-800">
                {formData.planName || `Lịch trình ${formData.goal} - ${formData.duration}`}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Ngày bắt đầu:</span>
              <div className="text-gray-800">
                {formData.startDate ? new Date(formData.startDate).toLocaleDateString('vi-VN') : 'Hôm nay'}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Ngày kết thúc:</span>
              <div className="text-gray-800">
                {formData.endDate ? new Date(formData.endDate).toLocaleDateString('vi-VN') : 'Tự động tính'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}