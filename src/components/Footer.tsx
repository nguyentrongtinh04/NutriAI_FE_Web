import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Camera,
  Calendar,
  History,
  Settings,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/home" },
    { id: "plans", icon: Calendar, label: "Plans", path: "/plans" },
    { id: "scan", icon: Camera, label: "Scan", path: "/scan-meal" },
    { id: "history", icon: History, label: "History", path: "/scan-history" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Ẩn footer ở các trang public / admin
  const hiddenRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin",
  ];

  if (hiddenRoutes.some((r) => location.pathname.startsWith(r))) return null;

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      {/* Hiệu ứng ánh sáng nền động */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-lg border-t border-cyan-300/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]"></div>

      {/* Nội dung chính */}
      <div className="relative max-w-3xl mx-auto flex justify-around items-center py-3 text-white">
        {navItems.map(({ id, icon: Icon, label, path }) => {
          const isActive =
            location.pathname === path || location.pathname.startsWith(`${path}/`);

          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center transition-all duration-300 ${
                isActive
                  ? "text-cyan-300 scale-110"
                  : "text-blue-200 hover:text-cyan-200"
              }`}
            >
              {/* Vòng sáng nhấp nháy khi active */}
              {isActive && (
                <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-400/40 via-blue-400/40 to-cyan-400/40 blur-xl animate-pulse"></span>
              )}

              <Icon className="w-6 h-6 relative z-10" />
              <span className="text-xs mt-1 font-medium relative z-10">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
