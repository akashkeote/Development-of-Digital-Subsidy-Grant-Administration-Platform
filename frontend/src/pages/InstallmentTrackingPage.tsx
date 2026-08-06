import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, ShieldCheck, DollarSign, Compass, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { InstallmentCard } from '../components/InstallmentCard';
import { InstallmentModal } from '../components/InstallmentModal';
import { Application } from '../types';

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

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Get installments for the selected application
  const selectedInstallments = selectedApp 
    ? userInstallments.filter(i => i.applicationId === selectedApp.id)
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6" id="installment_tracking_page_root">
        
        {/* Page Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Direct Benefit Transfer Calendar</h1>
            <p className="text-sm text-slate-500 mt-2">Track direct DigiGrant subsidies deposited into your Aadhaar-linked State Bank of India account.</p>
          </div>
          <div className="text-xs text-[#198754] bg-green-50 border border-green-200 px-4 py-2 rounded-lg flex items-center font-bold">
            <ShieldCheck className="w-4 h-4 mr-2" /> NPCI Seeded Node
          </div>
        </div>

        {/* Totals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#198754]"></div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">Total Disbursed Funds</p>
            <h3 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#198754] pl-2">
              ₹{totalDisbursed.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 pl-2">Direct transfers completed successfully</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-2">Scheduled Pending Grants</p>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 pl-2">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 pl-2">Awaiting milestones calendar release</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00599f]"></div>
            <div className="pl-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">DBT Destination Node</p>
              <h4 className="font-bold text-slate-800 text-sm mt-3 truncate max-w-[150px]">{citizenProfile.bankName}</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">A/C: ******{citizenProfile.bankAccount.slice(-5)}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-200 mr-2">
              <Landmark className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Installments Ledger Grid */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center">
            <Compass className="w-4 h-4 mr-2 text-slate-400" /> Direct Disbursement Ledger
          </h2>

          {userApps.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
                <Landmark className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">No active disbursements found. Approve applications to trigger scheduled installments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userApps.map((app, idx) => {
                const appInstallments = userInstallments.filter(i => i.applicationId === app.id);
                // Only show applications that actually have installments
                if (appInstallments.length === 0) return null;
                
                return (
                  <InstallmentCard 
                    key={app.id} 
                    application={app} 
                    installments={appInstallments}
                    index={idx}
                    onClick={() => setSelectedApp(app)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Overlay */}
        <InstallmentModal 
          application={selectedApp} 
          installments={selectedInstallments} 
          onClose={() => setSelectedApp(null)} 
        />

        {/* Secure DBT Disclaimer */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-sm space-y-3 relative overflow-hidden shadow-sm">
          <div className="flex items-center space-x-2 text-[#198754] font-bold uppercase tracking-widest text-[10px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>APB System Mapping Verified</span>
          </div>
          <p className="text-emerald-900 leading-relaxed font-medium text-xs">
            Subsidies are dispatched using the Aadhaar Payment Bridge (APB). Your bank accounts are continuously validated against NPCI databases to guarantee zero intermediary interception. If you do not receive a scheduled payment, contact your bank branch to ensure Aadhaar consent seeding is active.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};
