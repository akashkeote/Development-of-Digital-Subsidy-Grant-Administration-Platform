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
    <header className="w-full z-40 sticky top-4 relative mb-6">
      {/* Background container that clips the tricolor line but allows header dropdowns to overflow */}
      <div className="pastel-nav-pill absolute inset-0 overflow-hidden pointer-events-none">
        {/* Tricolor line */}
        <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90" />
      </div>
      
      <div className="w-full px-6 py-3 flex items-center justify-between mt-1 relative z-10">
        
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

          <Link to="/" className="flex items-center gap-3 group outline-none">
            <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center transition-transform duration-300 shadow-md">
              <Landmark size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-extrabold text-gradient-blue tracking-tight leading-none">DigiGrant</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Administration</span>
            </div>
          </Link>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition relative outline-none"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
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
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-slate-100"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm">All caught up!</div>
                    ) : (
                      notifications.slice(0, 4).map((not) => (
                         <div key={not.id} className={`p-4 border-b border-slate-50 text-xs transition hover:bg-slate-50 cursor-pointer ${!not.isRead ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800">{not.title}</span>
                            <span className="text-[10px] text-slate-500">{not.timestamp.split(' ')[1]}</span>
                          </div>
                          <p className="text-slate-600 line-clamp-2 mt-1 leading-relaxed">{not.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-50/50 text-center border-t border-slate-100">
                    <button onClick={() => { setShowNotifications(false); navigate('/notifications'); }} className="text-xs font-bold text-blue-600 hover:text-blue-700 p-2 w-full rounded-lg hover:bg-blue-50 transition">
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
              className="flex items-center gap-3 pl-3 pr-1.5 py-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-full transition outline-none cursor-pointer"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentRole === 'citizen' ? citizenProfile.name.split(' ')[0] : 'Officer'}
                </p>
                <p className="text-[10px] font-medium text-slate-500 capitalize">
                  {currentRole.replace('_', ' ')}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center font-bold text-sm">
                {currentRole === 'citizen' ? citizenProfile.name.charAt(0) : 'O'}
              </div>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-slate-100"
                >
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Signed in as</p>
                    <p className="font-bold text-sm text-slate-800 truncate mt-0.5">
                      {currentRole === 'citizen' ? citizenProfile.email : 'admin@gov.in'}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* Sandbox Role Switcher hidden in dropdown for cleanliness */}
                    <div className="px-2 pt-2 pb-1 bg-white border border-slate-100/60 shadow-sm rounded-xl mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dev Sandbox Roles</p>
                      {(['citizen', 'verifier', 'district_officer', 'admin'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium capitalize flex items-center transition-colors ${
                            currentRole === role ? 'bg-blue-50/80 text-blue-700 font-bold' : 'text-slate-600 hover:bg-blue-50/50 hover:text-blue-600'
                          }`}
                        >
                          {currentRole === role ? <ShieldCheck size={14} className="mr-2 text-blue-600" /> : <div className="w-[14px] mr-2" />}
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="h-px bg-slate-100 my-1 mx-2" />

                    {currentRole === 'citizen' && (
                      <button onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }} className="w-full text-left px-3 py-2.5 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition text-xs font-medium flex items-center">
                        <User size={14} className="mr-3 text-slate-400" /> My Profile
                      </button>
                    )}
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }} className="w-full text-left px-3 py-2.5 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition text-xs font-medium flex items-center">
                      <Settings size={14} className="mr-3 text-slate-400" /> Settings
                    </button>
                    
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/login'); }} className="w-full text-left px-3 py-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition text-xs font-bold flex items-center">
                      <LogOut size={14} className="mr-3 text-rose-500" /> Sign Out
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
