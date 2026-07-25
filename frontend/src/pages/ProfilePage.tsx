import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Landmark, ShieldCheck, Mail, Phone, Lock, Save, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const ProfilePage: React.FC = () => {
  const { citizenProfile, setCitizenProfile } = useApp();

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
      <div className="space-y-6" id="profile_page_root">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Beneficiary Profile</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your demographic links, bank configurations, and security verification logs.</p>
          </div>
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center font-bold">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Identity Audited
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Editable Inputs on Left */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Demographics Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide pb-1.5 border-b border-gray-100 flex items-center">
                <User className="w-4.5 h-4.5 mr-2 text-purple-800" /> Demographic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">Full Name (Locked)</label>
                  <div className="flex items-center space-x-2 bg-gray-100 p-2.5 rounded-lg border border-gray-200 text-gray-500 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{citizenProfile.name}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold">Aadhaar Reference (Locked)</label>
                  <div className="flex items-center space-x-2 bg-gray-100 p-2.5 rounded-lg border border-gray-200 text-gray-500 font-mono">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{citizenProfile.aadhaar}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg text-xs font-medium focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg text-xs font-medium focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide pb-1.5 border-b border-gray-100 flex items-center">
                <Landmark className="w-4.5 h-4.5 mr-2 text-emerald-700" /> Direct Transfer Bank Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg text-xs font-medium focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Account Number</label>
                  <input 
                    type="text" 
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg text-xs font-mono font-medium focus:outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg text-xs font-mono font-medium focus:outline-hidden"
                    maxLength={11}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alert / Submit Actions */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center flex-wrap gap-4">
              {saved ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg animate-fade-in flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Demographic and Bank links updated successfully!
                </span>
              ) : (
                <span className="text-xs text-gray-400 font-semibold">Check IFSC nodes and digits carefully.</span>
              )}
              <button 
                type="submit"
                className="bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" />
                <span>Save Profile Updates</span>
              </button>
            </div>

          </div>

          {/* Locked State Demographics on Right */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#0f172a] text-white p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-1.5 border-b border-slate-800 flex items-center">
                <Lock className="w-4.5 h-4.5 mr-2 text-rose-500" /> Revenue Records Audit
              </h3>

              <div className="space-y-3.5 text-xs font-medium">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Resident State:</span>
                  <span className="font-semibold text-slate-200">{citizenProfile.state}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">District:</span>
                  <span className="font-semibold text-slate-200">{citizenProfile.district}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Income Segment:</span>
                  <span className="font-semibold text-slate-200">₹{citizenProfile.income.toLocaleString('en-IN')}/yr</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500">Occupation Category:</span>
                  <span className="font-semibold text-slate-200">{citizenProfile.occupation}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-[10px] text-slate-400 flex items-start space-x-2 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <span>Demographics audits (District, caste, verified annual revenues) are validated continuously against state land revenue nodes. Locked for security.</span>
              </div>
            </div>

          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};
