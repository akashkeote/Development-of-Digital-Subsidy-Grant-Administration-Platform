import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authService } from '../services/api';
import { UserRole } from '../types';
import { ArrowRight, Shield, Lock, Eye, Users, CheckCircle2, FileText, Activity, Building, ArrowLeft, Sun, AlertCircle, Landmark } from 'lucide-react';

export const Login: React.FC = () => {
  const { setCurrentRole, setCitizenProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'main_selection' | 'officer_selection' | 'login_form'>('main_selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Autocomplete depending on selected role
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('login_form');
    setError('');
    
    if (role === 'citizen') {
      setUserId('CIT-1092');
    } else if (role === 'vle') {
      setUserId('VLE-9901');
    } else if (role === 'l1_officer') {
      setUserId('VER-4011');
    } else if (role === 'l2_officer') {
      setUserId('DST-GORAKHPUR');
    } else if (role === 'l3_officer') {
      setUserId('SNO-PFMS-01');
    } else if (role === 'admin') {
      setUserId('ADMIN-ROOT');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter a valid User ID');
      return;
    }
    
    setIsLoading(true);
    setError('');

    if (selectedRole === 'citizen') {
      try {
        const data = await authService.login(userId, password);
        if (data.token) {
           localStorage.setItem('gov_token', data.token);
        }
        if (data.user) {
          setCitizenProfile((prev: any) => ({
            ...prev,
            id: `CIT-${data.user.id}`,
            name: data.user.fullName,
            email: data.user.email,
            aadhaar: data.user.aadharNumber || prev.aadhaar,
          }));
        }
        setCurrentRole(selectedRole);
        setIsLoading(false);
        navigate('/citizen/dashboard');
      } catch (err: any) {
        setIsLoading(false);
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } else {
      // Mock logic for VLE and Officers
      setTimeout(() => {
        setCurrentRole(selectedRole);
        setIsLoading(false);
        if (selectedRole === 'vle') navigate('/vle/dashboard');
        else if (selectedRole === 'l1_officer') navigate('/l1-verification/dashboard');
        else if (selectedRole === 'l2_officer') navigate('/l2-sanction/dashboard');
        else if (selectedRole === 'l3_officer') navigate('/l3-finance/dashboard');
        else if (selectedRole === 'admin') navigate('/admin/dashboard');
      }, 800);
    }
  };

  const rolesConfig: { id: UserRole; label: string; desc: string; icon: any; color: string; bg: string }[] = [
    { id: 'citizen', label: 'Citizen', desc: 'Beneficiary / Applicant Portal', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'vle', label: 'VLE', desc: 'Village Level Entrepreneur (CSC)', icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'l1_officer', label: 'L1: Field Verifier', desc: 'Document & Field Inspection', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-100' },
    { id: 'l2_officer', label: 'L2: Sanction Officer', desc: 'District Nodal Officer (DNO)', icon: Shield, color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 'l3_officer', label: 'L3: Finance Officer', desc: 'State Nodal Officer (PFMS/DBT)', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'admin', label: 'System Admin', desc: 'Central Control Portal', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' }
  ];

  const currentRoleConfig = rolesConfig.find(r => r.id === selectedRole) || rolesConfig[0];

  const mainCategories = [
    { id: 'citizen', label: 'Citizen', desc: 'Beneficiary & Applicant Portal', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'vle', label: 'VLE Partner', desc: 'Village Level Entrepreneur (CSC)', icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'officials', label: 'Government Official', desc: 'Officers & System Administrators', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' }
  ];

  const officialRoles = rolesConfig.filter(r => ['l1_officer', 'l2_officer', 'l3_officer', 'admin'].includes(r.id));

  return (
    <div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-hidden relative">
      
      {/* Top Banner (Full Width) */}
      <div className="w-full h-10 bg-slate-900 z-50 flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-4 h-[10px] bg-white flex flex-col justify-between overflow-hidden relative rounded-[1px]">
            <div className="w-full h-[33%] bg-[#FF9933]"></div>
            <div className="w-full h-[33%] bg-white flex items-center justify-center">
              <div className="w-[3px] h-[3px] rounded-full border-[0.5px] border-[#000080]"></div>
            </div>
            <div className="w-full h-[33%] bg-[#138808]"></div>
          </div>
          <span className="text-white text-[11px] font-bold tracking-widest uppercase">Government of India</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-300 text-[11px] font-medium tracking-wider">
          <span className="hover:text-white cursor-pointer transition-colors">Screen Reader Access</span>
          <div className="flex gap-3">
            <span className="hover:text-white cursor-pointer transition-colors">A-</span>
            <span className="hover:text-white cursor-pointer transition-colors">A</span>
            <span className="hover:text-white cursor-pointer transition-colors">A+</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Dark Panel with Circles */}
        <div className="w-full md:w-[45%] lg:w-[40%] relative overflow-hidden flex flex-col justify-center px-8 lg:px-14 py-16 bg-blue-700">
          {/* Overlapping Circles Background */}
          <div className="absolute top-[-15%] right-[-20%] w-[500px] h-[500px] rounded-full bg-blue-600/50 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-800/40 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full border-[1.5px] border-white/40 flex items-center justify-center mb-8">
              <Sun className="w-5 h-5 text-white/80" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-heading drop-shadow-md">
              Government Subsidy & <br />
              Grant Disbursement <br />
              Tracking System
            </h1>
            
            <p className="text-blue-100 text-sm mb-16 max-w-sm leading-relaxed font-medium">
              Track government schemes, verify beneficiary eligibility, monitor fund disbursement, and ensure transparent delivery of subsidies across India.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-md">
              <div className="text-center md:text-left">
                <div className="text-2xl font-black text-white mb-1 font-heading">4,680+</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Schemes</div>
              </div>
              <div className="text-center md:text-left border-l border-white/10 pl-4">
                <div className="text-2xl font-black text-white mb-1 font-heading">36</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">States & UTs</div>
              </div>
              <div className="text-center md:text-left border-l border-white/10 pl-4">
                <div className="text-2xl font-black text-white mb-1 font-heading">65+</div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Ministries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Flow */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col justify-center items-center px-6 py-12 relative bg-white min-h-screen md:min-h-0">
          <div className="w-full max-w-[440px] relative z-10 transition-all duration-500">
            
            {step === 'main_selection' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight font-heading mb-2">Select Your Portal</h2>
                  <p className="text-sm font-medium text-slate-500">Choose your portal to continue to the dashboard</p>
                </div>

                <div className="space-y-4">
                  {mainCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button 
                        key={cat.id}
                        onClick={() => {
                          if (cat.id === 'officials') {
                            setStep('officer_selection');
                          } else {
                            handleRoleSelect(cat.id as UserRole);
                          }
                        }}
                        className="w-full bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex items-center gap-5 text-left group"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.label}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">{cat.desc}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-blue-500 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'officer_selection' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep('main_selection')}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Main Portals
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight font-heading mb-2">Government Officials</h2>
                  <p className="text-sm font-medium text-slate-500">Select your authorized nodal level</p>
                </div>

                <div className="space-y-3">
                  {officialRoles.map(r => {
                    const Icon = r.icon;
                    return (
                      <button 
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex items-center gap-4 text-left group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.bg} ${r.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{r.label}</div>
                          <div className="text-[11px] font-medium text-slate-500">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'login_form' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <button 
                  onClick={() => setStep(officialRoles.find(r => r.id === selectedRole) ? 'officer_selection' : 'main_selection')}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to roles
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentRoleConfig.bg} ${currentRoleConfig.color} shadow-sm`}>
                    <currentRoleConfig.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight font-heading leading-tight">{currentRoleConfig.label}</h2>
                    <p className="text-sm font-medium text-slate-500">{currentRoleConfig.desc}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-2xl flex items-start space-x-3 text-sm text-red-700">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" /> ID / Reference Number
                    </label>
                    <input 
                      type="text" 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
                      placeholder={`Enter your ${currentRoleConfig.label} ID`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Password
                    </label>
                    <div className="relative">
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
                        placeholder="Enter password"
                      />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors outline-none">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 text-[15px]"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <div className="text-center pt-2">
                      <p className="text-xs font-medium text-slate-400">Demo mode — enter any value to login</p>
                      {selectedRole === 'citizen' && (
                        <p className="text-xs font-medium mt-4">
                          New beneficiary?{' '}
                          <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Register & Link Aadhaar
                          </Link>
                        </p>
                      )}
                    </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
