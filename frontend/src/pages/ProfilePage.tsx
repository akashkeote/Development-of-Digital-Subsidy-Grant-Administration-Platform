import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Landmark, ShieldCheck, Mail, Phone, Lock, Save, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const ProfilePage: React.FC = () => {
  const { citizenProfile, setCitizenProfile } = useApp();

  const [name, setName] = useState(citizenProfile.name);
  const [aadhaar, setAadhaar] = useState(citizenProfile.aadhaar);
  const [email, setEmail] = useState(citizenProfile.email);
  const [phone, setPhone] = useState(citizenProfile.phone);
  const [bankName, setBankName] = useState(citizenProfile.bankName);
  const [bankAccount, setBankAccount] = useState(citizenProfile.bankAccount);
  const [ifsc, setIfsc] = useState(citizenProfile.ifsc);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCitizenProfile(prev => ({
      ...prev,
      name,
      aadhaar,
      email,
      phone,
      bankName,
      bankAccount,
      ifsc
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" id="profile_page_root">
        
        {/* Header */}
        <div className="pastel-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gradient-blue">Beneficiary Profile</h1>
            <p className="text-sm text-slate-500 mt-2">Manage your demographic links, bank configurations, and security verification logs.</p>
          </div>
          <div className="text-xs text-green-700 bg-green-50 border border-green-100 px-4 py-2.5 rounded-lg flex items-center font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5 mr-2" /> Identity Audited
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editable Inputs on Left */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Demographics Card */}
            <div className="pastel-card p-8 space-y-6 relative border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center">
                <User className="w-5 h-5 mr-3 text-blue-500" /> Demographic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Aadhaar Reference</label>
                  <input 
                    type="text" 
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={12}
                    className="w-full bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-mono shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 focus:border-blue-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 focus:border-blue-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Card */}
            <div className="pastel-card p-8 space-y-6 relative border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center">
                <Landmark className="w-5 h-5 mr-3 text-green-500" /> Direct Transfer Bank Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-100 focus:border-blue-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">Account Number</label>
                  <input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 bg-white border border-slate-100 focus:border-blue-300 rounded-xl text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-500 font-bold tracking-wider text-[10px] uppercase">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-4 bg-white border border-slate-100 focus:border-blue-300 rounded-xl text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm transition-all"
                    maxLength={11}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alert / Submit Actions */}
            <div className="pastel-card p-6 flex justify-between items-center flex-wrap gap-6 border border-slate-100 shadow-sm">
              {saved ? (
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-4 py-2.5 rounded-lg flex items-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 mr-2" /> Updates saved securely!
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Check IFSC nodes and digits carefully.</span>
              )}
              <button 
                type="submit"
                className="pastel-btn px-8 py-3.5 rounded-lg flex items-center space-x-2 cursor-pointer shadow-sm text-sm font-bold"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Updates</span>
              </button>
            </div>

          </div>

          {/* Locked State Demographics on Right */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="pastel-card p-8 space-y-6 relative overflow-hidden border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-slate-500" /> Revenue Records Audit
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Resident State:</span>
                  <span className="font-bold text-slate-800">{citizenProfile.state}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">District:</span>
                  <span className="font-bold text-slate-800">{citizenProfile.district}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Income Segment:</span>
                  <span className="font-bold text-green-600">₹{citizenProfile.income.toLocaleString('en-IN')}/yr</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-slate-500">Occupation Category:</span>
                  <span className="font-bold text-slate-800">{citizenProfile.occupation}</span>
                </div>
              </div>

              <div className="p-4 bg-white/50 border border-slate-100 rounded-xl text-xs text-slate-500 flex items-start space-x-3 leading-relaxed shadow-sm">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>Demographics audits (District, caste, verified annual revenues) are validated continuously against state land revenue nodes. Locked for security.</span>
              </div>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
