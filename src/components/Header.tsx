import React from 'react';
import { Bell, Settings, User, Utensils } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-50 bg-white/90 backdrop-blur-sm border-b border-blue-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2">
              <Utensils className="w-8 h-8 text-white" />
            </div>
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
          <div className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-800 font-medium">ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
