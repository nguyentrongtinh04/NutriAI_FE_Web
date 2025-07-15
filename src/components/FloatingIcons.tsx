import React from 'react';
import { Heart, Activity, Zap, Sparkles, Camera, Apple, Utensils, ChefHat, Target, BarChart3 } from 'lucide-react';

export default function FloatingIcons() {
  const icons = [
    { Icon: Heart, position: 'top-[15%] left-[8%]', delay: 0, color: 'from-blue-400 to-cyan-400', size: 'w-8 h-8' },
    { Icon: Activity, position: 'top-[45%] left-[55%]', delay: 500, color: 'from-cyan-400 to-blue-500', size: 'w-7 h-7' },
    { Icon: Zap, position: 'top-[18%] left-[40%]', delay: 1000, color: 'from-blue-500 to-indigo-500', size: 'w-6 h-6' },
    { Icon: Sparkles, position: 'top-[60%] left-[30%]', delay: 1500, color: 'from-sky-400 to-blue-400', size: 'w-8 h-8' },
    { Icon: Camera, position: 'top-[20%] left-[25%]', delay: 2000, color: 'from-cyan-300 to-blue-400', size: 'w-7 h-7' },
    { Icon: Apple, position: 'top-[80%] left-[35%]', delay: 2500, color: 'from-blue-400 to-cyan-500', size: 'w-8 h-8' },
    { Icon: Utensils, position: 'top-[60%] left-[2%]', delay: 3000, color: 'from-indigo-400 to-blue-500', size: 'w-7 h-7' },
    { Icon: Heart, position: 'top-[75%] left-[50%]', delay: 3500, color: 'from-cyan-400 to-sky-400', size: 'w-6 h-6' },
    { Icon: Activity, position: 'top-[85%] left-[15%]', delay: 4000, color: 'from-blue-500 to-cyan-400', size: 'w-8 h-8' },
    { Icon: ChefHat, position: 'top-[25%] left-[70%]', delay: 4500, color: 'from-green-400 to-emerald-500', size: 'w-7 h-7' },
    { Icon: Target, position: 'top-[65%] left-[75%]', delay: 5000, color: 'from-purple-400 to-pink-500', size: 'w-6 h-6' },
    { Icon: BarChart3, position: 'top-[35%] left-[85%]', delay: 5500, color: 'from-orange-400 to-red-500', size: 'w-8 h-8' },
    { Icon: Apple, position: 'top-[10%] left-[60%]', delay: 6000, color: 'from-lime-400 to-green-500', size: 'w-7 h-7' },
    { Icon: Sparkles, position: 'top-[90%] left-[60%]', delay: 6500, color: 'from-yellow-400 to-orange-500', size: 'w-6 h-6' },
    { Icon: Camera, position: 'top-[50%] left-[90%]', delay: 7000, color: 'from-teal-400 to-cyan-500', size: 'w-8 h-8' }
  ];

  return (
    <div className="absolute w-full h-full pointer-events-none z-10 select-none">
      {icons.map((item, index) => {
        const { Icon, position, delay, color, size } = item;
        return (
          <div 
            key={index}
            className={`absolute ${position} animate-bounce`}
            style={{ 
              animationDelay: `${delay}ms`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className={`bg-gradient-to-r ${color} rounded-full p-3 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 group`}>
              <Icon className={`${size} text-white animate-pulse group-hover:animate-spin`} />
            </div>
          </div>
        );
      })}
      
      {/* Additional floating elements */}
      <div className="absolute top-[30%] left-[12%] w-4 h-4 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-[70%] left-[80%] w-3 h-3 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[40%] left-[95%] w-5 h-5 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[15%] left-[85%] w-2 h-2 bg-gradient-to-r from-sky-300 to-cyan-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-[85%] left-[5%] w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
}