import React, { useState } from 'react';
import { ArrowLeft, User, Edit, Camera, Settings, Mail, Phone, MapPin, Calendar, Shield, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileSettings() {
  const [userData] = useState({
    name: 'Admin User',
    email: 'admin@nutriai.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    avatar: '/src/assets/default-avatar.jpg'
  });

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Aurora Waves */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Aurora Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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
      <div className="relative z-20 p-1">
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
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Manage your account and preferences</p>
        </div>

        {/* Profile Content */}
        <div className="grid lg:grid-cols-3 gap-2">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="relative">
              {/* Enhanced Glowing Border */}
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
              
              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                {/* Avatar Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <Link 
                      to="/profile/change-avatar"
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </Link>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mt-4">{userData.name}</h2>
                  <p className="text-blue-600 font-medium">{userData.email}</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link 
                    to="/profile/edit"
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group border border-blue-200/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Edit Profile</p>
                      <p className="text-sm text-gray-600">Update your information</p>
                    </div>
                  </Link>

                  <Link 
                    to="/profile/change-avatar"
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group border border-green-200/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Change Avatar</p>
                      <p className="text-sm text-gray-600">Upload profile picture</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Enhanced Glowing Border */}
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
              
              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-500" />
                  Account Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-8">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-700">Email</span>
                      </div>
                      <p className="text-gray-800 ml-8">{userData.email}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-700">Phone</span>
                      </div>
                      <p className="text-gray-800 ml-8">{userData.phone}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-gray-700">Location</span>
                      </div>
                      <p className="text-gray-800 ml-8">{userData.location}</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-8">
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-gray-700">Member Since</span>
                      </div>
                      <p className="text-gray-800 ml-8">{userData.joinDate}</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <span className="font-semibold text-gray-700">Account Status</span>
                      </div>
                      <p className="text-gray-800 ml-8">Active Premium</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-5 h-5 text-cyan-500" />
                        <span className="font-semibold text-gray-700">Notifications</span>
                      </div>
                      <p className="text-gray-800 ml-8">Email & Push Enabled</p>
                    </div>
                  </div>
                </div>             
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}