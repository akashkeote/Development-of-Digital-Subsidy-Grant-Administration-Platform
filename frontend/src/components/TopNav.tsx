import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Bell, User, Landmark, Settings, LogOut, Menu, X, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

export const TopNav: React.FC = () => {
  const { currentRole, setCurrentRole, notifications, citizenProfile } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'verifier') navigate('/verification/dashboard');
    else if (role === 'district_officer') navigate('/district/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const getLinks = () => {
    switch (currentRole) {
      case 'verifier': return [
        { to: '/verification/dashboard', label: 'Review Queue' },
        { to: '/schemes', label: 'View Schemes' },
        { to: '/notifications', label: 'System Alerts' },
      ];
      case 'district_officer': return [
        { to: '/district/dashboard', label: 'Sanctioning Dashboard' },
        { to: '/schemes', label: 'View Schemes' },
        { to: '/notifications', label: 'System Alerts' },
      ];
      case 'admin': return [
        { to: '/admin/dashboard', label: 'Admin Analytics' },
        { to: '/schemes', label: 'Manage Schemes' },
        { to: '/notifications', label: 'System Logs' },
      ];
      case 'citizen':
      default: return [
        { to: '/citizen/dashboard', label: 'Dashboard' },
        { to: '/schemes', label: 'Explore Schemes' },
        { to: '/citizen/tracking', label: 'Track Applications' },
        { to: '/citizen/installments', label: 'Installments' },
      ];
    }
  };

  const links = getLinks();
  const isCitizen = currentRole === 'citizen';

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl h-16 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 rounded-full flex items-center justify-between px-5">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 outline-none group">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md">
            <Landmark size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-[17px] font-heading font-extrabold text-slate-800 tracking-tight leading-none">DigiGrant</span>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Portal</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                px-4 py-2 rounded-full text-[13px] transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${isActive 
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 font-semibold hover:bg-slate-100/80 hover:text-slate-900'}
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileDropdown(false);
              }}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition relative outline-none"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
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
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
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
                  <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                    <button onClick={() => { setShowNotifications(false); navigate('/notifications'); }} className="text-xs font-bold text-blue-600 hover:text-blue-700 p-2 w-full rounded-lg hover:bg-blue-50 transition">
                      View All Activity
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 hover:bg-slate-50 border border-transparent rounded-full transition outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                {isCitizen ? citizenProfile.name.charAt(0) : 'O'}
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
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {isCitizen ? citizenProfile.name : 'Government Official'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium capitalize mt-0.5">
                      {currentRole.replace('_', ' ')} Account
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* Sandbox Role Switcher hidden in dropdown for cleanliness */}
                    <div className="px-2 pt-2 pb-1 bg-slate-50 border border-slate-100 rounded-xl mb-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sandbox Roles</p>
                      {(['citizen', 'verifier', 'district_officer', 'admin'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium capitalize flex items-center transition-colors ${
                            currentRole === role ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-200/50'
                          }`}
                        >
                          {currentRole === role ? <ShieldCheck size={14} className="mr-2 text-blue-600" /> : <div className="w-[14px] mr-2" />}
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="h-px bg-slate-100 my-1 mx-2" />

                    {isCitizen && (
                      <button onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }} className="w-full text-left px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition text-xs font-medium flex items-center">
                        <User size={14} className="mr-3 text-slate-400" /> My Profile
                      </button>
                    )}
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }} className="w-full text-left px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition text-xs font-medium flex items-center">
                      <Settings size={14} className="mr-3 text-slate-400" /> Settings
                    </button>
                    
                    <div className="h-px bg-slate-100 my-1 mx-2" />
                    
                    <button onClick={() => { setShowProfileDropdown(false); navigate('/login'); }} className="w-full text-left px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition text-xs font-bold flex items-center">
                      <LogOut size={14} className="mr-3 text-rose-500" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full ml-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 p-4 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-1">Navigation</p>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    px-4 py-3 rounded-xl text-sm transition-all
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold' 
                      : 'text-slate-600 font-medium hover:bg-slate-50'}
                  `}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
