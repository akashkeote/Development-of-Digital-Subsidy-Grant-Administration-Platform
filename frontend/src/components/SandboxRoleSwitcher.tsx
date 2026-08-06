import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, Briefcase, Key } from 'lucide-react';

export const SandboxRoleSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'verifier') navigate('/verification/dashboard');
    else if (role === 'district_officer') navigate('/district/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const roles: { id: UserRole; label: string; icon: React.FC<any> }[] = [
    { id: 'citizen', label: 'Citizen', icon: User },
    { id: 'verifier', label: 'Verifier', icon: Shield },
    { id: 'district_officer', label: 'District Officer', icon: Briefcase },
    { id: 'admin', label: 'Admin', icon: Key },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-200 flex items-center gap-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300">
      <div className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block border-r border-slate-200 mr-1">
        Sandbox Roles
      </div>
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = currentRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all outline-none ${
              isActive 
                ? 'bg-blue-600 text-white shadow-md scale-105' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-400'} />
            <span className="hidden md:inline">{role.label}</span>
          </button>
        );
      })}
    </div>
  );
};
