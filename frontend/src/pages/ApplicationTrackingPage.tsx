import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, MapPin, Calendar, CheckCircle2, XCircle, Clock, Send, ShieldCheck 
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ApplicationModal } from '../components/ApplicationModal';
import { Application } from '../types';

const STATUS_FILTERS = ["All", "submitted", "in_progress", "approved", "rejected"];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: "Submitted", color: "#0891b2", bg: "#cffafe" }, // cyan
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fef3c7" }, // amber
  approved: { label: "Approved", color: "#16a34a", bg: "#dcfce7" }, // green
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2" }, // red
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  approved: CheckCircle2,
  rejected: XCircle,
  in_progress: Clock,
  submitted: Send,
};

export const ApplicationTrackingPage: React.FC = () => {
  const { citizenProfile, applications } = useApp();
  const [filter, setFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const citizenApps = applications.filter(app => app.citizenId === citizenProfile.id);

  const getNormalizedStatus = (status: string) => {
    if (status === "completed" || status === "disbursing") return "approved";
    if (status.includes("rejected")) return "rejected";
    if (status !== "submitted") return "in_progress";
    return "submitted";
  };

  const filteredApps = filter === "All"
    ? citizenApps
    : citizenApps.filter(app => getNormalizedStatus(app.status) === filter);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-5 animate-fade-in pb-12" id="application_tracking_page_root">
        
        {/* Role Bar */}
        <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-4">
          <div className="flex items-center gap-2 text-[13px] text-blue-700">
            <ShieldCheck size={16} />
            <span>Viewing as: <strong>Citizen</strong></span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { label: "Total", count: citizenApps.length, color: "#7c3aed" },
            { label: "Approved", count: citizenApps.filter(a => getNormalizedStatus(a.status) === "approved").length, color: "#16a34a" },
            { label: "In Progress", count: citizenApps.filter(a => getNormalizedStatus(a.status) === "in_progress").length, color: "#d97706" },
            { label: "Rejected", count: citizenApps.filter(a => getNormalizedStatus(a.status) === "rejected").length, color: "#dc2626" },
            { label: "Submitted", count: citizenApps.filter(a => getNormalizedStatus(a.status) === "submitted").length, color: "#0891b2" },
          ].map((s) => (
            <div key={s.label} className="flex-1 min-w-[110px] flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="font-['Outfit'] text-2xl font-extrabold" style={{ color: s.color }}>{s.count}</span>
              <span className="text-xs text-slate-500 font-semibold">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-5 border-b-2 border-slate-200">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`px-4.5 py-2 text-[13px] font-semibold transition-all duration-200 rounded-t-lg -mb-[2px] border-b-2 ${
                filter === f 
                  ? 'text-blue-600 border-blue-500 bg-blue-50' 
                  : 'text-slate-500 border-transparent hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setFilter(f)}
            >
              {f === "All" ? "All Applications" : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>

        {/* Application Cards List */}
        <div className="flex flex-col gap-2.5">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium">No applications found.</p>
            </div>
          ) : (
            filteredApps.map((app, i) => {
              const normStatus = getNormalizedStatus(app.status);
              const statusConf = STATUS_CONFIG[normStatus] || STATUS_CONFIG.submitted;
              const StatusIcon = STATUS_ICONS[normStatus] || Clock;
              
              const totalStages = 4;
              const currentStage = app.currentStep > totalStages ? totalStages : app.currentStep;
              const progressPercentage = (currentStage / totalStages) * 100;
              const dashArray = (progressPercentage / 100) * 138;

              return (
                <div
                  key={app.id}
                  className="group flex flex-col md:flex-row md:items-center gap-4 p-4 sm:p-5 bg-white border border-slate-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-md hover:translate-x-0.5 animate-slide-up-modal"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => setSelectedApp(app)}
                >
                  {/* Left Progress Ring */}
                  <div className="relative w-[52px] h-[52px] shrink-0">
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="22" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="26" cy="26" r="22" fill="none"
                        stroke={statusConf.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${dashArray} 138`}
                        transform="rotate(-90 26 26)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span 
                      className="absolute inset-0 flex items-center justify-center text-xs font-extrabold"
                      style={{ color: statusConf.color }}
                    >
                      {currentStage}/{totalStages}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-slate-500 font-semibold font-mono tracking-wide">{app.id}</span>
                      <span 
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ background: statusConf.bg, color: statusConf.color }}
                      >
                        <StatusIcon size={12} strokeWidth={2.5} /> {statusConf.label}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 truncate pr-2">{app.schemeTitle}</h3>
                    
                    <div className="flex flex-wrap gap-3.5 text-xs text-slate-500 mb-2.5">
                      <span className="flex items-center gap-1"><User size={12} /> {citizenProfile.name}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {(citizenProfile?.address || '').split(',').slice(-2).join(', ') || 'Unknown Location'}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {app.appliedDate}</span>
                    </div>

                    {/* Mini Workflow Bar */}
                    <div className="flex items-center gap-0">
                      {[1, 2, 3, 4].map((stageId) => {
                        let stStatus = 'pending';
                        if (normStatus === 'rejected' && stageId > currentStage) stStatus = 'pending';
                        else if (normStatus === 'rejected' && stageId === currentStage) stStatus = 'rejected';
                        else if (stageId < currentStage + 1) stStatus = 'completed';
                        else if (stageId === currentStage + 1) stStatus = 'in_progress';

                        return (
                          <div key={stageId} className="flex items-center">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 
                              ${stStatus === 'completed' ? 'bg-[#16a34a] border-[#16a34a]' : 
                                stStatus === 'in_progress' ? 'bg-[#d97706] border-[#d97706] animate-pulse' : 
                                stStatus === 'rejected' ? 'bg-[#dc2626] border-[#dc2626]' : 
                                'bg-transparent border-slate-300'}`} 
                            />
                            {stageId < 4 && (
                              <div className={`w-6 h-[2px] ${stStatus === 'completed' ? 'bg-[#16a34a]' : 'bg-slate-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column (Amount & Score) */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 min-w-[120px] pt-3 mt-1 border-t border-slate-100 md:pt-0 md:mt-0 md:border-t-0 md:gap-1.5">
                    <span className="font-['Outfit'] text-[15px] font-bold text-blue-700 whitespace-nowrap">₹6,000/year</span>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] text-slate-500 font-semibold">Eligibility</span>
                      <div className="w-[80px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#16a34a] rounded-full transition-all duration-1000" style={{ width: '92%' }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 mt-0.5">92%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </DashboardLayout>
  );
};
