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
  Calendar,
  UserCheck,
  Target,
  ClipboardList,
  Mail,
  Settings,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { CleanRootState, AppDispatch } from "../../redux/store";
import AddAdminModal from "./AddAdminModal";
import AdminListModal from "./AdminListModal";
import { useNotify } from "../../components/notifications/NotificationsProvider";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

import {
  fetchAllServiceStats,
  fetchRequestLogsStats,
} from "../../redux/slices/systemStatsSlice";
import Portal from "../../components/Portal";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../redux/slices/authSlice";
import { clearUser } from "../../redux/slices/userSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const notify = useNotify();

  const [activeTab, setActiveTab] = useState<"user" | "system">("user");
  const [activeUserMenu, setActiveUserMenu] = useState<
    "scheduleResult" | "auth" | "user" | "meal" | "schedule"
  >("user");

  const { loading, serviceStats, requestLogs } = useSelector(
    (state: CleanRootState) => state.system
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);

  useEffect(() => {
    dispatch(fetchAllServiceStats())
      .unwrap()
      .catch(() => notify.error("Không tải được thống kê hệ thống!"));

    dispatch(fetchRequestLogsStats())
      .unwrap()
      .catch(() => notify.error("Không tải được logs yêu cầu!"));
  }, [dispatch]);

  const handleLogout = () => {
    notify.success("Đăng xuất thành công!");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("persist:root");

    dispatch(clearAuth());
    dispatch(clearUser());

    navigate("/login");
  };
 
  if (loading || !serviceStats || !requestLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-xl font-semibold tracking-wide">
            Loading Dashboard...
          </p>
          <p className="text-slate-400 text-sm mt-2">Loading statistics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-visible">

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 px-8 py-10 max-w-[1800px] mx-auto">

        <div className="mb-14">

          <div className="flex items-center justify-between gap-10">

            {/* LEFT: ICON + TITLE */}
            <div className="flex items-center gap-6">
              {/* ICON WITH GLOW */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-40"></div>
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-2xl border border-white/10">
                  <BarChart3 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* TITLE */}
              <div className="flex flex-col">
                <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-lg mt-1 font-medium">
                  Real-time Monitoring & AI-driven Analytics
                </p>
              </div>
            </div>

            {/* RIGHT: TOP TABS */}
            <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-slate-700/50">

              {/* TAB 1 */}
              <button
                onClick={() => setActiveTab("user")}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300
    ${activeTab === "user"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <Users className="w-5 h-5" strokeWidth={2.5} />
                User Statistics
              </button>

              {/* TAB 2 */}
              <button
                onClick={() => setActiveTab("system")}
                className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300
    ${activeTab === "system"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <Server className="w-5 h-5" strokeWidth={2.5} />
                System Statistics
              </button>

              {/* ⚙️ SETTINGS DROPDOWN */}
              <div className="relative z-[9999]">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-6 py-3 ml-3 rounded-xl bg-gradient-to-r 
      from-indigo-500 to-violet-600 text-white font-semibold shadow-lg 
      shadow-violet-500/30 hover:scale-105 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                {showSettings && (
                  <Portal>
                    <div className="fixed top-[130px] right-[30px] w-56 z-[99999]">
                      <div className="bg-slate-800 border border-slate-700/50 shadow-2xl rounded-xl overflow-hidden">

                        <button
                          onClick={() => { setShowSettings(false); setShowAddAdmin(true); }}
                          className="w-full text-left px-5 py-3 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" /> Add Admin
                        </button>

                        <button
                          onClick={() => { setShowSettings(false); setShowAdminList(true); }}
                          className="w-full text-left px-5 py-3 hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" /> Admin List
                        </button>

                        <button
                          onClick={() => {
                            setShowSettings(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-red-600/20 text-red-400 flex items-center gap-2 border-t border-slate-700/50"
                        >
                          <XCircle className="w-4 h-4" /> Logout
                        </button>

                      </div>
                    </div>
                  </Portal>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="flex gap-6">

          {activeTab === "user" && (
            <div className="w-80 bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/50">

              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-3 pb-4 border-b border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                Statistics Menu
              </h3>

              <div className="space-y-2">
                {[
                  { key: "auth", label: "Authentication", icon: UserCheck },
                  { key: "user", label: "Users", icon: Users },
                  { key: "meal", label: "Meals", icon: FileText },
                  { key: "schedule", label: "Schedules", icon: Calendar },
                  { key: "scheduleResult", label: "Results", icon: Target },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveUserMenu(key as any)}
                    className={`w-full text-left px-5 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${activeUserMenu === key
                      ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/30"
                      }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1">
            {activeTab === "user" ? (
              <UserStatsView
                serviceStats={serviceStats}
                activeUserMenu={activeUserMenu}
              />
            ) : (
              <SystemStatsView
                serviceStats={serviceStats}
                requestLogs={requestLogs}
              />
            )}
          </div>
        </div>
      </div>
      {showAddAdmin && (
        <AddAdminModal onClose={() => setShowAddAdmin(false)} />
      )}

      {showAdminList && (
        <AdminListModal onClose={() => setShowAdminList(false)} />
      )}
    </div>
  );
}

function UserStatsView({ serviceStats, activeUserMenu }: any) {
  const results = serviceStats?.results || {};

  const menuMap: any = {
    scheduleResult: results.scheduleResult?.data,
    auth: results.auth?.data,
    user: results.user?.data,
    meal: results.meal?.data,
    schedule: results.schedule?.data,
  };

  const data = menuMap[activeUserMenu];

  return (
    <div className="space-y-6">

      <div className="bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/50">
        <h2 className="text-4xl font-bold text-white capitalize flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          {activeUserMenu}
        </h2>
      </div>

      {activeUserMenu === "scheduleResult" && <ScheduleResultView data={data} />}
      {activeUserMenu === "auth" && <AuthView data={data} />}
      {activeUserMenu === "user" && <UserDetailView data={data} />}
      {activeUserMenu === "meal" && <MealStatsView data={data} />}
      {activeUserMenu === "schedule" && <ScheduleStatsView data={data} />}
    </div>
  );
}

function ScheduleResultView({ data }: any) {
  const stats = data.statistics;

  const chartData = [
    { name: "Completion", value: stats.completionRate },
    { name: "Goal Achieved", value: stats.goalAchievedRate },
    { name: "Adherence", value: stats.adherenceAverage },
    { name: "Difficulty", value: stats.difficultyAverage },
  ];

  return (
    <ChartCard title="Schedule Result Overview" icon={Target}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 40, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />

          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="#94a3b8" />
          <YAxis type="category" dataKey="name" width={120} stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(v) => `${v}%`}
          />

          <Bar
            dataKey="value"
            radius={[0, 10, 10, 0]}
            activeBar={false}
            background={false}
            className="bar-hover-effect"   // 👈 thêm class này
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"][index]}
                className="transition-all duration-300 hover:brightness-150 hover:scale-[1.02] origin-left"
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
function AuthView({ data }: any) {
  return (
    <div className="space-y-6">

      {/* ----- CỤM 1: 3 StatCard ----- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total accounts"
          value={data.totalAccounts}
          icon={Users}
          color="emerald"
        />

        <StatCard
          title="1 login method"
          value={data.usersWith1LoginMethod}
          icon={UserCheck}
          color="blue"
        />

        <StatCard
          title="2 login method"
          value={data.usersWith2LoginMethods}
          icon={TrendingUp}
          color="violet"
        />
      </div>

      {/* ----- CỤM 2: Email chưa link + 10 User gần nhất ----- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <StatCard
          title="Email not linked with Google"
          value={data.emailVerifiedButNotLinkedGoogle}
          icon={Mail}
          color="amber"
        />

        <ChartCard title="10 Latest Users" icon={Users}>
          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {data.recent10Ids.map((id: string, idx: number) => (
              <div
                key={id}
                className="bg-slate-700/30 p-3 rounded-xl border border-slate-600/30 
                hover:border-emerald-500/50 transition-all duration-300 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 
                flex items-center justify-center text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <span className="text-slate-300 font-mono text-sm">{id}</span>
              </div>
            ))}
          </div>
        </ChartCard>

      </div>

    </div>
  );
}

function UserDetailView({ data }: any) {
  const genderStats = data.genderStats?.map((g: any) => ({
    name: g._id,
    value: g.count,
  }));

  const activityStats = data.activityStats?.map((a: any) => ({
    name: a._id || "Không rõ",
    value: a.count,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

        <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="emerald" />

        <StatCard title="Good BMI Users" value={data.goodBMIUsers} icon={UserCheck} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* PIE CHART - Gender */}
        <ChartCard title="Gender" icon={Users}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderStats}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={(entry) => `${entry.name}: ${entry.value}`}
                labelLine={{ stroke: "#94a3b8" }}
              >
                {genderStats.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function MealStatsView({ data }: any) {
  const days = data?.templatesByDays || [];

  const daysData = days.map((d: any) => ({
    name: `${d._id} ngày`,
    value: d.count,
  }));

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total templates" value={data.totalTemplates} icon={FileText} color="emerald" />
        <StatCard title="Most used duration" value={data.mostUsedDuration} icon={TrendingUp} color="violet" />
        <StatCard title="Total scanned meals" value={data.totalScannedMeals} icon={Activity} color="blue" />
      </div>

      <ChartCard title="Templates by days" icon={Calendar}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={daysData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Latest 3 scans" icon={Activity}>
        <div className="space-y-3">
          {(data?.latestScans || []).map((scan: any, idx: number) => (
            <div key={scan._id} className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-emerald-500/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{scan.food_vi}</p>
                    <p className="text-emerald-400 font-semibold">{scan.nutrition.calories} kcal</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{scan.scannedAt}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ScheduleStatsView({ data }: any) {
  const totals = [
    { name: "Today", value: data.totals.today },
    { name: "This week", value: data.totals.thisWeek },
    { name: "This month", value: data.totals.thisMonth },
  ];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Today" value={data.totals.today} icon={Calendar} color="emerald" />
        <StatCard title="This week" value={data.totals.thisWeek} icon={Calendar} color="blue" />
        <StatCard title="This month" value={data.totals.thisMonth} icon={Calendar} color="violet" />
      </div>

      <ChartCard title="Overview chart" icon={BarChart3}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={totals}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar fill="url(#scheduleGradient)" dataKey="value" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="scheduleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function SystemStatsView({ serviceStats, requestLogs }: any) {
  const daily = requestLogs.dailyStats || [];

  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");
  // vì startOf('week') = Chủ Nhật, +1 ngày = Thứ 2

  const weekData = daily.filter((d: any) => {
    const date = dayjs(d.date);
    return date.isAfter(startOfWeek.subtract(1, "day")) && date.isBefore(today.add(1, "day"));
  });

  const weekTotal = weekData.reduce((sum: number, d: any) => sum + (d.totalRequests || 0), 0);
  
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard title="Today requests" value={requestLogs.today?.total ?? 0}
          icon={Zap} color="emerald" trend="+15%" />

        <StatCard
          title="Requests tuần"
          value={weekTotal}
          icon={Calendar}
          color="blue"
          trend="+9%"
        />

        <StatCard title="Weekly requests" value={requestLogs.month?.total ?? 0}
          icon={BarChart3} color="violet" trend="+22%" />

        <StatCard title="Top API" value={requestLogs.api?.api || "No Data"}
          icon={Activity} color="amber" isText
          subtitle={
            requestLogs.api?.totalWeek
              ? `${requestLogs.api.totalWeek} calls`
              : ""
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TableCard title="Service status" icon={Server}>
          <div className="space-y-3">
            {Object.entries(serviceStats.results || {}).map(
              ([name, st]: any) => (
                <ServiceHealthItem key={name} name={name} st={st} />
              )
            )}
          </div>
        </TableCard>

        <ChartCard title="Requests by services" icon={FileText}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={requestLogs.services.details || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="service" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="today" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="week" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="month" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="DailyStats" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={requestLogs.dailyStats || []}>
            <defs>
              <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tickFormatter={(d) => d.slice(5)}   // hiện "11-16", "11-17"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff'
              }}
              formatter={(val) => [`${val} requests`, "Tổng"]}
            />

            <Area
              type="monotone"
              dataKey="totalRequests"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#dailyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  isText = false,
  subtitle = "",
}: any) {

  const colors: any = {
    emerald: {
      gradient: "from-emerald-500 to-emerald-600",
      text: "text-emerald-400",
    },
    blue: {
      gradient: "from-blue-500 to-blue-600",
      text: "text-blue-400",
    },
    violet: {
      gradient: "from-violet-500 to-violet-600",
      text: "text-violet-400",
    },
    amber: {
      gradient: "from-amber-500 to-amber-600",
      text: "text-amber-400",
    },
  };

  const scheme = colors[color];

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">

      {/* 🔥 ICON + TITLE cùng hàng giống ChartCard */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">

        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        {trend && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${scheme.text} bg-white/5 border border-white/10`}>
            {trend}
          </span>
        )}
      </div>

      {/* VALUE */}
      <p className={`text-white font-bold ${isText ? "text-xl" : "text-4xl"}`}>
        {value}
      </p>

      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
}

function ServiceHealthItem({ name, st }: any) {
  const healthy = st.status === "success";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] ${healthy
        ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50"
        : "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
        }`}
    >
      <div className="flex items-center gap-3">
        {healthy ? (
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-400" strokeWidth={2.5} />
          </div>
        )}

        <span className="font-bold text-white capitalize text-lg">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-bold ${healthy
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
        >
          {st.status}
        </span>

        <span className="font-mono text-slate-400 text-sm font-semibold">{st.duration}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>

        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      {children}
    </div>
  );
}

function TableCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      {children}
    </div>
  );
}
