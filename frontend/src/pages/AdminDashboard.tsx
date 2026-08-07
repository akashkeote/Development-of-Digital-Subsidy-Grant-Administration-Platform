import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Scheme } from '../types';
import { DashboardLayout } from '../components/DashboardLayout';
import { PlusCircle, LineChart, ShieldCheck, DollarSign, PlayCircle, Plus, Trash2, Download, FileSpreadsheet, Map, AlertTriangle, CheckCircle2, Users, Lock, Unlock, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { schemes, installments, stats, addNewScheme, releaseInstallment, applications, approveApplication, users, updateUserStatus, setCurrentRole } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'create_scheme' | 'treasury' | 'compliance' | 'access_management'>('analytics');
  const [overridingAppId, setOverridingAppId] = useState<string | null>(null);

  // Scheme Form States
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [ministry, setMinistry] = useState('');
  const [category, setCategory] = useState<Scheme['category']>('agriculture');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState<string[]>(['']);
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>(['']);
  const [totalAllocation, setTotalAllocation] = useState<number>(50000000);
  const [subsidyAmount, setSubsidyAmount] = useState<number>(10000);
  const [installmentCount, setInstallmentCount] = useState<number>(3);

  // Field helpers
  const handleAddCriteria = () => setEligibilityCriteria([...eligibilityCriteria, '']);
  const handleRemoveCriteria = (index: number) => {
    setEligibilityCriteria(eligibilityCriteria.filter((_, idx) => idx !== index));
  };
  const handleCriteriaChange = (index: number, val: string) => {
    const next = [...eligibilityCriteria];
    next[index] = val;
    setEligibilityCriteria(next);
  };

  const handleAddDoc = () => setRequiredDocuments([...requiredDocuments, '']);
  const handleRemoveDoc = (index: number) => {
    setRequiredDocuments(requiredDocuments.filter((_, idx) => idx !== index));
  };
  const handleDocChange = (index: number, val: string) => {
    const next = [...requiredDocuments];
    next[index] = val;
    setRequiredDocuments(next);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !department.trim() || !description.trim()) {
      setErrorMsg('Please fill out all primary scheme details.');
      return;
    }

    const filteredCrit = eligibilityCriteria.filter(c => c.trim() !== '');
    const filteredDocs = requiredDocuments.filter(d => d.trim() !== '');

    if (filteredCrit.length === 0 || filteredDocs.length === 0) {
      setErrorMsg('Please add at least one eligibility criterion and one required document.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate Network Request
    await new Promise(resolve => setTimeout(resolve, 1500));

    addNewScheme({
      title,
      department,
      ministry,
      category,
      description,
      benefits,
      eligibilityCriteria: filteredCrit,
      requiredDocuments: filteredDocs,
      financialYear: '2026-27',
      totalAllocation,
      subsidyAmount,
      installmentCount
    });

    setIsSubmitting(false);
    
    // Clear Form
    setTitle('');
    setDepartment('');
    setMinistry('');
    setDescription('');
    setBenefits('');
    setEligibilityCriteria(['']);
    setRequiredDocuments(['']);
    setTotalAllocation(50000000);
    setSubsidyAmount(10000);
    setInstallmentCount(3);
    setActiveTab('analytics');
  };

  const pendingPayments = installments.filter(i => i.status === 'processing' || i.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        {/* Header */}
        <div className="glass-card p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40">
          <div>
            <h1 className="font-heading text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-700">System Administrator</h1>
            <p className="text-slate-600 mt-2 font-medium">Configure welfare schemes, review general ledger stats, and authorize treasury direct transfer releases.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {/* Real-time Queue Monitor instead of Role Switcher */}
            <div className="bg-white/80 p-4 rounded-2xl flex items-center gap-6 shadow-sm border border-slate-200/50">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">L1 Queue</p>
                <p className="text-xl font-black text-blue-600">{applications.filter(app => app.status === 'submitted').length}</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">L2 Queue</p>
                <p className="text-xl font-black text-amber-500">{applications.filter(app => app.status === 'documents_verified').length}</p>
              </div>
              <div className="text-center border-l border-slate-200 pl-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">L3 Queue</p>
                <p className="text-xl font-black text-emerald-500">{installments.filter(inst => inst.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Container */}
        <div className="flex gap-4 w-full overflow-x-auto pb-4 hide-scrollbar">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn-3d px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-t border-white/20' 
                : 'glass-card bg-white/60 text-slate-700 hover:text-blue-600 border border-white/60 hover:bg-white/80'
            }`}
          >
            System Analytics
          </button>
          <button
            onClick={() => setActiveTab('treasury')}
            className={`btn-3d px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'treasury' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-t border-white/20' 
                : 'glass-card bg-white/60 text-slate-700 hover:text-blue-600 border border-white/60 hover:bg-white/80'
            }`}
          >
            Treasury Desk
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`btn-3d px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'compliance' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-t border-white/20' 
                : 'glass-card bg-white/60 text-slate-700 hover:text-blue-600 border border-white/60 hover:bg-white/80'
            }`}
          >
            Compliance Desk
          </button>
          <button
            onClick={() => setActiveTab('access_management')}
            className={`btn-3d px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'access_management' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-t border-white/20' 
                : 'glass-card bg-white/60 text-slate-700 hover:text-blue-600 border border-white/60 hover:bg-white/80'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Access Management</span>
          </button>
          <button
            onClick={() => setActiveTab('create_scheme')}
            className={`btn-3d px-6 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'create_scheme' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-t border-white/20' 
                : 'glass-card bg-white/60 text-slate-700 hover:text-blue-600 border border-white/60 hover:bg-white/80'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Scheme</span>
          </button>
        </div>

        {/* 1. SYSTEM ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-10">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold font-heading text-slate-800">Fund Utilization & Regional Analytics</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 rounded-xl font-bold text-sm shadow-sm transition-all">
                  <FileSpreadsheet size={16} className="text-emerald-500" /> Export Excel
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 rounded-xl font-bold text-sm shadow-sm transition-all">
                  <Download size={16} className="text-rose-500" /> Download PDF
                </button>
              </div>
            </div>
            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Consolidated Disbursed</p>
                <h3 className="font-heading text-3xl font-bold mt-3 relative z-10 text-slate-800">₹{(stats.totalDisbursedAmount / 10000000).toFixed(2)} Cr</h3>
                <div className="mt-4 inline-flex items-center space-x-1.5 bg-green-100/50 text-[#138808] px-3 py-1 rounded-lg border border-green-200/50 backdrop-blur-sm relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cleared RBI-DBT transfers</span>
                </div>
              </div>
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Total Sanctions</p>
                <h3 className="font-heading text-3xl font-bold mt-3 relative z-10 text-slate-800">₹{(stats.totalSanctionedAmount / 10000000).toFixed(2)} Cr</h3>
                <div className="mt-4 inline-flex items-center space-x-1.5 bg-blue-100/50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200/50 backdrop-blur-sm relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sanctioned budgets</span>
                </div>
              </div>
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Active Subsidies</p>
                <h3 className="font-heading text-3xl font-bold mt-3 relative z-10 text-slate-800">{stats.totalSchemesActive} Live</h3>
                <div className="mt-4 inline-flex items-center space-x-1.5 bg-sky-100/50 text-sky-700 px-3 py-1 rounded-lg border border-sky-200/50 backdrop-blur-sm relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Accepting applications</span>
                </div>
              </div>
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Total Applications</p>
                <h3 className="font-heading text-3xl font-bold mt-3 relative z-10 text-slate-800">{stats.totalApplicationsReceived} Files</h3>
                <div className="mt-4 inline-flex items-center space-x-1.5 bg-fuchsia-100/50 text-fuchsia-700 px-3 py-1 rounded-lg border border-fuchsia-200/50 backdrop-blur-sm relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Audited globally</span>
                </div>
              </div>
            </div>

            {/* Visualizations Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 space-y-8">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-white pb-4 flex items-center font-heading">
                  <LineChart className="w-5 h-5 mr-3 text-blue-600" />
                  Ministry Allocation Proportions (FY 26-27)
                </h3>

                <div className="space-y-6 text-sm font-medium text-slate-700">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Agriculture & Farmers Welfare <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹15 Cr)</span></span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded uppercase tracking-wider border border-rose-200">
                          <AlertTriangle size={12} /> 85% Exhausted
                        </span>
                        <span className="font-bold text-slate-800 bg-white/60 px-3 py-1 rounded-lg border border-white backdrop-blur-md shadow-sm">85.0%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>New & Renewable Energy <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹8.5 Cr)</span></span>
                      <span className="font-bold text-slate-800 bg-white/60 px-3 py-1 rounded-lg border border-white backdrop-blur-md shadow-sm">49.4%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-[#FF9933] rounded-full shadow-[0_0_10px_rgba(255,153,51,0.5)]" style={{ width: '49.4%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>School Education & Literacy <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹5 Cr)</span></span>
                      <span className="font-bold text-slate-800 bg-white/60 px-3 py-1 rounded-lg border border-white backdrop-blur-md shadow-sm">62.0%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Ministry of Rural Development <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹24 Cr)</span></span>
                      <span className="font-bold text-slate-800 bg-white/60 px-3 py-1 rounded-lg border border-white backdrop-blur-md shadow-sm">77.0%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-white/60 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Region-wise Analytics */}
              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 space-y-8 col-span-1 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-white pb-4 flex items-center font-heading">
                  <Map className="w-5 h-5 mr-3 text-blue-600" />
                  Region-wise Disbursements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">North Region</p>
                    <p className="font-heading text-2xl font-bold text-slate-800 mt-2">₹12.4 Cr</p>
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-3"><div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div></div>
                  </div>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">South Region</p>
                    <p className="font-heading text-2xl font-bold text-slate-800 mt-2">₹18.1 Cr</p>
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-3"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div></div>
                  </div>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">East Region</p>
                    <p className="font-heading text-2xl font-bold text-slate-800 mt-2">₹8.9 Cr</p>
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-3"><div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div></div>
                  </div>
                  <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">West Region</p>
                    <p className="font-heading text-2xl font-bold text-slate-800 mt-2">₹15.2 Cr</p>
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-3"><div className="h-full bg-fuchsia-500 rounded-full" style={{ width: '55%' }}></div></div>
                  </div>
                </div>
              </div>

              <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 space-y-8 col-span-1 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-white pb-4 flex items-center font-heading">
                  <ShieldCheck className="w-5 h-5 mr-3 text-blue-600" />
                  System Audit Logs
                </h3>

                <div className="space-y-6 font-mono text-xs text-slate-600">
                  <div className="flex items-start space-x-4 border-b border-white/40 pb-5 last:border-0 last:pb-0">
                    <span className="text-[#138808] font-bold bg-green-100/50 border border-green-200/50 px-2 py-1 rounded-md text-[10px] tracking-widest shadow-sm">INFO</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-800 text-sm">Aadhaar Verification Node Online</p>
                      <p className="mt-1.5 text-slate-500">Retrieved successfully 124,050 citizen indexes from National demographics registers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 border-b border-white/40 pb-5 last:border-0 last:pb-0">
                    <span className="text-blue-700 font-bold bg-blue-100/50 border border-blue-200/50 px-2 py-1 rounded-md text-[10px] tracking-widest shadow-sm">DBT</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-800 text-sm">NPCI Map Synchronization Complete</p>
                      <p className="mt-1.5 text-slate-500">Connected State Bank of India & Bank of Baroda direct routing routers. Latency: 12ms.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 pb-5 last:border-0 last:pb-0">
                    <span className="text-amber-700 font-bold bg-amber-100/50 border border-amber-200/50 px-2 py-1 rounded-md text-[10px] tracking-widest shadow-sm">AUDIT</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-800 text-sm">Sanction Threshold Audited</p>
                      <p className="mt-1.5 text-slate-500">Consolidated district budgets are within 85% safety limits of national welfare reserve allocations.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* COMPLIANCE DESK VIEW */}
        {activeTab === 'compliance' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold font-heading text-slate-800 border-b border-slate-200/50 pb-4">Master Application Override Console</h2>
            
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="relative z-10 flex gap-4">
                <AlertTriangle className="text-rose-600 shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-rose-800 text-lg">System Administrator Privileges Active</h3>
                  <p className="text-sm text-rose-600 mt-1">
                    You have global override authority. You can bypass L1 (Verifier) and L2 (District) stages and forcefully approve or reject any application in the system. Use with extreme caution.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 border border-white/60 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6 flex items-center">
                Global Application Registry ({applications.length})
              </h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {applications.length === 0 ? (
                  <p className="text-center text-slate-500 font-medium py-10">No applications registered in the system.</p>
                ) : applications.map((app) => (
                  <div key={app.id} className="flex flex-col xl:flex-row items-center justify-between p-5 bg-white/60 border border-white/80 shadow-sm rounded-2xl hover:bg-white/80 transition-all">
                    <div className="flex items-center gap-5 w-full xl:w-auto">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-inner shrink-0 ${
                        app.status === 'approved_by_district' || app.status === 'disbursing' || app.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                          : app.status === 'rejected_by_verifier' || app.status === 'rejected_by_district'
                          ? 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-amber-100 text-amber-600 border border-amber-200'
                      }`}>
                        {app.status === 'approved_by_district' || app.status === 'disbursing' || app.status === 'completed' ? 'A' : app.status.includes('reject') ? 'R' : '!'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{app.citizenName} <span className="text-xs text-slate-400 font-normal ml-2">({app.schemeTitle})</span></h4>
                        <p className="text-xs font-mono text-slate-500 mt-1">ID: {app.id} • Status: <span className="font-bold text-slate-700 uppercase tracking-wider">{app.status.replace(/_/g, ' ')}</span></p>
                      </div>
                    </div>
                    <div className="mt-5 xl:mt-0 flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                      <button 
                        onClick={async () => {
                          setOverridingAppId(app.id + '_reject');
                          await new Promise(r => setTimeout(r, 800));
                          approveApplication(app.id, 'Force Rejected by System Administrator', false);
                          setOverridingAppId(null);
                        }}
                        disabled={overridingAppId !== null}
                        className="btn-3d px-5 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all whitespace-nowrap disabled:opacity-50"
                      >
                        {overridingAppId === app.id + '_reject' ? 'Overriding...' : 'Force Reject'}
                      </button>
                      <button 
                        onClick={async () => {
                          setOverridingAppId(app.id + '_approve');
                          await new Promise(r => setTimeout(r, 800));
                          approveApplication(app.id, 'Force Approved by System Administrator (Bypassed L1/L2)', true);
                          setOverridingAppId(null);
                        }}
                        disabled={overridingAppId !== null || app.status === 'approved_by_district' || app.status === 'disbursing' || app.status === 'completed'}
                        className="btn-3d px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-transparent rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 size={16} /> 
                        {overridingAppId === app.id + '_approve' ? 'Authorizing...' : 'Force Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DIRECT TRANSFERS (TREASURY) RELEASE VIEW */}
        {activeTab === 'treasury' && (
          <div className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 space-y-8">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-white pb-4 font-heading">
              Treasury Pending Disbursements Queue
            </h2>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-24 text-slate-500 bg-white/30 rounded-2xl border border-white/50 shadow-inner">
                <DollarSign className="w-16 h-16 text-[#138808] mx-auto mb-4 drop-shadow-md" />
                <p className="font-bold uppercase tracking-widest text-slate-700">Treasury ledger clear</p>
                <p className="mt-2 font-medium">All sanctioned installments are already released or pending sanctioning.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/50 bg-white/30 shadow-inner">
                <table className="w-full text-left text-sm divide-y divide-white/40 text-slate-700">
                  <thead>
                    <tr className="text-slate-500 uppercase font-bold tracking-widest text-[10px] bg-white/50 backdrop-blur-md">
                      <th className="py-5 pl-6">Reference ID</th>
                      <th className="py-5">Scheme Grant</th>
                      <th className="py-5">Inst. #</th>
                      <th className="py-5">Value (₹)</th>
                      <th className="py-5">Current Status</th>
                      <th className="py-5 pr-6 text-right">DBT Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {pendingPayments.map((inst) => {
                      // We can check if this specific row is being processed if we had a state, but since we can't easily add a hook here without refactoring the whole component, we will just use a global state or inline if we add it at the top of AdminDashboard.
                      // Wait, I will add it right now inside the component body in the next step.
                      return (
                      <tr key={inst.id} className="hover:bg-white/60 transition-colors group">
                        <td className="py-5 font-mono text-xs font-bold text-slate-900 pl-6">#{inst.id}</td>
                        <td className="py-5 font-bold text-slate-800 max-w-xs truncate">{inst.schemeTitle}</td>
                        <td className="py-5 text-slate-500 font-bold">{inst.installmentNumber}</td>
                        <td className="py-5 font-bold text-[#138808]">₹{inst.amount.toLocaleString('en-IN')}</td>
                        <td className="py-5">
                          <span className={`inline-block text-[10px] px-3 py-1.5 rounded-lg border font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${
                            inst.status === 'processing' 
                              ? 'bg-amber-100/50 text-amber-700 border-amber-200/50' 
                              : 'bg-white/60 text-slate-600 border-white/60'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-5 pr-6 text-right">
                          <button
                            onClick={async () => {
                              const btn = document.getElementById(`btn-${inst.id}`);
                              if (btn) {
                                btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Authorizing...</span>';
                                btn.classList.add('opacity-70', 'cursor-not-allowed');
                              }
                              await new Promise(r => setTimeout(r, 1500)); // Simulate RBI Gateway
                              releaseInstallment(inst.id);
                            }}
                            id={`btn-${inst.id}`}
                            className="btn-3d bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center space-x-2 shadow-lg shadow-blue-500/30 border-t border-white/20"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Authorize Transfer</span>
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. NEW SCHEME CONFIGURATOR */}
        {activeTab === 'create_scheme' && (
          <form onSubmit={handleCreateSchemeSubmit} className="glass-card card-3d p-8 rounded-3xl border border-white/60 bg-white/40 space-y-10">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-white pb-4 font-heading">
              Configure New Grant / Subsidy Scheme
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              
              <div className="space-y-3 col-span-2">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Scheme Official Title</label>
                <input 
                  type="text" 
                  value={title}
                  placeholder="e.g. PM Suryodaya Yojana"
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Administering Department</label>
                <input 
                  type="text" 
                  value={department}
                  placeholder="e.g. Department of Energy"
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Nodal Ministry</label>
                <input 
                  type="text" 
                  value={ministry}
                  placeholder="e.g. Ministry of New & Renewable Energy"
                  onChange={(e) => setMinistry(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Sector Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Scheme['category'])}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234F46E5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[position:right_1.25rem_center] bg-no-repeat cursor-pointer"
                >
                  <option value="agriculture">Agriculture</option>
                  <option value="education">Education</option>
                  <option value="energy">Green Energy</option>
                  <option value="housing">Housing</option>
                  <option value="healthcare">Healthcare & Insurance</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Total Allocation Budget (₹)</label>
                <input 
                  type="number" 
                  value={totalAllocation}
                  onChange={(e) => setTotalAllocation(Number(e.target.value))}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Grant Value Per Beneficiary (₹)</label>
                <input 
                  type="number" 
                  value={subsidyAmount}
                  onChange={(e) => setSubsidyAmount(Number(e.target.value))}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Installment Disbursements</label>
                <input 
                  type="number" 
                  min={1} 
                  max={12}
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(Number(e.target.value))}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner"
                  required
                />
              </div>

              <div className="space-y-3 col-span-2">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Program Description</label>
                <textarea 
                  value={description}
                  placeholder="Input detailed background, targets and context..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-inner resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-3 col-span-2">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Financial Benefits Structure</label>
                <textarea 
                  value={benefits}
                  placeholder="Input distribution timeline details (e.g. ₹6000 per year paid in 3 installments)..."
                  onChange={(e) => setBenefits(e.target.value)}
                  className="input-3d w-full p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium placeholder:text-slate-400 shadow-inner resize-none"
                  rows={2}
                  required
                />
              </div>

              <div className="col-span-2 space-y-5 pt-8 border-t border-white/40">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Eligibility Criteria</label>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="btn-3d text-xs bg-white/60 border border-white/60 text-slate-700 hover:text-blue-600 hover:bg-white/80 px-5 py-2.5 rounded-xl transition-all font-bold flex items-center space-x-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {eligibilityCriteria.map((crit, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <span className="w-12 h-12 rounded-xl bg-white/50 border border-white/60 text-slate-500 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">#{idx + 1}</span>
                      <input 
                        type="text" 
                        value={crit}
                        placeholder="e.g. Household annual family income must not exceed ₹2.5 Lakhs"
                        onChange={(e) => handleCriteriaChange(idx, e.target.value)}
                        className="input-3d flex-1 p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner placeholder:text-slate-400"
                        required
                      />
                      {eligibilityCriteria.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCriteria(idx)}
                          className="btn-3d w-12 h-12 flex items-center justify-center text-red-500 bg-white/50 border border-white/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 space-y-5 pt-8 border-t border-white/40">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block ml-1">Required Documents</label>
                  <button
                    type="button"
                    onClick={handleAddDoc}
                    className="btn-3d text-xs bg-white/60 border border-white/60 text-slate-700 hover:text-blue-600 hover:bg-white/80 px-5 py-2.5 rounded-xl transition-all font-bold flex items-center space-x-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Document</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <span className="w-12 h-12 rounded-xl bg-white/50 border border-white/60 text-slate-500 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">#{idx + 1}</span>
                      <input 
                        type="text" 
                        value={doc}
                        placeholder="e.g. Income Certificate issued by competent Revenue Authority"
                        onChange={(e) => handleDocChange(idx, e.target.value)}
                        className="input-3d flex-1 p-4 rounded-xl bg-white/60 border border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium shadow-inner placeholder:text-slate-400"
                        required
                      />
                      {requiredDocuments.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDoc(idx)}
                          className="btn-3d w-12 h-12 flex items-center justify-center text-red-500 bg-white/50 border border-white/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> {errorMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d w-full py-5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-bold rounded-xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-3 border-t border-white/20 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <PlusCircle className="w-6 h-6" />
                )}
                <span>{isSubmitting ? 'Publishing Scheme to National Database...' : 'Launch New Subsidy Scheme'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 5. ACCESS MANAGEMENT (USER DIRECTORY) */}
        {activeTab === 'access_management' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-800">System Users & Access Control</h2>
              <p className="text-sm text-slate-500 mt-1">Manage system officers, monitor application throughput, and block suspicious accounts.</p>
            </div>

            <div className="grid gap-6">
              {users.map(user => (
                <div key={user.id} className="glass-card card-3d p-6 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${user.status === 'blocked' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {user.status === 'blocked' ? <Lock size={20} /> : <Users size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                        <span className="font-mono text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded text-slate-500">#{user.id}</span>
                        {user.status === 'blocked' && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                            <ShieldAlert size={10} /> Suspended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{user.email} • {user.department}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</span>
                      <span className="text-sm font-bold text-slate-700 capitalize">{user.role.replace('_', ' ')}</span>
                    </div>
                    
                    {user.applicationsProcessed !== undefined && (
                      <div className="flex flex-col px-4 border-l border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processed</span>
                        <span className="text-sm font-bold text-blue-600">{user.applicationsProcessed} Apps</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 ml-auto md:ml-4">
                      {user.status === 'blocked' ? (
                        <button 
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="btn-3d px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <Unlock size={16} /> Unblock
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateUserStatus(user.id, 'blocked')}
                          className="btn-3d px-4 py-2 bg-white text-rose-600 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <Lock size={16} /> Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
