import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { BookOpen, FileText, CheckCircle2, ChevronRight, AlertCircle, ChevronDown } from 'lucide-react';

export const GuidelinesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: 'General Eligibility',
      icon: <CheckCircle2 size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            All schemes hosted on the DigiGrant platform require baseline eligibility verification. Citizens must hold a valid <strong>Aadhaar Card</strong> linked with an active mobile number for eKYC authentication.
          </p>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-700">
              Only one application per scheme is permitted per household unless explicitly stated otherwise in the scheme's core mandate.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Disbursement & Treasury',
      icon: <LandmarkIcon size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            Funds are transferred exclusively via Direct Benefit Transfer (DBT) utilizing the NPCI mapping of the beneficiary's Aadhaar to their primary bank account. 
          </p>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            <li>Ensure your bank account is DBT-enabled.</li>
            <li>No manual cheques or cash disbursements are allowed.</li>
            <li>Staged disbursements are released strictly upon verification of milestone completions.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Audit & Compliance',
      icon: <FileText size={18} />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            The platform maintains a strict immutable audit trail for all transactions. Random sampling audits are conducted monthly by the Central Vigilance node.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Any discrepancies found during the post-disbursement utilization check may result in immediate suspension of the beneficiary profile and clawback proceedings.
          </p>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8" id="guidelines_page_root">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">Platform Guidelines</h1>
              <p className="text-slate-500 font-medium">Standard operating procedures and compliance rules.</p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-24">
              <h3 className="font-heading font-bold text-slate-800 uppercase tracking-widest text-xs px-4 mb-4">Chapters</h3>
              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSection(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      activeSection === idx 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={activeSection === idx ? 'text-blue-500' : 'text-slate-400'}>{sec.icon}</span>
                      {sec.title}
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${activeSection === idx ? 'text-blue-500' : 'text-transparent'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-2/3">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[400px]">
              <h2 className="font-heading text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                {sections[activeSection].title}
              </h2>
              <div className="prose prose-slate prose-blue max-w-none">
                {sections[activeSection].content}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

function LandmarkIcon({ size = 24 }: { size?: number }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>; }
