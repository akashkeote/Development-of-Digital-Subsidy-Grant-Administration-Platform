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
      case 'verifier': return { label: 'Verifier Mode', color: 'bg-purple-800 text-purple-100' };
      case 'district_officer': return { label: 'Sanction Officer', color: 'bg-purple-800 text-purple-100' };
      case 'admin': return { label: 'Admin Root', color: 'bg-purple-800 text-purple-100' };
      case 'citizen':
      default:
        return { label: 'Citizen Account', color: 'bg-purple-800 text-purple-100' };
    }
  };

  const links = getLinks();
  const badge = getRoleBadge();
  const isCitizen = currentRole === 'citizen';
  const sidebarBg = 'bg-white border-r border-gray-200';
  const activeBg = 'bg-black';

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm md:hidden"
        ></div>
      )}

      <aside className={`
        fixed top-[64px] bottom-0 left-0 z-35 w-64 ${sidebarBg} flex flex-col justify-between transition-all duration-300 ease-in-out md:sticky md:top-[64px] md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="py-6 px-4 flex-1 overflow-y-auto">
          {/* User role visualization inside sidebar */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Active View Profile</p>
            <p className="font-semibold text-gray-900 text-xs truncate">
              {isCitizen ? 'Rajesh Kumar Sharma' : 'Govt Operations'}
            </p>
            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-gray-200 bg-white text-gray-700`}>
              {badge.label}
            </span>
          </div>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2.5 px-3">Navigation</p>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? `bg-black text-white font-semibold` 
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'}
                `}
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>


      </aside>
    </>
  );
};
