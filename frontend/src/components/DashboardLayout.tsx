import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app_root_layout">
      <div>
        {/* Main Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />

        {/* Workspace Body */}
        <div className="flex relative max-w-7xl mx-auto w-full min-h-[calc(100vh-64px)]">
          {/* Collapsible/Sticky Navigation Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          {/* Main Context Area */}
          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 bg-slate-50/50 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
