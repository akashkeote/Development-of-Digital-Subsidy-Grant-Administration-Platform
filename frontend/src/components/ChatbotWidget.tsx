import React, { useState, useEffect } from 'react';
import { Minus, X, Bot } from 'lucide-react';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for messages from the UMANG chatbot iframe to close the modal
      if (event.data?.action === 'handelCloseBotModal') {
        setIsOpen(false);
      }
      if (event.data?.action === 'openLink' && event.data.url) {
        window.location.href = event.data.url;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const openBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Modern Floating Trigger Pill */}
      {!isOpen && (
        <button 
          onClick={openBot}
          className="fixed bottom-6 right-6 h-[60px] bg-white border border-slate-200 cursor-pointer z-[9999] flex items-center justify-center pl-2 pr-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 group"
        >
          <img 
            src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png" 
            alt="DigiGrant" 
            className="w-11 h-11 object-contain p-1"
          />
          <span className="text-[15px] font-extrabold text-slate-700 ml-3">
            Ask DigiGrant
          </span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed bg-white overflow-hidden z-[9999] shadow-2xl flex flex-col border border-slate-200 transition-all duration-300 ease-in-out ${
            isMinimized 
              ? 'h-[60px] bottom-6 cursor-pointer hover:bg-slate-50 rounded-full' 
              : 'rounded-2xl'
          }`}
          style={!isMinimized ? {
            bottom: isMobile ? '10px' : '24px',
            right: isMobile ? '10px' : '24px',
            width: isMobile ? 'calc(100vw - 20px)' : '400px',
            height: isMobile ? 'calc(100dvh - 20px)' : '650px',
            maxHeight: '85vh',
          } : {
            bottom: '24px',
            right: '24px',
            width: '280px',
          }}
          onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        >
          {/* Header */}
          <div className={`w-full flex justify-between items-center shrink-0 ${isMinimized ? 'h-full px-4 bg-white' : 'p-4 bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
            <div className="flex items-center gap-3">
               <img 
                src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png" 
                alt="DigiGrant" 
                className={`object-contain bg-white rounded-full ${isMinimized ? 'w-9 h-9 p-0.5' : 'w-8 h-8 p-1 shadow-sm'}`}
              />
              <span className={`font-bold text-[15px] ${isMinimized ? 'text-slate-800' : 'text-white'}`}>
                DigiGrant Assistant
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {!isMinimized && (
                <button 
                  onClick={toggleMinimize} 
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors outline-none"
                  title="Minimize"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                className={`${isMinimized ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/20'} p-1.5 rounded-lg transition-colors outline-none`}
                title="Close"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          {/* Iframe content */}
          {!isMinimized && (
            <div className="flex-1 w-full bg-slate-50 relative">
              <iframe 
                id="chatbot-iframe"
                allow="clipboard-write; microphone"
                src="https://chatbot.umangapp.in/"
                className="absolute inset-0 w-full h-full border-none"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </>
  );
};

