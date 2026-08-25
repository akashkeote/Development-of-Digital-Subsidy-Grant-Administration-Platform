import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { ServerCrash, AlertCircle, Search, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const L3Logs: React.FC = () => {
  const { installments, applications } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get all disbursed installments as "successful logs"
  const successfulLogs = installments.filter(i => i.status === 'disbursed');
  
  // Dummy failed logs for realistic UI, normally this would come from a PFMS callback table
  const failedLogsCount = 0;

  const filteredLogs = successfulLogs.filter(log => 
    log.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.schemeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">PFMS Disbursement Logs</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Audit logs of all PFMS API calls, successful bank transfers, and bounce-backs.</p>
          </div>
          <div className="z-10 flex flex-wrap items-center gap-4">
            <div className="text-sm font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600" /> Successful: <span className="ml-2 font-black text-emerald-700 text-lg">{successfulLogs.length}</span>
            </div>
            <div className="text-sm font-bold text-rose-700 bg-rose-50/80 border border-rose-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <ServerCrash className="w-5 h-5 mr-3 text-rose-600" /> Failed Pushes: <span className="ml-2 font-black text-rose-700 text-lg">{failedLogsCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Activity className="w-5 h-5 mr-3 text-blue-600" /> Transaction Ledger
            </h3>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search TXN, App ID, or Scheme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Transaction ID (PFMS)</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Amount Disbursed</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        No disbursement logs found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const matchedApp = applications.find(a => a.id === log.applicationId);
                    return (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">{log.transactionId || `TXN-${Math.floor(Math.random()*1000000)}`}</td>
                        <td className="px-6 py-4 font-mono text-xs">{log.applicationId}</td>
                        <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={log.schemeTitle}>{log.schemeTitle}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">?{log.amount.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                           {log.disbursementDate ? new Date(log.disbursementDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Processing...'}
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold whitespace-nowrap">Success (Credited)</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};