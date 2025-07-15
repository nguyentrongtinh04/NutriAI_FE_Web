import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Aurora Waves */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-400/20 via-blue-300/30 to-cyan-400/20 transform rotate-6 scale-125 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Aurora Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-gradient-to-r from-blue-300/45 via-cyan-400/55 to-blue-500/45 rounded-full blur-3xl animate-bounce delay-3000"></div>
        <div className="absolute top-1/6 left-1/2 w-88 h-88 bg-gradient-to-r from-indigo-400/40 via-blue-400/50 to-cyan-400/40 rounded-full blur-3xl animate-bounce delay-1500"></div>
      </div>
      
      {/* Animated Light Rays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-sky-300/40 via-transparent to-blue-400/40 animate-pulse delay-2000"></div>
        <div className="absolute top-0 left-1/6 w-1 h-full bg-gradient-to-b from-cyan-300/50 via-transparent to-indigo-400/50 transform rotate-6 animate-pulse delay-500"></div>
        <div className="absolute top-0 right-1/6 w-1 h-full bg-gradient-to-b from-blue-300/45 via-transparent to-cyan-400/45 transform -rotate-6 animate-pulse delay-1500"></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
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
        <div className="absolute top-1/6 right-1/6 w-28 h-28 border-2 border-cyan-300/25 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/6 left-1/6 w-16 h-16 border-2 border-blue-300/30 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Moving Aurora Streams */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-full h-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform -skew-y-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-full h-6 bg-gradient-to-r from-transparent via-blue-400/35 to-transparent transform skew-y-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-10 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent transform -skew-y-6 animate-pulse delay-2000"></div>
        <div className="absolute top-1/6 left-0 w-full h-4 bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent transform skew-y-8 animate-pulse delay-500"></div>
      </div>

      {/* Spiral Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 border-4 border-cyan-400/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border-4 border-blue-400/25 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-sky-400/30 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-1/5 left-1/5 w-8 h-8 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 transform rotate-45 animate-bounce delay-1000"></div>
        <div className="absolute top-3/5 right-1/5 w-6 h-6 bg-gradient-to-r from-blue-400/35 to-indigo-400/35 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-1/5 left-2/5 w-10 h-10 bg-gradient-to-r from-sky-400/30 to-cyan-400/30 transform rotate-12 animate-bounce delay-500"></div>
        <div className="absolute top-2/5 right-2/5 w-4 h-4 bg-gradient-to-r from-cyan-300/45 to-blue-300/45 rounded-full animate-bounce delay-1500"></div>
      </div>

      {/* Pulsing Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-400/10 via-cyan-400/5 to-transparent animate-pulse delay-3000"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-indigo-400/10 via-blue-400/5 to-transparent animate-pulse delay-4000"></div>
      </div>
    </div>
  );
}