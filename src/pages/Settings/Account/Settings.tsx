import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Lock, Mail, Shield, User, Phone, Trash2, Plus, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import EmailManagement from './EmailManagement';

export default function Settings() {
  const [activeSection, setActiveSection] = useState<'main' | 'changePassword' | 'emailManagement'>('main');

  const handleBackToSettings = () => {
    setActiveSection('main');
  };

  if (activeSection === 'changePassword') {
    return <ChangePassword onBack={handleBackToSettings} />;
  }

  if (activeSection === 'emailManagement') {
    return <EmailManagement onBack={handleBackToSettings} />;
  }

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
        <Link 
          to="/home" 
          className="inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 via-cyan-400/50 to-blue-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/30">
              <ArrowLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
              <span className="text-lg font-semibold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Back to Dashboard
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 via-cyan-300/50 to-blue-500/40 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
                <SettingsIcon className="w-12 h-12 text-cyan-400 animate-spin-slow" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Manage your account security and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Security Settings */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-red-400 via-pink-500 to-red-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-red-400 to-pink-500 rounded-3xl blur-lg opacity-30 animate-pulse delay-500"></div>
            
            <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-red-200/60 rounded-3xl p-6 shadow-2xl shadow-red-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur animate-pulse"></div>
                  <div className="relative bg-red-100 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Security</h3>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setActiveSection('changePassword')}
                  className="w-full flex items-center gap-4 p-4 bg-red-50/80 hover:bg-red-100/80 border-2 border-red-200/50 hover:border-red-300 rounded-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-red-200 p-2 rounded-lg group-hover:bg-red-300 transition-colors">
                      <Lock className="w-5 h-5 text-red-700" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">Change Password</p>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Edit3 className="w-5 h-5 text-red-600 group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Management */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 rounded-3xl blur-lg opacity-30 animate-pulse delay-500"></div>
            
            <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-green-200/60 rounded-3xl p-6 shadow-2xl shadow-green-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur animate-pulse"></div>
                  <div className="relative bg-green-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Email Management</h3>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setActiveSection('emailManagement')}
                  className="w-full flex items-center gap-4 p-4 bg-green-50/80 hover:bg-green-100/80 border-2 border-green-200/50 hover:border-green-300 rounded-xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative bg-green-200 p-2 rounded-lg group-hover:bg-green-300 transition-colors">
                      <Mail className="w-5 h-5 text-green-700" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">Manage Emails</p>
                    <p className="text-sm text-gray-600">Add or remove email addresses</p>
                  </div>
                  <Edit3 className="w-5 h-5 text-green-600 group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}