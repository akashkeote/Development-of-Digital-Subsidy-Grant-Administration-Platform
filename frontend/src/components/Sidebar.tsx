import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Search, 
  FileText, 
  TrendingUp, 
  User, 
  Bell, 
  ShieldCheck, 
  CheckSquare, 
  PlusCircle, 
  LineChart, 
  UserSquare2,
  Lock,
  Compass,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole } = useApp();
  const navigate = useNavigate();

  const handleRoleReset = (role: UserRole) => {
    setCurrentRole(role);
    onClose();
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'verifier') navigate('/verification/dashboard');
    else if (role === 'district_officer') navigate('/district/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  // Define links based on active sandbox role
  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Citizen Home' },
    { to: '/schemes', label: 'Explore Schemes' },
    { to: '/citizen/tracking', label: 'Track Applications' },
    { to: '/citizen/installments', label: 'Track Installments' },
    { to: '/profile', label: 'My Profile' },
    { to: '/notifications', label: 'Inbox & Alerts' },
  ];

  const verifierLinks = [
    { to: '/verification/dashboard', label: 'Review Queue' },
    { to: '/schemes', label: 'View Schemes' },
    { to: '/notifications', label: 'System Alerts' },
  ];

  const districtLinks = [
    { to: '/district/dashboard', label: 'Sanctioning Dashboard' },
    { to: '/schemes', label: 'View Schemes' },
    { to: '/notifications', label: 'System Alerts' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Analytics' },
    { to: '/schemes', label: 'Manage Schemes' },
    { to: '/notifications', label: 'System Logs' },
  ];

  const getLinks = () => {
    switch (currentRole) {
      case 'verifier': return verifierLinks;
      case 'district_officer': return districtLinks;
      case 'admin': return adminLinks;
      case 'citizen':
      default:
        return citizenLinks;
    }
  };

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'verifier': return { label: 'Verifier Mode', color: 'from-violet-500 to-fuchsia-500' };
      case 'district_officer': return { label: 'Sanction Officer', color: 'from-blue-500 to-cyan-500' };
      case 'admin': return { label: 'Admin Root', color: 'from-rose-500 to-orange-500' };
      case 'citizen':
      default:
        return { label: 'Citizen Account', color: 'from-emerald-500 to-teal-500' };
    }
  };

  const links = getLinks();
  const badge = getRoleBadge();
  const isCitizen = currentRole === 'citizen';

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        ></div>
      )}

      <aside className={`
        pastel-card fixed top-[96px] bottom-8 left-4 z-35 w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out md:sticky md:top-[96px] md:h-[calc(100vh-128px)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="py-6 px-4 flex-1 overflow-y-auto">
          {/* User profile section */}
          <div className="mb-8 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {isCitizen ? 'RK' : 'GO'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-slate-800 text-sm truncate">
                {isCitizen ? 'Rajesh Kumar' : 'Govt Operations'}
              </p>
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 shadow-sm`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-[0.2em] mb-3 px-3">Navigation</p>
          <nav className="space-y-3 px-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all relative w-full
                  ${isActive 
                    ? 'btn-3d-primary font-bold border border-blue-600' 
                    : 'btn-3d bg-white text-slate-700 hover:text-blue-600 hover:border-blue-200 border border-slate-200 font-medium'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded bg-slate-200 p-[2px]">
              <div className="w-full h-full bg-white rounded-[2px] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border border-slate-400"></div>
              </div>
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-slate-800 leading-tight">DigiGrant</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">v3.0.0-ultra</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
