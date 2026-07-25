import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scheme } from '../types';
import { Landmark, PlusCircle, LineChart, ShieldCheck, DollarSign, ListOrdered, CheckCircle2, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const AdminDashboard: React.FC = () => {
  const { schemes, installments, stats, addNewScheme, releaseInstallment } = useApp();
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'create_scheme' | 'treasury'>('analytics');

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

  const handleCreateSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !department.trim() || !description.trim()) {
      alert('Please fill out all primary scheme details.');
      return;
    }

    const filteredCrit = eligibilityCriteria.filter(c => c.trim() !== '');
    const filteredDocs = requiredDocuments.filter(d => d.trim() !== '');

    if (filteredCrit.length === 0 || filteredDocs.length === 0) {
      alert('Please add at least one eligibility criterion and one required document.');
      return;
    }

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

    alert(`Successfully launched new scheme: "${title}"! Notification sent to all citizens.`);
    
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

  // Find processing / pending installments for treasury desk
  const pendingPayments = installments.filter(i => i.status === 'processing' || i.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6" id="admin_dashboard_root">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="z-10 relative">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">System Administrator</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Configure welfare schemes, review general ledger stats, and authorize treasury direct transfer releases.</p>
          </div>

          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-sm relative z-10 w-full md:w-auto overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              System Analytics
            </button>
            <button
              onClick={() => setActiveTab('treasury')}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'treasury' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Treasury Desk
            </button>
            <button
              onClick={() => setActiveTab('create_scheme')}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'create_scheme' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Scheme</span>
            </button>
          </div>
        </div>

        {/* 1. SYSTEM ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-50 group-hover:bg-emerald-200 transition-colors"></div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest relative z-10">Consolidated Disbursed</p>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 relative z-10 tracking-tight">₹{(stats.totalDisbursedAmount / 10000000).toFixed(2)} Cr</h3>
                <p className="text-[10px] text-emerald-600 font-extrabold mt-3 uppercase tracking-widest bg-emerald-50 inline-block px-2 py-1 rounded-md border border-emerald-100 relative z-10">Cleared RBI-DBT transfers</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-200 transition-colors"></div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest relative z-10">Total Sanctions</p>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 relative z-10 tracking-tight">₹{(stats.totalSanctionedAmount / 10000000).toFixed(2)} Cr</h3>
                <p className="text-[10px] text-indigo-600 font-extrabold mt-3 uppercase tracking-widest bg-indigo-50 inline-block px-2 py-1 rounded-md border border-indigo-100 relative z-10">Sanctioned budgets</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100 rounded-full blur-3xl opacity-50 group-hover:bg-sky-200 transition-colors"></div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest relative z-10">Active Subsidies</p>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 relative z-10 tracking-tight">{stats.totalSchemesActive} Live</h3>
                <p className="text-[10px] text-sky-600 font-extrabold mt-3 uppercase tracking-widest bg-sky-50 inline-block px-2 py-1 rounded-md border border-sky-100 relative z-10">Accepting applications</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-100 rounded-full blur-3xl opacity-50 group-hover:bg-fuchsia-200 transition-colors"></div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest relative z-10">Total Applications</p>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 relative z-10 tracking-tight">{stats.totalApplicationsReceived} Files</h3>
                <p className="text-[10px] text-fuchsia-600 font-extrabold mt-3 uppercase tracking-widest bg-fuchsia-50 inline-block px-2 py-1 rounded-md border border-fuchsia-100 relative z-10">Audited globally</p>
              </div>
            </div>

            {/* SVG Visualizations Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category distribution bar chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
                  <LineChart className="w-5 h-5 mr-3 text-emerald-500" />
                  Ministry Allocation Proportions (FY 26-27)
                </h3>

                <div className="space-y-6 text-xs font-bold text-slate-600">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Agriculture & Farmers Welfare <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹15 Cr)</span></span>
                      <span className="font-extrabold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">74.6%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '74.6%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New & Renewable Energy <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹8.5 Cr)</span></span>
                      <span className="font-extrabold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">49.4%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '49.4%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">School Education & Literacy <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹5 Cr)</span></span>
                      <span className="font-extrabold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">62.0%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ministry of Rural Development <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">(₹24 Cr)</span></span>
                      <span className="font-extrabold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">77.0%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System logs info */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/20 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest border-b border-slate-800 pb-4 flex items-center relative z-10">
                  <ShieldCheck className="w-5 h-5 mr-3 text-sky-400" />
                  System Audit Logs
                </h3>

                <div className="space-y-5 font-mono text-xs text-slate-400 relative z-10">
                  <div className="flex items-start space-x-3 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                    <span className="text-emerald-400 font-extrabold bg-emerald-950/50 border border-emerald-900/50 px-2 py-1 rounded-md text-[10px] tracking-widest">INFO</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-200">Aadhaar Verification Node Online</p>
                      <p className="mt-1">Retrieved successfully 124,050 citizen indexes from National demographics registers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                    <span className="text-purple-400 font-extrabold bg-purple-950/50 border border-purple-900/50 px-2 py-1 rounded-md text-[10px] tracking-widest">DBT</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-200">NPCI Map Synchronization Complete</p>
                      <p className="mt-1">Connected State Bank of India & Bank of Baroda direct routing routers. Latency: 12ms.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pb-4 last:border-0 last:pb-0">
                    <span className="text-amber-400 font-extrabold bg-amber-950/50 border border-amber-900/50 px-2 py-1 rounded-md text-[10px] tracking-widest">AUDIT</span>
                    <div className="leading-relaxed">
                      <p className="font-bold text-slate-200">Sanction Threshold Audited</p>
                      <p className="mt-1">Consolidated district budgets are within 85% safety limits of national welfare reserve allocations.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. DIRECT TRANSFERS (TREASURY) RELEASE VIEW */}
        {activeTab === 'treasury' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
              Treasury Pending Disbursements Queue
            </h2>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-24 text-slate-400 text-sm">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-pulse" />
                <p className="font-extrabold uppercase tracking-widest">Treasury ledger clear</p>
                <p className="mt-2 font-medium">All sanctioned installments are already released or pending sanctioning.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm divide-y divide-slate-100 font-medium text-slate-600">
                  <thead>
                    <tr className="text-slate-400 uppercase font-extrabold tracking-widest text-[10px]">
                      <th className="pb-4 pl-4">Reference ID</th>
                      <th className="pb-4">Scheme Grant</th>
                      <th className="pb-4">Inst. #</th>
                      <th className="pb-4">Value (₹)</th>
                      <th className="pb-4">Current Status</th>
                      <th className="pb-4 pr-4 text-right">DBT Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingPayments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 font-mono text-xs font-bold text-slate-900 pl-4">#{inst.id}</td>
                        <td className="py-5 font-bold text-slate-800 max-w-xs truncate">{inst.schemeTitle}</td>
                        <td className="py-5 text-slate-500 font-bold">{inst.installmentNumber}</td>
                        <td className="py-5 font-extrabold text-emerald-600">₹{inst.amount.toLocaleString('en-IN')}</td>
                        <td className="py-5">
                          <span className={`inline-block text-[10px] px-2.5 py-1 rounded-md border font-extrabold uppercase tracking-widest ${
                            inst.status === 'processing' 
                              ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse shadow-sm' 
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-5 pr-4 text-right">
                          <button
                            onClick={() => {
                              releaseInstallment(inst.id);
                              alert(`DBT authorized! ₹${inst.amount.toLocaleString('en-IN')} released to applicant's Aadhaar-mapped bank node.`);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center space-x-2 cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Authorize Transfer</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. NEW SCHEME CONFIGURATOR */}
        {activeTab === 'create_scheme' && (
          <form onSubmit={handleCreateSchemeSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
              Configure New Grant / Subsidy Scheme
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Scheme Official Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. PM Suryodaya Yojana (Solar Subsidy program)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Administering Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Department of School Education"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Nodal Ministry</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ministry of Education"
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Sector Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Scheme['category'])}
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                >
                  <option value="agriculture">Agriculture</option>
                  <option value="education">Education</option>
                  <option value="energy">Green Energy</option>
                  <option value="housing">Housing</option>
                  <option value="healthcare">Healthcare & Insurance</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Total Allocation Budget (₹)</label>
                <input 
                  type="number" 
                  value={totalAllocation}
                  onChange={(e) => setTotalAllocation(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Grant Value Per Beneficiary (₹)</label>
                <input 
                  type="number" 
                  value={subsidyAmount}
                  onChange={(e) => setSubsidyAmount(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Installment Disbursements</label>
                <input 
                  type="number" 
                  min={1} 
                  max={12}
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Program Description</label>
                <textarea 
                  placeholder="Input detailed background, targets and context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Financial Benefits Structure</label>
                <textarea 
                  placeholder="Input distribution timeline details (e.g. ₹6000 per year paid in 3 installments)..."
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 resize-none"
                  rows={2}
                  required
                />
              </div>

              {/* Dynamic list: Eligibility checklist */}
              <div className="col-span-2 space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Eligibility Criteria Parameters List</label>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="text-xs text-indigo-600 font-extrabold hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Parameter</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {eligibilityCriteria.map((crit, idx) => (
                    <div key={idx} className="flex gap-3 items-center group">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-extrabold text-xs">#{idx + 1}</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Household annual family income must not exceed ₹2.5 Lakhs"
                        value={crit}
                        onChange={(e) => handleCriteriaChange(idx, e.target.value)}
                        className="flex-1 p-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                        required
                      />
                      {eligibilityCriteria.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCriteria(idx)}
                          className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic list: Required Documents checklist */}
              <div className="col-span-2 space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest ml-1">Required Documents Checklist</label>
                  <button
                    type="button"
                    onClick={handleAddDoc}
                    className="text-xs text-indigo-600 font-extrabold hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Document</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-extrabold text-xs">#{idx + 1}</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Income Certificate issued by competent Revenue Authority"
                        value={doc}
                        onChange={(e) => handleDocChange(idx, e.target.value)}
                        className="flex-1 p-3.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                        required
                      />
                      {requiredDocuments.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDoc(idx)}
                          className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Launch New Subsidy Scheme</span>
            </button>
          </form>
        )}

      </div>
    </DashboardLayout>
  );
};
