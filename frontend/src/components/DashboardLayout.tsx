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
    <div className="min-h-screen pastel-mesh-bg flex flex-col justify-between" id="app_root_layout">
      <div className="px-4 pt-4 md:px-6 md:pt-6">
        {/* Main Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />
      </div>

      {/* Workspace Body */}
      <div className="flex relative max-w-[1600px] mx-auto w-full min-h-[calc(100vh-100px)] perspective-container px-2 md:px-6">
          {/* Collapsible/Sticky Navigation Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          {/* Main Context Area */}
          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
