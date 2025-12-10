import React, { ReactNode } from "react";
import Footer from "../components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {children}
      <Footer />
    </div>
  );
};
console.log("MAINLAYOUT RENDER");

export default MainLayout;
