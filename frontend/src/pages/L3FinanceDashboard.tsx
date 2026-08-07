import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { Landmark, FileText, CheckCircle2, DollarSign, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const L3FinanceDashboard: React.FC = () => {
  const { installments, releaseInstallment } = useApp();
  const [selectedInstId, setSelectedInstId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter installments pending disbursement (Status: pending)
  const pendingInstallments = installments.filter(i => i.status === 'pending');
  const disbursedInstallments = installments.filter(i => i.status === 'disbursed');

  const totalPendingAmount = pendingInstallments.reduce((acc, curr) => acc + curr.amount, 0);

  const handleDisburse = () => {
    if (!selectedInstId) return;
    setIsProcessing(true);
    setTimeout(() => {
      releaseInstallment(selectedInstId);
      setIsProcessing(false);
      setSelectedInstId('');
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">State Finance Nodal Officer</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">L3 DBT/PFMS Fund Disbursement Dashboard</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-blue-700 bg-blue-50/80 border border-blue-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <DollarSign className="w-5 h-5 mr-3 text-blue-600" /> Pending Transfers: <span className="ml-2 font-black text-blue-700 text-lg">{pendingInstallments.length}</span>
            </div>
          </div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="p-8 glass-card bg-white/70 rounded-3xl shadow-xl border border-white/50 backdrop-blur-xl card-3d">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> Pending Installments</p>
            <h3 className="text-4xl font-black text-slate-800 mt-4 mb-2 font-heading">{pendingInstallments.length}</h3>
            <p className="text-sm font-medium text-slate-500">Requires PFMS push</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-8 glass-card bg-white/70 rounded-3xl shadow-xl border border-white/50 backdrop-blur-xl card-3d">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-4 h-4 text-amber-500"/> Pending Amount</p>
            <h3 className="text-4xl font-black text-amber-500 mt-4 mb-2 font-heading">₹{totalPendingAmount.toLocaleString('en-IN')}</h3>
            <p className="text-sm font-medium text-slate-500">Awaiting clearance</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-8 glass-card bg-white/70 rounded-3xl shadow-xl border border-white/50 backdrop-blur-xl card-3d">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Successfully Disbursed</p>
            <h3 className="text-4xl font-black text-emerald-500 mt-4 mb-2 font-heading">{disbursedInstallments.length}</h3>
            <p className="text-sm font-medium text-slate-500">DBT transferred</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Pending DBT Transfers</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4">Inst. ID</th>
                    <th className="px-6 py-4">App ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInstallments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400">No pending installments.</td>
                    </tr>
                  ) : (
                    pendingInstallments.map((inst) => (
                      <tr 
                        key={inst.id} 
                        className={`border-b border-slate-50 transition-colors cursor-pointer ${selectedInstId === inst.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
                        onClick={() => setSelectedInstId(inst.id)}
                      >
                        <td className="px-6 py-4 font-mono text-xs">{inst.id}</td>
                        <td className="px-6 py-4 font-mono text-xs">{inst.applicationId}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">₹{inst.amount.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={`w-4 h-4 rounded-full border-2 ml-auto ${selectedInstId === inst.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Disbursement Action</h3>
              
              {selectedInstId ? (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs font-bold text-amber-700 uppercase mb-1">Selected Installment</p>
                    <p className="font-mono text-sm text-amber-900">{selectedInstId}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">PFMS Verification</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 mb-2">
                       <CheckCircle2 className="w-4 h-4" /> Bank Account Verified
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                       <CheckCircle2 className="w-4 h-4" /> NPCI Mapper Linked
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleDisburse}
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                       <>Execute PFMS Transfer <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                  <DollarSign className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium text-center">Select a pending installment from the list to process disbursement.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
