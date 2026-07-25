import React from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, ShieldCheck, DollarSign, ExternalLink, Compass, CheckCircle2, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const InstallmentTrackingPage: React.FC = () => {
  const { citizenProfile, installments, applications } = useApp();

  // Find user's applications
  const userApps = applications.filter(a => a.citizenId === citizenProfile.id);
  
  // Filter installments belonging to user's applications
  const userInstallments = installments.filter(inst => {
    return userApps.some(a => a.id === inst.applicationId);
  });

  const totalDisbursed = userInstallments
    .filter(i => i.status === 'disbursed')
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingAmount = userInstallments
    .filter(i => ['pending', 'processing'].includes(i.status))
    .reduce((sum, i) => sum + i.amount, 0);

  const statusBadges: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-500 border-gray-200',
    processing: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse',
    disbursed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    failed: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" id="installment_tracking_page_root">
        
        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Direct Benefit Transfer Calendar</h1>
            <p className="text-xs text-gray-500 mt-1">Track direct subsidy grants deposited directly into your Aadhaar-linked State Bank of India account.</p>
          </div>
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg flex items-center font-semibold">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> NPCI Seeded Node
          </div>
        </div>

        {/* Totals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Disbursed Funds</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-emerald-700 mt-1">
              ₹{totalDisbursed.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1.5">Direct transfers completed successfully</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Scheduled Pending Grants</p>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1.5">Awaiting milestones calendar release</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">DBT Destination Node</p>
              <h4 className="font-extrabold text-slate-800 text-xs mt-1.5 truncate max-w-[150px]">{citizenProfile.bankName}</h4>
              <p className="text-[10px] text-gray-400 font-mono">A/C: ******{citizenProfile.bankAccount.slice(-5)}</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Installments Ledger Grid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-gray-100 pb-3">
            Direct Disbursement Ledger
          </h2>

          {userInstallments.length === 0 ? (
            <div className="text-center py-16">
              <Landmark className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">No active disbursements found. Approve applications to trigger scheduled installments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-gray-100 font-medium text-gray-600">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-3.5 pl-2">Scheme Name</th>
                    <th className="pb-3.5">Inst. No.</th>
                    <th className="pb-3.5">Amount</th>
                    <th className="pb-3.5">Release Status</th>
                    <th className="pb-3.5">Due/Release Date</th>
                    <th className="pb-3.5 pr-2">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userInstallments.map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 font-semibold text-slate-800 pl-2 max-w-xs truncate">{inst.schemeTitle}</td>
                      <td className="py-4 text-center sm:text-left">{inst.installmentNumber}</td>
                      <td className="py-4 font-bold text-slate-900">₹{inst.amount.toLocaleString('en-IN')}</td>
                      <td className="py-4">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-bold capitalize ${statusBadges[inst.status]}`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-[11px] text-gray-400">
                        {inst.disbursementDate || inst.dueDate}
                      </td>
                      <td className="py-4 font-mono text-[10px] text-gray-400 pr-2">
                        {inst.transactionId ? (
                          <span className="flex items-center text-purple-800 font-bold hover:underline">
                            {inst.transactionId.slice(0, 10)}... 
                            <ExternalLink className="w-3 h-3 ml-1 text-purple-600 flex-shrink-0" />
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Secure DBT Disclaimer */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl text-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>APB System Mapping Verified</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            Subsidies are dispatched using the Aadhaar Payment Bridge (APB). Your bank accounts are continuously validated against NPCI databases to guarantee zero intermediary interception. If you do not receive a scheduled payment, contact your bank branch to ensure Aadhaar consent seeding is active.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};
