import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { BarChart3, AlertCircle } from 'lucide-react';

export const L2Reports: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">District Reports</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Aggregated analytics of sanctioned budgets and application volume for your district.</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-blue-700 bg-blue-50/80 border border-blue-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <BarChart3 className="w-5 h-5 mr-3 text-blue-600" /> Total Sanctions: <span className="ml-2 font-black text-blue-700 text-lg">0</span>
            </div>
          </div>
        </div>

        <div className="glass-card bg-white/70 p-16 rounded-3xl border border-white/50 shadow-xl flex flex-col items-center justify-center text-center backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full bg-slate-100/80 flex items-center justify-center mb-6 shadow-inner border border-slate-200">
             <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading mb-2">Insufficient Data</h2>
          <p className="text-slate-500 max-w-md">There is not enough historical data to generate district reports at this time. Analytics will appear here as you sanction more applications.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
