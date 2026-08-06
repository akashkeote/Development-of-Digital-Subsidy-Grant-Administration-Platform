import React, { useState } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  return (
    <div className="min-h-screen pastel-mesh-bg flex flex-col justify-between" id="app_root_layout">
      {/* Top Navigation Pill */}
      <TopNav />

      {/* Workspace Body - Add top padding to account for fixed TopNav */}
      <div className="flex relative max-w-[1600px] mx-auto w-full min-h-[calc(100vh-100px)] perspective-container px-4 md:px-6 pt-28">
        {/* Main Context Area - Takes full width now */}
        <main className="flex-1 w-full p-2 md:p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
