import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen w-full font-sans overflow-x-hidden relative bg-gradient-to-br from-[#e8f5ff] via-[#d2e6fb] to-[#bcdaf7]">

      {/* Animated Aurora Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bg-blue-300/30 w-[500px] h-[500px] rounded-full blur-[120px] top-0 left-[-100px] animate-[ping_8s_infinite]" />
        <div className="absolute bg-purple-100/30 w-[300px] h-[300px] rounded-full blur-[100px] bottom-10 right-0 animate-[pulse_10s_infinite]" />
        <div className="absolute bg-white/30 w-[200px] h-[200px] rounded-full blur-[100px] top-1/2 left-[40%] animate-[spin_20s_linear_infinite]" />
      </div>
      {/* Clay-style Floating Icons */}
      <div className="absolute w-full h-full pointer-events-none z-10 select-none">
        <span className="text-[42px] absolute top-[15%] left-[10%] ">🥑</span>
        <span className="text-[42px] absolute top-[45%] left-[55%] ">🥗</span>
        <span className="text-[42px] absolute top-[18%] left-[40%] ">🏃‍♂️</span>
        <span className="text-[34px] absolute top-[60%] left-[30%] ">💪</span>
        <span className="text-[42px] absolute top-[20%] left-[25%] ">🏊‍♂️</span>
        <span className="text-[42px] absolute top-[80%] left-[35%] ">🚴‍♂️</span>
        <span className="text-[42px] absolute top-[60%] left-[2%] ">🏋️‍♂️</span>
        <span className="text-[42px] absolute top-[75%] left-[50%] ">🥕</span>
        <span className="text-[42px] absolute top-[85%] left-[15%] ">🩺</span>
      </div>

      {/* Logo + tagline */}
      <div className="absolute left-6 z-50 flex flex-col items-start">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
      </div>

      {/* Header */}
      <header className="flex justify-end items-center max-w-7xl mx-auto px-6 py-8 z-20 relative">
        <nav className="hidden md:flex gap-10 text-[#1c3c64] text-l font-bold mr-auto ml-40">
          <a href="#" className="hover:text-[#347bbd] transition">Home</a>
          <a href="#" className="hover:text-[#347bbd] transition">Nutrition</a>
          <a href="#" className="hover:text-[#347bbd] transition">Advice</a>
        </nav>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-1 rounded-full border border-[#90c2e7] text-l text-[#1c3c64] hover:bg-[#d5eefd] transition"
          >
            Sign In
          </Link>
          <button className="px-5 py-1 rounded-full bg-[#2a78b8] text-white text-l hover:bg-[#1c5a94] transition">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12 gap-10 md:gap-20 z-20 relative">
        {/* Box */}
        <div className="max-w-xl w-full bg-white/60 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-[8px_8px_20px_rgba(0,0,0,0.05)] text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1c3c64] leading-tight">
            Welcome to <span className="text-[#2a78b8]">NutriAI</span>
          </h1>
          <p className="text-[#224665] text-lg mt-4">
            Personalized AI-powered nutrition suggestions and activity tracking.
          </p>
          <p className="text-[#3d5f7d] text-sm mt-2">
            Smart recommendations based on your health journey. Improve your wellness
            with a personalized plan tailored just for you.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-gradient-to-r from-[#4aa8df] to-[#2a78b8] text-white px-6 py-2 rounded-full shadow-lg hover:opacity-90 transition">
              Get Started
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#90c2e7] px-5 py-2 rounded-full text-sm text-[#1c3c64] hover:bg-[#e3f3fd] transition backdrop-blur-sm bg-white/40">
              <span>🔍</span> Learn More
            </button>
          </div>
        </div>

        {/* Doctor Image */}
        <div className="flex justify-center md:justify-end w-full md:w-[30%]">
          <img
            src="/src/assets/doctor.png"
            alt="Doctor"
            className="w-full max-w-[95%] h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </main>
    </div>
  );
}
