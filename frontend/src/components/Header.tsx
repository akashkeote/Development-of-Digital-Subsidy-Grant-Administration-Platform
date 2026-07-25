import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, User, Landmark, Settings, LogOut, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const { currentRole, setCurrentRole, notifications, citizenProfile } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowProfileDropdown(false);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'verifier') navigate('/verification/dashboard');
    else if (role === 'district_officer') navigate('/district/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Menu */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition md:hidden outline-none"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Landmark size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">GovGrant</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Disbursement</span>
            </div>
          </Link>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition relative outline-none"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">All caught up!</div>
                    ) : (
                      notifications.slice(0, 4).map((not) => (
                        <div key={not.id} className={`p-4 border-b border-gray-50 text-xs transition hover:bg-slate-50 cursor-pointer ${!not.isRead ? 'bg-indigo-50/30' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800">{not.title}</span>
                            <span className="text-[10px] text-slate-400">{not.timestamp.split(' ')[1]}</span>
                          </div>
                          <p className="text-slate-500 line-clamp-2 mt-1 leading-relaxed">{not.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-50 text-center">
                    <button onClick={() => { setShowNotifications(false); navigate('/notifications'); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 p-2 w-full rounded-lg hover:bg-indigo-100/50 transition">
                      View All Activity
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile & Settings */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-slate-50 border border-transparent hover:border-gray-100 rounded-full transition outline-none"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentRole === 'citizen' ? citizenProfile.name.split(' ')[0] : 'Officer'}
                </p>
                <p className="text-[10px] font-medium text-slate-400 capitalize">
                  {currentRole.replace('_', ' ')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentRole === 'citizen' ? citizenProfile.name.charAt(0) : 'O'}
              </div>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-gray-100">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {currentRole === 'citizen' ? citizenProfile.email : 'admin@gov.in'}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* Sandbox Role Switcher hidden in dropdown for cleanliness */}
                    <div className="px-2 pt-2 pb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dev Sandbox</p>
                      {(['citizen', 'verifier', 'district_officer', 'admin'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize flex items-center transition ${
                            currentRole === role ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {currentRole === role ? <ShieldCheck size={14} className="mr-2" /> : <div className="w-[14px] mr-2" />}
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="h-px bg-gray-100 my-1 mx-2" />

                    {currentRole === 'citizen' && (
                      <button onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition text-xs font-medium flex items-center">
                        <User size={14} className="mr-2 text-slate-400" /> My Profile
                      </button>
                    )}
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }} className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition text-xs font-medium flex items-center">
                      <Settings size={14} className="mr-2 text-slate-400" /> Settings
                    </button>
                    
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/login'); }} className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition text-xs font-bold flex items-center">
                      <LogOut size={14} className="mr-2" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
