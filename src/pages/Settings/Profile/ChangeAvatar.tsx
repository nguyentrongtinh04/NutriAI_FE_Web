import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Camera, User, Save, X, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChangeAvatar() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetImage = () => {
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
        </div>

        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
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
              <Camera className="w-5 h-5" />
              Avatar updated successfully!
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              Change Avatar
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Upload a new profile picture</p>
        </div>

        {/* Avatar Upload Section */}
        <div className="relative">
          {/* Enhanced Glowing Border */}
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Current/Preview Avatar */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
                  <User className="w-6 h-6 text-blue-500" />
                  {selectedImage ? 'Preview' : 'Current Avatar'}
                </h3>

                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative w-48 h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
                    {selectedImage ? (
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-white" />
                    )}
                  </div>
                  
                  {selectedImage && (
                    <button
                      onClick={resetImage}
                      className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {selectedImage && (
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={resetImage}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                      <div className="relative flex items-center gap-2 border-2 border-gray-300/50 px-4 py-2 rounded-full text-gray-700 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </div>
                    </button>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full blur opacity-60 animate-pulse"></div>
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {isLoading ? 'Saving...' : 'Save Avatar'}
                        </span>
                        {!isLoading && (
                          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Area */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Upload className="w-6 h-6 text-green-500" />
                  Upload New Image
                </h3>

                {/* Drag & Drop Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="relative border-2 border-dashed border-blue-300/50 rounded-2xl p-8 text-center hover:border-blue-400/70 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Drop your image here
                    </h4>
                    <p className="text-gray-600 mb-4">
                      or click to browse from your computer
                    </p>
                    
                    <div className="text-sm text-gray-500">
                      <p>Supported formats: JPG, PNG, GIF</p>
                      <p>Maximum file size: 10MB</p>
                      <p>Recommended: 400x400 pixels</p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="mt-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-60 animate-pulse"></div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" />
                        Choose File
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
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