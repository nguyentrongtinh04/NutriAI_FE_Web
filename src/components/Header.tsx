import React, { useState } from 'react';
import { Bell, Settings, User, Utensils, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('accessToken'); // Xóa token
    navigate('/login'); // Quay lại trang đăng nhập
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-blue-200/50 shadow-lg">
      <div className="max-w-9xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
            <img
              src="/src/assets/logo.png"
              alt="NutriAI Logo"
              className="relative w-20 h-15 object-contain drop-shadow-2xl filter brightness-110 contrast-110 saturate-110"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            NutriAI
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg">
            Dashboard
          </a>
          <a href="#" className="px-4 py-2 text-blue-700 hover:text-blue-900 font-medium transition-colors">
            Image Scan
          </a>
          <a href="#" className="px-4 py-2 text-blue-700 hover:text-blue-900 font-medium transition-colors">
            Meal Plan
          </a>
          <a href="#" className="px-4 py-2 text-blue-700 hover:text-blue-900 font-medium transition-colors">
            Progress
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <Settings className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
          
          {/* Enhanced User Menu with SignOut */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-2 cursor-pointer hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-800 font-medium">ADMIN</span>
              <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            {/* Enhanced Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 origin-top-right">
                {/* Enhanced Glowing Border */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 via-cyan-400/40 to-blue-500/30 rounded-2xl blur-lg animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-400/30 to-cyan-500/20 rounded-2xl blur-md animate-pulse delay-300"></div>
                
                <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/60 overflow-hidden transform animate-in slide-in-from-top-2 duration-300">
                  {/* User Info Section */}
                  <div className="p-4 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-sm animate-pulse"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Admin User</p>
                        <p className="text-sm text-blue-600">admin@nutriai.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg flex items-center justify-center group-hover:from-blue-400/30 group-hover:to-cyan-400/30 transition-all duration-300">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Profile Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 rounded-xl transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg flex items-center justify-center group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all duration-300">
                        <Settings className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Account Settings</span>
                    </button>

                    {/* Divider */}
                    <div className="my-2 border-t border-blue-100/50"></div>

                    {/* Enhanced SignOut Button */}
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-all duration-300 group transform hover:scale-[1.02]"
                    >
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                        <div className="relative w-8 h-8 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-lg flex items-center justify-center group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                          <LogOut className="w-4 h-4 text-red-600 group-hover:animate-pulse" />
                        </div>
                      </div>
                      <span className="text-red-600 font-medium group-hover:text-red-700">Sign Out</span>
                    </button>
                  </div>

                  {/* Enhanced Bottom Glow Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Click Outside Overlay */}
            {showUserMenu && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setShowUserMenu(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}