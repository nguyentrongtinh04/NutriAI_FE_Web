import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Edit, Camera, Settings, Mail, Phone, Calendar, Save, X, Upload, Check } from 'lucide-react';

export default function ProfileSettings() {
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@nutriai.com',
    phone: '+1 234 567 8900',
    gender: 'Male',
    birthDate: '1990-01-15',
    avatar: '/src/assets/default-avatar.jpg'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Avatar Modal Functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveAvatar = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUserData(prev => ({ ...prev, avatar: selectedImage }));
    setIsLoading(false);
    setShowAvatarModal(false);
    setSelectedImage(null);
  };

  const resetImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    setShowAvatarModal(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
        </div>

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
      <div className="relative z-20 p-6">
        <button
          onClick={() => window.history.back()}
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
        </button>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Camera className="w-6 h-6 text-blue-500" />
                  Change Avatar
                </h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Preview */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-blue-300/50 rounded-xl p-6 text-center hover:border-blue-400/70 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 cursor-pointer mb-6"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-2">Drop image here or click to browse</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF (max 10MB)</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>

                {selectedImage && (
                  <>
                    <button
                      onClick={resetImage}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      Reset
                    </button>

                    <button
                      onClick={handleSaveAvatar}
                      disabled={isLoading}
                      className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isLoading ? 'Saving...' : 'Save Avatar'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-2 py-2">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Manage your account and preferences</p>
        </div>

        {/* Profile Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                {/* Avatar Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                      {userData.avatar && userData.avatar !== '/src/assets/default-avatar.jpg' ? (
                        <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mt-4">{userData.name}</h2>
                  <p className="text-blue-600 font-medium">{userData.email}</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Information Your</p>
                      <p className="text-sm text-gray-600">Personal details</p>
                    </div>
                  </div>

                  <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Information Health</p>
                      <p className="text-sm text-gray-600">Health metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-500" />
                    Account Information
                  </h3>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform duration-300"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform duration-300"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-700">Email</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl px-4 py-3">
                          <input
                            type="email"
                            value={editedData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                            placeholder="Enter your email"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-800 ml-8">{userData.email}</p>
                      )}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-700">Phone</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl px-4 py-3">
                          <input
                            type="tel"
                            value={editedData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none focus:ring-0"
                            placeholder="Enter your phone"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-800 ml-8">{userData.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-gray-700">Gender</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-xl px-4 py-3">
                          <select
                            value={editedData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="flex-1 bg-transparent text-gray-800 outline-none focus:ring-0"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      ) : (
                        <p className="text-gray-800 ml-8">{userData.gender}</p>
                      )}
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-gray-700">Birth Date</span>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-xl px-4 py-3">
                          <input
                            type="date"
                            value={editedData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            className="flex-1 bg-transparent text-gray-800 outline-none focus:ring-0"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-800 ml-8">{new Date(userData.birthDate).toLocaleDateString()}</p>
                      )}
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