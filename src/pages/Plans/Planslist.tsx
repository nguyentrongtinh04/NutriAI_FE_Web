import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronRight, Plus, Search,
  Tags, Clock, Target, Sparkles, Calendar as CalIcon
} from 'lucide-react';
import CreatePlanModal from './CreatePlanModal';
import { useLocation, useNavigate } from 'react-router-dom';

// 🔔 thêm: hook & banner từ hệ thống thông báo
import { useNotify, AlertBanner } from './../../components/notifications/NotificationsProvider';

type PlanType = 'Giảm cân' | 'Tăng cơ' | 'Giữ dáng' | 'Cải thiện sức khỏe';

interface PlanItem {
  id: string;
  name: string;
  type: PlanType;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
}

export default function PlansList() {
  const notify = useNotify(); // 🔔

  // ===== Utils ngày =====
  const toYMD = (d: Date) => {
    const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return tz.toISOString().split('T')[0]; // yyyy-mm-dd
  };
  const addDays = (d: Date, n: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    return nd;
  };

  // ===== Dữ liệu mẫu theo ngày THỰC TẾ =====
  const today = new Date();
  const initialPlans: PlanItem[] = [
    { id: 'p1', name: 'Kế hoạch giảm cân 4 tuần', type: 'Giảm cân', startDate: toYMD(today), endDate: toYMD(addDays(today, 27)) },
    { id: 'p2', name: 'Lean bulk 8 tuần',        type: 'Tăng cơ',   startDate: toYMD(today), endDate: toYMD(addDays(today, 55)) },
    { id: 'p3', name: 'Giữ dáng Eat Clean 1 tháng', type: 'Giữ dáng', startDate: toYMD(today), endDate: toYMD(addDays(today, 29)) },
    { id: 'p4', name: 'Địa Trung Hải cải thiện sức khỏe', type: 'Cải thiện sức khỏe', startDate: toYMD(today), endDate: toYMD(addDays(today, 42)) },
  ];

  // ===== State =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);

  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
    if (location.state?.from) navigate(location.state.from);
    else navigate('/home');
  };

  const [q, setQ] = useState('');
  const [type, setType] = useState<PlanType | 'Tất cả'>('Tất cả');
  const [from, setFrom] = useState<string>(''); // yyyy-mm-dd
  const [to, setTo] = useState<string>('');

  const planTypes: (PlanType | 'Tất cả')[] = ['Tất cả', 'Giảm cân', 'Tăng cơ', 'Giữ dáng', 'Cải thiện sức khỏe'];

  const filtered = useMemo(() => {
    return plans.filter(p => {
      const matchName = p.name.toLowerCase().includes(q.trim().toLowerCase());
      const matchType = type === 'Tất cả' ? true : p.type === type;

      const f = from ? new Date(from) : null;
      const t = to ? new Date(to) : null;
      const s = new Date(p.startDate);
      const e = new Date(p.endDate);

      let matchTime = true;
      if (f && e < f) matchTime = false;
      if (t && s > t) matchTime = false;

      return matchName && matchType && matchTime;
    });
  }, [q, type, from, to, plans]);

  const goToPlan = (plan: PlanItem) => {
    // 🔔 cảnh báo nếu đã kết thúc
    const now = new Date();
    const ended = now > new Date(plan.endDate);
    if (ended) {
      notify.warning('Lịch trình này đã kết thúc. Bạn có muốn tạo lịch mới?', {
        title: 'Cảnh báo',
        action: { label: 'Tạo lịch mới', onClick: () => setIsModalOpen(true) },
      });
    }
    navigate('/goals', { state: { from: '/plans', planMeta: plan } });
  };

  // ===== Tạo lịch mới =====
  const handleCreatePlan = (newPlan: Omit<PlanItem, 'id'>) => {
    const id = 'p' + Date.now();
    const planWithId: PlanItem = { ...newPlan, id };
    setPlans(prev => [planWithId, ...prev]);
    setIsModalOpen(false);

    // 🔔 toast thành công
    notify.success('Lịch trình đã được tạo và bắt đầu từ ngày ' +
      new Date(planWithId.startDate).toLocaleDateString('vi-VN') + '.', {
      title: 'Thành công',
    });
  };

  const getPlanTypeIcon = (planType: PlanType) => {
    switch (planType) {
      case 'Giảm cân': return Target;
      case 'Tăng cơ': return Sparkles;
      case 'Giữ dáng': return Tags;
      case 'Cải thiện sức khỏe': return Clock;
      default: return Tags;
    }
  };

  const getPlanTypeColors = (planType: PlanType) => {
    switch (planType) {
      case 'Giảm cân':
        return { gradient: 'from-red-400 to-pink-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', glow: 'from-red-400/30 to-pink-400/30' };
      case 'Tăng cơ':
        return { gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', glow: 'from-green-400/30 to-emerald-400/30' };
      case 'Giữ dáng':
        return { gradient: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', glow: 'from-blue-400/30 to-cyan-400/30' };
      case 'Cải thiện sức khỏe':
        return { gradient: 'from-purple-400 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', glow: 'from-purple-400/30 to-pink-400/30' };
      default:
        return { gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', glow: 'from-gray-400/30 to-gray-500/30' };
    }
  };

  // 🔔 khi kết quả lọc trống -> toast 1 lần mỗi lần thay đổi điều kiện
  const toastShownRef = useRef<string>('');
  useEffect(() => {
    const key = JSON.stringify({ q, type, from, to });
    if (filtered.length === 0 && toastShownRef.current !== key) {
      notify.info('Không tìm thấy lịch trình phù hợp. Thử điều chỉnh bộ lọc hoặc từ khóa khác.', {
        title: 'Thông tin',
      });
      toastShownRef.current = key;
    }
  }, [filtered.length, q, type, from, to, notify]);

  return (
    <main className="relative z-20 w-full px-4 pt-[10px]">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 -z-10" />

      {/* ===== Header / Breadcrumb (style giống Goals) ===== */}
      <div className="mb-8 relative">
        <div className="absolute -inset-6 bg-gradient-to-r from-blue-400/20 via-cyan-400/40 to-purple-400/20 rounded-3xl blur-3xl animate-pulse"></div>
        <div className="relative">
          <div className="bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-4 text-gray-600">
              <button onClick={handleBack} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <div className="relative inline-flex items-center gap-3 px-4 py-3 hover:text-blue-600 transition-all duration-300 rounded-2xl">
                  <div className="relative">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                    <div className="absolute -inset-1 bg-blue-400/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <span className="font-semibold text-lg relative">
                    Dashboard
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500"></div>
                  </span>
                </div>
              </button>

              <ChevronRight className="w-6 h-6 text-gray-400" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Danh sách lịch trình
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tiêu đề ===== */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Danh sách lịch trình
          </span>
        </h1>
        <p className="text-gray-600 text-lg">Quản lý và theo dõi các lịch trình dinh dưỡng của bạn</p>
      </div>

      {/* ===== Search + Add ===== */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl opacity-20 blur"></div>
          <div className="relative">
            <Search className="w-5 h-5 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm theo tên lịch trình..."
              className="w-full pl-12 pr-4 h-14 rounded-2xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300"
            />
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative inline-flex items-center justify-center gap-3 h-14 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Thêm mới</span>
          </div>
        </button>
      </div>

      {/* ===== Bộ lọc chi tiết ===== */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tags className="w-4 h-4 text-blue-500" /> Loại lịch trình
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PlanType | 'Tất cả')}
                className="w-full h-12 rounded-xl border border-blue-200 bg-white/90 backdrop-blur-sm px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-300"
              >
                {planTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalIcon className="w-4 h-4 text-green-500" /> Từ ngày
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full h-12 rounded-xl border border-blue-200 bg-white/90 backdrop-blur-sm px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalIcon className="w-4 h-4 text-red-500" /> Đến ngày
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full h-12 rounded-xl border border-blue-200 bg-white/90 backdrop-blur-sm px-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Danh sách lịch trình ===== */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 via-cyan-400/20 to-blue-400/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-blue-200 p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Target className="w-7 h-7 text-blue-600" />
            Danh sách các lịch trình
            <span className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm px-3 py-1 rounded-full">
              {filtered.length} lịch trình
            </span>
          </h2>

          <div className="grid gap-6">
            {filtered.map((p, index) => {
              const colors = getPlanTypeColors(p.type);
              const Icon = getPlanTypeIcon(p.type);

              return (
                <div key={p.id} className="relative group" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className={`absolute -inset-1 bg-gradient-to-r ${colors.glow} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`} />
                  <button
                    onClick={() => goToPlan(p)}
                    className="relative w-full text-left p-6 rounded-2xl border border-gray-200 hover:border-blue-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r ${colors.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {p.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>
                              {new Date(p.startDate).toLocaleDateString('vi-VN')} – {new Date(p.endDate).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}>
                            <Icon className={`w-4 h-4 ${colors.text}`} />
                            <span className={`font-medium ${colors.text}`}>{p.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <PlanTimeBadge start={p.startDate} end={p.endDate} />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl font-medium text-gray-500 mb-2">Không tìm thấy lịch trình phù hợp</div>
                <div className="text-gray-400">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlan}
      />
    </main>
  );
}

/** Badge trạng thái theo thời gian hiện tại */
function PlanTimeBadge({ start, end }: { start: string; end: string }) {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);

  let label = 'Sắp bắt đầu';
  let bgClass = 'bg-gradient-to-r from-amber-400 to-orange-500';
  let glowClass = 'from-amber-400/50 to-orange-500/50';

  if (now < s) {
    label = 'Sắp bắt đầu';
    bgClass = 'bg-gradient-to-r from-amber-400 to-orange-500';
    glowClass = 'from-amber-400/50 to-orange-500/50';
  } else if (now > e) {
    label = 'Đã kết thúc';
    bgClass = 'bg-gradient-to-r from-gray-400 to-gray-500';
    glowClass = 'from-gray-400/50 to-gray-500/50';
  } else {
    label = 'Đang diễn ra';
    bgClass = 'bg-gradient-to-r from-green-400 to-emerald-500';
    glowClass = 'from-green-400/50 to-emerald-500/50';
  }

  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${glowClass} rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`} />
      <span className={`relative inline-flex items-center justify-center px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg ${bgClass} hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
        {label}
      </span>
    </div>
  );
}
