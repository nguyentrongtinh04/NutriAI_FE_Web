import React from 'react';
import AuroraBackground from '../components/AuroraBackground';
import FloatingIcons from '../components/FloatingIcons';
import Header from '../components/Header';
import MainDashboard from '../components/MainDashboard';

export default function Home() {
  return (
    <div className="w-full relative overflow-x-hidden">
      <AuroraBackground />
      <FloatingIcons />

      <div className="relative z-30 flex flex-col">
        <Header />
        <MainDashboard />
      </div>
    </div>
  );
}

