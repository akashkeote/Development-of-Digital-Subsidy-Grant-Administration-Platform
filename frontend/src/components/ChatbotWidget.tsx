import React, { useState, useEffect } from 'react';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  };

  return (
    <>
      {/* Floating Button (matches UMANG HTML snippet) */}
      {!isOpen && (
        <div 
          onClick={openBot}
          className="fixed bottom-5 right-0 h-[80px] bg-white border border-slate-100 cursor-pointer z-[9999] flex items-center justify-center pr-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-l-full hover:pr-6 transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] group"
        >
          <img 
            src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png" 
            alt="UMANG" 
            className="w-[50px] h-[50px] object-contain bg-white rounded-full p-1 ml-2 group-hover:scale-105 transition-transform"
          />
          <span className="text-sm m-0 pl-3 pr-2 text-[#00599f] whitespace-nowrap font-bold">
            Ask UMANG
          </span>
        </div>
      )}

      {/* Chatbot Window (matches UMANG HTML snippet sizing & behavior) */}
      {isOpen && (
        <div 
          className="fixed bottom-0 bg-[#D0E2F5] overflow-hidden overscroll-contain z-[9999] rounded-t-2xl shadow-2xl flex flex-col border border-slate-200"
          style={{
            right: isMobile ? '2vw' : '2vw',
            width: isMobile ? '96vw' : '400px',
            height: isMobile ? '90dvh' : '600px',
            maxHeight: '85vh',
          }}
        >
          <div className="bg-white w-full p-3 flex justify-between items-center border-b border-slate-200">
            <div className="flex items-center gap-2">
               <img 
                src="https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png" 
                alt="UMANG" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-bold text-sm text-slate-800">UMANG AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <iframe 
            id="chatbot-iframe"
            allow="clipboard-write; microphone"
            src="https://chatbot.umangapp.in/"
            className="w-full h-full border-none overflow-hidden flex-1 bg-white"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      )}
    </>
  );
};
