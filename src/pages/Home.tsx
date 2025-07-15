import React from 'react';
import AuroraBackground from '../components/AuroraBackground';
import FloatingIcons from '../components/FloatingIcons';
import Header from '../components/Header';
import MainDashboard from '../components/MainDashboard';

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Aurora Background Layer */}
      <AuroraBackground />
      
      {/* Floating Icons Layer */}
      <FloatingIcons />
      
      {/* Main Content Layer */}
      <div className="relative z-30 min-h-screen flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main Dashboard Content */}
        <MainDashboard />
      </div>
    </div>
  );
}