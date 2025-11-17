import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

import {
  Server,
  FileText,
  Zap,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Clock,
  Globe,
  Calendar,
  UserCheck,
  Target,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { CleanRootState, AppDispatch } from "../../redux/store";

import {
  fetchAllServiceStats,
  fetchRequestLogsStats,
} from "../../redux/slices/systemStatsSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<"user" | "system">("user");

  const { loading, serviceStats, requestLogs } = useSelector(
    (state: CleanRootState) => state.system
  );

  useEffect(() => {
    dispatch(fetchAllServiceStats());
    dispatch(fetchRequestLogsStats());
  }, [dispatch]);

  if (loading || !serviceStats || !requestLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative z-10 w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-blue-100 text-lg ml-[68px]">
            Real-time monitoring and analytics
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 mb-6 inline-flex gap-2 shadow-xl">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === "user"
              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Users className="w-5 h-5" />
            Thống kê User
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === "system"
              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Server className="w-5 h-5" />
            Thống kê Hệ thống
          </button>
        </div>

        <div className="transition-all duration-500">
          {activeTab === "user" ? (
            <UserStatsView serviceStats={serviceStats} />
          ) : (
            <SystemStatsView serviceStats={serviceStats} requestLogs={requestLogs} />
          )}
        </div>
      </div>
    </div>
  );
}
function UserStatsView({ serviceStats }: any) {
  const userData = serviceStats?.results?.user?.data;

  const totalUsers = userData?.totalUsers ?? 0;
  const goodBMIUsers = userData?.goodBMIUsers ?? 0;

  // Phân bố giới tính
  const genderStats = userData?.genderStats?.map((g: any) => ({
    gender: g._id || "UNKNOWN",
    count: g.count,
  })) || [];

  // Phân bố hoạt động
  const activityStats = userData?.activityStats?.map((a: any) => ({
    level: a._id || "Không rõ",
    count: a.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* --- Thẻ thống kê --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        <StatCard
          title="Tổng Users"
          value={totalUsers}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Users có BMI tốt"
          value={goodBMIUsers}
          icon={UserCheck}
          color="green"
        />

        <StatCard
          title="Giới tính phổ biến"
          value={
            genderStats.length
              ? genderStats.reduce(
                (a: { gender: string; count: number }, b: { gender: string; count: number }) =>
                  a.count > b.count ? a : b
              ).gender

              : "Không rõ"
          }
          icon={TrendingUp}
          color="purple"
          isText
        />
      </div>

      {/* --- Biểu đồ giới tính --- */}
      <ChartCard title="Phân bố Giới tính" icon={Users}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={genderStats}
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              dataKey="count"
              label={({ gender, percent }: any) =>
                `${gender}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {genderStats.map((item: any, idx: number) => (
                <Cell
                  key={idx}
                  fill={["#3b82f6", "#10b981", "#f59e0b"][idx]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}


function SystemStatsView({ serviceStats, requestLogs }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Requests Hôm nay"
          value={requestLogs.today?.total ?? 0}
          icon={Zap}
          color="blue"
          trend="+15.3%"
        />

        <StatCard
          title="Requests Tuần"
          value={requestLogs.week?.total ?? 0}  
          icon={Calendar}
          color="green"
          trend="+8.7%"
        />

        <StatCard
          title="Requests Tháng"
          value={requestLogs.month?.total ?? 0}
          icon={BarChart3}
          color="purple"
          trend="+22.4%"
        />

        <StatCard
          title="Top API"
          value={requestLogs.api?.api || "Không có dữ liệu"}
          icon={Activity}
          color="orange"
          isText
          subtitle={requestLogs.api?.totalWeek ? `${requestLogs.api.totalWeek} calls` : ""}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TableCard title="Trạng thái Dịch vụ" icon={Server}>
          <div className="space-y-3">
            {Object.entries(serviceStats.results || {}).map(
              ([serviceName, st]: any) => (
                <ServiceHealthItem
                  key={serviceName}
                  name={serviceName}
                  st={st}
                />
              )
            )}
          </div>
        </TableCard>

        <ChartCard title="Request Logs theo Dịch vụ" icon={FileText}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={requestLogs.services.details || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="service" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="today" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="week" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="month" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Tổng quan Request Logs" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={requestLogs.services.details || []}>
            <defs>
              <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="service" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="month"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#colorMonth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend, isText = false, subtitle = "" }: any) {
  const colors: any = {
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-600",
    orange: "from-orange-500 to-red-600",
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className={`${isText ? "text-xl" : "text-3xl"} font-bold text-gray-900`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function ServiceHealthItem({ name, st }: any) {
  const healthy = st.status === "success";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-105 ${healthy
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
        : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
        }`}
    >
      <div className="flex items-center gap-3">
        {healthy ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600" />
        )}
        <span className="font-semibold text-gray-800 capitalize">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${healthy
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {st.status}
        </span>
        <span className="text-sm text-gray-600 font-mono">
          {st.duration}
        </span>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TableCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}
