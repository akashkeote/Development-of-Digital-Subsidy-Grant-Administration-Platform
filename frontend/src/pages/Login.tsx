import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ArrowRight, Landmark, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login: React.FC = () => {
  const { setCurrentRole } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [userId, setUserId] = useState('CIT-1092');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Autocomplete depending on selected role
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setUserId('CIT-1092');
    } else if (role === 'verifier') {
      setUserId('VER-4011');
    } else if (role === 'district_officer') {
      setUserId('DST-GORAKHPUR');
    } else if (role === 'admin') {
      setUserId('ADMIN-ROOT');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter a valid User ID');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setCurrentRole(selectedRole);
      setIsLoading(false);
      if (selectedRole === 'citizen') navigate('/citizen/dashboard');
      else if (selectedRole === 'verifier') navigate('/verification/dashboard');
      else if (selectedRole === 'district_officer') navigate('/district/dashboard');
      else if (selectedRole === 'admin') navigate('/admin/dashboard');
    }, 800); // Simulate network request for premium feel
  };

  const rolesConfig: { id: UserRole; label: string; desc: string }[] = [
    { id: 'citizen', label: 'Citizen', desc: 'Apply for grants' },
    { id: 'verifier', label: 'Verifier', desc: 'Field inspections' },
    { id: 'district_officer', label: 'District Officer', desc: 'Sanction funds' },
    { id: 'admin', label: 'Administrator', desc: 'System management' }
  ];

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden" id="login_page_root">
      
      {/* Left side - Decorative Graphic Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/30 blur-[100px]"></div>
        
        {/* Glassmorphism Abstract Element */}
        <div className="relative z-10 p-12 max-w-xl">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl">
            <Landmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Streamlining National <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">Welfare Delivery</span>
          </h1>
          <p className="text-lg text-indigo-100/80 font-medium mb-12 max-w-md leading-relaxed">
            The next-generation direct benefit transfer portal ensuring transparency, speed, and security for millions of citizens.
          </p>

          <div className="flex items-center gap-4 text-indigo-200 text-sm font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Secured by 256-bit AES Encryption</span>
          </div>
        </div>

        {/* Decorative Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative bg-white">
        
        {/* Mobile Header (only visible on small screens) */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">GovGrant</span>
        </Link>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-sm font-medium text-slate-500">Sign in to your GovGrant portal account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role Selector Grid */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {rolesConfig.map((role) => {
                  const isActive = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-slate-900 border-slate-900 shadow-md shadow-slate-900/10 scale-[1.02]' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {role.label}
                      </span>
                      <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {role.desc}
                      </span>
                      {isActive && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-sm text-red-700 font-medium"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Fields */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID / Aadhaar</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="Enter your ID"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* New User Register Link */}
          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-sm font-medium text-slate-500">
              New to GovGrant? <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition">Register as a Citizen</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
