with open('src/pages/L2Reports.tsx', 'w', encoding='utf-8') as f:
    f.write('''import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { BarChart3, AlertCircle, Search, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';

export const L2Reports: React.FC = () => {
  const { applications } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter apps processed by District Officer (L2)
  const l2ProcessedApps = applications.filter(app => 
    app.status === 'approved_by_district' || 
    app.status === 'rejected_by_district' || 
    app.status === 'disbursing' || 
    app.status === 'completed'
  );
  
  const filteredApps = l2ProcessedApps.filter(app => 
    app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.schemeTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSanctioned = l2ProcessedApps.filter(a => a.status !== 'rejected_by_district').length;
  const totalRejected = l2ProcessedApps.filter(a => a.status === 'rejected_by_district').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="glass-card bg-white/80 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">District Reports & History</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Aggregated analytics and history of your sanction approvals/rejections.</p>
          </div>
          <div className="z-10 flex flex-wrap gap-4 items-center">
            <div className="text-sm font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <FileSignature className="w-5 h-5 mr-3 text-emerald-600" /> Sanctioned: <span className="ml-2 font-black text-emerald-700 text-lg">{totalSanctioned}</span>
            </div>
            <div className="text-sm font-bold text-red-700 bg-red-50/80 border border-red-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest shadow-inner">
              <AlertCircle className="w-5 h-5 mr-3 text-red-600" /> Rejected: <span className="ml-2 font-black text-red-700 text-lg">{totalRejected}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-3 text-blue-600" /> Application Ledger
            </h3>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search citizen, scheme or ID..."
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
                  <th className="px-6 py-4 rounded-tl-xl">Citizen Name</th>
                  <th className="px-6 py-4">Application ID</th>
                  <th className="px-6 py-4">Scheme</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-xl">District Officer Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        No district sanction records found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{app.citizenName}</td>
                      <td className="px-6 py-4 font-mono text-xs">{app.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={app.schemeTitle}>{app.schemeTitle}</td>
                      <td className="px-6 py-4">
                         {app.status === 'rejected_by_district' ? (
                           <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold whitespace-nowrap">Sanction Denied</span>
                         ) : (
                           <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold whitespace-nowrap">Sanction Approved</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-[250px] truncate" title={app.districtOfficerComment || 'No comments provided'}>
                         {app.districtOfficerComment || <span className="italic opacity-50">No comments provided</span>}
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
};''')
