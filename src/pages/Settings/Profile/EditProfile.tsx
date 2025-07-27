import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@nutriai.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    dateOfBirth: '1990-01-01',
    bio: 'Health enthusiast and nutrition tracking expert.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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
      <div className="relative z-20 p-2">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 via-cyan-400/50 to-blue-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/30">
              <ArrowLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
              <span className="text-lg font-semibold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Back to Profile
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/50 to-emerald-400/50 rounded-xl blur-lg animate-pulse"></div>
            <div className="relative bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              Profile updated successfully!
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Edit Profile
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Update your personal information</p>
        </div>

        {/* Edit Form */}
        <div className="relative">
          {/* Enhanced Glowing Border */}
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-500" />
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-all duration-300"></div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="relative w-full px-4 py-3 border-2 border-blue-200/50 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-all duration-300"></div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="relative w-full px-4 py-3 border-2 border-blue-200/50 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-all duration-300"></div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="relative w-full px-4 py-3 border-2 border-green-200/50 rounded-xl focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-all duration-300"></div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="relative w-full px-4 py-3 border-2 border-purple-200/50 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative max-w-md">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-xl blur opacity-0 focus-within:opacity-100 transition-all duration-300"></div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="relative w-full px-4 py-3 border-2 border-orange-200/50 rounded-xl focus:border-orange-400 focus:outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link 
                  to="/profile"
                  className="flex-1 relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <button 
                    type="button"
                    className="relative w-full flex items-center justify-center gap-2 border-2 border-gray-300/50 px-6 py-3 rounded-full text-gray-700 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </Link>

                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full blur opacity-60 animate-pulse"></div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </span>
                    {!isLoading && (
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}