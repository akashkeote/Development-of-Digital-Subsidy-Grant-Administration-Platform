code = """import React from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { FileText, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const L1History: React.FC = () => {
  const { applications } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter apps that have been processed beyond 'submitted' phase
  const processedApps = applications.filter(app => app.status !== 'draft' && app.status !== 'submitted');
  
  const filteredApps = processedApps.filter(app => 
    app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Inspection History</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Review your past verifications, approvals, and rejections.</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-slate-700 bg-slate-100/80 border border-slate-200/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <FileText className="w-5 h-5 mr-3 text-slate-500" /> Total Inspected: <span className="ml-2 font-black text-slate-800 text-lg">{processedApps.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-slate-800">Past Audits</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search citizen or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Citizen Name</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Verification Date</th>
                  <th className="px-6 py-4">Action Taken</th>
                  <th className="px-6 py-4 rounded-tr-xl">Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        No inspection history found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{app.citizenName}</td>
                      <td className="px-6 py-4 font-mono text-xs">{app.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={app.schemeTitle}>{app.schemeTitle}</td>
                      <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                         {app.verifierComment ? 'Recently Verified' : 'Pre-approved'}
                      </td>
                      <td className="px-6 py-4">
                         {app.status === 'rejected_by_verifier' ? (
                           <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold whitespace-nowrap">Rejected</span>
                         ) : (
                           <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold whitespace-nowrap">Verified</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-[200px] truncate" title={app.verifierComment || 'N/A'}>
                         {app.verifierComment || 'N/A'}
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
"""
with open('src/pages/L1History.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
