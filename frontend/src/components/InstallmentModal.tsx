import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Application, Installment } from '../types';
import { X, User, MapPin, CreditCard, ClipboardList, CheckCircle2, ExternalLink } from 'lucide-react';

interface InstallmentModalProps {
  application: Application | null;
  installments: Installment[];
  onClose: () => void;
}

export const InstallmentModal: React.FC<InstallmentModalProps> = ({ application, installments, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    if (application) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [application, onClose]);

  if (!application) return null;

  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const disbursedAmount = installments
    .filter(i => i.status === 'disbursed')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const pendingAmount = totalAmount - disbursedAmount;
  const progress = totalAmount > 0 ? (disbursedAmount / totalAmount) * 100 : 0;

  const milestones = [
    { name: "Bank Verification", date: application.appliedDate, completed: true },
    { name: "Fund Allocation", date: application.appliedDate, completed: ['disbursing', 'completed'].includes(application.status) },
    { name: "NPCI Mapping", date: application.appliedDate, completed: ['disbursing', 'completed'].includes(application.status) },
    { name: "Final Release", date: application.appliedDate, completed: application.status === 'completed' }
  ];

  const statusBadges: Record<string, string> = {
    pending: 'bg-slate-100 text-slate-600 border-slate-200',
    processing: 'bg-orange-50 text-orange-600 border-orange-200',
    disbursed: 'bg-green-50 text-[#198754] border-green-200',
    failed: 'bg-red-50 text-red-600 border-red-200'
  };

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ minHeight: '300px', backgroundColor: '#ffffff', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-start gap-4 p-5 sm:p-6 border-b border-slate-100">
          <button 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex-1 min-w-0 pr-8">
            <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wider mb-1 block">
              {application.id} • {application.schemeId}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
              {application.schemeTitle}
            </h2>
            <div className="flex items-center gap-4 text-[12px] font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                {application.citizenName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                {application.personalDetails?.state || 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          
          {/* Fund Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sanctioned</span>
              <span className="block text-lg font-bold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Disbursed</span>
              <span className="block text-lg font-bold text-emerald-600">₹{disbursedAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pending</span>
              <span className="block text-lg font-bold text-orange-600">₹{pendingAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Progress</span>
              <span className="block text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Installment Releases Table */}
            <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <CreditCard size={16} className="text-blue-500" />
                <h3 className="text-[14px] font-bold text-slate-800">Installment Releases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-widest text-[10px] font-bold bg-slate-50">
                      <th className="py-3 pl-4">#</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 pr-4">Txn ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {installments.map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 pl-4 font-bold text-slate-700">{inst.installmentNumber}</td>
                        <td className="py-3 font-bold text-slate-700">₹{inst.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-slate-500 text-[12px]">{inst.disbursementDate || inst.dueDate}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center justify-center text-[10px] px-2.5 py-0.5 rounded border font-bold uppercase tracking-wider ${statusBadges[inst.status]}`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11px] text-slate-500">
                          {inst.transactionId ? (
                            <span className="flex items-center gap-1">
                              {inst.transactionId}
                              <ExternalLink size={12} className="text-blue-400" />
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Compliance Milestones */}
            <section className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <ClipboardList size={16} className="text-blue-500" />
                <h3 className="text-[14px] font-bold text-slate-800">Compliance Milestones</h3>
              </div>
              <div className="p-4 space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${m.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                      {m.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold ${m.completed ? 'text-slate-800' : 'text-slate-400'}`}>{m.name}</p>
                      {m.completed && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{m.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
