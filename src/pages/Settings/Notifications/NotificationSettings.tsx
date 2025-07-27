import React, { useState } from 'react';
import { ArrowLeft, Bell, BellRing, Utensils, TrendingUp, MessageCircle, Clock, Shield, Smartphone, Mail, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationState {
  masterToggle: boolean;
  mealReminders: boolean;
  progressUpdates: boolean;
  aiRecommendations: boolean;
  socialNotifications: boolean;
  scheduledReminders: boolean;
  securityAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEffects: boolean;
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationState>({
    masterToggle: true,
    mealReminders: true,
    progressUpdates: true,
    aiRecommendations: true,
    socialNotifications: false,
    scheduledReminders: true,
    securityAlerts: true,
    pushNotifications: true,
    emailNotifications: false,
    soundEffects: true,
  });

  const handleMasterToggle = (enabled: boolean) => {
    setNotifications(prev => {
      const newState = { ...prev, masterToggle: enabled };
      if (!enabled) {
        // Turn off all notifications when master is disabled
        Object.keys(newState).forEach(key => {
          if (key !== 'masterToggle') {
            (newState as any)[key] = false;
          }
        });
      }
      return newState;
    });
  };

  const handleToggle = (key: keyof NotificationState) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const NotificationToggle = ({ 
    enabled, 
    onChange, 
    disabled = false 
  }: { 
    enabled: boolean; 
    onChange: () => void; 
    disabled?: boolean;
  }) => (
    <div className="relative">
      <div className={`
        w-14 h-8 rounded-full cursor-pointer transition-all duration-500 transform
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${enabled 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' 
          : 'bg-gray-300'
        }
      `} onClick={!disabled ? onChange : undefined}>
        {/* Glow effect when enabled */}
        {enabled && !disabled && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
        )}
        <div className={`
          relative w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform top-1
          ${enabled ? 'translate-x-7' : 'translate-x-1'}
          ${!disabled && 'hover:shadow-xl'}
        `}></div>
      </div>
    </div>
  );

  const notificationItems = [
    {
      key: 'mealReminders' as keyof NotificationState,
      icon: Utensils,
      title: 'Meal Reminders',
      description: 'Get reminded about meal times and nutrition goals',
      gradient: 'from-green-400 via-emerald-500 to-green-400',
      cardGradient: 'from-green-400/40 via-emerald-500/50 to-green-400/40',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverBg: 'hover:bg-green-100/80',
      borderColor: 'border-green-200/60'
    },
    {
      key: 'progressUpdates' as keyof NotificationState,
      icon: TrendingUp,
      title: 'Progress Updates',
      description: 'Receive weekly progress reports and achievements',
      gradient: 'from-purple-400 via-indigo-500 to-purple-400',
      cardGradient: 'from-purple-400/40 via-indigo-500/50 to-purple-400/40',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverBg: 'hover:bg-purple-100/80',
      borderColor: 'border-purple-200/60'
    },
    {
      key: 'aiRecommendations' as keyof NotificationState,
      icon: MessageCircle,
      title: 'AI Recommendations',
      description: 'Smart suggestions based on your nutrition patterns',
      gradient: 'from-cyan-400 via-teal-500 to-cyan-400',
      cardGradient: 'from-cyan-400/40 via-teal-500/50 to-cyan-400/40',
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      hoverBg: 'hover:bg-cyan-100/80',
      borderColor: 'border-cyan-200/60'
    },
    {
      key: 'socialNotifications' as keyof NotificationState,
      icon: Bell,
      title: 'Social Notifications',
      description: 'Updates from friends and community interactions',
      gradient: 'from-pink-400 via-rose-500 to-pink-400',
      cardGradient: 'from-pink-400/40 via-rose-500/50 to-pink-400/40',
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100',
      hoverBg: 'hover:bg-pink-100/80',
      borderColor: 'border-pink-200/60'
    },
    {
      key: 'scheduledReminders' as keyof NotificationState,
      icon: Clock,
      title: 'Scheduled Reminders',
      description: 'Custom reminders for water intake and supplements',
      gradient: 'from-orange-400 via-amber-500 to-orange-400',
      cardGradient: 'from-orange-400/40 via-amber-500/50 to-orange-400/40',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
      hoverBg: 'hover:bg-orange-100/80',
      borderColor: 'border-orange-200/60'
    },
    {
      key: 'securityAlerts' as keyof NotificationState,
      icon: Shield,
      title: 'Security Alerts',
      description: 'Important security and account notifications',
      gradient: 'from-red-400 via-pink-500 to-red-400',
      cardGradient: 'from-red-400/40 via-pink-500/50 to-red-400/40',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      hoverBg: 'hover:bg-red-100/80',
      borderColor: 'border-red-200/60'
    }
  ];

  const deliveryMethods = [
    {
      key: 'pushNotifications' as keyof NotificationState,
      icon: Smartphone,
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      gradient: 'from-blue-400 via-cyan-500 to-blue-400',
      cardGradient: 'from-blue-400/40 via-cyan-500/50 to-blue-400/40',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-100/80',
      borderColor: 'border-blue-200/60'
    },
    {
      key: 'emailNotifications' as keyof NotificationState,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Get notifications via email',
      gradient: 'from-violet-400 via-purple-500 to-violet-400',
      cardGradient: 'from-violet-400/40 via-purple-500/50 to-violet-400/40',
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-100',
      hoverBg: 'hover:bg-violet-100/80',
      borderColor: 'border-violet-200/60'
    },
    {
      key: 'soundEffects' as keyof NotificationState,
      icon: Volume2,
      title: 'Sound Effects',
      description: 'Play sounds for notifications',
      gradient: 'from-yellow-400 via-orange-500 to-yellow-400',
      cardGradient: 'from-yellow-400/40 via-orange-500/50 to-yellow-400/40',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      hoverBg: 'hover:bg-yellow-100/80',
      borderColor: 'border-yellow-200/60'
    }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-300 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 via-cyan-400/50 to-blue-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/30">
              <ArrowLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
              <span className="text-lg font-semibold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Back
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-500/40 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
                <BellRing className="w-12 h-12 text-cyan-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Notification Settings
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Customize how and when you receive notifications</p>
        </div>

        {/* Master Toggle Card */}
        <div className="relative mb-8">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 via-cyan-500/50 to-blue-400/40 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-500/30 rounded-3xl blur-lg opacity-30 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-blue-100 p-4 rounded-full">
                    <BellRing className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">All Notifications</h2>
                  <p className="text-gray-600 text-lg">Master switch to control all notifications</p>
                </div>
              </div>
              <NotificationToggle
                enabled={notifications.masterToggle}
                onChange={() => handleMasterToggle(!notifications.masterToggle)}
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur animate-pulse"></div>
              <div className="relative bg-green-100 p-2 rounded-full">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Notification Types
            </span>
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notificationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="relative">
                  <div className={`absolute -inset-3 bg-gradient-to-r ${item.cardGradient} rounded-3xl blur-xl opacity-40 animate-pulse`}></div>
                  <div className={`absolute -inset-2 bg-gradient-to-r ${item.gradient} rounded-3xl blur-lg opacity-30 animate-pulse delay-500`}></div>
                  
                  <div className={`relative bg-white/95 backdrop-blur-3xl border-2 ${item.borderColor} rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-full blur animate-pulse`}></div>
                        <div className={`relative ${item.bgColor} p-3 rounded-full`}>
                          <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                      </div>
                      <NotificationToggle
                        enabled={notifications[item.key]}
                        onChange={() => handleToggle(item.key)}
                        disabled={!notifications.masterToggle}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Methods */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur animate-pulse"></div>
              <div className="relative bg-purple-100 p-2 rounded-full">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              Delivery Methods
            </span>
          </h3>
          
          <div className="grid gap-6 md:grid-cols-3">
            {deliveryMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.key} className="relative">
                  <div className={`absolute -inset-3 bg-gradient-to-r ${method.cardGradient} rounded-3xl blur-xl opacity-40 animate-pulse`}></div>
                  <div className={`absolute -inset-2 bg-gradient-to-r ${method.gradient} rounded-3xl blur-lg opacity-30 animate-pulse delay-500`}></div>
                  
                  <div className={`relative bg-white/95 backdrop-blur-3xl border-2 ${method.borderColor} rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${method.gradient} rounded-full blur animate-pulse`}></div>
                        <div className={`relative ${method.bgColor} p-3 rounded-full`}>
                          <IconComponent className={`w-6 h-6 ${method.iconColor}`} />
                        </div>
                      </div>
                      <NotificationToggle
                        enabled={notifications[method.key]}
                        onChange={() => handleToggle(method.key)}
                        disabled={!notifications.masterToggle}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h4>
                      <p className="text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/50 via-cyan-400/60 to-blue-500/50 rounded-2xl blur-xl animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/40 via-blue-400/50 to-cyan-500/40 rounded-2xl blur-lg animate-pulse delay-300"></div>
            
            <button className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl px-12 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}