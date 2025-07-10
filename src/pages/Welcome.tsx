import React from "react";

export default function Welcome() {
  return (
    <div className="min-h-screen w-full font-sans overflow-x-hidden bg-gradient-to-br from-[#f3faff] via-[#d9ecf9] to-[#c2dbf1] relative">
      
      {/* Logo riêng */}
      <div className="absolute left-6 z-50">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
      </div>

      {/* Header */}
      <header className="flex justify-end items-center max-w-7xl mx-auto px-6 py-8">
        <nav className="hidden md:flex gap-6 text-[#1c3c64] text-sm font-semibold mr-auto ml-40">
          <a href="#" className="hover:text-[#347bbd] transition">Home</a>
          <a href="#" className="hover:text-[#347bbd] transition">Nutrition</a>
          <a href="#" className="hover:text-[#347bbd] transition">Advice</a>
        </nav>

        <div className="flex gap-2">
          <button className="px-4 py-1 rounded-full border border-[#90c2e7] text-sm text-[#1c3c64] hover:bg-[#d5eefd] transition">
            Sign In
          </button>
          <button className="px-5 py-1 rounded-full bg-[#2a78b8] text-white text-sm hover:bg-[#1c5a94] transition">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12 gap-10 md:gap-20">
        {/* Glassmorphism Box */}
        <div className="max-w-xl w-full backdrop-blur-lg bg-white/50 border border-white/30 rounded-3xl p-8 shadow-xl text-center md:text-left">
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
