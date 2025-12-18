import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, User, Edit, Camera, Settings, Phone, Calendar, Save, X, Upload, Check,
  Heart, Activity, Weight, Ruler, Target, Droplets, FileText, AlertTriangle, Pill, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe, updateInfo, updateHealth, uploadAndUpdateAvatar } from "../../../redux/slices/userSlice";
import { useNotify } from "../../../components/notifications/NotificationsProvider";

export default function HealthInformation() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: any) => state.user);
  const notify = useNotify();
  const [activeTab, setActiveTab] = useState("information-your");
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy dữ liệu user khi vào trang
  useEffect(() => {
    dispatch(fetchMe() as any);
  }, [dispatch]);

  // Khởi tạo local state rỗng, tránh null
  const [editedUserData, setEditedUserData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    avatar: "/src/assets/default-avatar.jpg"
  });

  const [editedHealthData, setEditedHealthData] = useState<any>({
    height: "",
    weight: "",
    medicalConditions: [],
    currentMedications: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    pastSurgeries: "",
    familyHistory: "",
    immunizations: "",
    previousHospitalizations: ""
  });

  // Khi profile từ Redux thay đổi → copy sang local state
  useEffect(() => {
    if (profile) {
      setEditedUserData({
        name: profile.fullname || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        birthDate: profile.DOB || "",
        avatar: profile.avt || "/src/assets/default-avatar.jpg",
      });

      setEditedHealthData({
        height: profile.height || "",
        weight: profile.weight || "",
        medicalConditions: profile.medicalConditions || [],
        currentMedications: profile.currentMedications || "",
        allergies: profile.allergies || "",
        chronicConditions: profile.chronicConditions || "",
        emergencyContact: profile.emergencyContact || "",
        pastSurgeries: profile.pastSurgeries || "",
        familyHistory: profile.familyHistory || "",
        immunizations: profile.immunizations || "",
        previousHospitalizations: profile.previousHospitalizations || "",
      });
    }
  }, [profile]);
  useEffect(() => {
    console.log("Profile updated:", profile);
  }, [profile]);

  const handleSaveInfo = async () => {
    try {
      await dispatch(updateInfo({
        fullname: editedUserData.name,
        DOB: editedUserData.birthDate,
        gender: editedUserData.gender,
      }) as any).unwrap();

      notify.success("🎉 Cập nhật thông tin cá nhân thành công!");
      setIsEditing(false);
    } catch (err: any) {
      notify.error(`❌ Cập nhật thất bại: ${err.message || "Unknown error"}`);
    }
  };

  // Lưu thông tin sức khỏe
  const handleSaveHealth = async () => {
    try {
      await dispatch(updateHealth({
        height: editedHealthData.height,
        weight: editedHealthData.weight,
        medicalConditions: editedHealthData.medicalConditions,
      }) as any).unwrap();

      notify.success("🎉 Cập nhật thông tin sức khỏe thành công!");
      setIsEditing(false);
    } catch (err: any) {
      notify.error(`❌ Cập nhật thất bại: ${err.message || "Unknown error"}`);
    }
  };

  // Lưu avatar
  const handleSaveAvatar = async () => {
    if (!selectedImage || !fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    setIsLoading(true);
    try {
      await dispatch(uploadAndUpdateAvatar(file) as any).unwrap();
      notify.success("🎉 Avatar đã được cập nhật!");
      setShowAvatarModal(false);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      notify.error(`❌ Upload avatar thất bại: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Input change
  const handleUserInputChange = (field: string, value: string) => {
    setEditedUserData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleHealthInputChange = (
    field: string,
    value: string | string[]
  ) => {
    setEditedHealthData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // BMI
  const calculateBMI = (weight: string, height: string) => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      const hM = h / 100;
      return (w / (hM * hM)).toFixed(1);
    }
    return "0.0";
  };
  const getBMICategory = (bmi: string) => {
    const n = parseFloat(bmi);
    if (n < 18.5) return { category: "Underweight", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (n < 25) return { category: "Normal", color: "text-green-600", bgColor: "bg-green-100" };
    if (n < 30) return { category: "Overweight", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { category: "Obese", color: "text-red-600", bgColor: "bg-red-100" };
  };

  // Avatar
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const closeModal = () => {
    setShowAvatarModal(false);
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // ✅ Tabs (cũng bị thiếu trong code bạn gửi)
  const tabs = [
    {
      id: "information-your",
      name: "Information Your",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200/50",
    },
    {
      id: "medical-history",
      name: "Medical History",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200/50",
    },
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
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-2">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Health Information
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Manage your personal and medical history information</p>
        </div>

        {/* Profile Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Summary Card - Balanced Size */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-6 shadow-2xl shadow-cyan-500/20">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                      {editedUserData?.avatar ? (
                        <img src={editedUserData.avatar} alt="Avatar" />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mt-3">{editedUserData.name}</h2>
                  <p className="text-blue-600 font-medium text-sm">{editedUserData.email}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${isActive
                          ? `bg-gradient-to-r ${tab.bgColor} ${tab.borderColor} border-2 shadow-lg`
                          : 'bg-white/50 border-gray-200/50 hover:bg-white/70'
                          }`}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${tab.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold text-sm ${isActive ? 'text-gray-800' : 'text-gray-700'}`}>
                            {tab.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Larger Size */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>

              <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    {tabs.find(tab => tab.id === activeTab) && (
                      <>
                        {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                          className: "w-6 h-6 text-blue-500"
                        })}
                        {tabs.find(tab => tab.id === activeTab)?.name}
                      </>
                    )}
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
                          onClick={activeTab === "information-your" ? handleSaveInfo : handleSaveHealth}
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

                {/* Information Your Content */}
                {activeTab === 'information-your' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold text-gray-700">Full Name</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUserData.name}
                            onChange={(e) => handleUserInputChange('name', e.target.value)}
                            className="w-full bg-white/70 border border-blue-200/50 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-gray-800 ml-8">{editedUserData.name}</p>
                        )}
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-purple-500" />
                          <span className="font-semibold text-gray-700">Gender</span>
                        </div>
                        {isEditing ? (
                          <select
                            value={editedUserData.gender}
                            onChange={(e) => handleUserInputChange('gender', e.target.value)}
                            className="w-full bg-white/70 border border-purple-200/50 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="text-gray-800 ml-8">{editedUserData.gender}</p>
                        )}
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold text-gray-700">Birth Date</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editedUserData.birthDate}
                            onChange={(e) => handleUserInputChange('birthDate', e.target.value)}
                            className="w-full bg-white/70 border border-orange-200/50 rounded-lg px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        ) : (
                          <p className="text-gray-800 ml-8">{new Date(editedUserData.birthDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Phone */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-5 h-5 text-green-500" />
                          <span className="font-semibold text-gray-700">Phone</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedUserData.phone}
                            disabled // ✅ không cho sửa
                            className="w-full bg-gray-100 border border-green-200/50 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                          />
                        ) : (
                          <p className="text-gray-800 ml-8">{editedUserData.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-indigo-500" />
                          <span className="font-semibold text-gray-700">Email</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedUserData.email}
                            disabled // ✅ không cho sửa
                            className="w-full bg-gray-100 border border-indigo-200/50 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                          />
                        ) : (
                          <p className="text-gray-800 ml-8">{editedUserData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical History Content */}
                {activeTab === 'medical-history' && (
                  <div className="space-y-8">
                    {/* Body Measurements Section */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Body Measurements
                      </h4>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Ruler className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-gray-700">Height (cm)</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editedHealthData.height}
                              onChange={(e) => handleHealthInputChange('height', e.target.value)}
                              className="w-full bg-white/70 border border-green-200/50 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-300"
                              placeholder="Enter your height"
                            />
                          ) : (
                            <p className="text-gray-800 ml-8">{editedHealthData.height} cm</p>
                          )}
                        </div>

                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Weight className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-gray-700">Weight (kg)</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editedHealthData.weight}
                              onChange={(e) => handleHealthInputChange('weight', e.target.value)}
                              className="w-full bg-white/70 border border-blue-200/50 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
                              placeholder="Enter your weight"
                            />
                          ) : (
                            <p className="text-gray-800 ml-8">{editedHealthData.weight} kg</p>
                          )}
                        </div>

                        {/* BMI Display */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            <span className="font-semibold text-gray-700">BMI</span>
                          </div>
                          <div className="ml-8">
                            <p className="text-2xl font-bold text-gray-800">
                              {calculateBMI(isEditing ? editedHealthData.weight : editedHealthData.weight, isEditing ? editedHealthData.height : editedHealthData.height)}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBMICategory(calculateBMI(isEditing ? editedHealthData.weight : editedHealthData.weight, isEditing ? editedHealthData.height : editedHealthData.height)).bgColor} ${getBMICategory(calculateBMI(isEditing ? editedHealthData.weight : editedHealthData.weight, isEditing ? editedHealthData.height : editedHealthData.height)).color}`}>
                              {getBMICategory(calculateBMI(isEditing ? editedHealthData.weight : editedHealthData.weight, isEditing ? editedHealthData.height : editedHealthData.height)).category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Medical Conditions */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Medical Conditions
                      </h4>

                      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200/50">
                        {isEditing ? (
                          <input
                            type="text"
                            placeholder="Enter conditions, separated by commas"
                            value={editedHealthData.medicalConditions.join(", ")}
                            onChange={(e) =>
                              handleHealthInputChange(
                                "medicalConditions",
                                e.target.value.split(",").map((s) => s.trim())
                              )
                            }
                            className="w-full bg-white/70 border border-red-200/50 rounded-lg px-4 py-3"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {editedHealthData.medicalConditions?.length ? (
                              editedHealthData.medicalConditions.map((c: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 font-medium"
                                >
                                  {c}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 italic">No medical conditions</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}