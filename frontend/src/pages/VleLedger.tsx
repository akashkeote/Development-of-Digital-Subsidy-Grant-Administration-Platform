import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { DollarSign, AlertCircle } from 'lucide-react';

export const VleLedger: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Commission Ledger</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Track your earnings and pending commissions for successfully disbursed applications.</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <DollarSign className="w-5 h-5 mr-3 text-emerald-600" /> Total Earnings: <span className="ml-2 font-black text-emerald-700 text-lg">₹0</span>
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/70 p-16 rounded-3xl border border-white/50 shadow-xl flex flex-col items-center justify-center text-center backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full bg-slate-100/80 flex items-center justify-center mb-6 shadow-inner border border-slate-200">
             <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading mb-2">Ledger is Empty</h2>
          <p className="text-slate-500 max-w-md">No commissions have been credited to your account yet. Commissions are processed when an application you submitted reaches the final disbursement stage.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
