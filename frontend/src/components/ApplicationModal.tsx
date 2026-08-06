import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Application } from '../types';
import { X, CheckCircle2, XCircle, Clock, Send, ClipboardCheck } from 'lucide-react';

interface ApplicationModalProps {
  app: Application | null;
  onClose: () => void;
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  approved: CheckCircle2,
  rejected: XCircle,
  in_progress: Clock,
  submitted: Send,
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "#0891b2", bg: "#cffafe" }, // cyan
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fef3c7" }, // amber
  approved: { label: "Approved", color: "#16a34a", bg: "#dcfce7" }, // green
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" }, // red
};

const WORKFLOW_STAGES = [
  { id: 1, name: "Application Submitted", role: "Applicant", desc: "File successfully recorded in portal registry." },
  { id: 2, name: "Document Verification", role: "Data Entry Operator", desc: "Aadhaar, revenue deeds, and income statements audited." },
  { id: 3, name: "Grant Sanctioning", role: "District Officer", desc: "District Budget Officer completes final allocation sign-off." },
  { id: 4, name: "Direct Benefit Transfer", role: "Finance Dept", desc: "Disbursements schedule and Direct transfers (DBT) triggered." },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ app, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    if (app) document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [app, onClose]);

  if (!app) return null;

  // Determine normalized status based on app.status
  let normalizedStatus = "submitted";
  if (app.status === "completed" || app.status === "disbursing") normalizedStatus = "approved";
  else if (app.status.includes("rejected")) normalizedStatus = "rejected";
  else if (app.status !== "submitted") normalizedStatus = "in_progress";

  const statusConf = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.submitted;
  const StatusIcon = STATUS_ICONS[normalizedStatus] || Clock;

  const eligibilityScore = 92; // Mock score since it's not in our Application type

  const getStageStatus = (stageId: number) => {
    // Current step in our db is 1, 2, 3, or 4
    const currentStep = app.currentStep; 
    
    if (normalizedStatus === "rejected") {
      if (app.status === 'rejected_by_verifier' && stageId === 2) return 'rejected';
      if (app.status === 'rejected_by_district' && stageId === 3) return 'rejected';
      if (stageId > currentStep) return 'pending';
      return 'completed'; // earlier stages are completed
    }

    if (stageId < currentStep + 1) return 'completed';
    if (stageId === currentStep + 1) return 'in_progress';
    return 'pending';
  };

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-5 bg-[#1e1145]/45 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-[750px] max-h-[88vh] flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start pt-[22px] px-[22px] pb-[14px] border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-slate-500 font-bold font-mono tracking-wide">{app.id}</span>
              <span 
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: statusConf.bg, color: statusConf.color }}
              >
                <StatusIcon size={12} strokeWidth={2.5} /> {statusConf.label}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{app.schemeTitle}</h2>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[22px] py-[18px]">
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Applicant</span>
              <span className="block text-[13px] font-bold text-slate-900 truncate">Deepak Choudhary</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Aadhaar</span>
              <span className="block text-[13px] font-bold text-slate-900">XXXX-XXXX-****</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Location</span>
              <span className="block text-[13px] font-bold text-slate-900 truncate">Gurugram, Haryana</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Amount</span>
              <span className="block text-[13px] font-extrabold text-blue-600">₹8,000 stipend</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Category</span>
              <span className="block text-[13px] font-bold text-slate-900">Skills & Employment</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg relative">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Eligibility Score</span>
              <div className="w-full h-2.5 bg-slate-200 rounded-full mt-1 relative overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${eligibilityScore}%`, 
                    backgroundColor: eligibilityScore >= 80 ? '#16a34a' : eligibilityScore >= 50 ? '#d97706' : '#dc2626' 
                  }}
                />
              </div>
              <span className="absolute right-2.5 top-2 text-[11px] font-bold text-slate-600">{eligibilityScore}/100</span>
            </div>
          </div>

          {/* Rejection Details */}
          {normalizedStatus === "rejected" && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 mb-5">
              <div className="text-[14px] font-bold text-[#dc2626] mb-2 flex items-center gap-1.5">
                <XCircle size={16} /> Rejection Details
              </div>
              <p className="text-[13px] text-[#7f1d1d] leading-relaxed mb-2.5">
                {app.districtOfficerComment || app.verifierComment || "Application details did not match required verification criteria."}
              </p>
              <div className="text-[12px] text-[#991b1b] flex flex-col gap-0.5">
                <span>Rejected by: <strong>{app.status === 'rejected_by_district' ? 'District Officer' : 'Verification Officer'}</strong></span>
                <span>Government Portal Registry</span>
              </div>
            </div>
          )}

          {/* Workflow Timeline */}
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            <ClipboardCheck size={16} className="text-blue-600" />
            Approval Workflow — Officer Chain
          </h3>

          <div className="flex flex-col">
            {WORKFLOW_STAGES.map((ws, i) => {
              const stageStatus = getStageStatus(ws.id);
              const isCompleted = stageStatus === "completed";
              const isActive = stageStatus === "in_progress";
              const isRejected = stageStatus === "rejected";
              const isPending = stageStatus === "pending";

              return (
                <div key={i} className={`flex gap-3.5 min-h-[70px] ${isActive ? 'bg-blue-50 -mx-2 px-2 py-1 rounded-lg' : ''}`}>
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center shrink-0 w-[30px]">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border-2 z-10 transition-colors
                        ${isCompleted ? 'bg-[#16a34a] border-[#16a34a] text-white' : 
                          isActive ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_6px_rgba(147,51,234,0.15)]' : 
                          isRejected ? 'bg-[#dc2626] border-[#dc2626] text-white' : 
                          'bg-slate-50 border-slate-300 text-slate-400'
                        }`}
                    >
                      {isCompleted && "✓"}
                      {isActive && "●"}
                      {isRejected && "✕"}
                      {isPending && (i + 1)}
                    </div>
                    {i < 3 && (
                      <div className={`w-0.5 flex-1 min-h-[20px] transition-colors ${isCompleted ? 'bg-[#16a34a]' : 'bg-slate-200'}`} />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[14px] font-bold text-slate-900">{ws.name}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{ws.role}</span>
                    </div>
                    
                    {/* Render remarks if applicable */}
                    {ws.id === 2 && app.verifierComment && (
                      <div className="mb-1">
                        <span className="text-[13px] font-semibold text-blue-700 block">{app.verifierName || 'Verification Officer'}</span>
                        <p className={`text-xs p-1.5 rounded bg-slate-100 text-slate-600 mt-1 ${isRejected ? 'bg-red-50 text-red-800 font-semibold' : ''}`}>
                          {app.verifierComment}
                        </p>
                      </div>
                    )}
                    {ws.id === 3 && app.districtOfficerComment && (
                      <div className="mb-1">
                        <span className="text-[13px] font-semibold text-blue-700 block">{app.districtOfficerName || 'District Budget Officer'}</span>
                        <p className={`text-xs p-1.5 rounded bg-slate-100 text-slate-600 mt-1 ${isRejected ? 'bg-red-50 text-red-800 font-semibold' : ''}`}>
                          {app.districtOfficerComment}
                        </p>
                      </div>
                    )}
                    {ws.id === 4 && app.financeComment && (
                      <div className="mb-1">
                        <span className="text-[13px] font-semibold text-blue-700 block">{app.financeOfficerName || 'Finance Dept'}</span>
                        <p className={`text-xs p-1.5 rounded bg-slate-100 text-slate-600 mt-1 ${isRejected ? 'bg-red-50 text-red-800 font-semibold' : ''}`}>
                          {app.financeComment}
                        </p>
                      </div>
                    )}
                    {!app.verifierComment && !app.districtOfficerComment && !app.financeComment && (
                      <p className="text-[13px] text-slate-500 mt-0.5">{ws.desc}</p>
                    )}
                    
                    {isCompleted && ws.id === 1 && <span className="text-[11px] text-slate-400 block mt-1">{app.appliedDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
