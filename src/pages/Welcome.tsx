import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Play, Search, Heart, Activity, Zap } from "lucide-react";

export default function Welcome() {
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
          <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/45 via-cyan-400/55 to-blue-500/45 rounded-full blur-3xl animate-bounce delay-3000"></div>
        </div>
        
        {/* Animated Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-sky-300/40 via-transparent to-blue-400/40 animate-pulse delay-2000"></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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

        {/* Ripple Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-blue-400/40 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-2/3 left-1/2 w-20 h-20 border-2 border-sky-400/35 rounded-full animate-ping delay-2000"></div>
        </div>

        {/* Moving Aurora Streams */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -skew-y-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent transform -skew-y-6 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Enhanced Floating Health Icons */}
      <div className="absolute w-full h-full pointer-events-none z-10 select-none">
        <div className="absolute top-[15%] left-[10%] text-4xl animate-bounce">
          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full p-3 shadow-lg">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[45%] left-[55%] text-4xl animate-bounce delay-500">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-3 shadow-lg">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[18%] left-[40%] text-4xl animate-bounce delay-1000">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 shadow-lg">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[60%] left-[30%] text-3xl animate-bounce delay-1500">
          <div className="bg-gradient-to-r from-sky-400 to-blue-400 rounded-full p-2 shadow-lg">
            <Sparkles className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
        <div className="absolute top-[20%] left-[25%] text-4xl animate-bounce delay-2000">
          <div className="bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full p-3 shadow-lg">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[80%] left-[35%] text-4xl animate-bounce delay-2500">
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full p-3 shadow-lg">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[60%] left-[2%] text-4xl animate-bounce delay-3000">
          <div className="bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full p-3 shadow-lg">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[75%] left-[50%] text-4xl animate-bounce delay-3500">
          <div className="bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full p-3 shadow-lg">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[85%] left-[15%] text-4xl animate-bounce delay-4000">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-3 shadow-lg">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Enhanced Logo - Keep Original */}
      <div className="absolute left-6 z-50 flex flex-col items-start">
      <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-cyan-300/40 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl animate-pulse delay-500"></div>
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
        </div>
      </div>

      {/* Enhanced Header */}
      <header className="flex justify-end items-center max-w-7xl mx-auto px-6 py-8 z-20 relative">
        <nav className="hidden md:flex gap-10 text-white text-lg font-bold mr-auto ml-40">
          <a href="#" className="hover:text-cyan-300 transition-all duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-cyan-300 transition-all duration-300 relative group">
            Nutrition
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-cyan-300 transition-all duration-300 relative group">
            Advice
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Link
              to="/login"
              className="relative px-6 py-2 rounded-full border-2 border-blue-300/50 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full blur opacity-60 animate-pulse"></div>
            <button className="relative px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Main Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12 gap-10 md:gap-20 z-20 relative">
        {/* Enhanced Content Box */}
        <div className="max-w-xl w-full relative">
          {/* Enhanced Glowing Border */}
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/90 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-pulse">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="w-12 h-12 text-blue-500 animate-spin" />
                NutriAI
              </span>
            </h1>
            
            <p className="text-blue-700 text-lg mt-4 font-medium">
              Personalized AI-powered nutrition suggestions and activity tracking.
            </p>
            <p className="text-blue-600 text-sm mt-2 leading-relaxed">
              Smart recommendations based on your health journey. Improve your wellness
              with a personalized plan tailored just for you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full blur opacity-60 animate-pulse"></div>
                <button className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 group">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5 animate-pulse" />
                    Get Started
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <button className="relative flex items-center justify-center gap-2 border-2 border-blue-300/50 px-6 py-3 rounded-full text-blue-700 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 transform hover:scale-105 group">
                  <Search className="w-5 h-5 group-hover:animate-pulse" />
                  Learn More
                </button>
              </div>
            </div>

            {/* Enhanced Feature Pills */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30 animate-pulse"></div>
                <div className="relative bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 text-xs text-blue-700 flex items-center gap-2">
                  <Heart className="w-3 h-3 animate-pulse" />
                  AI Nutrition
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-30 animate-pulse delay-500"></div>
                <div className="relative bg-cyan-50/80 backdrop-blur-sm border border-cyan-200 rounded-full px-4 py-2 text-xs text-cyan-700 flex items-center gap-2">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Activity Tracking
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30 animate-pulse delay-1000"></div>
                <div className="relative bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 text-xs text-blue-700 flex items-center gap-2">
                  <Zap className="w-3 h-3 animate-pulse" />
                  Personalized Plans
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Image - Keep Original */}
        <div className="flex justify-center md:justify-end w-full md:w-[30%] relative">
          <img
            src="/src/assets/doctor.png"
            alt="Doctor"
            className="w-full max-w-[340px] h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </main>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-32 h-32 bg-gradient-to-r from-blue-300/50 to-sky-400/50 rounded-full blur-xl animate-bounce delay-2000"></div>
      <div className="absolute bottom-1/4 right-5 w-36 h-36 bg-gradient-to-r from-cyan-300/45 to-blue-400/45 rounded-full blur-xl animate-bounce delay-500"></div>
    </div>
  );
}