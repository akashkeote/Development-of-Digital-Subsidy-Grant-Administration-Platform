import React, { useState, useEffect, useRef } from 'react';
import { Minus, X, Bot, Send, Loader2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! ?? I am the **DigiGrant Assistant**. I can help you find relevant government schemes, grants, and subsidies directly from our database.\n\nJust tell me what you''re looking for (e.g., ''farmer'', ''student'', ''housing'', ''business'').', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const openBot = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/chat', { message: userMessage.text });
      const botMessage = { id: (Date.now() + 1).toString(), text: response.data.reply, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { id: (Date.now() + 1).toString(), text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modern Floating Trigger Pill */}
      {!isOpen && (
        <button 
          onClick={openBot}
          className="fixed bottom-6 right-6 h-[60px] bg-white border border-slate-200 cursor-pointer z-[9999] flex items-center justify-center pl-2 pr-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 group"
        >
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-extrabold text-slate-700 ml-3">
            Ask DigiGrant
          </span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div 
          className={ixed bg-white overflow-hidden z-[9999] shadow-2xl flex flex-col border border-slate-200 transition-all duration-300 ease-in-out "$"{"{
            isMinimized 
              ? 'h-[60px] bottom-6 cursor-pointer hover:bg-slate-50 rounded-full' 
              : 'rounded-2xl'
          }"}"}}
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
          <div className={w-full flex justify-between items-center shrink-0 "$"{"{isMinimized ? 'h-full px-4 bg-white' : 'p-4 bg-gradient-to-r from-blue-600 to-indigo-600'}"}"}}>
            <div className="flex items-center gap-3">
              <div className={lex items-center justify-center bg-white text-blue-600 rounded-full "$"{"{isMinimized ? 'w-9 h-9' : 'w-8 h-8 shadow-sm'}"}"}}>
                <Bot size={18} strokeWidth={2.5} />
              </div>
              <span className={ont-bold text-[15px] "$"{"{isMinimized ? 'text-slate-800' : 'text-white'}"}"}}>
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
                className={"$"{"{isMinimized ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/20'}"}"} p-1.5 rounded-lg transition-colors outline-none}
                title="Close"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          {/* Chat Interface */}
          {!isMinimized && (
            <div className="flex-1 w-full bg-slate-50 relative flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={lex "$"{"{msg.isUser ? 'justify-end' : 'justify-start'}"}"}}>
                    <div className={max-w-[85%] rounded-2xl px-4 py-2.5 "$"{"{msg.isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}"}"}}>
                      {msg.isUser ? (
                        <p className="text-[15px]">{msg.text}</p>
                      ) : (
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-blue-600" />
                      <span className="text-sm font-medium text-slate-500">Searching database...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about schemes..."
                    className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-12 h-12 flex-shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} className="ml-1" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
