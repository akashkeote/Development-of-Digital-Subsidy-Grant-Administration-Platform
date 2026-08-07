import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Landmark, FileText, CheckCircle2, Bookmark, Compass, DollarSign, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export const L2SanctionDashboard: React.FC = () => {
  const { applications, approveApplication } = useApp();
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [comment, setComment] = useState('');

  // Gather applications waiting for district sanction approval
  const queue = applications.filter(app => app.status === 'documents_verified');

  // Select first app in queue on load
  React.useEffect(() => {
    if (queue.length > 0 && !selectedAppId) {
      setSelectedAppId(queue[0].id);
    }
  }, [queue, selectedAppId]);

  const activeApp = applications.find(app => app.id === selectedAppId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitSanction = async (approved: boolean) => {
    if (!activeApp) return;

    if (!comment.trim()) {
      setErrorMsg('Please enter statutory sanctioning remarks before proceeding.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate the network request visually for the frontend user
    await new Promise(resolve => setTimeout(resolve, 800));

    approveApplication(activeApp.id, comment, approved);
    
    setIsSubmitting(false);
    setSelectedAppId('');
    setComment('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 relative z-10" id="district_dashboard_root">
        
        {/* Header */}
        <div className="glass-card bg-white/80 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="z-10">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight font-heading">District Sanction Desk</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Authorize fiscal allocations, audit verifier comments, and sign off on scheduled welfare grant disbursements.</p>
          </div>
          <div className="z-10 flex flex-col items-end gap-4">
            <div className="text-sm font-bold text-blue-700 bg-blue-50/80 border border-blue-100/50 px-6 py-4 rounded-xl flex items-center tracking-widest">
              <Landmark className="w-5 h-5 mr-3 text-blue-600" /> Sanction Queue: <span className="ml-2 font-bold text-blue-700 text-lg">{queue.length}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {queue.length === 0 ? (
          <div className="glass-card bg-white/80 text-center py-24 px-8 border border-white/50 rounded-2xl max-w-2xl mx-auto space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-24 h-24 mx-auto bg-blue-50/80 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/50 card-3d">
              <CheckCircle2 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl text-slate-800 font-bold font-heading">Sanction Desk Empty</h3>
            <p className="text-slate-600 font-medium text-lg">No verified files are awaiting district sanctioning at this time.</p>
            <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100/50 rounded-xl text-sm text-slate-700 font-medium leading-relaxed">
              <strong className="text-blue-600 font-bold tracking-widest block mb-2">Evaluator Guide:</strong> To test, switch to "Verification Officer" mode in the header, approve any pending application in their queue, and it will immediately flow into this desk for final sanctioning!
            </div>
          </div>
        ) : !activeApp ? (
          <div className="text-center py-24 glass-card bg-white/80 rounded-2xl border border-white/50 shadow-2xl backdrop-blur-xl">
            <p className="text-slate-500 font-bold tracking-widest text-sm uppercase">Please select an application from the queue to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Queue Panel */}
            <div className="lg:col-span-4 glass-card bg-white/80 p-8 rounded-2xl border border-white/50 shadow-2xl space-y-6 h-fit relative overflow-hidden backdrop-blur-xl">
              <h3 className="text-xs font-bold text-slate-500 tracking-widest border-b border-slate-200/50 pb-4 font-heading uppercase flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Sanctioning List ({queue.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {queue.map((app) => {
                  const active = app.id === selectedAppId;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setSelectedAppId(app.id);
                        setComment('');
                      }}
                      className={`w-full text-left p-6 rounded-xl transition-all cursor-pointer btn-3d border ${
                        active 
                          ? 'bg-blue-600 text-white shadow-md border-blue-600' 
                          : 'bg-white border-slate-200/60 hover:border-blue-300 text-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-4">
                        <span className={`text-base font-bold line-clamp-1 flex-1 font-heading ${active ? 'text-white' : 'text-slate-800'}`}>{app.schemeTitle}</span>
                        <span className={`text-[10px] font-bold font-mono flex-shrink-0 px-2 py-1 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200/60'}`}>#{app.id}</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs font-medium ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                        <span>{app.citizenName}</span>
                        <span className={`font-bold px-2 py-1 rounded-md ${active ? 'bg-white/20 text-white' : 'text-[#138808] bg-green-50 border border-green-100'}`}>₹{app.personalDetails.income.toLocaleString()}/yr</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Dossier and Approval Form */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Demographics Summary */}
              <div className="glass-card bg-white/80 p-8 rounded-2xl border border-white/50 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-xl">
                <h3 className="text-sm font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-4 flex items-center font-heading uppercase">
                  <Bookmark className="w-5 h-5 mr-3 text-blue-600" /> Demographic & Bank Specs
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 text-sm font-medium">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 uppercase">Scheme Name:</p>
                    <p className="text-blue-700 font-bold text-base line-clamp-2">{activeApp.schemeTitle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 uppercase">Applicant Name:</p>
                    <p className="text-slate-800 font-bold text-base">{activeApp.personalDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 uppercase">Family Income:</p>
                    <p className="text-[#138808] font-bold bg-green-50/80 px-4 py-1.5 rounded-lg inline-block border border-green-200/50 text-base">₹{activeApp.personalDetails.income.toLocaleString()}/yr</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 uppercase">IFSC Code:</p>
                    <p className="text-slate-800 font-mono font-bold bg-slate-100/50 px-4 py-1.5 rounded-lg inline-block border border-slate-200/50 text-base">{activeApp.bankDetails.ifsc}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 uppercase">Bank & Account Mapping:</p>
                    <p className="text-slate-800 font-bold text-base">{activeApp.bankDetails.bankName} <span className="text-slate-500 font-mono ml-3 text-xs bg-slate-100/50 border border-slate-200/50 px-3 py-1 rounded-lg">(A/C: {activeApp.bankDetails.accountNumber})</span></p>
                  </div>
                </div>
              </div>

              {/* Verifier Officer Remarks */}
              <div className="glass-card bg-blue-50/60 border border-blue-100/60 p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden backdrop-blur-xl">
                <p className="text-xs font-bold text-blue-700 tracking-widest flex items-center uppercase">
                  <CheckCircle2 className="w-5 h-5 mr-3" /> Verification Audit Log
                </p>
                <div className="bg-white/80 p-8 rounded-xl border border-white/60 shadow-inner card-3d">
                  <p className="text-base text-slate-700 leading-relaxed font-medium italic font-heading border-l-4 border-blue-400 pl-5">
                    "{activeApp.verifierComment || 'No verifier comment logged.'}"
                  </p>
                </div>
              </div>

              {/* District Approval Inputs Form */}
              <div className="glass-card bg-white/80 p-8 rounded-2xl shadow-2xl border border-white/50 space-y-8 relative overflow-hidden backdrop-blur-xl">
                <h3 className="text-sm font-bold text-slate-800 tracking-widest border-b border-slate-200/50 pb-4 relative z-10 font-heading uppercase flex items-center">
                  <Compass className="w-5 h-5 mr-3 text-blue-600" /> Sanction Remarks Log & Signoff
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-600 tracking-widest uppercase">Official Sanctioning Remarks (Required)</label>
                    <textarea
                      placeholder="Input statutory remarks declaring budget allocation compliance, income verification confirmations, and DBT schedules..."
                      rows={4}
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className={`input-3d w-full p-6 bg-slate-50/50 border focus:ring-4 transition-all text-base text-slate-800 font-medium placeholder:text-slate-400 resize-none shadow-inner ${
                        errorMsg 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10 bg-red-50/10' 
                          : 'border-slate-200/60 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                    {errorMsg && (
                      <p className="text-xs font-bold text-red-500 animate-in fade-in flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> {errorMsg}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 justify-end pt-6 border-t border-slate-200/50">
                    <button
                      onClick={() => handleSubmitSanction(false)}
                      disabled={isSubmitting}
                      className="btn-3d w-full sm:w-auto bg-white border border-slate-200/60 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-sm font-bold px-8 py-4 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deny Grant
                    </button>
                    <button
                      onClick={() => handleSubmitSanction(true)}
                      disabled={isSubmitting}
                      className="btn-3d w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white shadow-xl text-sm font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-3 cursor-pointer border border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <DollarSign className="w-5 h-5" />
                      )}
                      <span>{isSubmitting ? 'Processing Sanction...' : 'Sanction & Release Funds'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
