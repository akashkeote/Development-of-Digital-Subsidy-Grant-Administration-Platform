import React from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { DollarSign, AlertCircle, FileText } from 'lucide-react';

export const VleLedger: React.FC = () => {
  const { applications } = useApp();
  
  // Filter only applications submitted by this VLE
  const assistedApps = applications.filter(app => app.submittedByRole === 'vle');
  
  // Calculate total earnings for completely submitted apps (or successfully processed ones). For demo, flat Rs 50 for every submitted app.
  const totalEarned = assistedApps.length * 50;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Application History & Ledger</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Track all applications you submitted and your earned commissions.</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <DollarSign className="w-5 h-5 mr-3 text-emerald-600" /> Total Earnings: <span className="ml-2 font-black text-emerald-700 text-lg">?{totalEarned.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Citizen Name</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Applied On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Commission</th>
                </tr>
              </thead>
              <tbody>
                {assistedApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        No history found. Start submitting applications to earn commissions.
                      </div>
                    </td>
                  </tr>
                ) : (
                  assistedApps.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{app.citizenName}</td>
                      <td className="px-6 py-4 font-mono text-xs">{app.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={app.schemeTitle}>{app.schemeTitle}</td>
                      <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">{new Date(app.appliedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold whitespace-nowrap capitalize">
                            {app.status.replace(/_/g, ' ')}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                         +?50
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
